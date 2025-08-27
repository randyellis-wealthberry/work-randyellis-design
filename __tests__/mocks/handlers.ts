/**
 * Mock Service Worker Handlers
 * API mocking for newsletter and other service testing
 */

import { http, HttpResponse } from "msw";

// Newsletter API handlers
export const newsletterHandlers = [
  // Subscribe to newsletter
  http.post("/api/newsletter/subscribe", async ({ request }) => {
    const body = (await request.json()) as { email: string };

    // Simulate validation
    if (!body.email || !body.email.includes("@")) {
      return new HttpResponse(
        JSON.stringify({
          error: "Invalid email address",
          code: "INVALID_EMAIL",
        }),
        { status: 400 },
      );
    }

    // Simulate rate limiting
    const userAgent = request.headers.get("user-agent");
    if (userAgent?.includes("rate-limit-test")) {
      return new HttpResponse(
        JSON.stringify({
          error: "Rate limit exceeded",
          code: "RATE_LIMIT_EXCEEDED",
        }),
        { status: 429 },
      );
    }

    // Simulate server error for chaos testing
    if (body.email.includes("server-error")) {
      return new HttpResponse(
        JSON.stringify({
          error: "Internal server error",
          code: "INTERNAL_ERROR",
        }),
        { status: 500 },
      );
    }

    // Simulate network timeout
    if (body.email.includes("timeout-test")) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }

    // Successful subscription
    return HttpResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
      subscriber: {
        email: body.email,
        subscribedAt: new Date().toISOString(),
        id: `sub_${Math.random().toString(36).substr(2, 9)}`,
      },
    });
  }),

  // Get newsletter stats
  http.get("/api/newsletter/stats", () => {
    return HttpResponse.json({
      totalSubscribers: 1247,
      recentSubscribers: 89,
      growthRate: 12.5,
      lastUpdated: new Date().toISOString(),
    });
  }),

  // Unsubscribe from newsletter
  http.post("/api/newsletter/unsubscribe", async ({ request }) => {
    const body = (await request.json()) as { email: string; token?: string };

    if (!body.email) {
      return new HttpResponse(
        JSON.stringify({
          error: "Email address required",
          code: "EMAIL_REQUIRED",
        }),
        { status: 400 },
      );
    }

    return HttpResponse.json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  }),

  // Export newsletter data (for testing admin features)
  http.get("/api/newsletter/export", () => {
    return HttpResponse.json({
      subscribers: [
        {
          email: "test1@example.com",
          subscribedAt: "2023-01-15T10:00:00Z",
          status: "active",
        },
        {
          email: "test2@example.com",
          subscribedAt: "2023-01-16T11:00:00Z",
          status: "active",
        },
      ],
      totalCount: 2,
      exportedAt: new Date().toISOString(),
    });
  }),

  // Newsletter analytics
  http.get("/api/newsletter/analytics", () => {
    return HttpResponse.json({
      subscriptions: {
        today: 5,
        thisWeek: 34,
        thisMonth: 156,
      },
      sources: {
        direct: 45,
        blog: 32,
        projects: 23,
      },
      engagement: {
        openRate: 68.5,
        clickRate: 12.3,
        unsubscribeRate: 2.1,
      },
    });
  }),
];

// CDN optimization handlers
export const cdnHandlers = [
  http.get("/api/cdn/optimize", ({ request }) => {
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get("url");
    const width = url.searchParams.get("w");
    const height = url.searchParams.get("h");
    const quality = url.searchParams.get("q") || "80";

    return HttpResponse.json({
      originalUrl: imageUrl,
      optimizedUrl: `https://cdn.example.com/optimized/${width}x${height}/q${quality}/${encodeURIComponent(imageUrl || "")}`,
      size: {
        original: 2048000,
        optimized: 512000,
        savings: 75,
      },
      format: "webp",
      cached: false,
    });
  }),
];

// Analytics handlers for testing
export const analyticsHandlers = [
  http.post("/api/analytics/track", async ({ request }) => {
    const body = (await request.json()) as {
      event: string;
      properties: Record<string, any>;
    };

    // Simulate analytics validation
    if (!body.event) {
      return new HttpResponse(
        JSON.stringify({ error: "Event name required" }),
        { status: 400 },
      );
    }

    return HttpResponse.json({
      success: true,
      eventId: `evt_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    });
  }),

  http.get("/api/analytics/stats", () => {
    return HttpResponse.json({
      pageViews: {
        today: 892,
        week: 6345,
        month: 28901,
      },
      uniqueVisitors: {
        today: 234,
        week: 1789,
        month: 8456,
      },
      topPages: [
        { path: "/", views: 1234 },
        { path: "/projects/echo", views: 567 },
        { path: "/about", views: 345 },
      ],
      devices: {
        desktop: 65,
        mobile: 28,
        tablet: 7,
      },
    });
  }),
];

// Error simulation handlers for chaos testing
export const chaosHandlers = [
  // Simulate random server errors
  http.all("*/chaos/server-error", () => {
    return new HttpResponse(null, { status: 500 });
  }),

  // Simulate network timeouts
  http.all("*/chaos/timeout", async () => {
    await new Promise((resolve) => setTimeout(resolve, 30000));
    return HttpResponse.json({ success: true });
  }),

  // Simulate intermittent failures
  http.all("*/chaos/intermittent", () => {
    if (Math.random() < 0.3) {
      return new HttpResponse(null, { status: 503 });
    }
    return HttpResponse.json({ success: true });
  }),

  // Simulate slow responses
  http.all("*/chaos/slow", async () => {
    await new Promise((resolve) =>
      setTimeout(resolve, 3000 + Math.random() * 2000),
    );
    return HttpResponse.json({ success: true });
  }),
];

// Combine all handlers
export const handlers = [
  ...newsletterHandlers,
  ...cdnHandlers,
  ...analyticsHandlers,
  ...chaosHandlers,
];
