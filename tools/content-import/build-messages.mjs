// Baut die importierten Namespaces (Meta, Nav, Footer, Home, Stores) der UI-Übersetzungen aus den
// extrahierten Katalogen der bisherigen Website. Aufruf: node build-messages.mjs <json-verzeichnis>
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dir = process.argv[2];
const messagesDir = fileURLToPath(new URL("../../packages/i18n/messages/", import.meta.url));
const read = (f) => JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
const B = read("brandText.json").langMaps[0].value;
const L = read("landingText.json").langMaps[0].value;
const SB = read("StoreBadges.json").langMaps;
const chrome = read("chrome.json");
const routes = JSON.parse(
  readFileSync(fileURLToPath(new URL("../../apps/web/content/routes.json", import.meta.url)), "utf8"),
);
/** Übersetzte Adresse → deutscher Schlüssel (z. B. /event-planning-guides → /anlaesse-planen). */
function keyOf(locale, href) {
  const path = href.replace(/^\/(en|fr|it|es|pt)(?=\/|$|#)/, "") || "/";
  const norm = path.startsWith("#") ? `/${path}` : path;
  for (const [key, alts] of Object.entries(routes)) if (alts[locale] === norm) return key;
  return norm;
}
const LMAP = { de: "de-CH", en: "en-CH", fr: "fr-CH", it: "it-CH", es: "es-419", pt: "pt-BR" };

/** Template-Funktion e=>`…${e}…` → ICU-Text mit benanntem Platzhalter. */
function templateToIcu(fn, param) {
  const m = fn.__fn__.match(/`([\s\S]*)`/);
  if (!m) throw new Error(`Unbekannte Funktion: ${fn.__fn__}`);
  return m[1].replace(/\$\{[a-z]\}/g, `{${param}}`);
}
/** e=>e===1?"1 X":`${e} Y` → ICU-Plural. */
function pluralToIcu(fn) {
  const src = fn.__fn__;
  const m = src.match(/===1\?"([^"]*)":`\$\{[a-z]\}([^`]*)`/);
  if (m) return `{count, plural, one {${m[1].replace(/^1/, "#")}} other {#${m[2]}}}`;
  const t = src.match(/`\$\{[a-z]\}([^`]*)`/);
  if (t) return `{count, plural, other {#${t[1]}}}`;
  throw new Error(`Unbekannter Plural: ${src}`);
}
const call = (v) => (v && v.__call__ ? v.args[0] : v);
/** Einträge kommen als [titel, text, marke] oder als Objekt {title, text, brand} vor. */
const entry = (v) =>
  Array.isArray(v)
    ? { title: v[0], text: v[1], tag: v[2] ?? null }
    : { title: v.title, text: v.text, tag: v.brand ?? null };
const pair = (v) => {
  const e = entry(v);
  return { title: e.title, text: e.text };
};

const linkKeys = {
  "/#so-funktionierts": "how",
  "/entdecken": "discover",
  "/warteliste": "app",
  "/preise": "pricing",
  "/anlaesse-planen": "events",
  "/travel-guide": "travel",
  "/fuer-creator": "creators",
  "/fuer-firmen": "companies",
  "/fuer-vereine": "clubs",
  "/hilfe": "help",
  "/kontakt": "contact",
  "/impressum": "imprint",
  "/datenschutz": "privacy",
  "/agb": "terms",
};

for (const [short, locale] of Object.entries(LMAP)) {
  const b = B[short],
    l = L[short],
    c = chrome[locale];
  const footerLinks = {};
  for (const [href, label] of c.footer) {
    const key = linkKeys[keyOf(locale, href)];
    if (key) footerLinks[key] = label;
  }
  const ex = call(l.examples.items).map(entry);
  const steps = call(l.demo.steps).map(entry);
  const ns = {
    Meta: { siteName: "Pickeed", title: c.title, description: c.description },
    Nav: { ...l.nav },
    Footer: {
      product: l.foot.product,
      pros: l.foot.pros,
      help: l.foot.help,
      copy: c.copy.replace(/20\d\d/, "{year}"),
      links: footerLinks,
    },
    Stores: {
      title: SB[0].value[short].title,
      appStore: SB[1].value[short][0],
      googlePlay: SB[1].value[short][1],
    },
    Home: {
      hero: {
        h1a: b.h1[0],
        h1b: b.h1[1],
        h1c: b.h1[2],
        lead: b.lead,
        cta: l.hero.cta,
        friends: l.hero.friends,
        phonesLabel: b.phonesLabel,
        claim: l.hero.claim,
      },
      steps: { s1: pair(b.steps[0]), s2: pair(b.steps[1]), s3: pair(b.steps[2]) },
      topPicks: { title: b.sections.toppicks.title, text: b.sections.toppicks.text, sub: b.picks.sub },
      plan: { title: b.sections.plan.title, text: b.sections.plan.text },
      demo: {
        title: l.demo.title,
        intro: l.demo.intro,
        label: l.demo.label,
        next: l.demo.next,
        prev: l.demo.prev,
        pause: l.demo.pause,
        play: l.demo.play,
        steps: {
          time: { title: steps[0].title, text: steps[0].text, tag: steps[0].tag },
          idea: { title: steps[1].title, text: steps[1].text, tag: steps[1].tag },
          ready: { title: steps[2].title, text: steps[2].text },
        },
        plan: l.demo.plan,
        meta: l.demo.meta,
        ideasTitle: l.demo.ideasTitle,
        earlier: l.demo.earlier,
        earlierVotes: l.demo.earlierVotes,
        earlierNote: l.demo.earlierNote,
        ask: l.demo.ask,
        yes: l.demo.yes,
        no: l.demo.no,
        votes: l.demo.votes,
        vote: l.demo.vote,
        ideas: Object.fromEntries(l.demo.ideas.map(([name, desc], i) => [`i${i + 1}`, { name, desc }])),
        votesOf: pluralToIcu(l.demo.votesOf),
        ready: l.demo.ready,
        place: l.demo.place,
        when: l.demo.when,
        where: l.demo.where,
        coming: l.demo.coming,
        task: l.demo.task,
        done: l.demo.done,
      },
      features: {
        title: b.features,
        items: {
          denktmit: b.sections.denktmit,
          zusagen: b.sections.zusagen,
          circle: b.sections.circle,
          entdecken: b.sections.entdecken,
          memories: b.sections.memories,
          qr: { title: l.qr.title, text: l.qr.text },
        },
      },
      profile: {
        kicker: b.profil.kicker,
        title: b.profil.title,
        lead: b.profil.lead,
        swipe: b.profil.swipe,
        items: Object.fromEntries(Object.entries(b.profil.items).map(([k, v]) => [k, pair(v)])),
      },
      invitee: {
        title: l.invitee.title,
        lead: l.invitee.lead,
        p1: l.invitee.points[0],
        p2: l.invitee.points[1],
        p3: l.invitee.points[2],
        invites: l.invitee.invites,
        finding: l.invitee.finding,
        name: l.invitee.name,
        nameValue: l.invitee.nameValue,
        join: l.invitee.join,
        noAccount: l.invitee.noAccount,
      },
      examples: {
        title: l.examples.title,
        more: l.examples.more,
        i1: pair(ex[0]),
        i2: pair(ex[1]),
        i3: pair(ex[2]),
      },
      business: {
        kicker: b.business.kicker,
        title: b.business.title,
        text: b.business.text,
        cta: b.business.cta,
        companies: b.business.links[0],
        creators: b.business.links[1],
        clubs: b.business.links[3],
      },
      privacy: {
        title: b.privacy.title,
        text: b.privacy.text,
        items: Object.fromEntries(l.trust.items.map((t, i) => [`t${i + 1}`, t])),
        free: templateToIcu(l.trust.free, "date"),
        freeMore: l.trust.freeMore,
      },
      final: { title: l.final.title, text: l.final.text, already: l.final.already, signIn: l.final.signIn },
    },
  };
  const file = `${messagesDir}${locale}.json`;
  const current = JSON.parse(readFileSync(file, "utf8"));
  const merged = { ...(ns.Meta && { Meta: ns.Meta }), ...current, ...ns };
  writeFileSync(file, JSON.stringify(merged, null, 2) + "\n");
  console.log(locale, "ok");
}
