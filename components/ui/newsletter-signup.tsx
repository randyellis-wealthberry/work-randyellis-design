"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import "@/styles/performance-optimized.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { FloatingInput } from "@/components/ui/input";
import { SECTION, SectionLabel } from "@/components/case-study/section-chrome";
import { PRIMARY_BUTTON } from "@/components/ui/button-styles";
import { cn } from "@/lib/utils";
import { trackNewsletterAttempt } from "@/lib/analytics";
import { useFeatureFlag } from "@/hooks/use-feature-flag";
import { useAnimationPerformance } from "@/hooks/use-animation-performance";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type EmailForm = z.infer<typeof emailSchema>;

/**
 * Routes whose own primary action must not compete with the subscribe button.
 * The services page ends on "Book a 30-minute call"; a full-width form beneath
 * it outranks that action and imports a palette the page does not use.
 */
const ROUTES_WITHOUT_NEWSLETTER = ["/services"];

/** Every case study ends on "Book a 30-minute call"; see above. */
const PREFIXES_WITHOUT_NEWSLETTER = ["/projects/"];

export function NewsletterSignup() {
  const pathname = usePathname();
  const isNewsletterEnabled = useFeatureFlag("newsletterEnabled");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error" | "rate_limited"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Performance monitoring
  const { startMonitoring, stopMonitoring } = useAnimationPerformance();
  const successElementRef = useRef<HTMLDivElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  // Return null if newsletter is disabled via feature flag, or if this route
  // owns a primary action the subscribe form would compete with.
  // usePathname returns null outside a router context (and in tests), so the
  // route checks have to tolerate it rather than throwing.
  const route = pathname ?? "";
  const suppressed =
    ROUTES_WITHOUT_NEWSLETTER.includes(route) ||
    PREFIXES_WITHOUT_NEWSLETTER.some((prefix) => route.startsWith(prefix));

  if (!isNewsletterEnabled || suppressed) {
    return null;
  }

  const onSubmit = async (data: EmailForm) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    // Track the attempt
    trackNewsletterAttempt("submit_start", false);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        trackNewsletterAttempt("submit_success", true);
        reset();

        // Start performance monitoring when animation begins
        setTimeout(() => {
          startMonitoring();
          // Stop monitoring after animation completes (400ms + 150ms delay)
          setTimeout(() => stopMonitoring(), 600);
        }, 50);
      } else if (response.status === 429) {
        // Rate limited
        const errorData = await response.json();
        setSubmitStatus("rate_limited");
        setErrorMessage(
          errorData.message || "Too many requests. Please wait a moment.",
        );
        trackNewsletterAttempt("submit_rate_limited", false);
      } else {
        // Other errors
        const errorData = await response.json().catch(() => ({}));
        setSubmitStatus("error");
        setErrorMessage(
          errorData.error || "Something went wrong. Please try again.",
        );
        trackNewsletterAttempt("submit_error", false);
      }
    } catch {
      setSubmitStatus("error");
      setErrorMessage(
        "Network error. Please check your connection and try again.",
      );
      trackNewsletterAttempt("submit_error", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Opens through the shared `SECTION` rule like every other section on the
    // site. What stood here was `mt-24 min-h-[600px] border-zinc-100 pt-16` —
    // a bespoke rule weight the palette does not contain, and 600px of forced
    // height appended to the bottom of every page whether the form needed it
    // or not.
    //
    // It is deliberately quieter than `CTASection`, which still runs above it
    // on `/about`, `/projects`, and every blog post. Two closes on one page is
    // a hierarchy problem, and the fix is that the second one is a label, a
    // line, and a field — not a second display heading with its own hero.
    <motion.section
      className={cn(SECTION, "pb-8")}
      aria-labelledby="newsletter-heading"
      initial={{ opacity: 1, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionLabel id="newsletter-heading">Newsletter</SectionLabel>

      {submitStatus === "success" ? (
        <motion.div
          ref={successElementRef}
          initial={{ opacity: 1, scale: 1, rotateZ: 0 }}
          animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1], // Spring-like cubic-bezier
          }}
          style={{
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)", // Force hardware acceleration
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            transitionDuration: "0.4s",
          }}
          className="performance-optimized-animation hw-accelerated mt-6"
        >
          <div className="flex flex-col space-y-4">
            <div className="hw-accelerated flex h-16 w-16 items-center justify-center">
              {/* Ink, not `bg-green-500`. The One Family Rule: zinc plus weight
                  is the whole vocabulary, and the tick already says "success"
                  without recruiting a hue to repeat it. */}
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 dark:bg-white"
                // Visible At Zero: entrance motion moves, it never hides. This
                // opened at `scale: 0, opacity: 0`, so the confirmation a
                // reader was waiting for was invisible until a script ran.
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.4,
                  ease: [0.34, 1.56, 0.64, 1],
                  delay: 0.2,
                }}
                style={{
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden",
                  transform: "translateZ(0)",
                }}
              >
                <svg
                  aria-hidden="true"
                  className="h-6 w-6 text-white dark:text-zinc-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            </div>
            <motion.div
              className="space-y-2"
              initial={{ opacity: 1, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.1, // Stagger after main animation
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                willChange: "transform, opacity",
                backfaceVisibility: "hidden",
              }}
            >
              {/* h3, not h4: the section's own heading is the h2 above, so a
                  h4 here skipped a level. Subhead voice — Body at
                  `font-medium` — because the section is already announced. */}
              <motion.h3
                className="stagger-title text-base font-medium text-zinc-900 dark:text-white"
                // Visible At Zero, again: this opened invisible.
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.2,
                  delay: 0.0, // Title first
                  ease: "easeOut",
                }}
                style={{
                  willChange: "opacity",
                  transitionDelay: "0s",
                }}
              >
                Successfully subscribed!
              </motion.h3>
              <motion.p
                className="stagger-description max-w-[62ch] text-base text-zinc-600 dark:text-zinc-300"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.2,
                  delay: 0.15, // Description delayed
                  ease: "easeOut",
                }}
                style={{
                  willChange: "opacity",
                  transitionDelay: "0.15s",
                }}
              >
                Please check your email for a confirmation message.
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <div className="mt-6">
          {/* No decorative dots. Three descending circles in `bg-blue-600`,
              `bg-blue-400`, `bg-blue-300` sat above this heading: pure
              ornament, in the one hue family the site does not use. */}
          <div className="space-y-3">
            {/* Subhead, and no `<br />`. A forced line break is a layout
                decision frozen at one viewport width; `text-balance` is the
                tool that actually knows how wide the column is. */}
            <h3 className="max-w-[40ch] text-base font-medium text-balance text-zinc-900 dark:text-white">
              Business strategy prompts for product designers
            </h3>
            <p className="max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
              Weekly insights that bridge design thinking with business strategy
              — how to argue for design in the language the boardroom already
              speaks.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 w-full max-w-xl"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3 sm:flex-row sm:items-start"
              noValidate
            >
              <div className="flex-1">
                <FloatingInput
                  {...register("email")}
                  type="email"
                  label="Email Address"
                  required
                  aria-describedby={errors.email ? "email-error" : "email-help"}
                  disabled={isSubmitting}
                  error={errors.email?.message}
                />
              </div>

              {/* The shared primary: Ink fill, 44px target, transition-colors,
                  zinc focus ring. It was `bg-blue-600 hover:bg-blue-700
                  focus-visible:ring-blue-500/20` — a hue the palette does not
                  contain, on the one control that appears on every page. */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  PRIMARY_BUTTON,
                  "shrink-0 disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                {isSubmitting ? "Subscribing…" : "Subscribe"}
              </button>
            </form>

            {(submitStatus === "error" || submitStatus === "rate_limited") && (
              // Red text, no filled panel, and one treatment for both states.
              // A rate limit is an error; two hues for two subtypes of the same
              // outcome is a distinction the reader does not act on. The tone
              // matches `input.tsx`, which already owns validation errors —
              // this is the form layer's signal, not decorative emphasis.
              <motion.p
                role="alert"
                initial={{ opacity: 1, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 max-w-[62ch] text-sm text-red-600 dark:text-red-400"
              >
                {errorMessage || "Something went wrong. Please try again."}
              </motion.p>
            )}
          </motion.div>

          {/* Footnote voice. "Your privacy matters to us" — there is no "us";
              this is one person's mailing list, and the site speaks as "I"
              everywhere else. */}
          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            No spam, and you can unsubscribe from any email.
          </p>
        </div>
      )}
    </motion.section>
  );
}
