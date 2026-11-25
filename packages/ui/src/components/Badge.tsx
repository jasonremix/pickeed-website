import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface text-text-2 border border-line",
  primary: "bg-primary-soft text-link border border-primary-soft-line",
  success: "bg-success text-on-semantic",
  warning: "bg-warning text-on-semantic",
  danger: "bg-danger text-on-semantic",
};

export function Badge({ tone = "neutral", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-caption whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}
