"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CalButton } from "@/components/booking/cal-embed";
import {
  SectionLabel,
  SECTION,
  ROW,
} from "@/components/case-study/section-chrome";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
} from "@/components/ui/button-styles";
import { trackContactIntent, trackEvent } from "@/lib/analytics";
import { BOOKING_URL } from "@/lib/constants";
import {
  BAND_LABELS,
  DIMENSIONS,
  OVERALL_VERDICTS,
  isDimensionComplete,
  scoreDiagnostic,
  type Answers,
  type Dimension,
} from "@/lib/data/diagnostic";
import { cn } from "@/lib/utils";

/**
 * Where an unfinished diagnostic waits. A reload halfway through twelve
 * questions should not cost the founder their answers; the tab's session
 * storage keeps them until the tab closes, and nothing leaves the browser.
 */
const STORAGE_KEY = "hire-ai-randy:diagnostic";

interface Saved {
  answers: Answers;
  step: number;
}

function readSaved(): Saved | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as Saved).step !== "number" ||
      typeof (parsed as Saved).answers !== "object" ||
      (parsed as Saved).answers === null
    ) {
      return null;
    }
    const { answers, step } = parsed as Saved;
    const clean: Record<string, number> = {};
    for (const [key, value] of Object.entries(answers)) {
      if (typeof value === "number") clean[key] = value;
    }
    return {
      answers: clean,
      step: Math.min(Math.max(0, Math.trunc(step)), DIMENSIONS.length),
    };
  } catch {
    return null;
  }
}

function writeSaved(saved: Saved) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // Storage can be full or blocked; the diagnostic still works in memory.
  }
}

function clearSaved() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do; there was nothing to clear.
  }
}

const TEXT_LINK =
  "-my-3 inline-flex min-h-[44px] w-fit items-center gap-1.5 py-3 font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-white dark:decoration-zinc-700 dark:hover:decoration-zinc-100 dark:focus-visible:ring-white";

/** Steps 0..3 are the four dimensions; step 4 is the verdict. */
const RESULTS_STEP = DIMENSIONS.length;

export default function HireAiRandyClient() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // Saved state is read after mount so server and first client render agree.
  const [restored, setRestored] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const questionRefs = useRef<Record<string, HTMLFieldSetElement | null>>({});
  const skipScrollRef = useRef(true);

  useEffect(() => {
    const saved = readSaved();
    if (saved) {
      setAnswers(saved.answers);
      setStep(saved.step);
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    writeSaved({ answers, step });
  }, [answers, step, restored]);

  // Each step change moves the reader to the top of the new section and hands
  // focus to it, so a keyboard or screen-reader user lands on the question
  // set rather than on whatever the button used to be. The first render is
  // skipped: the page opens at the top already.
  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }
    const section = sectionRef.current;
    if (!section) return;
    section.scrollIntoView({ block: "start" });
    section.focus({ preventScroll: true });
  }, [step]);

  const result = useMemo(() => scoreDiagnostic(answers), [answers]);

  useEffect(() => {
    if (step !== RESULTS_STEP) return;
    trackEvent("diagnostic_complete", "engagement", result.band, result.total);
    // The result is derived from the answers that produced this step; the
    // event fires once per arrival at the verdict, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const choose = useCallback(
    (questionId: string, index: number) => {
      const updated = { ...answers, [questionId]: index };
      setAnswers(updated);
      // Keep the per-question markers until every question is answered, so a
      // founder who answers one of two missing questions still sees the other.
      const dimension = DIMENSIONS[step];
      if (dimension && isDimensionComplete(dimension, updated)) setError(null);
    },
    [answers, step],
  );

  const next = useCallback(() => {
    const dimension = DIMENSIONS[step];
    if (!dimension) return;
    if (!isDimensionComplete(dimension, answers)) {
      const missing = dimension.questions.filter(
        (question) => answers[question.id] === undefined,
      );
      setError(
        missing.length === 1
          ? "One question still needs an answer."
          : `${missing.length} questions still need an answer.`,
      );
      questionRefs.current[missing[0]!.id]?.focus();
      return;
    }
    setError(null);
    setStep((current) => Math.min(current + 1, RESULTS_STEP));
  }, [answers, step]);

  const back = useCallback(() => {
    setError(null);
    setStep((current) => Math.max(current - 1, 0));
  }, []);

  const restart = useCallback(() => {
    clearSaved();
    setAnswers({});
    setError(null);
    setStep(0);
  }, []);

  const current: Dimension | undefined = DIMENSIONS[step];

  return (
    <main
      id="main-content"
      className="pb-8 caret-zinc-900 selection:bg-zinc-900 selection:text-white dark:caret-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900"
    >
      <h1 className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-900 sm:text-5xl dark:text-white">
        Hire AI Randy.
      </h1>
      <p className="mt-5 max-w-[62ch] text-lg text-zinc-600 dark:text-zinc-300">
        Twenty years of design leadership, structured into twelve questions you
        can answer without me in the room. Score how ready your AI product is to
        ship, read the verdict I would give you on a call, and see where the
        two-week sprint would start.
      </p>
      <p className="mt-4 max-w-[62ch] text-sm text-zinc-500 dark:text-zinc-400">
        Free · About ten minutes · Your answers stay in this browser tab
      </p>

      {/* The route through the diagnostic, as a contents line rather than a
          progress widget: the four dimensions in order, the current one in
          Ink. Plain text, no bar to animate. */}
      <nav aria-label="Diagnostic progress" className="mt-10">
        <ol className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 tabular-nums dark:text-zinc-400">
          {DIMENSIONS.map((dimension, index) => {
            const isCurrent = index === step;
            const isDone = index < step;
            return (
              <li
                key={dimension.id}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  isCurrent && "font-medium text-zinc-900 dark:text-white",
                  isDone && "text-zinc-700 dark:text-zinc-300",
                )}
              >
                {index + 1}. {dimension.name}
              </li>
            );
          })}
          <li
            aria-current={step === RESULTS_STEP ? "step" : undefined}
            className={cn(
              step === RESULTS_STEP &&
                "font-medium text-zinc-900 dark:text-white",
            )}
          >
            5. The verdict
          </li>
        </ol>
      </nav>

      {current ? (
        <section
          // Keyed by dimension: the section label holds its text in state
          // from mount, so without a remount the heading would keep the first
          // dimension's name through every step.
          key={current.id}
          ref={sectionRef}
          tabIndex={-1}
          aria-labelledby="dimension-heading"
          className={cn(SECTION, "focus:outline-none")}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <SectionLabel id="dimension-heading">{current.name}</SectionLabel>
            <p className="text-sm text-zinc-500 tabular-nums dark:text-zinc-400">
              {step + 1} of {DIMENSIONS.length}
            </p>
          </div>
          <p className="mt-4 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-300">
            {current.reveals}
          </p>

          <div className="mt-8">
            {current.questions.map((question, questionIndex) => {
              const chosen = answers[question.id];
              const missing = error !== null && chosen === undefined;
              const errorId = `${question.id}-error`;
              return (
                <fieldset
                  key={question.id}
                  ref={(node) => {
                    questionRefs.current[question.id] = node;
                  }}
                  role="radiogroup"
                  tabIndex={-1}
                  aria-invalid={missing || undefined}
                  aria-describedby={missing ? errorId : undefined}
                  className={cn(
                    "border-t py-6 focus:outline-none",
                    missing
                      ? "border-red-600 dark:border-red-400"
                      : "border-zinc-200 dark:border-zinc-800",
                  )}
                >
                  <legend className="float-left w-full pt-6 text-base font-medium text-zinc-900 dark:text-white">
                    <span
                      className={cn(
                        "mr-2 tabular-nums",
                        missing
                          ? "text-red-600 dark:text-red-400"
                          : "text-zinc-500 dark:text-zinc-400",
                      )}
                    >
                      {questionIndex + 1}.
                    </span>
                    {question.prompt}
                  </legend>
                  {missing && (
                    <p
                      id={errorId}
                      className="clear-both mt-2 text-sm font-medium text-red-600 dark:text-red-400"
                    >
                      Choose one option to continue.
                    </p>
                  )}
                  <div className="clear-both mt-4 flex flex-col gap-1">
                    {question.options.map((option, optionIndex) => {
                      const id = `${question.id}-${optionIndex}`;
                      const selected = chosen === optionIndex;
                      return (
                        <label
                          key={id}
                          htmlFor={id}
                          className={cn(
                            "flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-base transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900",
                            selected
                              ? "font-medium text-zinc-900 dark:text-white"
                              : "text-zinc-600 dark:text-zinc-300",
                          )}
                        >
                          <input
                            id={id}
                            type="radio"
                            name={question.id}
                            value={optionIndex}
                            checked={selected}
                            onChange={() => choose(question.id, optionIndex)}
                            className="mt-1.5 h-4 w-4 shrink-0 accent-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:accent-white dark:focus-visible:ring-white"
                          />
                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}
          </div>

          {error && (
            <p
              role="alert"
              className="mt-2 text-sm font-medium text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}

          {/* Order is the hierarchy: the way forward is first. */}
          <div className="mt-8 flex flex-col gap-3 border-t border-zinc-200 pt-8 sm:flex-row dark:border-zinc-800">
            <button type="button" onClick={next} className={PRIMARY_BUTTON}>
              {step === DIMENSIONS.length - 1
                ? "See the verdict"
                : "Next: " + DIMENSIONS[step + 1]!.name}
            </button>
            {step > 0 && (
              <button type="button" onClick={back} className={SECONDARY_BUTTON}>
                Back
              </button>
            )}
          </div>
        </section>
      ) : (
        <section
          ref={sectionRef}
          tabIndex={-1}
          aria-labelledby="verdict-heading"
          className={cn(SECTION, "focus:outline-none")}
        >
          <SectionLabel id="verdict-heading">The verdict</SectionLabel>
          <p className="mt-6 max-w-[24ch] text-2xl leading-tight font-semibold tracking-[-0.03em] text-zinc-900 sm:text-3xl dark:text-white">
            {OVERALL_VERDICTS[result.band].title}
          </p>
          <p className="mt-4 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-300">
            {OVERALL_VERDICTS[result.band].body}
          </p>

          {/* The Results Table signature: a real table, sr-only caption,
              numbers right-aligned in tabular figures. */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full max-w-[46rem] border-collapse text-left">
              <caption className="sr-only">
                Ship-readiness score by dimension
              </caption>
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th
                    scope="col"
                    className="py-3 pr-4 text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400"
                  >
                    Dimension
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-4 text-right text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400"
                  >
                    Score
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-right text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400"
                  >
                    Reads as
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.dimensions.map((dimension) => (
                  <tr
                    key={dimension.id}
                    className="border-b border-zinc-200 dark:border-zinc-800"
                  >
                    <th
                      scope="row"
                      className="py-4 pr-4 text-base font-normal text-zinc-500 dark:text-zinc-400"
                    >
                      {dimension.name}
                    </th>
                    <td className="py-4 pr-4 text-right text-base font-medium text-zinc-900 tabular-nums dark:text-white">
                      {dimension.score} / {dimension.max}
                    </td>
                    <td className="py-4 text-right text-base font-medium text-zinc-900 dark:text-white">
                      {BAND_LABELS[dimension.band]}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-zinc-900 dark:border-zinc-100">
                  <th
                    scope="row"
                    className="py-4 pr-4 text-base font-normal text-zinc-500 dark:text-zinc-400"
                  >
                    Overall
                  </th>
                  <td className="py-4 pr-4 text-right text-base font-medium text-zinc-900 tabular-nums dark:text-white">
                    {result.total} / {result.max}
                  </td>
                  <td className="py-4 text-right text-base font-medium text-zinc-900 dark:text-white">
                    {BAND_LABELS[result.band]}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <dl className="mt-10">
            {result.dimensions.map((dimension) => (
              <div key={dimension.id} className={ROW}>
                <dt className="text-base font-medium text-zinc-900 sm:pr-8 dark:text-white">
                  {dimension.name}
                  <span className="ml-2 text-sm font-normal text-zinc-500 tabular-nums dark:text-zinc-400">
                    {dimension.score} / {dimension.max}
                  </span>
                </dt>
                <dd className="mt-2 max-w-[62ch] text-base text-zinc-600 sm:mt-0 dark:text-zinc-300">
                  {dimension.verdict}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-20 border-t border-zinc-900 pt-10 dark:border-zinc-100">
            <h2 className="text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400">
              Where I would start
            </h2>
            <p className="mt-6 max-w-[24ch] text-2xl leading-tight font-semibold tracking-[-0.03em] text-zinc-900 sm:text-3xl dark:text-white">
              {result.weakest.name}.
            </p>
            <p className="mt-4 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-300">
              {result.weakest.sprint}
            </p>
            <dl className="mt-8">
              {[
                {
                  label: "Engagement",
                  value: "The two-week AI product design sprint",
                },
                {
                  label: "Price",
                  value: "$4,000, credited to month one of the retainer",
                },
                { label: "Starts", value: "Within two weeks of the call" },
              ].map((term) => (
                <div
                  key={term.label}
                  className="grid grid-cols-1 border-t border-zinc-200 py-5 sm:grid-cols-[minmax(0,14rem)_1fr] dark:border-zinc-800"
                >
                  <dt className="text-base text-zinc-500 sm:pr-8 dark:text-zinc-400">
                    {term.label}
                  </dt>
                  <dd className="mt-1 text-base font-medium text-zinc-900 tabular-nums sm:mt-0 dark:text-white">
                    {term.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CalButton
                onClick={() =>
                  trackContactIntent(
                    "booking",
                    BOOKING_URL,
                    "diagnostic_results",
                  )
                }
                className={PRIMARY_BUTTON}
              >
                Book a 30-minute call about the sprint
              </CalButton>
              <Link href="/services" className={SECONDARY_BUTTON}>
                Sprint and retainer terms
              </Link>
            </div>
            <div className="mt-6 flex flex-col gap-4">
              <button
                type="button"
                onClick={restart}
                className={cn(TEXT_LINK, "cursor-pointer")}
              >
                Start the diagnostic over
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </button>
              <p className="max-w-[62ch] text-xs text-zinc-500 dark:text-zinc-400">
                Signals, not an audit. Twelve answers cannot see your codebase;
                the sprint can.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
