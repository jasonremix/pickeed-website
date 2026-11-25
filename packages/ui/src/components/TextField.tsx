"use client";

import { useId, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  /** Hilfetext unter dem Feld. */
  hint?: string;
  /** Fehlermeldung – setzt aria-invalid und wird vorgelesen. */
  error?: string;
  /** Label nur für Screenreader sichtbar. */
  hideLabel?: boolean;
}

export function TextField({
  label,
  hint,
  error,
  hideLabel,
  id,
  className,
  required,
  ...rest
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? `tf-${autoId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className={cn("text-body-sm font-medium text-text-1", hideLabel && "sr-only")}>
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-primary">
            *
          </span>
        ) : null}
      </label>
      <input
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-11 w-full rounded-sm border bg-surface px-3 text-body text-text-1 placeholder:text-text-3",
          "transition-[border-color,box-shadow] duration-fast ease-out",
          "focus-visible:border-primary focus-visible:focus-ring",
          "disabled:cursor-not-allowed disabled:opacity-60",
          error ? "border-danger" : "border-line hover:border-text-3",
        )}
        {...rest}
      />
      {error ? (
        <p id={errorId} className="text-body-sm text-danger-text">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="text-body-sm text-text-2">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
