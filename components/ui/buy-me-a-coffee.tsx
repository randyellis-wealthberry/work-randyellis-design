"use client";

import { useState } from "react";
import { Coffee, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { trackContactIntent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const BMC_USERNAME = "randyellisk";
const BMC_URL = `https://buymeacoffee.com/${BMC_USERNAME}`;
// Official BMC widget page (same URL the BMC script iframes)
const BMC_WIDGET_URL = `https://buymeacoffee.com/widget/page/${BMC_USERNAME}?description=Support%20my%20work&color=%23FFDD00`;

// Buy Me a Coffee brand palette
const BMC_YELLOW = "#FFDD00";
const BMC_INK = "#0D0C22";

interface BuyMeACoffeeButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function BuyMeACoffeeButton({
  className,
  children = "Buy me a coffee",
}: BuyMeACoffeeButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          trackContactIntent("buy_me_a_coffee", BMC_URL);
          setOpen(true);
        }}
        className={cn(
          "inline-flex cursor-pointer items-center gap-2 rounded-lg px-6 py-3 text-base font-medium transition-colors",
          "bg-[#FFDD00] text-[#0D0C22] hover:bg-[#FFE94D]",
          "focus-visible:ring-2 focus-visible:ring-[#FFDD00] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100 focus-visible:outline-none dark:focus-visible:ring-offset-zinc-900",
          "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
      >
        <Coffee className="size-5" aria-hidden="true" />
        {children}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          // Focus the dialog itself, not the X — avoids focus ring flash on open
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="flex max-h-[calc(100dvh-4rem)] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border-zinc-200 bg-white p-0 shadow-2xl sm:max-w-md dark:border-zinc-800 dark:bg-zinc-950"
        >
          {/* Brand header */}
          <div
            className="flex shrink-0 items-center gap-3 px-5 py-4"
            style={{ backgroundColor: BMC_YELLOW, color: BMC_INK }}
          >
            <Coffee className="size-5" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-semibold text-[#0D0C22]">
                Buy me a coffee
              </DialogTitle>
              <DialogDescription className="text-sm text-[#0D0C22]/70">
                Fuel the next project. Thank you.
              </DialogDescription>
            </div>
            <DialogClose
              className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#0D0C22] transition-colors hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-[#0D0C22] focus-visible:outline-none active:bg-black/15"
              aria-label="Close"
            >
              <X className="size-5" aria-hidden="true" />
            </DialogClose>
          </div>

          <iframe
            src={open ? BMC_WIDGET_URL : undefined}
            title="Buy Me a Coffee"
            loading="lazy"
            className="h-[min(560px,calc(100dvh-14rem))] min-h-[280px] w-full border-0 bg-white"
          />

          <div className="shrink-0 border-t border-zinc-100 px-5 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            Not loading?{" "}
            <a
              href={BMC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
            >
              Open on buymeacoffee.com
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
