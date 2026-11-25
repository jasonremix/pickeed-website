import type { Locale } from "@pickeed/i18n";
import { buttonClasses, cn } from "@pickeed/ui";
import type { CSSProperties, ReactNode } from "react";
import { StoreBadges } from "@/components/home/StoreBadges";
import { Icon, type IconName } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { appLink } from "@/lib/app-links";
import type { ContentElement, ContentNode, ContentPage } from "@/lib/content";

/**
 * Stellt übernommene Inhalte (bereinigter Baum) im Pickeed-Design dar.
 * Erkannte Muster: Hero, Kartenraster, Schritte, Häufige Fragen, Preiskarten, Linklisten, Faktenraster,
 * Abschluss-Aufruf. Rechtstexte werden als ruhiger Fliesstext dargestellt.
 */

type Mode = "marketing" | "prose";
interface Ctx {
  locale: Locale;
  mode: Mode;
}

const PREFIXES = /^\/(en|fr|it|es|pt)(?=\/|$|#|\?)/;
/** Pfade, die zur App gehören (Anmeldung, Formulare, Profile) – führen zur App unter APP_URL. */
const APP_PATHS = /^\/(anmelden|melden|status|recht\/|@|e\/|p\/|plan|einladung|join|i\/)/;
const STORE_HOSTS = /apps\.apple\.com|play\.google\.com/;
const PRICE = /^(CHF|EUR|USD|GBP|US\$|R\$|€|\$)\s?\d/;
const CARD_ICONS: IconName[] = [
  "sparkles",
  "users",
  "ticket",
  "calendar",
  "star",
  "share",
  "pin",
  "chat",
  "camera",
  "qr",
  "gift",
  "building",
];

const isEl = (n: ContentNode | undefined): n is ContentElement => Array.isArray(n);
const tagOf = (n: ContentNode | undefined) => (isEl(n) ? n[0] : null);
const kids = (n: ContentElement): ContentNode[] =>
  n[0] === "a" ? (n.slice(2) as ContentNode[]) : (n.slice(1) as ContentNode[]);
const elements = (nodes: ContentNode[]) => nodes.filter(isEl);
export function textOf(n: ContentNode): string {
  return typeof n === "string" ? n : kids(n).map(textOf).join("");
}
const blank = (n: ContentNode) => typeof n === "string" && n.trim() === "";
const delay = (i: number) => ({ ["--reveal-delay" as string]: `${Math.min(i, 6) * 80}ms` }) as CSSProperties;

/** Nur Links (und Trenner wie « · ») in einem Absatz? */
function linkOnly(n: ContentElement): ContentElement[] | null {
  const links = kids(n).filter(isEl);
  const rest = kids(n).filter((k) => typeof k === "string" && k.replace(/[·|,\s]/g, "") !== "");
  if (links.length > 0 && rest.length === 0 && links.every((l) => l[0] === "a")) return links;
  return null;
}

function hrefInfo(raw: string, locale: Locale): { kind: "internal" | "app" | "external"; href: string } {
  if (!raw) return { kind: "external", href: "#" };
  if (raw.startsWith("/")) {
    const path = raw.replace(PREFIXES, "") || "/";
    if (APP_PATHS.test(path)) return { kind: "app", href: appLink(locale, path) };
    return { kind: "internal", href: path };
  }
  return { kind: "external", href: raw };
}

function SmartLink({
  href,
  className,
  children,
  ctx,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  ctx: Ctx;
}) {
  const info = hrefInfo(href, ctx.locale);
  if (info.kind === "internal") {
    return (
      <Link href={info.href} className={className}>
        {children}
      </Link>
    );
  }
  const external = info.kind === "external" && /^https?:/.test(info.href);
  return (
    <a href={info.href} className={className} {...(external ? { rel: "noopener" } : {})}>
      {children}
    </a>
  );
}

function Inline({ nodes, ctx }: { nodes: ContentNode[]; ctx: Ctx }) {
  return (
    <>
      {nodes.map((n, i) => {
        if (typeof n === "string") return n;
        const c = kids(n);
        switch (n[0]) {
          case "a":
            if (!n[1]) return <Inline key={i} nodes={c} ctx={ctx} />;
            return (
              <SmartLink
                key={i}
                href={n[1] as string}
                ctx={ctx}
                className="font-semibold text-link underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
              >
                <Inline nodes={c} ctx={ctx} />
              </SmartLink>
            );
          case "strong":
          case "b":
            return (
              <strong key={i} className="font-semibold text-text-1">
                <Inline nodes={c} ctx={ctx} />
              </strong>
            );
          case "em":
          case "i":
            return (
              <em key={i}>
                <Inline nodes={c} ctx={ctx} />
              </em>
            );
          case "small":
            return (
              <small key={i} className="text-body-sm text-text-2">
                <Inline nodes={c} ctx={ctx} />
              </small>
            );
          case "br":
            return <br key={i} />;
          case "code":
            return (
              <code key={i} className="rounded-sm bg-surface px-1 py-0.5 text-[0.9em]">
                <Inline nodes={c} ctx={ctx} />
              </code>
            );
          default:
            return <Inline key={i} nodes={c} ctx={ctx} />;
        }
      })}
    </>
  );
}

function CtaLinks({
  links,
  ctx,
  center = false,
  onDark = false,
}: {
  links: ContentElement[];
  ctx: Ctx;
  center?: boolean;
  onDark?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap gap-3", center && "justify-center")}>
      {links.map((l, i) => (
        <SmartLink
          key={i}
          href={l[1] as string}
          ctx={ctx}
          className={buttonClasses({
            variant: i === 0 ? "primary" : "secondary",
            size: "lg",
            className: cn("group", onDark && i > 0 && "border-white/30 bg-transparent text-on-ink"),
          })}
        >
          <Inline nodes={kids(l)} ctx={ctx} />
          {i === 0 ? (
            <Icon
              name="arrow"
              className="size-5 transition-transform duration-fast group-hover:translate-x-1"
            />
          ) : null}
        </SmartLink>
      ))}
    </div>
  );
}

function ChipLinks({ links, ctx }: { links: ContentElement[]; ctx: Ctx }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((l, i) => (
        <li key={i}>
          <SmartLink
            href={l[1] as string}
            ctx={ctx}
            className="inline-flex h-10 items-center rounded-full border border-line bg-surface-raised px-4 text-body-sm font-semibold text-text-1 transition-[border-color,color,transform] duration-fast hover:-translate-y-0.5 hover:border-primary hover:text-link focus-visible:focus-ring"
          >
            <Inline nodes={kids(l)} ctx={ctx} />
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}

/** Listen: Kartenraster, Merkmal-Liste, Linkchips oder Aufzählung. */
function List({ node, ctx, index }: { node: ContentElement; ctx: Ctx; index: number }) {
  const items = elements(kids(node)).filter((n) => n[0] === "li");
  const ordered = node[0] === "ol";
  const firstEl = (li: ContentElement) => elements(kids(li))[0];

  if (ctx.mode === "marketing" && items.length > 0 && items.every((li) => tagOf(firstEl(li)) === "h3")) {
    return (
      <ol
        className={cn(
          "grid gap-4 sm:grid-cols-2",
          items.length % 3 === 0 || items.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2",
        )}
      >
        {items.map((li, i) => {
          const [h3, ...rest] = elements(kids(li));
          return (
            <li
              key={i}
              data-reveal
              style={delay(i % 3)}
              className="group relative rounded-xl border border-line bg-surface-raised p-6 transition-[transform,box-shadow,border-color] duration-base hover:-translate-y-1 hover:border-primary-soft-line hover:shadow-2"
            >
              {ordered ? (
                <span
                  className="text-gradient-bloom block text-[2.75rem] leading-none font-black tracking-[-0.04em]"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              ) : (
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--pk-phone-ink)] text-white transition-colors duration-base group-hover:bg-primary">
                  <Icon name={CARD_ICONS[(index + i) % CARD_ICONS.length]!} className="size-5" />
                </span>
              )}
              <h3 className="mt-4 text-h3">
                <Inline nodes={kids(h3!)} ctx={ctx} />
              </h3>
              <Blocks nodes={rest} ctx={ctx} compact />
            </li>
          );
        })}
      </ol>
    );
  }

  const linkItems = items.map((li) => {
    const els = elements(kids(li));
    const text = kids(li).filter((k) => typeof k === "string" && k.trim() !== "");
    return els.length === 1 && els[0]![0] === "a" && text.length === 0 ? els[0]! : null;
  });
  if (items.length > 0 && linkItems.every(Boolean)) {
    const links = linkItems as ContentElement[];
    if (links.some((l) => STORE_HOSTS.test(String(l[1])))) return <StoreBadges locale={ctx.locale} />;
    return <ChipLinks links={links} ctx={ctx} />;
  }

  if (
    ctx.mode === "marketing" &&
    items.length > 1 &&
    items.every((li) => tagOf(kids(li).find((k) => !blank(k))) === "strong")
  ) {
    return (
      <ul className="grid gap-3 md:grid-cols-2">
        {items.map((li, i) => {
          const c = kids(li).filter((k) => !blank(k));
          const [title, ...rest] = c;
          const restText = rest.map((r) => (typeof r === "string" ? r.replace(/^\s*[–—-]\s*/, "") : r));
          return (
            <li key={i} data-reveal style={delay(i % 4)} className="flex gap-3 rounded-lg bg-surface p-4">
              <Icon name="star" className="mt-0.5 size-5 shrink-0 text-primary" />
              <span>
                <span className="block font-semibold">
                  <Inline nodes={kids(title as ContentElement)} ctx={ctx} />
                </span>
                <span className="text-body text-text-2">
                  <Inline nodes={restText} ctx={ctx} />
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={cn("flex flex-col gap-2.5", ordered && "list-decimal pl-6")}>
      {items.map((li, i) => (
        <li key={i} className={cn("text-body-lg text-text-2", !ordered && "flex gap-3")}>
          {!ordered ? <Icon name="check" className="mt-1 size-5 shrink-0 text-primary" /> : null}
          <span className="min-w-0">
            <Blocks nodes={kids(li)} ctx={ctx} compact />
          </span>
        </li>
      ))}
    </Tag>
  );
}

function Facts({ node, ctx }: { node: ContentElement; ctx: Ctx }) {
  const pairs: Array<[ContentElement, ContentElement | undefined]> = [];
  const els = elements(kids(node));
  els.forEach((el, i) => {
    if (el[0] === "dt") pairs.push([el, els[i + 1]?.[0] === "dd" ? els[i + 1] : undefined]);
  });
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {pairs.map(([dt, dd], i) => (
        <div
          key={i}
          data-reveal
          style={delay(i)}
          className="rounded-lg border border-line bg-surface-raised p-4"
        >
          <dt className="text-caption font-semibold tracking-wide text-text-3 uppercase">
            <Inline nodes={kids(dt)} ctx={ctx} />
          </dt>
          <dd className="mt-1 text-body font-medium">{dd ? <Inline nodes={kids(dd)} ctx={ctx} /> : null}</dd>
        </div>
      ))}
    </dl>
  );
}

function Question({
  title,
  body,
  ctx,
  open = false,
}: {
  title: ContentNode[];
  body: ContentNode[];
  ctx: Ctx;
  open?: boolean;
}) {
  return (
    <details
      open={open}
      className="group rounded-lg border border-line bg-surface-raised transition-colors duration-base open:border-primary-soft-line"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-h3 marker:hidden focus-visible:focus-ring [&::-webkit-details-marker]:hidden">
        <span>
          <Inline nodes={title} ctx={ctx} />
        </span>
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-link transition-transform duration-base group-open:rotate-45">
          <Icon name="plus" className="size-4" />
        </span>
      </summary>
      <div className="px-5 pb-5">
        <Blocks nodes={body} ctx={ctx} compact />
      </div>
    </details>
  );
}

function PlanCard({ node, ctx, highlight }: { node: ContentElement; ctx: Ctx; highlight: boolean }) {
  const [h2, ...rest] = elements(kids(node));
  return (
    <article
      data-reveal
      className={cn(
        "flex flex-col rounded-xl border bg-surface-raised p-6 md:p-7",
        highlight ? "border-primary shadow-pop" : "border-line",
      )}
    >
      <h3 className="text-h2">
        <Inline nodes={kids(h2!)} ctx={ctx} />
      </h3>
      <Blocks nodes={rest} ctx={ctx} compact />
    </article>
  );
}

/** Blockelemente in Reihenfolge; fasst Fragen (h3 + Absätze) zu Akkordeons zusammen. */
function Blocks({ nodes, ctx, compact = false }: { nodes: ContentNode[]; ctx: Ctx; compact?: boolean }) {
  const out: ReactNode[] = [];
  const list = nodes.filter((n) => !blank(n));
  for (let i = 0; i < list.length; i++) {
    const n = list[i]!;
    if (typeof n === "string") {
      out.push(
        <p key={i} className="text-body-lg text-text-2">
          {n.trim()}
        </p>,
      );
      continue;
    }
    const c = kids(n);
    switch (n[0]) {
      case "h2":
        out.push(
          <h2
            key={i}
            data-reveal
            className={cn(
              "max-w-3xl leading-[1.1] font-extrabold tracking-[-0.025em] text-balance",
              ctx.mode === "prose" ? "mt-6 text-h2" : "text-[clamp(1.75rem,3.6vw,2.75rem)]",
            )}
          >
            <Inline nodes={c} ctx={ctx} />
          </h2>,
        );
        break;
      case "h3": {
        if (ctx.mode === "marketing" && !compact) {
          // Häufige Fragen: h3 gefolgt von Absätzen bis zur nächsten Überschrift
          const body: ContentNode[] = [];
          while (
            list[i + 1] &&
            tagOf(list[i + 1]) !== "h3" &&
            tagOf(list[i + 1]) !== "h2" &&
            tagOf(list[i + 1]) !== "ul"
          )
            body.push(list[++i]!);
          if (body.length > 0) {
            out.push(<Question key={i} title={c} body={body} ctx={ctx} />);
            break;
          }
        }
        out.push(
          <h3 key={i} className={cn("text-h3", ctx.mode === "prose" && "mt-4")}>
            <Inline nodes={c} ctx={ctx} />
          </h3>,
        );
        break;
      }
      case "h4":
        out.push(
          <h4 key={i} className="text-body-lg font-semibold">
            <Inline nodes={c} ctx={ctx} />
          </h4>,
        );
        break;
      case "p": {
        const links = linkOnly(n);
        const text = textOf(n).trim();
        if (links && ctx.mode === "marketing" && links.length <= 2 && !compact) {
          out.push(<CtaLinks key={i} links={links} ctx={ctx} />);
        } else if (links && links.length > 2) {
          out.push(<ChipLinks key={i} links={links} ctx={ctx} />);
        } else if (PRICE.test(text) && text.length < 24) {
          out.push(
            <p key={i} className="mt-4 text-[2.5rem] leading-none font-black tracking-[-0.03em]">
              <Inline nodes={c} ctx={ctx} />
            </p>,
          );
        } else if (text) {
          out.push(
            <p
              key={i}
              className={cn(
                compact ? "mt-2 text-body text-text-2" : "text-body-lg text-text-2",
                ctx.mode === "prose" && "text-body text-text-2",
              )}
            >
              <Inline nodes={c} ctx={ctx} />
            </p>,
          );
        }
        break;
      }
      case "ul":
      case "ol":
        out.push(<List key={i} node={n} ctx={ctx} index={i} />);
        break;
      case "dl":
        out.push(<Facts key={i} node={n} ctx={ctx} />);
        break;
      case "article": {
        const first = tagOf(elements(c)[0]);
        if (first === "h2" && ctx.mode === "marketing") {
          // Aufeinanderfolgende Karten (z. B. Preise) als Raster
          const group: ContentElement[] = [n];
          while (
            tagOf(list[i + 1]) === "article" &&
            tagOf(elements(kids(list[i + 1] as ContentElement))[0]) === "h2"
          )
            group.push(list[++i] as ContentElement);
          out.push(
            <div
              key={i}
              className={cn("grid gap-4", group.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2")}
            >
              {group.map((g, j) => (
                <PlanCard key={j} node={g} ctx={ctx} highlight={group.length === 2 && j === 1} />
              ))}
            </div>,
          );
        } else if (first === "h3" && ctx.mode === "marketing") {
          const group: ContentElement[] = [n];
          while (tagOf(list[i + 1]) === "article") group.push(list[++i] as ContentElement);
          out.push(
            <div key={i} className="flex flex-col gap-3">
              {group.map((g, j) => {
                const [h3, ...body] = elements(kids(g));
                return <Question key={j} title={kids(h3!)} body={body} ctx={ctx} />;
              })}
            </div>,
          );
        } else {
          out.push(<Blocks key={i} nodes={c} ctx={ctx} compact={compact} />);
        }
        break;
      }
      case "section":
        out.push(
          <div key={i} className="flex flex-col gap-5">
            <Blocks nodes={c} ctx={ctx} compact={compact} />
          </div>,
        );
        break;
      case "table":
        out.push(
          <div key={i} className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full text-left text-body-sm">
              <tbody>
                {elements(c)
                  .flatMap((r) => (r[0] === "tr" ? [r] : elements(kids(r))))
                  .map((row, r) => (
                    <tr key={r} className="border-b border-line last:border-0">
                      {elements(kids(row)).map((cell, k) =>
                        cell[0] === "th" ? (
                          <th key={k} className="bg-surface p-3 font-semibold">
                            <Inline nodes={kids(cell)} ctx={ctx} />
                          </th>
                        ) : (
                          <td key={k} className="p-3 text-text-2">
                            <Inline nodes={kids(cell)} ctx={ctx} />
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>,
        );
        break;
      case "blockquote":
        out.push(
          <blockquote key={i} className="border-l-4 border-primary pl-4 text-body-lg italic text-text-2">
            <Inline nodes={c} ctx={ctx} />
          </blockquote>,
        );
        break;
      case "details":
        out.push(<Blocks key={i} nodes={c} ctx={ctx} compact={compact} />);
        break;
      case "hr":
        out.push(<hr key={i} className="border-line" />);
        break;
      default:
        out.push(
          <p key={i} className="text-body text-text-2">
            <Inline nodes={c} ctx={ctx} />
          </p>,
        );
    }
  }
  return <>{out}</>;
}

/** Hero aus Kicker (Absatz vor h1), h1, Einleitung, Meta-Angaben und Aufrufen. */
function Hero({ nodes, ctx }: { nodes: ContentNode[]; ctx: Ctx }) {
  const els = elements(nodes);
  const h1Index = els.findIndex((e) => e[0] === "h1");
  const before = els.slice(0, h1Index);
  const after = els.slice(h1Index + 1);
  const kicker = before.find((e) => e[0] === "p");
  const leads: ContentElement[] = [];
  const chips: ContentElement[] = [];
  const ctas: ContentElement[] = [];
  const rest: ContentElement[] = [];
  for (const e of after) {
    const links = e[0] === "p" ? linkOnly(e) : null;
    const text = textOf(e).trim();
    if (links) ctas.push(...links);
    else if (
      e[0] === "p" &&
      text.length > 0 &&
      text.length < 70 &&
      !/[.!?]$/.test(text) &&
      leads.length === 0
    )
      chips.push(e);
    else if (e[0] === "p" && text) leads.push(e);
    else rest.push(e);
  }
  return (
    <section className="relative overflow-hidden px-4 pt-14 pb-16 text-center md:px-6 md:pt-20 md:pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-blush" aria-hidden="true" />
      <div
        className="animate-glow pointer-events-none absolute -top-48 left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-gradient-glow"
        aria-hidden="true"
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
        {kicker ? (
          <p className="animate-rise inline-flex rounded-full border border-primary-soft-line bg-surface-raised px-3.5 py-1 text-body-sm font-semibold text-link">
            <Inline nodes={kids(kicker)} ctx={ctx} />
          </p>
        ) : null}
        <h1
          className="animate-rise text-[clamp(2.5rem,6.2vw,4.5rem)] leading-[1] font-black tracking-[-0.04em] text-balance"
          style={{ ["--rise-delay" as string]: "80ms" }}
        >
          <Inline nodes={kids(els[h1Index]!)} ctx={ctx} />
        </h1>
        {chips.length > 0 ? (
          <p
            className="animate-rise flex flex-wrap justify-center gap-2"
            style={{ ["--rise-delay" as string]: "140ms" }}
          >
            {chips.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-raised px-3 py-1 text-body-sm text-text-2 shadow-1"
              >
                <Icon name={i === 0 ? "pin" : "calendar"} className="size-4 text-primary" />
                <Inline nodes={kids(c)} ctx={ctx} />
              </span>
            ))}
          </p>
        ) : null}
        {leads.map((l, i) => (
          <p
            key={i}
            className="animate-rise max-w-2xl text-body-lg text-text-2 md:text-[1.2rem] md:leading-8"
            style={{ ["--rise-delay" as string]: "160ms" }}
          >
            <Inline nodes={kids(l)} ctx={ctx} />
          </p>
        ))}
        {ctas.length > 0 ? (
          <div className="animate-rise mt-2" style={{ ["--rise-delay" as string]: "240ms" }}>
            <CtaLinks links={ctas} ctx={ctx} center />
          </div>
        ) : null}
        {rest.length > 0 ? (
          <div
            className="animate-rise mt-2 flex flex-col items-center gap-4"
            style={{ ["--rise-delay" as string]: "300ms" }}
          >
            <Blocks nodes={rest} ctx={ctx} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Abschluss-Aufruf: Überschrift + kurzer Text + Link → dunkles Panel. */
function isCallToAction(section: ContentElement): boolean {
  const els = elements(kids(section));
  return (
    els.length >= 2 &&
    els.length <= 3 &&
    els[0]![0] === "h2" &&
    els.slice(1).every((e) => e[0] === "p") &&
    els.slice(1).some((e) => linkOnly(e)) &&
    textOf(section).length < 420
  );
}

function CallToAction({ section, ctx }: { section: ContentElement; ctx: Ctx }) {
  const els = elements(kids(section));
  return (
    <div
      data-reveal="zoom"
      className="relative overflow-hidden rounded-xl bg-ink-section px-6 py-14 text-center text-on-ink md:py-16"
    >
      <div
        className="animate-glow pointer-events-none absolute -bottom-40 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-gradient-glow"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4">
        <h2 className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">
          <Inline nodes={kids(els[0]!)} ctx={ctx} />
        </h2>
        {els.slice(1).map((e, i) => {
          const links = linkOnly(e);
          return links ? (
            <div key={i} className="mt-2">
              <CtaLinks links={links} ctx={ctx} center onDark />
            </div>
          ) : (
            <p key={i} className="text-body-lg text-on-ink-2">
              <Inline nodes={kids(e)} ctx={ctx} />
            </p>
          );
        })}
      </div>
    </div>
  );
}

export function ContentRenderer({
  page,
  locale,
  mode,
  after,
}: {
  page: ContentPage;
  locale: Locale;
  mode: Mode;
  after?: ReactNode;
}) {
  const ctx: Ctx = { locale, mode };
  // Artikel auf oberster Ebene (Travel Guide) auflösen
  const top = page.body.flatMap((n) =>
    isEl(n) && n[0] === "article" && elements(kids(n)).some((e) => e[0] === "h1") ? kids(n) : [n],
  );
  const heroIndex = top.findIndex(
    (n) => isEl(n) && (n[0] === "h1" || elements(kids(n)).some((e) => e[0] === "h1")),
  );
  let heroNodes: ContentNode[] = [];
  let restNodes: ContentNode[] = top;
  if (heroIndex >= 0) {
    const h = top[heroIndex] as ContentElement;
    if (h[0] === "h1") {
      // Hero-Elemente liegen lose vor der ersten Sektion
      const firstSection = top.findIndex((n, i) => i > heroIndex && tagOf(n) === "section");
      heroNodes = top.slice(0, firstSection < 0 ? top.length : firstSection);
      restNodes = firstSection < 0 ? [] : top.slice(firstSection);
    } else {
      heroNodes = kids(h);
      restNodes = [...top.slice(0, heroIndex), ...top.slice(heroIndex + 1)];
    }
  }

  return (
    <>
      {heroNodes.length > 0 ? <Hero nodes={heroNodes} ctx={ctx} /> : null}
      <div
        className={cn(
          "mx-auto flex flex-col px-4 pb-20 md:px-6",
          mode === "prose" ? "max-w-3xl gap-4 pt-10" : "max-w-6xl gap-16 pt-6 md:gap-24",
        )}
      >
        {restNodes
          .filter((n) => !blank(n))
          .map((n, i) =>
            isEl(n) && n[0] === "section" && mode === "marketing" && isCallToAction(n) ? (
              <CallToAction key={i} section={n} ctx={ctx} />
            ) : (
              <section key={i} className={cn("flex flex-col", mode === "prose" ? "gap-3" : "gap-6")}>
                <Blocks nodes={isEl(n) && n[0] === "section" ? kids(n) : [n]} ctx={ctx} />
              </section>
            ),
          )}
        {after}
      </div>
    </>
  );
}
