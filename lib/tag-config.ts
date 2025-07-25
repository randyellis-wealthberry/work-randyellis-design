// Tag configuration utility for managing environment-based tag settings

interface TagConfig {
  primaryGaId: string;
  googleAdsId?: string;
  secondaryGaId?: string;
  customTags?: string[];
}

// Parse comma-separated tags from environment variable
const parseCustomTags = (tagsString?: string): string[] => {
  if (!tagsString) return [];
  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
};

// Validate tag ID format
const isValidTagId = (tagId: string): boolean => {
  // GA4 format: G-XXXXXXXXX
  // Google Ads format: AW-XXXXXXXXX
  // Universal Analytics format: UA-XXXXXXXX-X (legacy)
  const validFormats = [
    /^G-[A-Z0-9]{10}$/i, // GA4
    /^AW-[0-9]{8,}$/i, // Google Ads
    /^UA-[0-9]+-[0-9]+$/i, // Legacy UA (for backwards compatibility)
    /^GT-[A-Z0-9]{8,}$/i, // Google Tag Manager
  ];

  return validFormats.some((format) => format.test(tagId));
};

// Get tag configuration from environment variables
export const getTagConfig = (): TagConfig => {
  const primaryGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!primaryGaId) {
    throw new Error("NEXT_PUBLIC_GA_MEASUREMENT_ID is required");
  }

  if (!isValidTagId(primaryGaId)) {
    throw new Error(`Invalid primary GA ID format: ${primaryGaId}`);
  }

  const config: TagConfig = {
    primaryGaId,
  };

  // Add Google Ads ID if configured
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (googleAdsId) {
    if (!isValidTagId(googleAdsId)) {
      console.warn(`Invalid Google Ads ID format: ${googleAdsId}`);
    } else {
      config.googleAdsId = googleAdsId;
    }
  }

  // Add secondary GA4 ID if configured
  const secondaryGaId = process.env.NEXT_PUBLIC_GA4_SECONDARY_ID;
  if (secondaryGaId) {
    if (!isValidTagId(secondaryGaId)) {
      console.warn(`Invalid secondary GA4 ID format: ${secondaryGaId}`);
    } else {
      config.secondaryGaId = secondaryGaId;
    }
  }

  // Add custom tags if configured
  const customTagsString = process.env.NEXT_PUBLIC_CUSTOM_TAGS;
  if (customTagsString) {
    const customTags = parseCustomTags(customTagsString);
    const validCustomTags = customTags.filter((tagId) => {
      if (!isValidTagId(tagId)) {
        console.warn(`Invalid custom tag ID format: ${tagId}`);
        return false;
      }
      return true;
    });

    if (validCustomTags.length > 0) {
      config.customTags = validCustomTags;
    }
  }

  return config;
};

// Get connected tags configuration for GoogleAnalytics component
export const getConnectedTagsConfig = () => {
  const config = getTagConfig();

  return {
    googleAdsId: config.googleAdsId,
    secondaryGaId: config.secondaryGaId,
    customTags: config.customTags,
  };
};

// Utility to check if any connected tags are configured
export const hasConnectedTags = (): boolean => {
  const config = getTagConfig();
  return !!(
    config.googleAdsId ||
    config.secondaryGaId ||
    (config.customTags && config.customTags.length > 0)
  );
};

// Get tag type from ID format
export const getTagType = (
  tagId: string,
): "ga4" | "google-ads" | "gtm" | "legacy-ua" | "unknown" => {
  if (/^G-/i.test(tagId)) return "ga4";
  if (/^AW-/i.test(tagId)) return "google-ads";
  if (/^GT-/i.test(tagId)) return "gtm";
  if (/^UA-/i.test(tagId)) return "legacy-ua";
  return "unknown";
};

// Development helper to log tag configuration
export const logTagConfig = (): void => {
  if (process.env.NODE_ENV === "development") {
    const config = getTagConfig();
    console.log("🏷️ Tag Configuration:", {
      primaryGaId: config.primaryGaId,
      googleAdsId: config.googleAdsId || "Not configured",
      secondaryGaId: config.secondaryGaId || "Not configured",
      customTags: config.customTags || "None",
      hasConnectedTags: hasConnectedTags(),
    });
  }
};
