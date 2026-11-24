import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,box-shadow,transform,color] duration-fast ease-out " +
  "focus-visible:focus-ring active:scale-[0.98] motion-reduce:active:scale-100 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 " +
  "aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-gradient-action text-on-primary shadow-pop hover:brightness-105",
  secondary: "border border-line bg-surface-raised text-text-1 hover:border-primary hover:text-primary",
  tertiary: "text-link hover:bg-primary-soft",
  danger: "bg-danger text-on-semantic hover:brightness-110",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-body-sm",
  md: "h-11 px-5 text-body",
  lg: "h-13 px-6 text-body-lg",
};

/** Klassen eines Buttons – auch für Links nutzbar, die wie Buttons aussehen. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}): string {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {
  /** Zeigt einen Spinner, sperrt den Button und meldet «beschäftigt» an Screenreader. */
  loading?: boolean;
  /** Zugänglicher Text während des Ladens (übersetzt übergeben). */
  loadingLabel?: string;
  icon?: ReactNode;
}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  loading = false,
  loadingLabel,
  icon,
  disabled,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <>
          <span className="invisible inline-flex items-center gap-2">
            {icon}
            {children}
          </span>
          <span className="absolute inset-0 inline-flex items-center justify-center">
            <Spinner size="sm" {...(loadingLabel ? { label: loadingLabel } : {})} />
          </span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
