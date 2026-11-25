import { cn } from "@pickeed/ui";

/** Offizielles Pickeed-Logo: Bildmarke + Wortmarke (Wortmarke wird im Dunkelmodus hell). */
export function Logo({ className, markOnly = false }: { className?: string; markOnly?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- kleine, feste Logo-Datei */}
      <img
        src="/images/brand/pickeed-mark.png"
        alt=""
        width={448}
        height={515}
        className="h-[1.15em] w-auto"
      />
      {markOnly ? (
        <span className="sr-only">Pickeed</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- kleine, feste Logo-Datei
        <img
          src="/images/brand/pickeed-wordmark.png"
          alt="Pickeed"
          width={783}
          height={160}
          className="h-[0.95em] w-auto [filter:var(--pk-logo-filter)]"
        />
      )}
    </span>
  );
}
