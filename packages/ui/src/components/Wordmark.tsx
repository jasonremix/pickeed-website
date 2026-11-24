import { cn } from "../lib/cn";

export interface WordmarkProps {
  className?: string;
  /** Nur das Bildzeichen ohne Schriftzug. */
  markOnly?: boolean;
}

/**
 * Provisorische Wortmarke (ADR-0003, Frage C2): wird ersetzt, sobald offizielle Logo-Dateien vorliegen.
 * Bewusst keine Nachbildung bestehender Logos.
 */
export function Wordmark({ className, markOnly = false }: WordmarkProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 font-extrabold tracking-tight text-text-1", className)}
    >
      <span
        aria-hidden="true"
        className="inline-block size-[0.9em] rounded-full bg-gradient-bloom shadow-pop"
      />
      {markOnly ? <span className="sr-only">Pickeed</span> : <span>Pickeed</span>}
    </span>
  );
}
