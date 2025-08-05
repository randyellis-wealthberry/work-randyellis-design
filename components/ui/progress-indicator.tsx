"use client";

import { motion } from "motion/react";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: string;
  label: string;
  status: "pending" | "loading" | "completed" | "error";
  description?: string;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function ProgressIndicator({
  steps,
  className,
  orientation = "horizontal",
}: ProgressIndicatorProps) {
  const getStepIcon = (status: ProgressStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "loading":
        return <Loader className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return (
          <div className="h-5 w-5 rounded-full border-2 border-zinc-300 dark:border-zinc-600" />
        );
    }
  };

  const getStepColor = (status: ProgressStep["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "loading":
        return "text-blue-600";
      default:
        return "text-zinc-400";
    }
  };

  if (orientation === "vertical") {
    return (
      <div className={cn("space-y-4", className)}>
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className="flex-shrink-0 mt-0.5">
              {getStepIcon(step.status)}
            </div>
            <div className="min-w-0 flex-1">
              <p className={cn("font-medium", getStepColor(step.status))}>
                {step.label}
              </p>
              {step.description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {step.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center"
        >
          <div className="flex flex-col items-center">
            {getStepIcon(step.status)}
            <span
              className={cn(
                "text-xs mt-1 text-center",
                getStepColor(step.status),
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="w-8 h-0.5 bg-zinc-200 dark:bg-zinc-700 mx-2" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  submessage,
  className,
}: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn("flex flex-col items-center justify-center p-8", className)}
    >
      <div className="relative">
        <div className="w-8 h-8 border-2 border-blue-200 dark:border-blue-800 rounded-full animate-pulse" />
        <div className="absolute inset-0 w-8 h-8 border-2 border-t-blue-600 rounded-full animate-spin" />
      </div>
      <p className="text-zinc-700 dark:text-zinc-300 mt-4 font-medium">
        {message}
      </p>
      {submessage && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {submessage}
        </p>
      )}
    </motion.div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "Please try again or contact support if the problem persists.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className,
      )}
    >
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        {title}
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
        {message}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
