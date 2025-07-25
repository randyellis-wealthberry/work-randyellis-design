// Google Tag Manager utility for handling multiple connected tags

interface TagManagerConfig {
  primaryGaId: string;
  googleAdsId?: string;
  secondaryGaId?: string;
  customTags?: string[];
}

interface ConnectedTag {
  id: string;
  type: "ga4" | "google-ads" | "custom";
  nickname?: string;
  enabled: boolean;
}

class TagManager {
  private config: TagManagerConfig;
  private connectedTags: ConnectedTag[] = [];

  constructor(config: TagManagerConfig) {
    this.config = config;
    this.initializeConnectedTags();
  }

  private initializeConnectedTags() {
    // Add primary GA4 tag
    this.connectedTags.push({
      id: this.config.primaryGaId,
      type: "ga4",
      nickname: "Primary GA4",
      enabled: true,
    });

    // Add Google Ads tag if configured
    if (this.config.googleAdsId) {
      this.connectedTags.push({
        id: this.config.googleAdsId,
        type: "google-ads",
        nickname: "Google Ads",
        enabled: true,
      });
    }

    // Add secondary GA4 tag if configured
    if (this.config.secondaryGaId) {
      this.connectedTags.push({
        id: this.config.secondaryGaId,
        type: "ga4",
        nickname: "Secondary GA4",
        enabled: true,
      });
    }

    // Add custom tags if configured
    if (this.config.customTags) {
      this.config.customTags.forEach((tagId, index) => {
        this.connectedTags.push({
          id: tagId,
          type: "custom",
          nickname: `Custom Tag ${index + 1}`,
          enabled: true,
        });
      });
    }
  }

  // Connect a new tag dynamically
  connectTag(
    tagId: string,
    type: ConnectedTag["type"],
    nickname?: string,
  ): void {
    // Check if tag already exists
    if (this.connectedTags.find((tag) => tag.id === tagId)) {
      console.warn(`Tag ${tagId} is already connected`);
      return;
    }

    // Add new tag
    this.connectedTags.push({
      id: tagId,
      type,
      nickname: nickname || `${type.toUpperCase()} Tag`,
      enabled: true,
    });

    // Configure the tag if gtag is available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", tagId);
      console.log(`Connected tag: ${tagId} (${nickname || type})`);
    }
  }

  // Disconnect a tag
  disconnectTag(tagId: string): void {
    this.connectedTags = this.connectedTags.filter((tag) => tag.id !== tagId);
    console.log(`Disconnected tag: ${tagId}`);
  }

  // Enable/disable a tag
  toggleTag(tagId: string, enabled: boolean): void {
    const tag = this.connectedTags.find((t) => t.id === tagId);
    if (tag) {
      tag.enabled = enabled;
      console.log(`Tag ${tagId} ${enabled ? "enabled" : "disabled"}`);
    }
  }

  // Get all connected tags
  getConnectedTags(): ConnectedTag[] {
    return this.connectedTags.filter((tag) => tag.enabled);
  }

  // Get tags by type
  getTagsByType(type: ConnectedTag["type"]): ConnectedTag[] {
    return this.connectedTags.filter((tag) => tag.type === type && tag.enabled);
  }

  // Send event to all connected GA4 tags
  sendEventToGA4(
    eventName: string,
    parameters?: { [key: string]: unknown },
  ): void {
    const ga4Tags = this.getTagsByType("ga4");

    ga4Tags.forEach((tag) => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", eventName, {
          ...parameters,
          send_to: tag.id,
        });
      }
    });
  }

  // Send conversion to Google Ads tags
  sendConversionToAds(conversionLabel: string, value?: number): void {
    const adsTags = this.getTagsByType("google-ads");

    adsTags.forEach((tag) => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: `${tag.id}/${conversionLabel}`,
          value: value,
          currency: "USD",
        });
      }
    });
  }

  // Get configuration for GoogleAnalytics component
  getAnalyticsConfig() {
    const connectedTags = {
      googleAdsId: this.config.googleAdsId,
      secondaryGaId: this.config.secondaryGaId,
      customTags: this.config.customTags,
    };

    return {
      gaId: this.config.primaryGaId,
      connectedTags,
    };
  }
}

// Create a singleton instance
let tagManagerInstance: TagManager | null = null;

export const createTagManager = (config: TagManagerConfig): TagManager => {
  if (!tagManagerInstance) {
    tagManagerInstance = new TagManager(config);
  }
  return tagManagerInstance;
};

export const getTagManager = (): TagManager | null => {
  return tagManagerInstance;
};

export default TagManager;
