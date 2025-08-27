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

describe("Motion/Animation Analytics Functions", () => {
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

  describe("trackAnimationInteraction", () => {
    it("should track interactions with motion primitives", () => {
      const { trackAnimationInteraction } = require("../../lib/analytics");

      trackAnimationInteraction("magnetic", "hover", "/projects/echo", 2.5);

      expect(mockGtag).toHaveBeenCalledWith("event", "animation_interaction", {
        event_category: "motion_engagement",
        event_label: "magnetic",
        value: 2.5,
        animation_type: "magnetic",
        interaction_type: "hover",
        page_url: "/projects/echo",
        duration: 2.5,
      });

      expect(mockTrack).toHaveBeenCalledWith("animation_interaction", {
        category: "motion_engagement",
        label: "magnetic",
        value: 2.5,
        animation_type: "magnetic",
        interaction_type: "hover",
        page_url: "/projects/echo",
        duration: 2.5,
      });
    });

    it("should handle missing optional parameters", () => {
      const { trackAnimationInteraction } = require("../../lib/analytics");

      trackAnimationInteraction("fade-in", "scroll");

      expect(mockGtag).toHaveBeenCalledWith("event", "animation_interaction", {
        event_category: "motion_engagement",
        event_label: "fade-in",
        animation_type: "fade-in",
        interaction_type: "scroll",
      });

      expect(mockTrack).toHaveBeenCalledWith("animation_interaction", {
        category: "motion_engagement",
        label: "fade-in",
        animation_type: "fade-in",
        interaction_type: "scroll",
      });
    });
  });

  describe("trackMagneticHover", () => {
    it("should track magnetic effect interactions", () => {
      const { trackMagneticHover } = require("../../lib/analytics");

      trackMagneticHover("button", 15, 25, 3.2);

      expect(mockGtag).toHaveBeenCalledWith("event", "magnetic_hover", {
        event_category: "motion_engagement",
        event_label: "button",
        element_type: "button",
        distance_x: 15,
        distance_y: 25,
        duration: 3.2,
      });

      expect(mockTrack).toHaveBeenCalledWith("magnetic_hover", {
        category: "motion_engagement",
        label: "button",
        element_type: "button",
        distance_x: 15,
        distance_y: 25,
        duration: 3.2,
      });
    });
  });

  describe("trackScrollProgress", () => {
    it("should track scroll-based animation progress", () => {
      const { trackScrollProgress } = require("../../lib/analytics");

      trackScrollProgress("/projects/metis", "fade-up", 75, "hero-section");

      expect(mockGtag).toHaveBeenCalledWith("event", "scroll_progress", {
        event_category: "motion_engagement",
        event_label: "/projects/metis",
        page_url: "/projects/metis",
        animation_type: "fade-up",
        progress_percentage: 75,
        section_name: "hero-section",
      });

      expect(mockTrack).toHaveBeenCalledWith("scroll_progress", {
        category: "motion_engagement",
        label: "/projects/metis",
        page_url: "/projects/metis",
        animation_type: "fade-up",
        progress_percentage: 75,
        section_name: "hero-section",
      });
    });
  });

  describe("trackMotionPreference", () => {
    it("should track motion preference changes", () => {
      const { trackMotionPreference } = require("../../lib/analytics");

      trackMotionPreference("reduced", true, "user-setting");

      expect(mockGtag).toHaveBeenCalledWith("event", "motion_preference", {
        event_category: "motion_engagement",
        event_label: "reduced",
        preference: "reduced",
        is_system: true,
        source: "user-setting",
      });

      expect(mockTrack).toHaveBeenCalledWith("motion_preference", {
        category: "motion_engagement",
        label: "reduced",
        preference: "reduced",
        is_system: true,
        source: "user-setting",
      });
    });
  });

  describe("trackGlowEffectTrigger", () => {
    it("should track glow effect activations", () => {
      const { trackGlowEffectTrigger } = require("../../lib/analytics");

      trackGlowEffectTrigger("hero-card", "mouse-enter", "#ff6b35", 1.8);

      expect(mockGtag).toHaveBeenCalledWith("event", "glow_effect_trigger", {
        event_category: "motion_engagement",
        event_label: "hero-card",
        element_id: "hero-card",
        trigger_type: "mouse-enter",
        color: "#ff6b35",
        intensity: 1.8,
      });

      expect(mockTrack).toHaveBeenCalledWith("glow_effect_trigger", {
        category: "motion_engagement",
        label: "hero-card",
        element_id: "hero-card",
        trigger_type: "mouse-enter",
        color: "#ff6b35",
        intensity: 1.8,
      });
    });
  });

  describe("trackParallaxScroll", () => {
    it("should track parallax scroll interactions", () => {
      const { trackParallaxScroll } = require("../../lib/analytics");

      trackParallaxScroll("background-image", 0.5, 150, "/");

      expect(mockGtag).toHaveBeenCalledWith("event", "parallax_scroll", {
        event_category: "motion_engagement",
        event_label: "background-image",
        element_type: "background-image",
        speed_factor: 0.5,
        scroll_distance: 150,
        page_url: "/",
      });

      expect(mockTrack).toHaveBeenCalledWith("parallax_scroll", {
        category: "motion_engagement",
        label: "background-image",
        element_type: "background-image",
        speed_factor: 0.5,
        scroll_distance: 150,
        page_url: "/",
      });
    });
  });

  describe("Error handling", () => {
    it("should handle window.gtag being undefined", () => {
      const originalGtag = window.gtag;
      delete (window as any).gtag;

      const { trackAnimationInteraction } = require("../../lib/analytics");

      expect(() => {
        trackAnimationInteraction("fade-in", "scroll");
      }).not.toThrow();

      expect(mockTrack).toHaveBeenCalledWith("animation_interaction", {
        category: "motion_engagement",
        label: "fade-in",
        animation_type: "fade-in",
        interaction_type: "scroll",
      });

      // Restore gtag
      window.gtag = originalGtag;
    });
  });
});
