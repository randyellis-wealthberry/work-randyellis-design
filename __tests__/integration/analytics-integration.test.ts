import { jest } from '@jest/globals';

// Mock Vercel Analytics
const mockTrack = jest.fn();
jest.mock('@vercel/analytics', () => ({
  track: mockTrack,
}));

// Mock window.gtag
const mockGtag = jest.fn();
Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true,
});

describe('Analytics Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGtag.mockClear();
    mockTrack.mockClear();
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'GA_TEST_ID';
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  });

  describe('Component Analytics Integration', () => {
    it('should track breadcrumb clicks in navigation', () => {
      // Import after mocks are set up
      const analytics = require('../../lib/analytics');
      
      // Simulate breadcrumb click from BreadcrumbNav component
      analytics.trackBreadcrumbClick('/projects/echo', 'Echo Project', 2);

      expect(mockGtag).toHaveBeenCalledWith('event', 'breadcrumb_click', {
        event_category: 'seo',
        event_label: 'Echo Project',
        breadcrumb_url: '/projects/echo',
        breadcrumb_position: 2,
      });

      expect(mockTrack).toHaveBeenCalledWith('breadcrumb_click', {
        category: 'seo',
        label: 'Echo Project',
        breadcrumb_url: '/projects/echo',
        breadcrumb_position: 2,
      });
    });

    it('should track structured data views for SEO components', () => {
      const analytics = require('../../lib/analytics');
      
      // Simulate structured data rendering from LocalBusinessStructuredData component
      analytics.trackStructuredDataView('LocalBusiness', 'chicago-design-services');

      expect(mockGtag).toHaveBeenCalledWith('event', 'structured_data_view', {
        event_category: 'seo',
        event_label: 'LocalBusiness',
        schema_type: 'LocalBusiness',
        schema_id: 'chicago-design-services',
      });

      expect(mockTrack).toHaveBeenCalledWith('structured_data_view', {
        category: 'seo',
        label: 'LocalBusiness',
        schema_type: 'LocalBusiness',
        schema_id: 'chicago-design-services',
      });
    });

    it('should track blog hero image views', () => {
      const analytics = require('../../lib/analytics');
      
      // Simulate blog hero image view from blog pages
      analytics.trackBlogHeroImageView(
        'claude-obsidian-workflows', 
        'Obsidian knowledge graph visualization'
      );

      expect(mockGtag).toHaveBeenCalledWith('event', 'blog_hero_image_view', {
        event_category: 'blog_engagement',
        event_label: 'claude-obsidian-workflows',
        blog_slug: 'claude-obsidian-workflows',
        image_alt: 'Obsidian knowledge graph visualization',
      });

      expect(mockTrack).toHaveBeenCalledWith('blog_hero_image_view', {
        category: 'blog_engagement',
        label: 'claude-obsidian-workflows',
        blog_slug: 'claude-obsidian-workflows',
        image_alt: 'Obsidian knowledge graph visualization',
      });
    });

    it('should track code block copy interactions', () => {
      const analytics = require('../../lib/analytics');
      
      // Simulate code block copy from CodeBlock component
      analytics.trackCodeBlockCopy('typescript', 'claude-obsidian-workflows', 15);

      expect(mockGtag).toHaveBeenCalledWith('event', 'code_block_copy', {
        event_category: 'blog_engagement',
        event_label: 'typescript',
        language: 'typescript',
        blog_slug: 'claude-obsidian-workflows',
        line_count: 15,
      });

      expect(mockTrack).toHaveBeenCalledWith('code_block_copy', {
        category: 'blog_engagement',
        label: 'typescript',
        language: 'typescript',
        blog_slug: 'claude-obsidian-workflows',
        line_count: 15,
      });
    });

    it('should track magnetic hover interactions from motion components', () => {
      const analytics = require('../../lib/analytics');
      
      // Simulate magnetic hover from Magnetic component
      analytics.trackMagneticHover('button', 15, 25, 3.2);

      expect(mockGtag).toHaveBeenCalledWith('event', 'magnetic_hover', {
        event_category: 'motion_engagement',
        event_label: 'button',
        element_type: 'button',
        distance_x: 15,
        distance_y: 25,
        duration: 3.2,
      });

      expect(mockTrack).toHaveBeenCalledWith('magnetic_hover', {
        category: 'motion_engagement',
        label: 'button',
        element_type: 'button',
        distance_x: 15,
        distance_y: 25,
        duration: 3.2,
      });
    });

    it('should track glow effects from enhanced components', () => {
      const analytics = require('../../lib/analytics');
      
      // Simulate glow effect activation from enhanced components
      analytics.trackGlowEffectTrigger('hero-card', 'mouse-enter', '#ff6b35', 1.8);

      expect(mockGtag).toHaveBeenCalledWith('event', 'glow_effect_trigger', {
        event_category: 'motion_engagement',
        event_label: 'hero-card',
        element_id: 'hero-card',
        trigger_type: 'mouse-enter',
        color: '#ff6b35',
        intensity: 1.8,
      });

      expect(mockTrack).toHaveBeenCalledWith('glow_effect_trigger', {
        category: 'motion_engagement',
        label: 'hero-card',
        element_id: 'hero-card',
        trigger_type: 'mouse-enter',
        color: '#ff6b35',
        intensity: 1.8,
      });
    });

    it('should track PWA install prompts', () => {
      const analytics = require('../../lib/analytics');
      
      // Simulate PWA install prompt from service worker
      analytics.trackPWAInstallPrompt('beforeinstallprompt', 'automatic', 3);

      expect(mockGtag).toHaveBeenCalledWith('event', 'pwa_install_prompt', {
        event_category: 'pwa_engagement',
        event_label: 'beforeinstallprompt',
        event_type: 'beforeinstallprompt',
        trigger_source: 'automatic',
        session_visit_count: 3,
      });

      expect(mockTrack).toHaveBeenCalledWith('pwa_install_prompt', {
        category: 'pwa_engagement',
        label: 'beforeinstallprompt',
        event_type: 'beforeinstallprompt',
        trigger_source: 'automatic',
        session_visit_count: 3,
      });
    });

    it('should track reading progress from blog components', () => {
      const analytics = require('../../lib/analytics');
      
      // Simulate reading progress tracking from blog layout
      analytics.trackReadingProgress('claude-obsidian-workflows', 75, 180);

      expect(mockGtag).toHaveBeenCalledWith('event', 'reading_progress', {
        event_category: 'blog_engagement',
        event_label: 'claude-obsidian-workflows',
        value: 75,
        blog_slug: 'claude-obsidian-workflows',
        progress_percentage: 75,
        time_spent: 180,
      });

      expect(mockTrack).toHaveBeenCalledWith('reading_progress', {
        category: 'blog_engagement',
        label: 'claude-obsidian-workflows',
        value: 75,
        blog_slug: 'claude-obsidian-workflows',
        progress_percentage: 75,
        time_spent: 180,
      });
    });
  });

  describe('Analytics Function Availability', () => {
    it('should export all new analytics functions', () => {
      const analytics = require('../../lib/analytics');
      
      // SEO functions
      expect(typeof analytics.trackStructuredDataView).toBe('function');
      expect(typeof analytics.trackBreadcrumbClick).toBe('function');
      expect(typeof analytics.trackSearchEngineReferral).toBe('function');
      expect(typeof analytics.trackMetaTagEngagement).toBe('function');
      expect(typeof analytics.trackLocalBusinessView).toBe('function');

      // Blog functions
      expect(typeof analytics.trackBlogHeroImageView).toBe('function');
      expect(typeof analytics.trackCodeBlockCopy).toBe('function');
      expect(typeof analytics.trackRelatedArticleClick).toBe('function');
      expect(typeof analytics.trackReadingProgress).toBe('function');
      expect(typeof analytics.trackBlogSearchUsage).toBe('function');
      expect(typeof analytics.trackBlogCommentInteraction).toBe('function');

      // Motion functions
      expect(typeof analytics.trackAnimationInteraction).toBe('function');
      expect(typeof analytics.trackMagneticHover).toBe('function');
      expect(typeof analytics.trackScrollProgress).toBe('function');
      expect(typeof analytics.trackMotionPreference).toBe('function');
      expect(typeof analytics.trackGlowEffectTrigger).toBe('function');
      expect(typeof analytics.trackParallaxScroll).toBe('function');

      // PWA functions
      expect(typeof analytics.trackPWAInstallPrompt).toBe('function');
      expect(typeof analytics.trackPWAInstallSuccess).toBe('function');
      expect(typeof analytics.trackOfflineUsage).toBe('function');
      expect(typeof analytics.trackServiceWorkerUpdate).toBe('function');
      expect(typeof analytics.trackPushNotificationPermission).toBe('function');
      expect(typeof analytics.trackPWAPerformance).toBe('function');
      expect(typeof analytics.trackPWAEngagement).toBe('function');
    });

    it('should include all new functions in default export', () => {
      const analytics = require('../../lib/analytics');
      const defaultExport = analytics.default;
      
      // Verify new functions are in default export
      expect(typeof defaultExport.trackStructuredDataView).toBe('function');
      expect(typeof defaultExport.trackBlogHeroImageView).toBe('function');
      expect(typeof defaultExport.trackAnimationInteraction).toBe('function');
      expect(typeof defaultExport.trackPWAInstallPrompt).toBe('function');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle missing gtag gracefully in all function categories', () => {
      const originalGtag = window.gtag;
      delete (window as any).gtag;

      const analytics = require('../../lib/analytics');

      // Test one function from each category
      expect(() => {
        analytics.trackStructuredDataView('Article');
        analytics.trackBlogHeroImageView('test-blog');
        analytics.trackAnimationInteraction('fade', 'scroll');
        analytics.trackPWAInstallPrompt('manual');
      }).not.toThrow();

      // Verify Vercel Analytics was still called
      expect(mockTrack).toHaveBeenCalledTimes(4);

      // Restore gtag
      window.gtag = originalGtag;
    });
  });
});