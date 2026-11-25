import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "raised" | "outline";
  padding?: "none" | "sm" | "md" | "lg";
  /** Hebt die Karte beim Hover leicht an (für klickbare Karten mit Link im Inhalt). */
  interactive?: boolean;
}

const variants = {
  default: "bg-surface",
  raised: "bg-surface-raised shadow-2",
  outline: "border border-line bg-surface-raised",
} as const;

const paddings = { none: "", sm: "p-3", md: "p-5", lg: "p-8" } as const;

export function Card({
  variant = "default",
  padding = "md",
  interactive = false,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg",
        variants[variant],
        paddings[padding],
        interactive &&
          "transition-[transform,box-shadow] duration-base ease-out hover:-translate-y-0.5 hover:shadow-2 motion-reduce:hover:translate-y-0",
        className,
      )}
      {...rest}
    />
  );
}
