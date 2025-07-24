// Google Analytics utility functions

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

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
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

const analytics = {
  trackEvent,
  trackPageView,
  trackNewsletterSignup,
  trackProjectView,
  trackExternalLink,
  trackDownload,
};

export default analytics;
