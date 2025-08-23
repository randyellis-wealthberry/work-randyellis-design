/**
 * Environment configuration utility for dynamic URL generation
 * Handles local development, staging, and production environments
 */

// Type definitions for environment configuration
export interface EnvironmentConfig {
  baseUrl: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isStaging: boolean;
  environment: "development" | "staging" | "production";
}

/**
 * Get the base URL for the current environment
 * Priority order:
 * 1. NEXT_PUBLIC_BASE_URL environment variable (manual override)
 * 2. Vercel URL (automatic on Vercel deployments)
 * 3. Environment detection (localhost for dev, production domain for prod)
 */
export function getBaseUrl(): string {
  // Allow manual override via environment variable
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Vercel automatically sets NEXT_PUBLIC_VERCEL_URL for deployments
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // Environment-based detection
  if (typeof window !== "undefined") {
    // Client-side detection
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return `${window.location.protocol}//${window.location.host}`;
    }
    return `${window.location.protocol}//${window.location.host}`;
  }

  // Server-side detection
  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
  const port = process.env.PORT || "3000";

  if (nodeEnv === "development" || nodeEnv === "test") {
    return `http://localhost:${port}`;
  }

  if (vercelEnv === "preview") {
    return "https://work-randyellis-design-preview.vercel.app"; // Update with actual preview URL
  }

  // Default to production domain
  return "https://work.randyellis.design";
}

/**
 * Get comprehensive environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const baseUrl = getBaseUrl();
  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;

  // Determine environment type
  let environment: "development" | "staging" | "production" = "production";

  if (
    nodeEnv === "development" ||
    nodeEnv === "test" ||
    baseUrl.includes("localhost")
  ) {
    environment = "development";
  } else if (
    vercelEnv === "preview" ||
    baseUrl.includes("preview") ||
    baseUrl.includes("staging")
  ) {
    environment = "staging";
  }

  return {
    baseUrl,
    isProduction: environment === "production",
    isDevelopment: environment === "development",
    isStaging: environment === "staging",
    environment,
  };
}

/**
 * Create absolute URL from relative path
 */
export function createAbsoluteUrl(path: string = ""): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Get canonical URL for a page (for SEO)
 */
export function getCanonicalUrl(path: string = ""): string {
  return createAbsoluteUrl(path);
}

/**
 * Development helper to log current environment configuration
 */
export function logEnvironmentConfig(): void {
  if (process.env.NODE_ENV === "development") {
    const config = getEnvironmentConfig();
    console.log("🌍 Environment Configuration:", {
      baseUrl: config.baseUrl,
      environment: config.environment,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
      NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    });
  }
}

// Export environment config for convenience
export const env = getEnvironmentConfig();
export default env;
