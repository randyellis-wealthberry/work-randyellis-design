"use client";

import { useState } from "react";
import {
  Bot,
  CalendarDays,
  FolderKanban,
  MessageCircle,
  Smartphone,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ZINLEY_EMBED_URL, ZINLEY_URL } from "@/lib/constants";
import { trackContactIntent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const ASSISTANT_CAPABILITIES = [
  { icon: CalendarDays, label: "Schedule a meeting with me" },
  { icon: FolderKanban, label: "Ask about my projects and experience" },
  { icon: MessageCircle, label: "Anything else you're curious about" },
] as const;

type Step = "disclosure" | "call";

const PRIMARY_BUTTON =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-50";

interface LetsChatButtonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * "Let's chat" CTA that opens a two-step dialog:
 *  1. Disclosure — explains the visitor will be talking to Randy's AI virtual
 *     assistant and what it can help with.
 *  2. Call — after "Proceed to call", the Zinley card embed loads inline.
 *
 * The embed iframe is only mounted once the visitor proceeds, so nothing
 * third-party loads on page render or on merely opening the dialog.
 */
export function LetsChatButton({
  className,
  children = "Let's chat",
}: LetsChatButtonProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("disclosure");

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setStep("disclosure");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          trackContactIntent(
            "virtual_assistant_open",
            ZINLEY_URL,
            "chat_dialog",
          );
          setOpen(true);
        }}
        className={cn(
          PRIMARY_BUTTON,
          "focus-visible:ring-offset-zinc-100 dark:focus-visible:ring-offset-zinc-900",
          className,
        )}
      >
        {children}
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          // Focus the dialog itself, not the X — avoids focus ring flash on open
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="flex max-h-[calc(100dvh-4rem)] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border-zinc-200 bg-white p-0 shadow-2xl sm:max-w-md dark:border-zinc-800 dark:bg-zinc-950"
        >
          {/* Header */}
          <div className="flex shrink-0 items-start gap-3 border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
              <Bot className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Chat with my virtual assistant
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                {step === "disclosure"
                  ? "Heads up: you'll be speaking with my AI virtual assistant, not me directly. Ask it anything."
                  : "You're talking to my AI virtual assistant. Ask it anything."}
              </DialogDescription>
            </div>
            <DialogClose
              className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-50"
              aria-label="Close"
            >
              <X className="size-5" aria-hidden="true" />
            </DialogClose>
          </div>

          {step === "disclosure" ? (
            <>
              {/* Callout — what the assistant can do */}
              <div className="px-5 py-4">
                <div className="rounded-xl border-2 border-dashed border-zinc-300 p-4 dark:border-zinc-700">
                  <p className="mb-3 text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                    It can help you
                  </p>
                  <ul className="space-y-2.5">
                    {ASSISTANT_CAPABILITIES.map(({ icon: Icon, label }) => (
                      <li
                        key={label}
                        className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300"
                      >
                        <Icon
                          className="size-4 shrink-0 text-zinc-500 dark:text-zinc-400"
                          aria-hidden="true"
                        />
                        <span>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-end dark:border-zinc-800">
                <DialogClose className="inline-flex cursor-pointer items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-50">
                  Not now
                </DialogClose>
                <button
                  type="button"
                  onClick={() => {
                    trackContactIntent(
                      "virtual_assistant_call",
                      ZINLEY_EMBED_URL,
                      "chat_dialog",
                    );
                    setStep("call");
                  }}
                  className={cn(
                    PRIMARY_BUTTON,
                    "focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950",
                  )}
                >
                  <Smartphone className="size-4" aria-hidden="true" />
                  Proceed to call
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Zinley card embed — mounted only after the visitor proceeds.
                  Zinley's embed document has a transparent background and
                  centers a 360px dark (#09090b) card, so this surface is
                  pinned to zinc-950 (#09090b) in BOTH themes — intentionally
                  no `dark:` variant — and the iframe stays transparent so
                  the card blends into it edge to edge. */}
              <div className="flex items-center justify-center bg-zinc-950 px-4 py-3">
                <iframe
                  src={ZINLEY_EMBED_URL}
                  title="My Zinley card"
                  loading="lazy"
                  width={360}
                  height={400}
                  className="block h-[min(400px,calc(100dvh-14rem))] min-h-[280px] w-[360px] max-w-full border-0 bg-transparent"
                />
              </div>

              <div className="shrink-0 border-t border-zinc-100 px-5 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                Not loading?{" "}
                <a
                  href={ZINLEY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                >
                  Open on zinley.com
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
