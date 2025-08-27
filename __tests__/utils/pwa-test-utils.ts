/**
 * PWA Testing Utilities
 * Comprehensive testing utilities for Progressive Web App features
 */

// Service Worker testing utilities
export class ServiceWorkerTestUtils {
  private swRegistration: ServiceWorkerRegistration | null = null;

  async registerServiceWorker(
    scriptURL = "/sw.js",
  ): Promise<ServiceWorkerRegistration> {
    if ("serviceWorker" in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register(scriptURL);
        return this.swRegistration;
      } catch (error) {
        throw new Error(`Service Worker registration failed: ${error}`);
      }
    } else {
      throw new Error("Service Worker not supported");
    }
  }

  async waitForServiceWorkerActive(): Promise<ServiceWorker> {
    if (!this.swRegistration) {
      throw new Error("No service worker registration found");
    }

    return new Promise((resolve, reject) => {
      const serviceWorker =
        this.swRegistration!.installing ||
        this.swRegistration!.waiting ||
        this.swRegistration!.active;

      if (serviceWorker?.state === "activated") {
        resolve(serviceWorker);
        return;
      }

      serviceWorker?.addEventListener("statechange", () => {
        if (serviceWorker.state === "activated") {
          resolve(serviceWorker);
        } else if (serviceWorker.state === "redundant") {
          reject(new Error("Service Worker became redundant"));
        }
      });
    });
  }

  async unregisterServiceWorker(): Promise<boolean> {
    if (this.swRegistration) {
      return await this.swRegistration.unregister();
    }
    return false;
  }

  async updateServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (this.swRegistration) {
      return await this.swRegistration.update();
    }
    return null;
  }

  getServiceWorkerState(): string | null {
    if (this.swRegistration?.active) {
      return this.swRegistration.active.state;
    }
    return null;
  }

  async postMessageToServiceWorker(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.swRegistration?.active) {
        reject(new Error("No active service worker"));
        return;
      }

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      this.swRegistration.active.postMessage(message, [messageChannel.port2]);
    });
  }
}

// Install prompt testing
export class InstallPromptTestUtils {
  private deferredPrompt: any = null;

  simulateBeforeInstallPrompt(): Promise<boolean> {
    return new Promise((resolve) => {
      // Create a mock beforeinstallprompt event
      const beforeInstallPromptEvent = new CustomEvent("beforeinstallprompt", {
        cancelable: true,
        detail: {
          prompt: () =>
            Promise.resolve({ outcome: "accepted", platform: "web" }),
          userChoice: Promise.resolve({ outcome: "accepted", platform: "web" }),
        },
      });

      // Mock the deferredPrompt
      this.deferredPrompt = {
        prompt: jest.fn(() => Promise.resolve()),
        userChoice: Promise.resolve({ outcome: "accepted", platform: "web" }),
      };

      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        resolve(true);
      });

      window.dispatchEvent(beforeInstallPromptEvent);
    });
  }

  async triggerInstallPrompt(): Promise<{ outcome: string; platform: string }> {
    if (!this.deferredPrompt) {
      throw new Error("No deferred install prompt available");
    }

    await this.deferredPrompt.prompt();
    return await this.deferredPrompt.userChoice;
  }

  isDeferredPromptAvailable(): boolean {
    return this.deferredPrompt !== null;
  }

  clearDeferredPrompt(): void {
    this.deferredPrompt = null;
  }
}

// Offline testing utilities
export class OfflineTestUtils {
  async simulateOffline(): Promise<void> {
    // Mock navigator.onLine
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      value: false,
    });

    // Dispatch offline event
    window.dispatchEvent(new Event("offline"));
  }

  async simulateOnline(): Promise<void> {
    // Mock navigator.onLine
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      value: true,
    });

    // Dispatch online event
    window.dispatchEvent(new Event("online"));
  }

  async testOfflinePageAccess(url: string): Promise<boolean> {
    try {
      const response = await fetch(url);
      return response.status === 200;
    } catch (error) {
      // If fetch fails (offline), check if service worker serves cached version
      return false;
    }
  }

  async testCacheStorage(): Promise<{
    hasCache: boolean;
    cacheNames: string[];
    totalCachedItems: number;
  }> {
    const cacheNames = await caches.keys();
    let totalItems = 0;

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      totalItems += keys.length;
    }

    return {
      hasCache: cacheNames.length > 0,
      cacheNames,
      totalCachedItems: totalItems,
    };
  }

  async clearAllCaches(): Promise<void> {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  }
}

// Push notification testing
export class PushNotificationTestUtils {
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if ("Notification" in window) {
      return await Notification.requestPermission();
    }
    throw new Error("Notifications not supported");
  }

  async subscribeToPush(vapidPublicKey: string): Promise<PushSubscription> {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey),
    });

    return subscription;
  }

  async unsubscribeFromPush(): Promise<boolean> {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      return await subscription.unsubscribe();
    }
    return false;
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  createMockPushEvent(data: any): Event {
    const mockEvent = new CustomEvent("push", {
      detail: { data: JSON.stringify(data) },
    });
    return mockEvent;
  }
}

// Web App Manifest testing
export class ManifestTestUtils {
  async validateManifest(manifestUrl = "/manifest.json"): Promise<{
    valid: boolean;
    manifest: any;
    errors: string[];
  }> {
    const errors: string[] = [];

    try {
      const response = await fetch(manifestUrl);
      const manifest = await response.json();

      // Required fields validation
      if (!manifest.name && !manifest.short_name) {
        errors.push("Manifest must have either name or short_name");
      }

      if (!manifest.start_url) {
        errors.push("Manifest must have start_url");
      }

      if (!manifest.display) {
        errors.push("Manifest should have display property");
      }

      if (!manifest.icons || manifest.icons.length === 0) {
        errors.push("Manifest should have at least one icon");
      } else {
        // Validate icons
        const hasRequiredSizes = manifest.icons.some(
          (icon: any) =>
            icon.sizes &&
            (icon.sizes.includes("192x192") || icon.sizes.includes("512x512")),
        );
        if (!hasRequiredSizes) {
          errors.push(
            "Manifest should have icons with 192x192 or 512x512 sizes",
          );
        }
      }

      if (!manifest.theme_color) {
        errors.push("Manifest should have theme_color");
      }

      if (!manifest.background_color) {
        errors.push("Manifest should have background_color");
      }

      return {
        valid: errors.length === 0,
        manifest,
        errors,
      };
    } catch (error) {
      return {
        valid: false,
        manifest: null,
        errors: [`Failed to fetch or parse manifest: ${error}`],
      };
    }
  }

  async testIconAccessibility(): Promise<{
    accessible: boolean;
    testedIcons: Array<{ src: string; accessible: boolean; size?: string }>;
  }> {
    const manifestResponse = await fetch("/manifest.json");
    const manifest = await manifestResponse.json();

    const testedIcons = [];

    if (manifest.icons) {
      for (const icon of manifest.icons) {
        try {
          const iconResponse = await fetch(icon.src);
          testedIcons.push({
            src: icon.src,
            accessible: iconResponse.ok,
            size: icon.sizes,
          });
        } catch (error) {
          testedIcons.push({
            src: icon.src,
            accessible: false,
            size: icon.sizes,
          });
        }
      }
    }

    return {
      accessible: testedIcons.every((icon) => icon.accessible),
      testedIcons,
    };
  }
}

// Background sync testing
export class BackgroundSyncTestUtils {
  async registerBackgroundSync(tag: string): Promise<void> {
    const registration = await navigator.serviceWorker.ready;

    if ("sync" in registration) {
      await (registration as any).sync.register(tag);
    } else {
      throw new Error("Background sync not supported");
    }
  }

  async getTags(): Promise<string[]> {
    const registration = await navigator.serviceWorker.ready;

    if ("sync" in registration) {
      return await (registration as any).sync.getTags();
    }
    return [];
  }

  simulateBackgroundSyncEvent(tag: string): CustomEvent {
    return new CustomEvent("sync", {
      detail: { tag },
    });
  }
}

// Complete PWA test suite
export const pwaTestSuite = {
  serviceWorker: ServiceWorkerTestUtils,
  installPrompt: InstallPromptTestUtils,
  offline: OfflineTestUtils,
  pushNotifications: PushNotificationTestUtils,
  manifest: ManifestTestUtils,
  backgroundSync: BackgroundSyncTestUtils,
};
