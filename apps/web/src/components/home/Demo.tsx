"use client";

import { cn } from "@pickeed/ui";
import { useTranslations } from "next-intl";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/icons";

const STEP_MS = 5200;
const steps = ["time", "idea", "ready"] as const;
const people = ["LE", "MI", "JO", "NO"];

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** «So funktioniert's»: Pasta-Abend in drei Schritten – läuft automatisch, lässt sich anhalten und steuern. */
export function Demo() {
  const t = useTranslations("Home.demo");
  const reduce = useSyncExternalStore(subscribeMotion, reducedMotion, () => true);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = !paused && !reduce;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % steps.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [playing, step]);

  const go = (next: number) => setStep((next + steps.length) % steps.length);
  const current = steps[step]!;

  return (
    <div className="grid items-center gap-8 md:grid-cols-[1fr_1.1fr] md:gap-12">
      <ol className="flex flex-col gap-3" aria-label={t("label")}>
        {steps.map((key, i) => (
          <li key={key}>
            <button
              type="button"
              onClick={() => {
                setStep(i);
                setPaused(true);
              }}
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "group relative w-full overflow-hidden rounded-lg border p-5 text-left transition-colors duration-base focus-visible:focus-ring",
                i === step ? "border-primary bg-surface-raised shadow-2" : "border-line hover:border-text-3",
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-body-sm font-bold",
                    i === step ? "bg-gradient-action text-on-primary" : "bg-surface text-text-2",
                  )}
                >
                  {i + 1}
                </span>
                <span className="text-h3">{t(`steps.${key}.title`)}</span>
                {key !== "ready" ? (
                  <span className="ml-auto rounded-full bg-primary-soft px-2.5 py-0.5 text-caption text-link">
                    {t(`steps.${key}.tag`)}
                  </span>
                ) : null}
              </span>
              <span className="mt-2 block pl-11 text-body text-text-2">{t(`steps.${key}.text`)}</span>
              {i === step && playing ? (
                <span
                  key={`progress-${step}`}
                  aria-hidden="true"
                  className="animate-bar-now absolute inset-x-0 bottom-0 h-1 origin-left bg-gradient-action"
                  style={{ animationDuration: `${STEP_MS}ms`, animationTimingFunction: "linear" }}
                />
              ) : null}
            </button>
          </li>
        ))}
      </ol>

      <div className="relative">
        <div
          className="pointer-events-none absolute -inset-10 rounded-full bg-gradient-glow"
          aria-hidden="true"
        />
        <figure className="relative rounded-xl border border-line bg-surface-raised p-5 shadow-2 sm:p-7">
          <figcaption className="flex items-center justify-between gap-3 border-b border-line pb-4">
            <span>
              <span className="block text-h3">{t("plan")}</span>
              <span className="text-body-sm text-text-2">{t("meta")}</span>
            </span>
            <span className="flex -space-x-2" aria-hidden="true">
              {people.map((p, i) => (
                <span
                  key={p}
                  className="animate-pop inline-flex size-9 items-center justify-center rounded-full bg-primary-soft text-caption font-bold text-link ring-2 ring-surface-raised"
                  style={{ ["--pop-delay" as string]: `${i * 90}ms` }}
                >
                  {p}
                </span>
              ))}
            </span>
          </figcaption>

          <div key={current} className="animate-rise min-h-[17rem] pt-5" aria-live="polite">
            {current === "time" ? (
              <div className="flex flex-col gap-4">
                <div className="rounded-md border border-dashed border-line p-4">
                  <p className="flex items-center justify-between text-body-sm text-text-2">
                    <span className="line-through">{t("earlier")}</span>
                    <span>{t("earlierVotes")}</span>
                  </p>
                  <p className="mt-1 text-caption text-text-3">{t("earlierNote")}</p>
                </div>
                <div className="rounded-md bg-primary-soft p-4">
                  <p className="flex items-center gap-2 text-body font-semibold">
                    <Icon name="calendar" className="size-5 text-primary" />
                    {t("ask")}
                  </p>
                  <div className="mt-3 flex gap-2" aria-hidden="true">
                    <span className="inline-flex h-9 items-center rounded-full bg-gradient-action px-4 text-body-sm font-semibold text-on-primary">
                      {t("yes")}
                    </span>
                    <span className="inline-flex h-9 items-center rounded-full border border-line bg-surface-raised px-4 text-body-sm font-semibold">
                      {t("no")}
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-raised">
                    <span
                      className="animate-bar-now block h-full origin-left rounded-full bg-gradient-action"
                      style={{ ["--bar-delay" as string]: "300ms" }}
                    />
                  </div>
                  <p className="mt-2 text-body-sm font-semibold text-link">{t("votes")}</p>
                </div>
              </div>
            ) : null}

            {current === "idea" ? (
              <div className="flex flex-col gap-3">
                <p className="text-body font-semibold">{t("vote")}</p>
                {(["i1", "i2", "i3"] as const).map((k, i) => {
                  const votes = [3, 1, 0][i]!;
                  return (
                    <div
                      key={k}
                      className={cn("rounded-md border p-3", i === 0 ? "border-primary" : "border-line")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span>
                          <span className="block text-body font-semibold">{t(`ideas.${k}.name`)}</span>
                          <span className="text-body-sm text-text-2">{t(`ideas.${k}.desc`)}</span>
                        </span>
                        <span className="shrink-0 text-body-sm font-semibold text-link">
                          {t("votesOf", { count: votes })}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                        <span
                          className="animate-bar-now block h-full origin-left rounded-full bg-gradient-action"
                          style={{
                            width: `${(votes / 4) * 100}%`,
                            ["--bar-delay" as string]: `${200 + i * 150}ms`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {current === "ready" ? (
              <div className="flex flex-col gap-4">
                <p className="flex items-center gap-2 text-h3 text-link">
                  <Icon name="check" className="animate-pop size-6" />
                  {t("ready")}
                </p>
                <div className="rounded-md bg-surface p-4">
                  <p className="text-h3">{t("place")}</p>
                  <p className="mt-1 text-body text-text-2">
                    {t("when")} · {t("where")}
                  </p>
                  <p className="mt-3 text-body-sm font-semibold">{t("coming")}</p>
                </div>
                <p className="flex items-center justify-between gap-3 rounded-md border border-line p-4 text-body">
                  <span>{t("task")}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-0.5 text-caption text-on-semantic">
                    <Icon name="check" className="size-3.5" />
                    {t("done")}
                  </span>
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <div className="flex gap-1.5" aria-hidden="true">
              {steps.map((key, i) => (
                <span
                  key={key}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-base",
                    i === step ? "w-6 bg-primary" : "w-1.5 bg-line",
                  )}
                />
              ))}
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => go(step - 1)}
                aria-label={t("prev")}
                className="inline-flex size-10 items-center justify-center rounded-full hover:bg-surface focus-visible:focus-ring"
              >
                <Icon name="left" />
              </button>
              {!reduce ? (
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={playing ? t("pause") : t("play")}
                  className="inline-flex size-10 items-center justify-center rounded-full hover:bg-surface focus-visible:focus-ring"
                >
                  <Icon name={playing ? "pause" : "play"} />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => go(step + 1)}
                aria-label={t("next")}
                className="inline-flex size-10 items-center justify-center rounded-full hover:bg-surface focus-visible:focus-ring"
              >
                <Icon name="right" />
              </button>
            </div>
          </div>
        </figure>
      </div>
    </div>
  );
}
