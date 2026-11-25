"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "@/components/icons";
import { usePathname } from "@/i18n/navigation";

/** Menü für kleine Bildschirme als natives <dialog> (Fokus bleibt im Menü, Escape schliesst). */
export function MobileMenu({ children }: { children: ReactNode }) {
  const t = useTranslations("Common");
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    ref.current?.close();
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="inline-flex size-11 items-center justify-center rounded-full hover:bg-surface focus-visible:focus-ring lg:hidden"
        aria-label={t("menu")}
        aria-haspopup="dialog"
      >
        <Icon name="menu" className="size-6" />
      </button>
      <dialog
        ref={ref}
        aria-label={t("menu")}
        className="m-0 ml-auto h-dvh max-h-none w-[min(24rem,100vw)] max-w-none bg-bg p-0 text-text-1 backdrop:bg-black/40 backdrop:backdrop-blur-sm open:animate-[pk-rise_300ms_var(--pk-ease-out)]"
        onClick={(e) => {
          if (e.target === e.currentTarget) ref.current?.close();
        }}
      >
        <div className="flex h-full flex-col p-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="inline-flex size-11 items-center justify-center rounded-full hover:bg-surface focus-visible:focus-ring"
              aria-label={t("close")}
            >
              <Icon name="close" className="size-6" />
            </button>
          </div>
          <nav className="mt-4 flex flex-1 flex-col gap-1 text-h3">{children}</nav>
        </div>
      </dialog>
    </>
  );
}
