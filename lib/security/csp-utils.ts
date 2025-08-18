/**
 * Content Security Policy (CSP) Utility Functions
 *
 * Provides utilities for generating secure nonces and managing CSP policies.
 */

/**
 * Generates a cryptographically secure nonce for CSP inline script/style allowlisting
 */
export function generateCSPNonce(): string {
  // Generate 16 random bytes (128 bits) for strong security
  const array = new Uint8Array(16);

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Node.js environment fallback
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const crypto = require("crypto");
      const buffer = crypto.randomBytes(16);
      array.set(buffer);
    } catch {
      // Fallback for environments without crypto
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
  }

  // Convert to base64 string
  return Buffer.from(array).toString("base64");
}

/**
 * Validates if a string is a valid CSP nonce
 */
export function isValidNonce(nonce: unknown): boolean {
  if (typeof nonce !== "string") {
    return false;
  }

  // Trim whitespace
  nonce = nonce.trim();

  if (nonce.length < 16) {
    return false;
  }

  // Reject obviously invalid strings
  if (nonce.length > 200) {
    // Reasonable upper limit
    return false;
  }

  // Check if it's valid base64
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  if (!base64Regex.test(nonce)) {
    return false;
  }

  try {
    // Try to decode to ensure it's valid base64
    const decoded = Buffer.from(nonce, "base64");
    return decoded.length >= 12; // Minimum 96 bits
  } catch {
    return false;
  }
}

/**
 * CSP Policy Builder
 */
export interface CSPDirectives {
  defaultSrc?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  connectSrc?: string[];
  fontSrc?: string[];
  objectSrc?: string[];
  mediaSrc?: string[];
  frameSrc?: string[];
  frameAncestors?: string[];
  baseUri?: string[];
  reportUri?: string[];
  reportTo?: string[];
  upgradeInsecureRequests?: boolean;
}

export class CSPBuilder {
  private directives: CSPDirectives = {};
  private nonce: string;

  constructor(nonce?: string) {
    this.nonce = nonce || generateCSPNonce();
  }

  /**
   * Set the default source directive
   */
  defaultSrc(...sources: string[]): this {
    this.directives.defaultSrc = sources;
    return this;
  }

  /**
   * Set the script source directive
   */
  scriptSrc(...sources: string[]): this {
    this.directives.scriptSrc = sources;
    return this;
  }

  /**
   * Set the style source directive
   */
  styleSrc(...sources: string[]): this {
    this.directives.styleSrc = sources;
    return this;
  }

  /**
   * Set the image source directive
   */
  imgSrc(...sources: string[]): this {
    this.directives.imgSrc = sources;
    return this;
  }

  /**
   * Set the connect source directive
   */
  connectSrc(...sources: string[]): this {
    this.directives.connectSrc = sources;
    return this;
  }

  /**
   * Set the font source directive
   */
  fontSrc(...sources: string[]): this {
    this.directives.fontSrc = sources;
    return this;
  }

  /**
   * Set object source directive
   */
  objectSrc(...sources: string[]): this {
    this.directives.objectSrc = sources;
    return this;
  }

  /**
   * Set frame ancestors directive
   */
  frameAncestors(...sources: string[]): this {
    this.directives.frameAncestors = sources;
    return this;
  }

  /**
   * Set base URI directive
   */
  baseUri(...sources: string[]): this {
    this.directives.baseUri = sources;
    return this;
  }

  /**
   * Add violation reporting
   */
  reportUri(uri: string): this {
    this.directives.reportUri = [uri];
    return this;
  }

  /**
   * Add modern violation reporting
   */
  reportTo(group: string): this {
    this.directives.reportTo = [group];
    return this;
  }

  /**
   * Enable upgrade insecure requests
   */
  upgradeInsecureRequests(): this {
    this.directives.upgradeInsecureRequests = true;
    return this;
  }

  /**
   * Get the current nonce
   */
  getNonce(): string {
    return this.nonce;
  }

  /**
   * Build the CSP policy string
   */
  build(): string {
    const policies: string[] = [];

    // Helper to format directive name
    const formatDirective = (name: string): string => {
      return name.replace(/([A-Z])/g, "-$1").toLowerCase();
    };

    // Add each directive
    Object.entries(this.directives).forEach(([key, value]) => {
      if (key === "upgradeInsecureRequests") {
        if (value) {
          policies.push("upgrade-insecure-requests");
        }
        return;
      }

      if (Array.isArray(value) && value.length > 0) {
        const directiveName = formatDirective(key);

        // Add nonce to script-src and style-src if not already present
        if (
          (key === "scriptSrc" || key === "styleSrc") &&
          !value.some((v) => v.includes("nonce-"))
        ) {
          value.push(`'nonce-${this.nonce}'`);
        }

        policies.push(`${directiveName} ${value.join(" ")}`);
      }
    });

    return policies.join("; ");
  }
}

/**
 * Create a default CSP policy for the portfolio website
 */
export function createDefaultCSP(
  options: {
    nonce?: string;
    isDevelopment?: boolean;
    allowUnsafeEval?: boolean;
  } = {},
): string {
  const { nonce, isDevelopment = false, allowUnsafeEval = false } = options;

  const builder = new CSPBuilder(nonce);

  // Base policy
  builder
    .defaultSrc("'self'")
    .objectSrc("'none'")
    .frameAncestors("'none'")
    .baseUri("'self'")
    .upgradeInsecureRequests();

  // Script sources
  const scriptSources = ["'self'"];
  if (allowUnsafeEval || isDevelopment) {
    scriptSources.push("'unsafe-eval'"); // Required for development
  }

  // Add trusted domains
  scriptSources.push(
    "vitals.vercel-insights.com",
    "*.googletagmanager.com",
    "*.google-analytics.com",
  );

  builder.scriptSrc(...scriptSources);

  // Style sources (CSS-in-JS requires unsafe-inline)
  builder.styleSrc(
    "'self'",
    "'unsafe-inline'", // Required for styled-components and CSS-in-JS
    "fonts.googleapis.com",
  );

  // Image sources
  builder.imgSrc(
    "'self'",
    "data:",
    "blob:",
    "images.unsplash.com",
    "cdn.cosmos.so",
    "*.google-analytics.com",
    "*.googletagmanager.com",
  );

  // Connect sources for API calls and analytics
  builder.connectSrc(
    "'self'",
    "vitals.vercel-insights.com",
    "*.google-analytics.com",
    "*.analytics.google.com",
    "*.googletagmanager.com",
  );

  // Font sources
  builder.fontSrc("'self'", "data:", "fonts.gstatic.com");

  // Reporting
  builder.reportUri("/api/csp-report").reportTo("csp-endpoint");

  return builder.build();
}

/**
 * Extract domain from a URL for CSP violations analysis
 */
export function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/**
 * Check if a violation is potentially dangerous
 */
export function isDangerousViolation(violation: {
  "violated-directive"?: string;
  "blocked-uri"?: string;
}): boolean {
  const directive = violation["violated-directive"] || "";
  const blockedUri = violation["blocked-uri"] || "";

  // Script injections are always dangerous
  if (
    directive.includes("script") &&
    (blockedUri.includes("javascript:") ||
      blockedUri.includes("data:text/html") ||
      blockedUri.includes("vbscript:"))
  ) {
    return true;
  }

  // Object/embed sources can be dangerous
  if (directive.includes("object") || directive.includes("plugin")) {
    return true;
  }

  // External scripts from suspicious domains
  if (directive.includes("script") && blockedUri.startsWith("http")) {
    const domain = extractDomain(blockedUri);
    if (domain && isSuspiciousDomain(domain)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a domain is potentially suspicious
 */
function isSuspiciousDomain(domain: string): boolean {
  const suspiciousPatterns = [
    /\d+\.\d+\.\d+\.\d+/, // IP addresses
    /[a-z]{20,}\.com/, // Very long random domains
    /\.(tk|ml|ga|cf)$/, // Free TLD domains often used for malicious purposes
    /(malware|phishing|spam|evil|hack)/, // Obviously suspicious keywords
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(domain));
}
