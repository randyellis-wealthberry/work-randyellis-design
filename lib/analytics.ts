// Analytics utility functions for both Google Analytics and Vercel Analytics
import { track } from "@vercel/analytics";

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
  const trackData: Record<string, string | number | boolean> = {
    category,
  };

  if (label) trackData.label = label;
  if (value !== undefined) trackData.value = value;
  if (properties) Object.assign(trackData, properties);

  track(action, trackData);
};

// Track page views (useful for SPA navigation)
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_location: url,
      page_title: title,
    });
  }
};

// Track newsletter signups
export const trackNewsletterSignup = (method?: string) => {
  trackEvent("newsletter_signup", "engagement", method);
};

// Track project views
export const trackProjectView = (projectName: string) => {
  trackEvent("project_view", "engagement", projectName);
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText?: string) => {
  trackEvent("external_link_click", "engagement", linkText || url);
};

// Track file downloads
export const trackDownload = (fileName: string) => {
  trackEvent("file_download", "engagement", fileName, undefined);
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

// Project engagement tracking
export const trackProjectHover = (projectName: string, projectId?: string) => {
  trackEvent(
    "project_hover",
    "project_engagement",
    projectName,
    undefined,
    createProperties({
      project_id: projectId || projectName.toLowerCase().replace(/\s+/g, "-"),
    }),
  );
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

export const trackProjectLiveDemo = (projectName: string, demoUrl?: string) => {
  trackEvent(
    "project_live_demo",
    "project_engagement",
    projectName,
    undefined,
    createProperties({
      demo_url: demoUrl,
    }),
  );
};

export const trackProjectGithub = (projectName: string, repoUrl?: string) => {
  trackEvent(
    "project_github",
    "project_engagement",
    projectName,
    undefined,
    createProperties({
      repo_url: repoUrl,
    }),
  );
};

// Content consumption tracking
export const trackBlogPostView = (postTitle: string, postSlug?: string) => {
  trackEvent(
    "blog_post_view",
    "content_engagement",
    postTitle,
    undefined,
    createProperties({
      post_slug: postSlug,
    }),
  );
};

export const trackBlogReadingTime = (postTitle: string, timeSpent: number) => {
  trackEvent(
    "blog_reading_time",
    "content_engagement",
    postTitle,
    timeSpent,
    createProperties({
      reading_duration: timeSpent,
    }),
  );
};

export const trackSectionView = (sectionName: string, scrollDepth?: number) => {
  trackEvent(
    "section_view",
    "content_engagement",
    sectionName,
    scrollDepth,
    createProperties({
      scroll_depth: scrollDepth,
    }),
  );
};

// Professional interest tracking
export const trackContactIntent = (
  contactType: string,
  contactValue?: string,
) => {
  trackEvent(
    "contact_intent",
    "professional_interest",
    contactType,
    undefined,
    createProperties({
      contact_method: contactType,
      contact_value: contactValue,
    }),
  );
};

export const trackResumeDownload = () => {
  trackEvent("resume_download", "professional_interest", "pdf_resume");
};

export const trackWorkExperienceExpand = (companyName: string) => {
  trackEvent("work_experience_expand", "professional_interest", companyName);
};

// Technical interest tracking
export const trackTechnologyFilter = (technology: string) => {
  trackEvent("technology_filter", "technical_interest", technology);
};

export const trackDemoInteraction = (
  demoType: string,
  interactionType: string,
) => {
  trackEvent(
    "demo_interaction",
    "technical_interest",
    demoType,
    undefined,
    createProperties({
      interaction_type: interactionType,
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

export const trackScrollDepth = (depth: number, page: string) => {
  trackEvent(
    "scroll_depth",
    "user_experience",
    page,
    depth,
    createProperties({
      scroll_percentage: depth,
      page_type: page,
    }),
  );
};

// Performance tracking
export const trackPageLoadTime = (loadTime: number, page: string) => {
  trackEvent(
    "page_load_time",
    "performance",
    page,
    loadTime,
    createProperties({
      load_duration: loadTime,
    }),
  );
};

// === SEO ANALYTICS EVENTS ===

// Track structured data rendering
export const trackStructuredDataView = (
  schemaType: string,
  schemaId?: string,
) => {
  trackEvent(
    "structured_data_view",
    "seo",
    schemaType,
    undefined,
    createProperties({
      schema_type: schemaType,
      schema_id: schemaId,
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

// Track search engine referrals
export const trackSearchEngineReferral = (
  searchEngine: string,
  searchQuery?: string,
  landingPage?: string,
) => {
  trackEvent(
    "search_engine_referral",
    "seo",
    searchEngine,
    undefined,
    createProperties({
      search_engine: searchEngine,
      search_query: searchQuery,
      landing_page: landingPage,
    }),
  );
};

// Track meta tag engagement (social sharing)
export const trackMetaTagEngagement = (
  socialPlatform: string,
  engagementType: string,
  pageUrl?: string,
) => {
  trackEvent(
    "meta_tag_engagement",
    "seo",
    socialPlatform,
    undefined,
    createProperties({
      social_platform: socialPlatform,
      engagement_type: engagementType,
      page_url: pageUrl,
    }),
  );
};

// Track local business schema views
export const trackLocalBusinessView = (
  location: string,
  businessType?: string,
) => {
  trackEvent(
    "local_business_view",
    "seo",
    location,
    undefined,
    createProperties({
      business_location: location,
      business_type: businessType,
    }),
  );
};

// === BLOG ANALYTICS EVENTS ===

// Track blog hero image views
export const trackBlogHeroImageView = (blogSlug: string, imageAlt?: string) => {
  trackEvent(
    "blog_hero_image_view",
    "blog_engagement",
    blogSlug,
    undefined,
    createProperties({
      blog_slug: blogSlug,
      image_alt: imageAlt,
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

// Track related article clicks
export const trackRelatedArticleClick = (
  relatedTitle: string,
  relatedUrl: string,
  sourceArticle?: string,
  position?: number,
) => {
  trackEvent(
    "related_article_click",
    "blog_engagement",
    relatedTitle,
    undefined,
    createProperties({
      related_title: relatedTitle,
      related_url: relatedUrl,
      source_article: sourceArticle,
      position: position,
    }),
  );
};

// Track granular reading progress
export const trackReadingProgress = (
  blogSlug: string,
  progressPercentage: number,
  timeSpent?: number,
) => {
  trackEvent(
    "reading_progress",
    "blog_engagement",
    blogSlug,
    progressPercentage,
    createProperties({
      blog_slug: blogSlug,
      progress_percentage: progressPercentage,
      time_spent: timeSpent,
    }),
  );
};

// Track blog search usage
export const trackBlogSearchUsage = (
  searchQuery: string,
  resultsCount?: number,
  hadResults?: boolean,
) => {
  trackEvent(
    "blog_search_usage",
    "blog_engagement",
    searchQuery,
    undefined,
    createProperties({
      search_query: searchQuery,
      results_count: resultsCount,
      had_results: hadResults,
    }),
  );
};

// Track blog comment interactions
export const trackBlogCommentInteraction = (
  interactionType: string,
  blogSlug: string,
  commentId?: string,
) => {
  trackEvent(
    "blog_comment_interaction",
    "blog_engagement",
    interactionType,
    undefined,
    createProperties({
      interaction_type: interactionType,
      blog_slug: blogSlug,
      comment_id: commentId,
    }),
  );
};

// === MOTION/ANIMATION ANALYTICS EVENTS ===

// Track animation interactions
export const trackAnimationInteraction = (
  animationType: string,
  interactionType: string,
  pageUrl?: string,
  duration?: number,
) => {
  trackEvent(
    "animation_interaction",
    "motion_engagement",
    animationType,
    duration,
    createProperties({
      animation_type: animationType,
      interaction_type: interactionType,
      page_url: pageUrl,
      duration: duration,
    }),
  );
};

// Track magnetic hover effects
export const trackMagneticHover = (
  elementType: string,
  distanceX?: number,
  distanceY?: number,
  duration?: number,
) => {
  trackEvent(
    "magnetic_hover",
    "motion_engagement",
    elementType,
    undefined,
    createProperties({
      element_type: elementType,
      distance_x: distanceX,
      distance_y: distanceY,
      duration: duration,
    }),
  );
};

// Track scroll-based animation progress
export const trackScrollProgress = (
  pageUrl: string,
  animationType?: string,
  progressPercentage?: number,
  sectionName?: string,
) => {
  trackEvent(
    "scroll_progress",
    "motion_engagement",
    pageUrl,
    undefined,
    createProperties({
      page_url: pageUrl,
      animation_type: animationType,
      progress_percentage: progressPercentage,
      section_name: sectionName,
    }),
  );
};

// Track motion preference changes
export const trackMotionPreference = (
  preference: string,
  isSystem?: boolean,
  source?: string,
) => {
  trackEvent(
    "motion_preference",
    "motion_engagement",
    preference,
    undefined,
    createProperties({
      preference: preference,
      is_system: isSystem,
      source: source,
    }),
  );
};

// Track glow effect activations
export const trackGlowEffectTrigger = (
  elementId: string,
  triggerType: string,
  color?: string,
  intensity?: number,
) => {
  trackEvent(
    "glow_effect_trigger",
    "motion_engagement",
    elementId,
    undefined,
    createProperties({
      element_id: elementId,
      trigger_type: triggerType,
      color: color,
      intensity: intensity,
    }),
  );
};

// Track parallax scroll interactions
export const trackParallaxScroll = (
  elementType: string,
  speedFactor: number,
  scrollDistance?: number,
  pageUrl?: string,
) => {
  trackEvent(
    "parallax_scroll",
    "motion_engagement",
    elementType,
    undefined,
    createProperties({
      element_type: elementType,
      speed_factor: speedFactor,
      scroll_distance: scrollDistance,
      page_url: pageUrl,
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

// Track recommendation performance by measuring conversion rate
export const trackRecommendationConversion = (
  sourcePageType: "project" | "blog",
  sourceSlug: string,
  targetType: "case_study" | "article",
  targetSlug: string,
  conversionType: "view" | "engagement" | "exit",
  timeToConversion?: number,
) => {
  trackEvent(
    "recommendation_conversion",
    "recommendation_engagement",
    conversionType,
    timeToConversion,
    createProperties({
      source_page_type: sourcePageType,
      source_slug: sourceSlug,
      target_type: targetType,
      target_slug: targetSlug,
      conversion_type: conversionType,
      time_to_conversion: timeToConversion,
    }),
  );
};

// === PWA ANALYTICS EVENTS ===

// Track PWA install prompt display
export const trackPWAInstallPrompt = (
  eventType: string,
  triggerSource?: string,
  sessionVisitCount?: number,
) => {
  trackEvent(
    "pwa_install_prompt",
    "pwa_engagement",
    eventType,
    undefined,
    createProperties({
      event_type: eventType,
      trigger_source: triggerSource,
      session_visit_count: sessionVisitCount,
    }),
  );
};

// Track PWA installation success
export const trackPWAInstallSuccess = (
  outcome: string,
  browser?: string,
  platform?: string,
) => {
  trackEvent(
    "pwa_install_success",
    "pwa_engagement",
    outcome,
    undefined,
    createProperties({
      outcome: outcome,
      browser: browser,
      platform: platform,
    }),
  );
};

// Track offline usage
export const trackOfflineUsage = (
  pageUrl: string,
  actionType?: string,
  offlineDuration?: number,
) => {
  trackEvent(
    "offline_usage",
    "pwa_engagement",
    pageUrl,
    undefined,
    createProperties({
      page_url: pageUrl,
      action_type: actionType,
      offline_duration: offlineDuration,
    }),
  );
};

// Track service worker updates
export const trackServiceWorkerUpdate = (
  updateType: string,
  version?: string,
  activationMode?: string,
) => {
  trackEvent(
    "service_worker_update",
    "pwa_engagement",
    updateType,
    undefined,
    createProperties({
      update_type: updateType,
      version: version,
      activation_mode: activationMode,
    }),
  );
};

// Track push notification permissions
export const trackPushNotificationPermission = (
  permissionStatus: string,
  requestSource?: string,
  context?: string,
) => {
  trackEvent(
    "push_notification_permission",
    "pwa_engagement",
    permissionStatus,
    undefined,
    createProperties({
      permission_status: permissionStatus,
      request_source: requestSource,
      context: context,
    }),
  );
};

// Track PWA performance metrics
export const trackPWAPerformance = (
  metricType: string,
  resource: string,
  loadTime: number,
  fromCache?: boolean,
) => {
  trackEvent(
    "pwa_performance",
    "pwa_engagement",
    metricType,
    loadTime,
    createProperties({
      metric_type: metricType,
      resource: resource,
      load_time: loadTime,
      from_cache: fromCache,
    }),
  );
};

// Track PWA engagement
export const trackPWAEngagement = (
  engagementType: string,
  launchMethod?: string,
  sessionLength?: number,
) => {
  trackEvent(
    "pwa_engagement",
    "pwa_engagement",
    engagementType,
    undefined,
    createProperties({
      engagement_type: engagementType,
      launch_method: launchMethod,
      session_length: sessionLength,
    }),
  );
};

const analytics = {
  trackEvent,
  trackPageView,
  trackNewsletterSignup,
  trackProjectView,
  trackExternalLink,
  trackDownload,
  // New tracking functions
  trackProjectHover,
  trackProjectVideoPlay,
  trackProjectLiveDemo,
  trackProjectGithub,
  trackBlogPostView,
  trackBlogReadingTime,
  trackSectionView,
  trackContactIntent,
  trackResumeDownload,
  trackWorkExperienceExpand,
  trackTechnologyFilter,
  trackDemoInteraction,
  trackThemeToggle,
  trackNewsletterAttempt,
  trackScrollDepth,
  trackPageLoadTime,
  // SEO tracking functions
  trackStructuredDataView,
  trackBreadcrumbClick,
  trackSearchEngineReferral,
  trackMetaTagEngagement,
  trackLocalBusinessView,
  // Blog tracking functions
  trackBlogHeroImageView,
  trackCodeBlockCopy,
  trackRelatedArticleClick,
  trackReadingProgress,
  trackBlogSearchUsage,
  trackBlogCommentInteraction,
  // Motion/Animation tracking functions
  trackAnimationInteraction,
  trackMagneticHover,
  trackScrollProgress,
  trackMotionPreference,
  trackGlowEffectTrigger,
  trackParallaxScroll,
  // PWA tracking functions
  trackPWAInstallPrompt,
  trackPWAInstallSuccess,
  trackOfflineUsage,
  trackServiceWorkerUpdate,
  trackPushNotificationPermission,
  trackPWAPerformance,
  trackPWAEngagement,
  // Recommendation tracking functions
  trackRecommendationSectionView,
  trackRecommendationCaseStudyClick,
  trackRecommendationArticleClick,
  trackRecommendationCardHover,
  trackRecommendationConversion,
};

export default analytics;
