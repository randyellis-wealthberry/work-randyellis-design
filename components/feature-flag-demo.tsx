/**
 * Demo component showing feature flags in action
 * This can be added to any page to test the flags
 */

"use client";

import { useFeatureFlags } from "@/hooks/use-feature-flag";

export function FeatureFlagDemo() {
  const flags = useFeatureFlags();

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 max-w-xs rounded-lg bg-black/80 p-4 font-mono text-xs text-white">
      <h3 className="mb-2 font-bold">🏳️ Feature Flags</h3>
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
