import { cn } from "@pickeed/ui";

/** Handy-Rahmen um einen App-Screenshot (786 × 1528 px). */
export function PhoneFrame({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "phone relative aspect-[786/1640] rounded-[2.4rem] bg-[var(--pk-phone)] p-[3.2%] shadow-2",
        className,
      )}
    >
      <div className="relative h-full overflow-hidden rounded-[2rem] bg-white">
        <div
          className="relative flex h-[6.5%] items-center justify-between px-[9%] text-[clamp(7px,1.6vw,11px)] font-semibold text-[var(--pk-phone-ink)]"
          aria-hidden="true"
        >
          <span>9:41</span>
          <span className="absolute left-1/2 top-[24%] h-[52%] w-[30%] -translate-x-1/2 rounded-full bg-[var(--pk-phone-ink)]" />
          <span className="flex items-center gap-1">
            <span className="inline-block h-[0.55em] w-[1.1em] rounded-[2px] border border-current" />
          </span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- Screenshots sind bereits optimiert (WebP) */}
        <img
          src={src}
          alt={alt}
          width={786}
          height={1528}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-[93.5%] w-full object-cover object-top"
        />
      </div>
    </div>
  );
}
