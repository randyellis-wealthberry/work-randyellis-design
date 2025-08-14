"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FloatingInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trackNewsletterAttempt } from "@/lib/analytics";
import { useFeatureFlag } from "@/hooks/use-feature-flag";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type EmailForm = z.infer<typeof emailSchema>;

export function NewsletterSignup() {
  const isNewsletterEnabled = useFeatureFlag("newsletterEnabled");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error" | "rate_limited"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  // Return null if newsletter is disabled via feature flag
  if (!isNewsletterEnabled) {
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
    <motion.section
      className="mt-24 border-t border-zinc-100 dark:border-zinc-800 pt-16 pb-8 min-h-[600px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {submitStatus === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-lg mx-auto text-center flex flex-col justify-center h-full min-h-[520px]"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-[350px] h-[350px]">
              <DotLottieReact
                src="https://lottie.host/749b3ff8-0097-4e37-8cbd-2fa2687bcae7/ZV6PZUEF3p.json"
                loop={false}
                autoplay={true}
              />
            </div>
            <div className="text-center space-y-2">
              <h4 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Successfully subscribed!
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                Please check your email for a confirmation message.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-lg mx-auto text-center space-y-6 min-h-[520px] flex flex-col justify-center">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <div className="w-1 h-1 rounded-full bg-blue-400"></div>
              <div className="w-0.5 h-0.5 rounded-full bg-blue-300"></div>
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Business Strategy Prompts
              <br />
              for Product Designers
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Get weekly insights that bridge design thinking with business
              strategy. Transform from pixel-pusher to strategic partner in the
              boardroom.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <FloatingInput
                {...register("email")}
                type="email"
                label="Email Address"
                required
                aria-describedby={errors.email ? "email-error" : "email-help"}
                disabled={isSubmitting}
                error={errors.email?.message}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500/20"
                size="lg"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>

              {(submitStatus === "error" ||
                submitStatus === "rate_limited") && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 border rounded-lg ${
                    submitStatus === "rate_limited"
                      ? "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700"
                      : "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      submitStatus === "rate_limited"
                        ? "text-orange-700 dark:text-orange-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {errorMessage || "Something went wrong. Please try again."}
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            No spam. Unsubscribe anytime. Your privacy matters to us.
          </p>
        </div>
      )}
    </motion.section>
  );
}
