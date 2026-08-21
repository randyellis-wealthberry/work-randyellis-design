import * as fs from "fs";
import * as path from "path";
import * as vm from "vm";

describe("Service Worker Kill-Switch", () => {
  let swSource: string;
  let swSizeBytes: number;

  beforeAll(() => {
    const swPath = path.join(process.cwd(), "public/sw.js");
    swSource = fs.readFileSync(swPath, "utf8");
    swSizeBytes = fs.statSync(swPath).size;
  });

  test("registers exactly install and activate listeners, NO fetch listener", () => {
    const handlers: Record<string, Function[]> = {};
    const sandbox = {
      self: {
        addEventListener: jest.fn((type: string, handler: Function) => {
          if (!handlers[type]) {
            handlers[type] = [];
          }
          handlers[type].push(handler);
        }),
        skipWaiting: jest.fn(),
        registration: {
          unregister: jest.fn(async () => true),
        },
        clients: {
          claim: jest.fn(async () => undefined),
          matchAll: jest.fn(async () => []),
        },
      },
      caches: {
        keys: jest.fn(async () => []),
        delete: jest.fn(async () => true),
      },
      console,
    };

    vm.runInNewContext(swSource, sandbox);

    // Must have exactly install and activate listeners
    expect(handlers).toHaveProperty("install");
    expect(handlers).toHaveProperty("activate");
    expect(handlers.install).toHaveLength(1);
    expect(handlers.activate).toHaveLength(1);

    // Must NOT have fetch listener
    expect(handlers).not.toHaveProperty("fetch");
  });

  test("install handler calls self.skipWaiting() once", () => {
    const handlers: Record<string, Function[]> = {};
    const skipWaitingMock = jest.fn();
    const sandbox = {
      self: {
        addEventListener: jest.fn((type: string, handler: Function) => {
          if (!handlers[type]) {
            handlers[type] = [];
          }
          handlers[type].push(handler);
        }),
        skipWaiting: skipWaitingMock,
        registration: {
          unregister: jest.fn(async () => true),
        },
        clients: {
          claim: jest.fn(async () => undefined),
          matchAll: jest.fn(async () => []),
        },
      },
      caches: {
        keys: jest.fn(async () => []),
        delete: jest.fn(async () => true),
      },
      console,
    };

    vm.runInNewContext(swSource, sandbox);

    // Call the install handler
    handlers.install[0]({});

    expect(skipWaitingMock).toHaveBeenCalledTimes(1);
  });

  test("activate handler clears all caches, claims clients, unregisters, and navigates clients", async () => {
    const handlers: Record<string, Function[]> = {};
    const mockCacheNames = [
      "workbox-precache-v2-https://work.randyellis.design/",
      "static-image-assets",
    ];
    const mockClients = [
      {
        url: "https://work.randyellis.design/projects",
        navigate: jest.fn(async () => null),
      },
      {
        url: "https://work.randyellis.design/about",
        navigate: jest.fn(async () => null),
      },
    ];

    const cacheKeysEMock = jest.fn(async () => mockCacheNames);
    const cacheDeleteMock = jest.fn(async () => true);
    const claimMock = jest.fn(async () => undefined);
    const unregisterMock = jest.fn(async () => true);
    const matchAllMock = jest.fn(async () => mockClients);

    const sandbox = {
      self: {
        addEventListener: jest.fn((type: string, handler: Function) => {
          if (!handlers[type]) {
            handlers[type] = [];
          }
          handlers[type].push(handler);
        }),
        skipWaiting: jest.fn(),
        registration: {
          unregister: unregisterMock,
        },
        clients: {
          claim: claimMock,
          matchAll: matchAllMock,
        },
      },
      caches: {
        keys: cacheKeysEMock,
        delete: cacheDeleteMock,
      },
      console,
    };

    vm.runInNewContext(swSource, sandbox);

    // Call the activate handler with waitUntil
    let pending: Promise<any> | undefined;
    const event = {
      waitUntil: (promise: Promise<any>) => {
        pending = promise;
      },
    };

    handlers.activate[0](event);

    // Wait for the async work to complete
    expect(pending).toBeDefined();
    await pending;

    // Verify cache deletion
    expect(cacheKeysEMock).toHaveBeenCalledTimes(1);
    expect(cacheDeleteMock).toHaveBeenCalledTimes(mockCacheNames.length);
    mockCacheNames.forEach((cacheName) => {
      expect(cacheDeleteMock).toHaveBeenCalledWith(cacheName);
    });

    // Verify clients.claim() was called
    expect(claimMock).toHaveBeenCalledTimes(1);

    // Verify unregister was called
    expect(unregisterMock).toHaveBeenCalledTimes(1);

    // Verify navigate was called on each client
    expect(matchAllMock).toHaveBeenCalledWith({ type: "window" });
    mockClients.forEach((client) => {
      expect(client.navigate).toHaveBeenCalledWith(client.url);
    });
  });

  test("source contains none of the forbidden Workbox tokens", () => {
    const forbiddenTokens = [
      "precacheAndRoute",
      "importScripts",
      "workbox",
      "StaleWhileRevalidate",
      "fallback-",
    ];

    forbiddenTokens.forEach((token) => {
      expect(swSource).not.toContain(token);
    });
  });

  test("file size is under 2,000 bytes", () => {
    expect(swSizeBytes).toBeLessThan(2000);
  });
});
