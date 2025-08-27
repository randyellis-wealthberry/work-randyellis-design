import { jest } from "@jest/globals";

// Mock Vercel Analytics
const mockTrack = jest.fn();
jest.mock("@vercel/analytics", () => ({
  track: mockTrack,
}));

// Mock window.gtag
const mockGtag = jest.fn();
Object.defineProperty(window, "gtag", {
  value: mockGtag,
  writable: true,
});

describe("SEO Analytics Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGtag.mockClear();
    mockTrack.mockClear();
    // Mock process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "GA_TEST_ID";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  });

  describe("trackStructuredDataView", () => {
    it("should track when structured data is rendered", () => {
      const { trackStructuredDataView } = require("../../lib/analytics");

      trackStructuredDataView("LocalBusiness", "chicago-design-services");

      expect(mockGtag).toHaveBeenCalledWith("event", "structured_data_view", {
        event_category: "seo",
        event_label: "LocalBusiness",
        schema_type: "LocalBusiness",
        schema_id: "chicago-design-services",
      });

      expect(mockTrack).toHaveBeenCalledWith("structured_data_view", {
        category: "seo",
        label: "LocalBusiness",
        schema_type: "LocalBusiness",
        schema_id: "chicago-design-services",
      });
    });

    it("should handle missing optional parameters", () => {
      const { trackStructuredDataView } = require("../../lib/analytics");

      trackStructuredDataView("Article");

      expect(mockGtag).toHaveBeenCalledWith("event", "structured_data_view", {
        event_category: "seo",
        event_label: "Article",
        schema_type: "Article",
      });

      expect(mockTrack).toHaveBeenCalledWith("structured_data_view", {
        category: "seo",
        label: "Article",
        schema_type: "Article",
      });
    });
  });

  describe("trackBreadcrumbClick", () => {
    it("should track breadcrumb navigation clicks", () => {
      const { trackBreadcrumbClick } = require("../../lib/analytics");

      trackBreadcrumbClick("/projects/echo", "Echo Project", 2);

      expect(mockGtag).toHaveBeenCalledWith("event", "breadcrumb_click", {
        event_category: "seo",
        event_label: "Echo Project",
        breadcrumb_url: "/projects/echo",
        breadcrumb_position: 2,
      });

      expect(mockTrack).toHaveBeenCalledWith("breadcrumb_click", {
        category: "seo",
        label: "Echo Project",
        breadcrumb_url: "/projects/echo",
        breadcrumb_position: 2,
      });
    });
  });

  describe("trackSearchEngineReferral", () => {
    it("should track search engine referrals", () => {
      const { trackSearchEngineReferral } = require("../../lib/analytics");

      trackSearchEngineReferral("google", "ai product design chicago", "/");

      expect(mockGtag).toHaveBeenCalledWith("event", "search_engine_referral", {
        event_category: "seo",
        event_label: "google",
        search_engine: "google",
        search_query: "ai product design chicago",
        landing_page: "/",
      });

      expect(mockTrack).toHaveBeenCalledWith("search_engine_referral", {
        category: "seo",
        label: "google",
        search_engine: "google",
        search_query: "ai product design chicago",
        landing_page: "/",
      });
    });
  });

  describe("trackMetaTagEngagement", () => {
    it("should track social sharing from meta tags", () => {
      const { trackMetaTagEngagement } = require("../../lib/analytics");

      trackMetaTagEngagement("twitter", "share", "/projects/metis");

      expect(mockGtag).toHaveBeenCalledWith("event", "meta_tag_engagement", {
        event_category: "seo",
        event_label: "twitter",
        social_platform: "twitter",
        engagement_type: "share",
        page_url: "/projects/metis",
      });

      expect(mockTrack).toHaveBeenCalledWith("meta_tag_engagement", {
        category: "seo",
        label: "twitter",
        social_platform: "twitter",
        engagement_type: "share",
        page_url: "/projects/metis",
      });
    });
  });

  describe("trackLocalBusinessView", () => {
    it("should track local business schema views", () => {
      const { trackLocalBusinessView } = require("../../lib/analytics");

      trackLocalBusinessView("chicago", "design-services");

      expect(mockGtag).toHaveBeenCalledWith("event", "local_business_view", {
        event_category: "seo",
        event_label: "chicago",
        business_location: "chicago",
        business_type: "design-services",
      });

      expect(mockTrack).toHaveBeenCalledWith("local_business_view", {
        category: "seo",
        label: "chicago",
        business_location: "chicago",
        business_type: "design-services",
      });
    });
  });

  describe("Error handling", () => {
    it("should handle window.gtag being undefined", () => {
      const originalGtag = window.gtag;
      delete (window as any).gtag;

      const { trackStructuredDataView } = require("../../lib/analytics");

      expect(() => {
        trackStructuredDataView("Article");
      }).not.toThrow();

      expect(mockTrack).toHaveBeenCalledWith("structured_data_view", {
        category: "seo",
        label: "Article",
        schema_type: "Article",
      });

      // Restore gtag
      window.gtag = originalGtag;
    });
  });
});
