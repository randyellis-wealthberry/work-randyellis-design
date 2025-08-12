/**
 * React hooks for feature flags
 */

'use client';

import { useEffect, useState } from 'react';
import { getFlag, getFlags, type FeatureFlags } from '@/lib/feature-flags';

/**
 * Hook to get a single feature flag value
 */
export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  const [value, setValue] = useState(() => getFlag(flag));

  useEffect(() => {
    // Re-evaluate on mount in case of client/server mismatch
    setValue(getFlag(flag));
  }, [flag]);

  return value;
}

/**
 * Hook to get all feature flags
 */
export function useFeatureFlags(): FeatureFlags {
  const [flags, setFlags] = useState(() => getFlags());

  useEffect(() => {
    // Re-evaluate on mount in case of client/server mismatch
    setFlags(getFlags());
  }, []);

  return flags;
}