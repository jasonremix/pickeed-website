import { cn } from "../lib/cn";

export interface SkeletonProps {
  className?: string;
  shape?: "rect" | "circle" | "text";
}

/** Platzhalter in Form des erwarteten Inhalts während des Ladens. Für Screenreader unsichtbar. */
export function Skeleton({ className, shape = "rect" }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block animate-pulse bg-line motion-reduce:animate-none",
        shape === "circle" && "rounded-full",
        shape === "rect" && "rounded-md",
        shape === "text" && "h-4 rounded-sm",
        className,
      )}
    />
  );
}
