/**
 * Feature flags integration for the portfolio
 * Using the lightweight portfolio-feature-flags system
 */

// For now, we'll use a local implementation until the package is published
// Later you can: import { getFlags, useFeatureFlag } from 'portfolio-feature-flags';

export interface FeatureFlags {
  experimentalAnimations: boolean;
  maintenanceMode: boolean;
  newProjectShowcase: boolean;
  newsletterEnabled: boolean;
  analyticsEnhanced: boolean;
  betaFeatures: boolean;
  performanceMode: boolean;
}

/**
 * Get all feature flags from environment variables
 */
export function getFlags(): FeatureFlags {
  const isDevelopment = process.env.NODE_ENV === "development";

  return {
    experimentalAnimations:
      process.env.NEXT_PUBLIC_EXPERIMENTAL_ANIMATIONS === "true",
    maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true",
    newProjectShowcase: process.env.NEXT_PUBLIC_NEW_PROJECT_SHOWCASE === "true",
    newsletterEnabled: process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED !== "false",
    analyticsEnhanced: process.env.NEXT_PUBLIC_ANALYTICS_ENHANCED === "true",
    betaFeatures:
      process.env.NEXT_PUBLIC_BETA_FEATURES === "true" || isDevelopment,
    performanceMode: process.env.NEXT_PUBLIC_PERFORMANCE_MODE !== "false",
  };
}

/**
 * Get a single feature flag value
 */
export function getFlag(flag: keyof FeatureFlags): boolean {
  const flags = getFlags();
  return flags[flag];
}

/**
 * Export all flags as a constant for static access
 */
export const FLAGS = getFlags();
