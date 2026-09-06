// Analytics utility functions for both Google Analytics and Vercel Analytics
import { track } from "@vercel/analytics";
import { sanitize, currentPage } from "@/lib/analytics-guard";
import {
  CONVERSION_EVENTS,
  type ConversionSurface,
} from "@/lib/analytics-events";

// Track custom events to both GA and Vercel Analytics
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  properties?: Record<string, string | number | boolean>,
) => {
  // Google Analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...properties,
    });
  }

  // Vercel Analytics
  const raw: Record<string, unknown> = { category };

  if (label) raw.label = label;
  if (value !== undefined) raw.value = value;
  if (properties) Object.assign(raw, properties);

  // Only conversions carry `page`. Adding it everywhere would spend event
  // budget on questions nobody asks, and would break the exact-payload
  // assertions in the existing analytics suites.
  if (CONVERSION_EVENTS.has(action)) {
    const page = currentPage();
    if (page) raw.page = page;
  }

  const { name, props } = sanitize(action, raw);
  track(name, props);
};

// === NEW VERCEL ANALYTICS EVENTS ===

// Helper function to create properties object without undefined values
const createProperties = (
  props: Record<string, string | number | boolean | undefined | null>,
): Record<string, string | number | boolean> => {
  const filtered: Record<string, string | number | boolean> = {};
  Object.entries(props).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      filtered[key] = value;
    }
  });
  return filtered;
};

export const trackProjectVideoPlay = (
  projectName: string,
  videoType?: string,
) => {
  trackEvent(
    "project_video_play",
    "project_engagement",
    projectName,
    undefined,
    createProperties({
      video_type: videoType || "project_demo",
    }),
  );
};

// Professional interest tracking
export const trackContactIntent = (
  contactType: string,
  contactValue?: string,
  surface?: ConversionSurface,
) => {
  trackEvent(
    "contact_intent",
    "professional_interest",
    contactType,
    undefined,
    createProperties({
      contact_method: contactType,
      contact_value: contactValue,
      surface,
    }),
  );
};

// User experience tracking
export const trackThemeToggle = (newTheme: string) => {
  trackEvent("theme_toggle", "user_experience", newTheme);
};

export const trackNewsletterAttempt = (step: string, success?: boolean) => {
  trackEvent(
    "newsletter_attempt",
    "engagement",
    step,
    undefined,
    createProperties({
      success: success,
      step: step,
    }),
  );
};

// Track breadcrumb navigation clicks
export const trackBreadcrumbClick = (
  url: string,
  label: string,
  position?: number,
) => {
  trackEvent(
    "breadcrumb_click",
    "seo",
    label,
    undefined,
    createProperties({
      breadcrumb_url: url,
      breadcrumb_position: position,
    }),
  );
};

// Track code block copy actions
export const trackCodeBlockCopy = (
  language: string,
  blogSlug?: string,
  lineCount?: number,
) => {
  trackEvent(
    "code_block_copy",
    "blog_engagement",
    language,
    undefined,
    createProperties({
      language: language,
      blog_slug: blogSlug,
      line_count: lineCount,
    }),
  );
};

// === RECOMMENDATION ANALYTICS EVENTS ===

// Track when recommendation sections are viewed/rendered
export const trackRecommendationSectionView = (
  sourcePageType: "project" | "blog",
  sourceSlug: string,
  sectionsShown: ("case_studies" | "articles")[],
  caseStudyCount: number = 0,
  articleCount: number = 0,
) => {
  trackEvent(
    "recommendation_section_view",
    "recommendation_engagement",
    sourcePageType,
    undefined,
    createProperties({
      source_page_type: sourcePageType,
      source_slug: sourceSlug,
      sections_shown: sectionsShown.join(","),
      case_study_count: caseStudyCount,
      article_count: articleCount,
      recommendation_context: `${sourcePageType}_page`,
    }),
  );
};

// Track clicks on case study recommendation cards
export const trackRecommendationCaseStudyClick = (
  sourcePageType: "project" | "blog",
  sourceSlug: string,
  recommendedProjectSlug: string,
  recommendedProjectName: string,
  position: number,
  recommendationContext?: string,
) => {
  trackEvent(
    "recommendation_case_study_click",
    "recommendation_engagement",
    recommendedProjectName,
    undefined,
    createProperties({
      source_page_type: sourcePageType,
      source_slug: sourceSlug,
      recommended_project_slug: recommendedProjectSlug,
      recommended_project_name: recommendedProjectName,
      position: position,
      recommendation_context: recommendationContext || `${sourcePageType}_page`,
    }),
  );
};

// Track clicks on article recommendation cards
export const trackRecommendationArticleClick = (
  sourcePageType: "project" | "blog",
  sourceSlug: string,
  recommendedArticleSlug: string,
  recommendedArticleTitle: string,
  position: number,
  recommendationContext?: string,
) => {
  trackEvent(
    "recommendation_article_click",
    "recommendation_engagement",
    recommendedArticleTitle,
    undefined,
    createProperties({
      source_page_type: sourcePageType,
      source_slug: sourceSlug,
      recommended_article_slug: recommendedArticleSlug,
      recommended_article_title: recommendedArticleTitle,
      position: position,
      recommendation_context: recommendationContext || `${sourcePageType}_page`,
    }),
  );
};

// Track hover interactions with recommendation cards
export const trackRecommendationCardHover = (
  cardType: "case_study" | "article",
  sourcePageType: "project" | "blog",
  itemSlug: string,
  itemName: string,
  position: number,
) => {
  trackEvent(
    "recommendation_card_hover",
    "recommendation_engagement",
    cardType,
    undefined,
    createProperties({
      card_type: cardType,
      source_page_type: sourcePageType,
      item_slug: itemSlug,
      item_name: itemName,
      position: position,
    }),
  );
};

const analytics = {
  trackEvent,
  trackProjectVideoPlay,
  trackContactIntent,
  trackThemeToggle,
  trackNewsletterAttempt,
  trackBreadcrumbClick,
  trackCodeBlockCopy,
  trackRecommendationSectionView,
  trackRecommendationCaseStudyClick,
  trackRecommendationArticleClick,
  trackRecommendationCardHover,
};

export default analytics;
