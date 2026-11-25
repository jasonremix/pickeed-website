// Liest Texte aus JS-Modulen, OHNE sie auszuführen: Parsen + Auswerten konstanter Ausdrücke.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import * as acorn from "acorn";
import * as walk from "acorn-walk";

const LANGS = ["de", "en", "fr", "it", "es", "pt"];
const modules = new Map();

function load(file) {
  if (modules.has(file)) return modules.get(file);
  const src = readFileSync(file, "utf8");
  const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module" });
  const mod = {
    file,
    src,
    ast,
    decls: new Map(),
    imports: new Map(),
    exportsMap: new Map(),
    cache: new Map(),
    busy: new Set(),
  };
  modules.set(file, mod);
  for (const node of ast.body) {
    if (node.type === "VariableDeclaration")
      for (const d of node.declarations) if (d.id.type === "Identifier") mod.decls.set(d.id.name, d.init);
    if (node.type === "ImportDeclaration") {
      const target = join(dirname(file), node.source.value.replace(/^\.\//, ""));
      for (const s of node.specifiers)
        mod.imports.set(s.local.name, {
          target,
          name: s.type === "ImportSpecifier" ? s.imported.name : "default",
        });
    }
    if (node.type === "ExportNamedDeclaration")
      for (const s of node.specifiers || []) mod.exportsMap.set(s.exported.name, s.local.name);
  }
  return mod;
}

const FN = (mod, n) => ({ __fn__: mod.src.slice(n.start, n.end).slice(0, 400) });

function resolveName(mod, name) {
  if (mod.cache.has(name)) return mod.cache.get(name);
  if (mod.busy.has(name)) return { __unresolved__: name };
  if (mod.decls.has(name)) {
    mod.busy.add(name);
    const v = ev(mod, mod.decls.get(name));
    mod.busy.delete(name);
    mod.cache.set(name, v);
    return v;
  }
  if (mod.imports.has(name)) {
    const { target, name: imported } = mod.imports.get(name);
    if (!existsSync(target)) return { __import__: `${target}#${imported}` };
    const m2 = load(target);
    const local = m2.exportsMap.get(imported) ?? imported;
    return resolveName(m2, local);
  }
  return { __unresolved__: name };
}

function ev(mod, n) {
  if (!n) return null;
  switch (n.type) {
    case "Literal":
      return n.value;
    case "TemplateLiteral": {
      let s = "";
      n.quasis.forEach((q, i) => {
        s += q.value.cooked;
        if (i < n.expressions.length) {
          const e = n.expressions[i];
          const v = ev(mod, e);
          s += typeof v === "string" || typeof v === "number" ? v : `{${mod.src.slice(e.start, e.end)}}`;
        }
      });
      return s;
    }
    case "ObjectExpression": {
      const o = {};
      for (const p of n.properties) {
        if (p.type === "SpreadElement") {
          const v = ev(mod, p.argument);
          if (v && typeof v === "object") Object.assign(o, v);
          continue;
        }
        let key = p.computed ? ev(mod, p.key) : p.key.type === "Identifier" ? p.key.name : p.key.value;
        o[key] = p.value.type.includes("Function") ? FN(mod, p.value) : ev(mod, p.value);
      }
      return o;
    }
    case "ArrayExpression":
      return n.elements
        .map((e) => (e ? (e.type === "SpreadElement" ? ev(mod, e.argument) : ev(mod, e)) : null))
        .flat(0);
    case "Identifier":
      return n.name === "undefined" ? null : resolveName(mod, n.name);
    case "MemberExpression": {
      const obj = ev(mod, n.object);
      const key = n.computed ? ev(mod, n.property) : n.property.name;
      if (obj && typeof obj === "object" && !obj.__unresolved__ && key in obj) return obj[key];
      return { __expr__: mod.src.slice(n.start, n.end) };
    }
    case "UnaryExpression": {
      if (n.operator === "!" && n.argument.type === "Literal") return !n.argument.value;
      if (n.operator === "-" && n.argument.type === "Literal") return -n.argument.value;
      return { __expr__: mod.src.slice(n.start, n.end) };
    }
    case "ArrowFunctionExpression":
    case "FunctionExpression":
      return FN(mod, n);
    case "CallExpression": {
      // Hilfsfunktionen wie o([[…]]) – nur das literale Argument auswerten, nichts ausführen.
      if (n.arguments.length >= 1)
        return {
          __call__: mod.src.slice(n.callee.start, n.callee.end),
          args: n.arguments.map((a) => ev(mod, a)),
        };
      return { __expr__: mod.src.slice(n.start, n.end).slice(0, 200) };
    }
    default:
      return { __expr__: mod.src.slice(n.start, n.end).slice(0, 200) };
  }
}

const file = process.argv[2];
const mod = load(file);
const out = { exports: {}, langMaps: [] };
for (const [exp, local] of mod.exportsMap) out.exports[exp] = resolveName(mod, local);
walk.full(mod.ast, (node) => {
  if (node.type !== "ObjectExpression") return;
  const keys = node.properties
    .filter((p) => p.type === "Property" && !p.computed)
    .map((p) => (p.key.type === "Identifier" ? p.key.name : p.key.value));
  if (LANGS.filter((l) => keys.includes(l)).length >= 3)
    out.langMaps.push({ at: node.start, value: ev(mod, node) });
});
process.stdout.write(JSON.stringify(out, null, 1));
