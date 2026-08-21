/**
 * Service Worker Kill-Switch
 *
 * Replaces stale next-pwa/Workbox SW. Unregisters on first activation,
 * clears all caches for returning visitors.
 *
 * CRITICAL: MUST NEVER gain a fetch handler. Exists only to clean up
 * and remove itself. Delete once analytics show no stale-SW traffic.
 *
 * Lifecycle: install → skipWaiting → activate → clear caches →
 * unregister → reload clients → done.
 */

self.addEventListener("install", (event) => {
  // Take over immediately, don't wait for existing clients to close
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        // 1. Clear all caches (removes stale Workbox precache)
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));

        // 2. Claim all clients to ensure immediate takeover
        await self.clients.claim();

        // 3. Unregister this service worker (it's done its job)
        await self.registration.unregister();

        // 4. Navigate/reload all open windows to stop running stale JS
        const clients = await self.clients.matchAll({ type: "window" });
        await Promise.all(
          clients.map((client) =>
            client.navigate(client.url).catch(() => undefined),
          ),
        );
      } catch (error) {
        // Swallow errors — a failed cleanup must never throw out of activate
        // The browser will retry on the next page load
        console.error("SW kill-switch cleanup failed:", error);
      }
    })(),
  );
});

// No fetch handler — this SW does nothing but clean up
