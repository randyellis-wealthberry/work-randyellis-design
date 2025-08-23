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

describe('PWA Analytics Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGtag.mockClear();
    mockTrack.mockClear();
    // Mock process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'GA_TEST_ID';
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  });

  describe('trackPWAInstallPrompt', () => {
    it('should track when PWA install prompt is shown', () => {
      const { trackPWAInstallPrompt } = require('../../lib/analytics');
      
      trackPWAInstallPrompt('beforeinstallprompt', 'automatic', 3);

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

    it('should handle missing optional parameters', () => {
      const { trackPWAInstallPrompt } = require('../../lib/analytics');
      
      trackPWAInstallPrompt('manual');

      expect(mockGtag).toHaveBeenCalledWith('event', 'pwa_install_prompt', {
        event_category: 'pwa_engagement',
        event_label: 'manual',
        event_type: 'manual',
      });

      expect(mockTrack).toHaveBeenCalledWith('pwa_install_prompt', {
        category: 'pwa_engagement',
        label: 'manual',
        event_type: 'manual',
      });
    });
  });

  describe('trackPWAInstallSuccess', () => {
    it('should track successful PWA installations', () => {
      const { trackPWAInstallSuccess } = require('../../lib/analytics');
      
      trackPWAInstallSuccess('accepted', 'chrome', 'desktop');

      expect(mockGtag).toHaveBeenCalledWith('event', 'pwa_install_success', {
        event_category: 'pwa_engagement',
        event_label: 'accepted',
        outcome: 'accepted',
        browser: 'chrome',
        platform: 'desktop',
      });

      expect(mockTrack).toHaveBeenCalledWith('pwa_install_success', {
        category: 'pwa_engagement',
        label: 'accepted',
        outcome: 'accepted',
        browser: 'chrome',
        platform: 'desktop',
      });
    });
  });

  describe('trackOfflineUsage', () => {
    it('should track offline app usage', () => {
      const { trackOfflineUsage } = require('../../lib/analytics');
      
      trackOfflineUsage('/projects/echo', 'navigation', 45);

      expect(mockGtag).toHaveBeenCalledWith('event', 'offline_usage', {
        event_category: 'pwa_engagement',
        event_label: '/projects/echo',
        page_url: '/projects/echo',
        action_type: 'navigation',
        offline_duration: 45,
      });

      expect(mockTrack).toHaveBeenCalledWith('offline_usage', {
        category: 'pwa_engagement',
        label: '/projects/echo',
        page_url: '/projects/echo',
        action_type: 'navigation',
        offline_duration: 45,
      });
    });
  });

  describe('trackServiceWorkerUpdate', () => {
    it('should track service worker updates', () => {
      const { trackServiceWorkerUpdate } = require('../../lib/analytics');
      
      trackServiceWorkerUpdate('update-available', 'v2.1.0', 'background');

      expect(mockGtag).toHaveBeenCalledWith('event', 'service_worker_update', {
        event_category: 'pwa_engagement',
        event_label: 'update-available',
        update_type: 'update-available',
        version: 'v2.1.0',
        activation_mode: 'background',
      });

      expect(mockTrack).toHaveBeenCalledWith('service_worker_update', {
        category: 'pwa_engagement',
        label: 'update-available',
        update_type: 'update-available',
        version: 'v2.1.0',
        activation_mode: 'background',
      });
    });
  });

  describe('trackPushNotificationPermission', () => {
    it('should track push notification permission requests', () => {
      const { trackPushNotificationPermission } = require('../../lib/analytics');
      
      trackPushNotificationPermission('granted', 'user-initiated', 'welcome-flow');

      expect(mockGtag).toHaveBeenCalledWith('event', 'push_notification_permission', {
        event_category: 'pwa_engagement',
        event_label: 'granted',
        permission_status: 'granted',
        request_source: 'user-initiated',
        context: 'welcome-flow',
      });

      expect(mockTrack).toHaveBeenCalledWith('push_notification_permission', {
        category: 'pwa_engagement',
        label: 'granted',
        permission_status: 'granted',
        request_source: 'user-initiated',
        context: 'welcome-flow',
      });
    });
  });

  describe('trackPWAPerformance', () => {
    it('should track PWA performance metrics', () => {
      const { trackPWAPerformance } = require('../../lib/analytics');
      
      trackPWAPerformance('cache-hit', 'manifest.json', 120, true);

      expect(mockGtag).toHaveBeenCalledWith('event', 'pwa_performance', {
        event_category: 'pwa_engagement',
        event_label: 'cache-hit',
        value: 120,
        metric_type: 'cache-hit',
        resource: 'manifest.json',
        load_time: 120,
        from_cache: true,
      });

      expect(mockTrack).toHaveBeenCalledWith('pwa_performance', {
        category: 'pwa_engagement',
        label: 'cache-hit',
        value: 120,
        metric_type: 'cache-hit',
        resource: 'manifest.json',
        load_time: 120,
        from_cache: true,
      });
    });
  });

  describe('trackPWAEngagement', () => {
    it('should track PWA engagement events', () => {
      const { trackPWAEngagement } = require('../../lib/analytics');
      
      trackPWAEngagement('home-screen-launch', 'icon', 5);

      expect(mockGtag).toHaveBeenCalledWith('event', 'pwa_engagement', {
        event_category: 'pwa_engagement',
        event_label: 'home-screen-launch',
        engagement_type: 'home-screen-launch',
        launch_method: 'icon',
        session_length: 5,
      });

      expect(mockTrack).toHaveBeenCalledWith('pwa_engagement', {
        category: 'pwa_engagement',
        label: 'home-screen-launch',
        engagement_type: 'home-screen-launch',
        launch_method: 'icon',
        session_length: 5,
      });
    });
  });

  describe('Error handling', () => {
    it('should handle window.gtag being undefined', () => {
      const originalGtag = window.gtag;
      delete (window as any).gtag;

      const { trackPWAInstallPrompt } = require('../../lib/analytics');
      
      expect(() => {
        trackPWAInstallPrompt('manual');
      }).not.toThrow();

      expect(mockTrack).toHaveBeenCalledWith('pwa_install_prompt', {
        category: 'pwa_engagement',
        label: 'manual',
        event_type: 'manual',
      });

      // Restore gtag
      window.gtag = originalGtag;
    });
  });
});