import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  [
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
    "flex w-full min-w-0 rounded-lg border bg-white dark:bg-zinc-800/50 px-4 py-3 text-base font-medium shadow-sm transition-all outline-none leading-relaxed",
    "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20",
    "hover:border-zinc-400 dark:hover:border-zinc-500",
    "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500",
    "md:text-sm",
  ],
  {
    variants: {
      variant: {
        default: "border-zinc-300 dark:border-zinc-600",
        floating: "border-zinc-300 dark:border-zinc-600 pt-8 pb-3",
      },
      size: {
        default: "h-12 px-4 py-3",
        sm: "h-9 px-3 py-1",
        lg: "h-14 px-4 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Input({
  className,
  type,
  variant,
  size,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, size, className }))}
      {...props}
    />
  );
}

// Enhanced input with floating label
function FloatingInput({
  label,
  id,
  className,
  error,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  label: string;
  error?: string;
}) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="relative">
      <Input
        id={inputId}
        variant="floating"
        className={cn(
          "peer placeholder-transparent",
          error &&
            "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20",
          className,
        )}
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "absolute left-4 top-2 text-xs font-semibold transition-all duration-200 tracking-wide",
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-normal",
          "peer-focus:top-2.5 peer-focus:text-xs peer-focus:font-semibold peer-focus:translate-y-0 peer-focus:tracking-wide",
          "text-zinc-700 dark:text-zinc-300",
          "peer-focus:text-blue-600 dark:peer-focus:text-blue-400",
          error && "text-red-600 dark:text-red-400",
        )}
      >
        {label}
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export { Input, FloatingInput, inputVariants };
