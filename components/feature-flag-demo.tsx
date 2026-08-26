/**
 * Demo component showing feature flags in action
 * This can be added to any page to test the flags
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useFeatureFlags } from "@/hooks/use-feature-flag";

/**
 * Survives reloads on purpose. The panel sits over the bottom-right corner,
 * which is where the work is when you are checking a footer, a CTA or the
 * mobile menu trigger — so dismissing it has to outlast the next hot reload
 * or it isn't worth having.
 */
const STORAGE_KEY = "ffdemo:hidden";

function readHidden(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // Private windows and blocked site data throw on access rather than
    // returning null. A dev panel is not worth a crash.
    return false;
  }
}

export function FeatureFlagDemo() {
  const flags = useFeatureFlags();
  const [hidden, setHidden] = useState(false);
  // localStorage can't be read during render without risking a hydration
  // mismatch, so nothing paints until the first effect has settled the state.
  // Rendering the panel first and hiding it a tick later would flash it at
  // exactly the people who asked for it gone.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHidden(readHidden());
    setReady(true);
  }, []);

  const setHiddenPersisted = useCallback((next: boolean) => {
    setHidden(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // Ignored: the toggle still works for this page view.
    }
  }, []);

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  if (!ready) {
    return null;
  }

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => setHiddenPersisted(false)}
        aria-label="Show feature flags panel"
        title="Show feature flags"
        className="fixed right-4 bottom-4 rounded-full bg-black/30 px-2 py-1 font-mono text-xs text-white/40 transition-opacity hover:bg-black/70 hover:text-white/90"
      >
        🏳️
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 max-w-xs rounded-lg bg-black/80 p-4 font-mono text-xs text-white">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h3 className="font-bold">🏳️ Feature Flags</h3>
        <button
          type="button"
          onClick={() => setHiddenPersisted(true)}
          aria-label="Hide feature flags panel"
          title="Hide"
          className="-mt-1 -mr-1 rounded px-1 leading-none text-white/40 transition-colors hover:text-white"
        >
          ×
        </button>
      </div>
      <ul className="space-y-1">
        {Object.entries(flags).map(([key, value]) => (
          <li key={key} className="flex justify-between">
            <span>{key}:</span>
            <span className={value ? "text-green-400" : "text-red-400"}>
              {value ? "✓" : "✗"}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-2 border-t border-white/20 pt-2 text-[10px] opacity-60">
        Environment: {process.env.NEXT_PUBLIC_VERCEL_ENV || "development"}
      </div>
    </div>
  );
}
