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
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-xs font-mono max-w-xs">
      <h3 className="font-bold mb-2">🏳️ Feature Flags</h3>
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
      <div className="mt-2 pt-2 border-t border-white/20 text-[10px] opacity-60">
        Environment: {process.env.NEXT_PUBLIC_VERCEL_ENV || "development"}
      </div>
    </div>
  );
}
