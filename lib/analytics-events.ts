/**
 * The analytics vocabulary. Behavior lives in `analytics-guard.ts`; this file
 * only says what may be named.
 */

/**
 * Every UI region that can originate a conversion. Typed as a union so a typo
 * fails the build instead of quietly opening a new bucket in the dashboard.
 */
export const CONVERSION_SURFACES = [
  "home_hero",
  "home_secondary_cta",
  "services_pricing",
  "shared_cta_section",
  "case_study_footer",
  "chat_dialog",
  "coffee_link",
  "header_cta",
] as const;

export type ConversionSurface = (typeof CONVERSION_SURFACES)[number];

/**
 * Events that receive a derived `page` property.
 *
 * Deliberately narrow. 31 assertions across the existing analytics suites match
 * event payloads exactly, so adding `page` to a non-conversion event breaks them
 * — and would spend event budget on data that answers no question.
 */
export const CONVERSION_EVENTS: ReadonlySet<string> = new Set([
  "contact_intent",
  "newsletter_signup",
  "newsletter_attempt",
  "resume_download",
  "recommendation_conversion",
]);

/**
 * Throttle window for scroll, hover, and animation events. At 50,000 events per
 * month shared with pageviews, unthrottled per-scroll tracking exhausts the
 * Hobby allowance in days, after which collection stops for the rest of the cycle.
 */
export const HIGH_FREQUENCY_WINDOW_MS = 30_000;
