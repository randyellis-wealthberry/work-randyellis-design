"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";

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
        reset();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
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
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Business Strategy Prompts for Product Designers
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
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                required
                aria-describedby={errors.email ? "email-error" : "email-help"}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white transition-colors"
                placeholder="Enter your email address"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>

            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg"
              >
                <p className="text-sm text-green-700 dark:text-green-300">
                  Successfully subscribed! Check your email for confirmation.
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
