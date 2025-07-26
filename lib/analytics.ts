// Analytics utility functions for both Google Analytics and Vercel Analytics
import { track } from "@vercel/analytics";

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "consent",
      targetId: string | Date,
      config?: {
        [key: string]: unknown;
      },
    ) => void;
    dataLayer: unknown[];
  }
}

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
};

export default analytics;
