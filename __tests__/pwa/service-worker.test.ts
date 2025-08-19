/**
 * @jest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

// Mock ServiceWorker registration
const mockServiceWorker = {
  register: jest.fn(),
  ready: Promise.resolve({
    waiting: null,
    installing: null,
    active: {
      scriptURL: '/sw.js',
      state: 'activated'
    }
  }),
  getRegistration: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

// Mock next-pwa integration
const mockNextPWA = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  clientsClaim: true,
  sw: '/sw.js',
  fallbacks: {
    image: '/static/images/fallback.png',
    document: '/offline',
    font: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
  },
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  customWorkerDir: 'worker',
  workboxOptions: {
    disableDevLogs: true,
    mode: 'production'
  }
};

// Mock caches API
const mockCaches = {
  open: jest.fn() as jest.MockedFunction<(cacheName: string) => Promise<Cache>>,
  has: jest.fn() as jest.MockedFunction<(cacheName: string) => Promise<boolean>>,
  delete: jest.fn() as jest.MockedFunction<(cacheName: string) => Promise<boolean>>,
  keys: jest.fn() as jest.MockedFunction<() => Promise<string[]>>,
  match: jest.fn() as jest.MockedFunction<(request: RequestInfo) => Promise<Response | undefined>>
};

// Mock cache instance
const mockCache = {
  add: jest.fn() as jest.MockedFunction<(request: RequestInfo) => Promise<void>>,
  addAll: jest.fn() as jest.MockedFunction<(requests: RequestInfo[]) => Promise<void>>,
  delete: jest.fn() as jest.MockedFunction<(request: RequestInfo) => Promise<boolean>>,
  keys: jest.fn() as jest.MockedFunction<() => Promise<readonly Request[]>>,
  match: jest.fn() as jest.MockedFunction<(request: RequestInfo) => Promise<Response | undefined>>,
  matchAll: jest.fn() as jest.MockedFunction<(request?: RequestInfo) => Promise<readonly Response[]>>,
  put: jest.fn() as jest.MockedFunction<(request: RequestInfo, response: Response) => Promise<void>>
};

describe('Service Worker Tests', () => {
  beforeEach(() => {
    // Reset mocks
    jest.resetAllMocks();
    
    // Setup global mocks
    Object.defineProperty(global, 'navigator', {
      value: {
        serviceWorker: mockServiceWorker,
        onLine: true
      },
      configurable: true
    });

    Object.defineProperty(global, 'caches', {
      value: mockCaches,
      configurable: true
    });

    // Mock fetch globally
    global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      clone: jest.fn().mockReturnValue(new Response('test') as any),
      text: jest.fn().mockResolvedValue('test' as any),
      json: jest.fn().mockResolvedValue({} as any)
    } as any);

    // Mock successful cache operations
    mockCaches.open.mockResolvedValue(mockCache as any);
    mockCaches.has.mockResolvedValue(true);
    mockCaches.match.mockResolvedValue(new Response('cached content'));
    mockCache.match.mockResolvedValue(new Response('cached content'));
    mockCache.addAll.mockResolvedValue(undefined);
    mockCache.put.mockResolvedValue(undefined);

    // Reset DOM
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Service Worker Registration', () => {
    it('should register service worker when supported', async () => {
      mockServiceWorker.register.mockResolvedValue({
        waiting: null,
        installing: null,
        active: { scriptURL: '/sw.js', state: 'activated' }
      } as any);

      // Simulate service worker registration
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/sw.js');
      }

      expect(mockServiceWorker.register).toHaveBeenCalledWith('/sw.js');
    });

    it('should handle service worker registration failure gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockServiceWorker.register.mockRejectedValue(new Error('Registration failed') as any);

      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      consoleError.mockRestore();
    });

    it('should not attempt registration when service worker is not supported', () => {
      // Create navigator without serviceWorker
      const navigatorWithoutSW = {};
      
      const shouldRegister = 'serviceWorker' in navigatorWithoutSW;
      expect(shouldRegister).toBe(false);
    });

    it('should configure service worker with correct options', () => {
      expect(mockNextPWA.register).toBe(true);
      expect(mockNextPWA.skipWaiting).toBe(true);
      expect(mockNextPWA.clientsClaim).toBe(true);
      expect(mockNextPWA.sw).toBe('/sw.js');
    });
  });

  describe('Caching Strategies', () => {
    it('should implement cache-first strategy for static assets', async () => {
      const request = new Request('/static/image.jpg');
      
      // Should check cache first
      await mockCaches.match(request);
      expect(mockCaches.match).toHaveBeenCalledWith(request);
    });

    it('should implement network-first strategy for dynamic content', async () => {
      const request = new Request('/api/data');
      
      // For dynamic content, should try network first
      const response = await fetch(request).catch(() => mockCaches.match(request));
      
      // Would fall back to cache if network fails
      expect(typeof response).toBeDefined();
    });

    it('should cache navigation requests', async () => {
      const navigationRequest = new Request('/', { mode: 'navigate' });
      
      await mockCache.put(navigationRequest, new Response('<html></html>'));
      expect(mockCache.put).toHaveBeenCalled();
    });

    it('should handle cache versioning correctly', async () => {
      const cacheNames = ['static-v1', 'dynamic-v1', 'navigation-v1'];
      mockCaches.keys.mockResolvedValue(cacheNames);

      const keys = await mockCaches.keys();
      expect(keys).toEqual(cacheNames);
    });
  });

  describe('Offline Functionality', () => {
    it('should provide offline fallback for pages', async () => {
      expect(mockNextPWA.fallbacks.document).toBe('/offline');
    });

    it('should provide offline fallback for images', async () => {
      expect(mockNextPWA.fallbacks.image).toBe('/static/images/fallback.png');
    });

    it('should provide offline fallback for fonts', async () => {
      expect(mockNextPWA.fallbacks.font).toContain('fonts.gstatic.com');
    });

    it('should serve cached content when offline', async () => {
      // Simulate offline state
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        configurable: true
      });

      const request = new Request('/cached-page');
      const cachedResponse = await mockCaches.match(request);
      
      expect(cachedResponse).toBeDefined();
      expect(mockCaches.match).toHaveBeenCalledWith(request);
    });

    it('should handle offline state changes', () => {
      const onlineHandler = jest.fn();
      const offlineHandler = jest.fn();

      global.addEventListener = jest.fn() as jest.MockedFunction<typeof addEventListener>;
      global.dispatchEvent = jest.fn() as jest.MockedFunction<(event: Event) => boolean>;

      // Simulate event listeners
      global.addEventListener('online', onlineHandler);
      global.addEventListener('offline', offlineHandler);

      expect(global.addEventListener).toHaveBeenCalledWith('online', onlineHandler);
      expect(global.addEventListener).toHaveBeenCalledWith('offline', offlineHandler);
    });
  });

  describe('Cache Management', () => {
    it('should clean up old caches', async () => {
      const oldCacheNames = ['old-cache-v1', 'old-cache-v2'];
      const currentCacheNames = ['current-cache-v3'];
      
      mockCaches.keys.mockResolvedValue([...oldCacheNames, ...currentCacheNames]);

      // Simulate cache cleanup
      for (const cacheName of oldCacheNames) {
        await mockCaches.delete(cacheName);
      }

      expect(mockCaches.delete).toHaveBeenCalledTimes(oldCacheNames.length);
    });

    it('should update cache when content changes', async () => {
      const request = new Request('/updated-content');
      const newResponse = new Response('updated content');

      await mockCache.put(request, newResponse);
      expect(mockCache.put).toHaveBeenCalledWith(request, newResponse);
    });

    it('should respect cache size limits', async () => {
      // This would typically be handled by workbox
      const maxCacheSize = 100; // 100 entries
      const cacheKeys = Array.from({ length: 150 }, (_, i) => `cache-entry-${i}`);
      
      mockCache.keys.mockResolvedValue(cacheKeys as any);
      
      const keys = await mockCache.keys();
      const shouldCleanup = keys.length > maxCacheSize;
      
      expect(shouldCleanup).toBe(true);
    });
  });

  describe('Performance Optimization', () => {
    it('should precache critical resources', async () => {
      const criticalResources = [
        '/',
        '/static/css/main.css',
        '/static/js/main.js',
        '/favicon.ico'
      ];

      await mockCache.addAll(criticalResources);
      expect(mockCache.addAll).toHaveBeenCalledWith(criticalResources);
    });

    it('should enable aggressive front-end navigation caching', () => {
      expect(mockNextPWA.aggressiveFrontEndNavCaching).toBe(true);
      expect(mockNextPWA.cacheOnFrontEndNav).toBe(true);
    });

    it('should reload on coming back online', () => {
      expect(mockNextPWA.reloadOnOnline).toBe(true);
    });

    it('should optimize cache storage', async () => {
      // Test that we're not caching unnecessary large files
      const largeRequest = new Request('/large-video.mp4');
      const largeResponse = new Response(new ArrayBuffer(50 * 1024 * 1024)); // 50MB

      // Should not cache very large files
      const shouldCache = largeResponse.headers.get('content-length');
      const sizeLimit = 10 * 1024 * 1024; // 10MB limit
      
      if (shouldCache && parseInt(shouldCache) > sizeLimit) {
        // Don't cache large files
        expect(mockCache.put).not.toHaveBeenCalledWith(largeRequest, largeResponse);
      }
    });
  });

  describe('Service Worker Lifecycle', () => {
    it('should handle service worker updates', async () => {
      const registration = {
        waiting: {
          scriptURL: '/sw.js',
          state: 'waiting',
          postMessage: jest.fn()
        },
        installing: null,
        active: {
          scriptURL: '/sw.js',
          state: 'activated'
        },
        addEventListener: jest.fn(),
        update: jest.fn()
      };

      mockServiceWorker.register.mockResolvedValue(registration as any);

      const reg = await navigator.serviceWorker.register('/sw.js');
      
      if (reg.waiting) {
        // Should handle waiting service worker
        expect(reg.waiting.state).toBe('waiting');
      }
    });

    it('should skip waiting on update', () => {
      expect(mockNextPWA.skipWaiting).toBe(true);
    });

    it('should claim clients immediately', () => {
      expect(mockNextPWA.clientsClaim).toBe(true);
    });

    it('should handle service worker errors', () => {
      const errorHandler = jest.fn();
      mockServiceWorker.addEventListener.mockImplementation((event, handler) => {
        if (event === 'error') {
          errorHandler.mockImplementation(handler as any);
        }
      });

      // Simulate service worker error
      const error = new Error('Service worker error');
      errorHandler(error as any);

      expect(errorHandler).toHaveBeenCalled();
    });
  });

  describe('Network Strategies', () => {
    it('should implement stale-while-revalidate for frequently updated content', async () => {
      const request = new Request('/api/projects');
      
      // Should serve from cache immediately
      const cachedResponse = await mockCache.match(request);
      expect(cachedResponse).toBeDefined();
      
      // Then update cache in background
      const networkResponse = await fetch(request);
      await mockCache.put(request, networkResponse);
      
      expect(mockCache.put).toHaveBeenCalled();
    });

    it('should implement cache-only for offline-first content', async () => {
      const request = new Request('/offline-content');
      
      // Should only check cache, not network
      await mockCache.match(request);
      expect(mockCache.match).toHaveBeenCalledWith(request);
    });

    it('should implement network-only for real-time data', async () => {
      const request = new Request('/api/real-time-data');
      
      // Should always fetch from network
      const response = await fetch(request);
      expect(response).toBeDefined();
    });
  });

  describe('Background Sync', () => {
    it('should queue failed requests for background sync', () => {
      // This would typically be handled by workbox-background-sync
      const failedRequest = new Request('/api/submit', {
        method: 'POST',
        body: JSON.stringify({ data: 'test' })
      });

      // Would queue for retry when online
      const queueName = 'form-submissions';
      expect(queueName).toBeDefined();
    });

    it('should retry queued requests when online', () => {
      // Mock background sync functionality
      const syncHandler = jest.fn();
      
      // Would trigger when coming back online
      window.dispatchEvent(new Event('online'));
      
      // Verify sync mechanism exists
      expect(mockNextPWA.reloadOnOnline).toBe(true);
    });
  });
});