"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { FloatingInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trackNewsletterAttempt } from "@/lib/analytics";

const emailSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

type EmailForm = z.infer<typeof emailSchema>;

export function NewsletterSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailForm) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

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
      } else {
        setSubmitStatus("error");
        trackNewsletterAttempt("submit_error", false);
      }
    } catch {
      setSubmitStatus("error");
      trackNewsletterAttempt("submit_error", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      className="mt-24 border-t border-zinc-100 dark:border-zinc-800 pt-16 pb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-lg mx-auto text-center space-y-6">
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg"
              >
                <p className="text-sm text-green-700 dark:text-green-300">
                  Successfully subscribed! You&apos;ll receive a confirmation
                  email shortly.
                </p>
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg"
              >
                <p className="text-sm text-red-700 dark:text-red-300">
                  Something went wrong. Please try again.
                </p>
              </motion.div>
            )}
          </form>
        </motion.div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          No spam. Unsubscribe anytime. Your privacy matters to us.
        </p>
      </div>
    </motion.section>
  );
}
