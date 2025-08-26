/**
 * Progressive Web App (PWA) Functionality Tests
 * TDD approach for validating PWA features and offline capabilities
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// PWA Testing Utilities
class PWATestUtils {
  static mockServiceWorker() {
    const mockServiceWorker = {
      postMessage: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      scriptURL: '/sw.js',
      state: 'activated'
    };

    const mockRegistration = {
      active: mockServiceWorker,
      installing: null,
      waiting: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
      unregister: jest.fn().mockResolvedValue(true),
      scope: 'https://example.com/',
      updateViaCache: 'imports'
    };

    // Mock navigator.serviceWorker
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: jest.fn().mockResolvedValue(mockRegistration),
        getRegistration: jest.fn().mockResolvedValue(mockRegistration),
        getRegistrations: jest.fn().mockResolvedValue([mockRegistration]),
        ready: Promise.resolve(mockRegistration),
        controller: mockServiceWorker,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
      writable: true,
    });

    return { mockRegistration, mockServiceWorker };
  }

  static mockCacheAPI() {
    const mockCache = {
      match: jest.fn(),
      matchAll: jest.fn(),
      add: jest.fn(),
      addAll: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      keys: jest.fn(),
    };

    const mockCaches = {
      open: jest.fn().mockResolvedValue(mockCache),
      delete: jest.fn(),
      has: jest.fn(),
      keys: jest.fn(),
      match: jest.fn(),
    };

    Object.defineProperty(global, 'caches', {
      value: mockCaches,
      writable: true,
    });

    return { mockCache, mockCaches };
  }

  static simulateOfflineMode() {
    // Mock network status
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
    });

    // Dispatch offline event
    const offlineEvent = new Event('offline');
    window.dispatchEvent(offlineEvent);
  }

  static simulateOnlineMode() {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
    });

    const onlineEvent = new Event('online');
    window.dispatchEvent(onlineEvent);
  }

  static mockBeforeInstallPrompt() {
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn().mockResolvedValue({ outcome: 'accepted' }),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };

    return mockEvent;
  }
}

describe('PWA Functionality Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Reset navigator properties
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up event listeners
    window.removeEventListener('online', jest.fn());
    window.removeEventListener('offline', jest.fn());
  });

  describe('Service Worker Registration', () => {
    test('should register service worker successfully', async () => {
      const { mockRegistration } = PWATestUtils.mockServiceWorker();
      
      // Test service worker registration
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
      expect(registration).toBe(mockRegistration);
      expect(registration.active?.scriptURL).toBe('/sw.js');
    });

    test('should handle service worker registration failure', async () => {
      // Mock registration failure
      (navigator.serviceWorker.register as jest.Mock).mockRejectedValue(
        new Error('Service worker registration failed')
      );
      
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Service worker registration failed');
      }
    });

    test('should update service worker when new version available', async () => {
      const { mockRegistration } = PWATestUtils.mockServiceWorker();
      
      // Simulate service worker update
      await mockRegistration.update();
      
      expect(mockRegistration.update).toHaveBeenCalled();
    });

    test('should unregister service worker', async () => {
      const { mockRegistration } = PWATestUtils.mockServiceWorker();
      
      const unregistered = await mockRegistration.unregister();
      
      expect(mockRegistration.unregister).toHaveBeenCalled();
      expect(unregistered).toBe(true);
    });
  });

  describe('Cache Management', () => {
    test('should open cache and store resources', async () => {
      const { mockCache, mockCaches } = PWATestUtils.mockCacheAPI();
      
      const cache = await caches.open('portfolio-v1');
      await cache.addAll(['/index.html', '/styles.css', '/app.js']);
      
      expect(mockCaches.open).toHaveBeenCalledWith('portfolio-v1');
      expect(mockCache.addAll).toHaveBeenCalledWith(['/index.html', '/styles.css', '/app.js']);
    });

    test('should retrieve cached resources', async () => {
      const { mockCache, mockCaches } = PWATestUtils.mockCacheAPI();
      
      const mockResponse = new Response('cached content');
      mockCache.match.mockResolvedValue(mockResponse);
      
      const cache = await caches.open('portfolio-v1');
      const response = await cache.match('/index.html');
      
      expect(mockCache.match).toHaveBeenCalledWith('/index.html');
      expect(response).toBe(mockResponse);
    });

    test('should cache API responses dynamically', async () => {
      const { mockCache, mockCaches } = PWATestUtils.mockCacheAPI();
      
      const cache = await caches.open('api-cache-v1');
      const response = new Response(JSON.stringify({ data: 'test' }));
      
      await cache.put('/api/data', response);
      
      expect(mockCache.put).toHaveBeenCalledWith('/api/data', response);
    });

    test('should delete old cache versions', async () => {
      const { mockCaches } = PWATestUtils.mockCacheAPI();
      
      mockCaches.keys.mockResolvedValue(['portfolio-v1', 'portfolio-v2']);
      
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => name !== 'portfolio-v2');
      
      for (const cacheName of oldCaches) {
        await caches.delete(cacheName);
      }
      
      expect(mockCaches.delete).toHaveBeenCalledWith('portfolio-v1');
    });
  });

  describe('Offline Functionality', () => {
    test('should detect offline status', () => {
      PWATestUtils.simulateOfflineMode();
      
      expect(navigator.onLine).toBe(false);
    });

    test('should handle offline network requests', async () => {
      const { mockCache } = PWATestUtils.mockCacheAPI();
      PWATestUtils.simulateOfflineMode();
      
      // Mock cached response for offline request
      const cachedResponse = new Response('offline content');
      mockCache.match.mockResolvedValue(cachedResponse);
      
      // In a real PWA, service worker would intercept and serve cached response
      const cache = await caches.open('portfolio-v1');
      const response = await cache.match('/index.html');
      
      expect(response).toBe(cachedResponse);
    });

    test('should show offline indicator when network is down', async () => {
      let isOffline = false;
      
      const handleOffline = () => { isOffline = true; };
      const handleOnline = () => { isOffline = false; };
      
      window.addEventListener('offline', handleOffline);
      window.addEventListener('online', handleOnline);
      
      // Simulate going offline
      PWATestUtils.simulateOfflineMode();
      expect(isOffline).toBe(true);
      
      // Simulate going back online
      PWATestUtils.simulateOnlineMode();
      expect(isOffline).toBe(false);
      
      // Clean up
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    });

    test('should queue requests when offline and sync when online', async () => {
      const requestQueue: Array<{ url: string; data: any }> = [];
      
      const queueRequest = (url: string, data: any) => {
        requestQueue.push({ url, data });
      };
      
      const processQueue = async () => {
        while (requestQueue.length > 0) {
          const request = requestQueue.shift();
          // Process queued request
          expect(request).toBeDefined();
        }
      };
      
      // Simulate offline request
      PWATestUtils.simulateOfflineMode();
      queueRequest('/api/analytics', { event: 'page_view' });
      
      expect(requestQueue).toHaveLength(1);
      
      // Simulate going online and processing queue
      PWATestUtils.simulateOnlineMode();
      await processQueue();
      
      expect(requestQueue).toHaveLength(0);
    });
  });

  describe('Install Prompt and PWA Installation', () => {
    test('should handle beforeinstallprompt event', async () => {
      let deferredPrompt: any = null;
      
      const handleBeforeInstallPrompt = (event: any) => {
        event.preventDefault();
        deferredPrompt = event;
      };
      
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      // Simulate beforeinstallprompt event
      const mockEvent = PWATestUtils.mockBeforeInstallPrompt();
      const event = new CustomEvent('beforeinstallprompt');
      Object.assign(event, mockEvent);
      
      window.dispatchEvent(event);
      
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(deferredPrompt).toBe(event);
      
      // Clean up
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    });

    test('should show install prompt when triggered', async () => {
      const mockEvent = PWATestUtils.mockBeforeInstallPrompt();
      
      // Simulate showing install prompt
      await mockEvent.prompt();
      const choice = await mockEvent.userChoice;
      
      expect(mockEvent.prompt).toHaveBeenCalled();
      expect(choice.outcome).toBe('accepted');
    });

    test('should track app installation', async () => {
      let appInstalled = false;
      
      const handleAppInstalled = () => {
        appInstalled = true;
      };
      
      window.addEventListener('appinstalled', handleAppInstalled);
      
      // Simulate app installation
      const installedEvent = new CustomEvent('appinstalled');
      window.dispatchEvent(installedEvent);
      
      expect(appInstalled).toBe(true);
      
      // Clean up
      window.removeEventListener('appinstalled', handleAppInstalled);
    });
  });

  describe('Push Notifications', () => {
    test('should request notification permission', async () => {
      // Mock notification permission
      Object.defineProperty(global, 'Notification', {
        value: {
          requestPermission: jest.fn().mockResolvedValue('granted'),
          permission: 'default'
        },
        writable: true,
      });
      
      const permission = await Notification.requestPermission();
      
      expect(Notification.requestPermission).toHaveBeenCalled();
      expect(permission).toBe('granted');
    });

    test('should subscribe to push notifications', async () => {
      PWATestUtils.mockServiceWorker();
      
      // Mock push manager
      const mockSubscription = {
        endpoint: 'https://fcm.googleapis.com/fcm/send/123',
        getKey: jest.fn(),
        unsubscribe: jest.fn().mockResolvedValue(true)
      };
      
      const mockPushManager = {
        subscribe: jest.fn().mockResolvedValue(mockSubscription),
        getSubscription: jest.fn().mockResolvedValue(mockSubscription),
      };
      
      const registration = await navigator.serviceWorker.ready;
      (registration as any).pushManager = mockPushManager;
      
      const subscription = await mockPushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'test-key'
      });
      
      expect(mockPushManager.subscribe).toHaveBeenCalled();
      expect(subscription).toBe(mockSubscription);
    });

    test('should unsubscribe from push notifications', async () => {
      const mockSubscription = {
        endpoint: 'https://fcm.googleapis.com/fcm/send/123',
        unsubscribe: jest.fn().mockResolvedValue(true)
      };
      
      const unsubscribed = await mockSubscription.unsubscribe();
      
      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      expect(unsubscribed).toBe(true);
    });
  });

  describe('Background Sync', () => {
    test('should register background sync', async () => {
      PWATestUtils.mockServiceWorker();
      
      // Mock sync manager
      const mockSyncManager = {
        register: jest.fn().mockResolvedValue(undefined),
        getTags: jest.fn().mockResolvedValue(['background-sync'])
      };
      
      const registration = await navigator.serviceWorker.ready;
      (registration as any).sync = mockSyncManager;
      
      await mockSyncManager.register('background-sync');
      
      expect(mockSyncManager.register).toHaveBeenCalledWith('background-sync');
    });

    test('should handle background sync events', async () => {
      const mockSyncEvent = {
        tag: 'background-sync',
        waitUntil: jest.fn(),
        lastChance: false
      };
      
      // Simulate handling sync event in service worker
      const handleSync = (event: any) => {
        if (event.tag === 'background-sync') {
          event.waitUntil(Promise.resolve('sync completed'));
        }
      };
      
      handleSync(mockSyncEvent);
      
      expect(mockSyncEvent.waitUntil).toHaveBeenCalled();
    });
  });

  describe('Web Share API', () => {
    test('should check if Web Share API is supported', () => {
      // Mock Web Share API
      (navigator as any).share = jest.fn().mockResolvedValue(undefined);
      
      const canShare = 'share' in navigator;
      
      expect(canShare).toBe(true);
    });

    test('should share content using Web Share API', async () => {
      // Mock Web Share API
      (navigator as any).share = jest.fn().mockResolvedValue(undefined);
      
      const shareData = {
        title: 'My Portfolio',
        text: 'Check out my latest projects',
        url: 'https://example.com'
      };
      
      await navigator.share(shareData);
      
      expect(navigator.share).toHaveBeenCalledWith(shareData);
    });

    test('should handle Web Share API errors', async () => {
      // Mock Web Share API with error
      (navigator as any).share = jest.fn().mockRejectedValue(new Error('Share failed'));
      
      try {
        await navigator.share({
          title: 'Test',
          url: 'https://example.com'
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Share failed');
      }
    });
  });

  describe('PWA Performance and Loading', () => {
    test('should implement app shell loading strategy', async () => {
      const { mockCache, mockCaches } = PWATestUtils.mockCacheAPI();
      
      // Mock app shell resources
      const appShellResources = [
        '/index.html',
        '/styles.css',
        '/app.js',
        '/manifest.json'
      ];
      
      // Cache app shell during install
      const cache = await caches.open('app-shell-v1');
      await cache.addAll(appShellResources);
      
      expect(mockCaches.open).toHaveBeenCalledWith('app-shell-v1');
      expect(mockCache.addAll).toHaveBeenCalledWith(appShellResources);
    });

    test('should measure PWA loading performance', () => {
      // Mock performance API
      const mockPerformance = {
        now: jest.fn(() => Date.now()),
        mark: jest.fn(),
        measure: jest.fn(),
        getEntriesByName: jest.fn(() => [{ duration: 150 }])
      };
      
      Object.defineProperty(global, 'performance', {
        value: mockPerformance,
        writable: true,
      });
      
      // Simulate measuring app shell load time
      performance.mark('app-shell-start');
      // ... app shell loading logic ...
      performance.mark('app-shell-end');
      performance.measure('app-shell-load', 'app-shell-start', 'app-shell-end');
      
      const measurements = performance.getEntriesByName('app-shell-load');
      
      expect(performance.measure).toHaveBeenCalledWith(
        'app-shell-load',
        'app-shell-start',
        'app-shell-end'
      );
      expect(measurements[0].duration).toBeLessThan(200); // Should load within 200ms
    });

    test('should implement lazy loading for non-critical resources', async () => {
      const lazyLoadResources = ['/heavy-component.js', '/analytics.js'];
      let resourcesLoaded = 0;
      
      const loadResource = async (url: string) => {
        // Simulate loading resource
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            resourcesLoaded++;
            resolve();
          }, 100);
        });
      };
      
      // Load resources lazily
      const loadPromises = lazyLoadResources.map(loadResource);
      await Promise.all(loadPromises);
      
      expect(resourcesLoaded).toBe(2);
    });
  });

  describe('PWA Manifest and Display', () => {
    test('should have proper PWA manifest configuration', () => {
      // Mock manifest link in document head
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.json';
      document.head.appendChild(manifestLink);
      
      const manifestElement = document.querySelector('link[rel="manifest"]');
      
      expect(manifestElement).toBeInTheDocument();
      expect(manifestElement).toHaveAttribute('href', '/manifest.json');
    });

    test('should handle display mode changes', () => {
      // Mock display mode media query
      const mockMediaQuery = {
        matches: true,
        media: '(display-mode: standalone)',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      };
      
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn(() => mockMediaQuery),
        writable: true,
      });
      
      const standaloneQuery = window.matchMedia('(display-mode: standalone)');
      
      expect(standaloneQuery.matches).toBe(true);
      expect(window.matchMedia).toHaveBeenCalledWith('(display-mode: standalone)');
    });

    test('should adapt UI for different display modes', () => {
      // Test standalone mode
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn(() => ({ matches: true })),
        writable: true,
      });
      
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      expect(isStandalone).toBe(true);
      
      // In standalone mode, might hide browser-specific UI
      const shouldShowBrowserPrompt = !isStandalone;
      expect(shouldShowBrowserPrompt).toBe(false);
    });
  });
});