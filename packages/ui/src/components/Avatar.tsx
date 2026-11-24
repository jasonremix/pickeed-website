import { cn } from "../lib/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  /** Name der Person oder Seite – für Alt-Text und Initialen. */
  name: string;
  src?: string | null;
  size?: AvatarSize;
  /** Verlaufsring, z. B. für einen neuen Status. */
  ring?: boolean;
  /** Zeigt das Verifiziert-Häkchen; Label übersetzt übergeben (z. B. «Verifiziert»). */
  verifiedLabel?: string;
  className?: string;
}

const sizes: Record<AvatarSize, { box: string; text: string; badge: string }> = {
  xs: { box: "size-6", text: "text-[0.625rem]", badge: "size-3" },
  sm: { box: "size-8", text: "text-caption", badge: "size-3.5" },
  md: { box: "size-11", text: "text-body-sm", badge: "size-4" },
  lg: { box: "size-16", text: "text-body-lg", badge: "size-5" },
  xl: { box: "size-24", text: "text-h2", badge: "size-6" },
};

/** Ermittelt bis zu zwei Initialen aus einem Namen («Lea Muster» → «LM»). */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toLocaleUpperCase();
}

export function Avatar({ name, src, size = "md", ring = false, verifiedLabel, className }: AvatarProps) {
  const s = sizes[size];
  const face = src ? (
    <img src={src} alt={name} className={cn("rounded-full object-cover", s.box)} />
  ) : (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary-soft font-semibold text-link",
        s.box,
        s.text,
      )}
    >
      {initials(name)}
    </span>
  );

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      {ring ? (
        <span className="rounded-full bg-gradient-bloom p-0.5">
          <span className="block rounded-full bg-bg p-0.5">{face}</span>
        </span>
      ) : (
        face
      )}
      {verifiedLabel ? (
        <span
          className={cn(
            "absolute -right-0.5 -bottom-0.5 inline-flex items-center justify-center rounded-full bg-verified text-on-primary ring-2 ring-bg",
            s.badge,
          )}
        >
          <svg viewBox="0 0 16 16" className="size-[70%]" aria-hidden="true">
            <path
              d="M3.5 8.5l3 3 6-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="sr-only">{verifiedLabel}</span>
        </span>
      ) : null}
    </span>
  );
}
