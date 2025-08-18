/**
 * CDN Optimization Edge Function
 * Provides dynamic CDN optimization strategies and cache warming
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getCacheHeaders,
  generateOptimizedImageUrl,
  isAllowedImageSource,
} from "@/lib/cdn/optimization";

export const runtime = "edge";

interface OptimizationRequest {
  type: "image" | "font" | "static";
  url: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "avif" | "png" | "jpg";
}

export async function POST(request: NextRequest) {
  try {
    const body: OptimizationRequest = await request.json();
    const { type, url, width, height, quality, format } = body;

    // Validate request
    if (!type || !url) {
      return NextResponse.json(
        { error: "Type and URL are required" },
        { status: 400 },
      );
    }

    let optimizedUrl = url;
    let cacheHeaders = {};

    switch (type) {
      case "image":
        if (!isAllowedImageSource(url)) {
          return NextResponse.json(
            { error: "Image source not allowed" },
            { status: 403 },
          );
        }

        optimizedUrl = generateOptimizedImageUrl(url, {
          width,
          height,
          quality: quality || 75,
          format,
        });

        cacheHeaders = getCacheHeaders("IMAGES");
        break;

      case "font":
        cacheHeaders = getCacheHeaders("FONTS");
        break;

      case "static":
        cacheHeaders = getCacheHeaders("STATIC_ASSETS");
        break;

      default:
        return NextResponse.json(
          { error: "Invalid optimization type" },
          { status: 400 },
        );
    }

    const response = NextResponse.json({
      originalUrl: url,
      optimizedUrl,
      cacheStrategy: cacheHeaders,
      timestamp: new Date().toISOString(),
    });

    // Apply cache headers to the response
    Object.entries(cacheHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("CDN optimization error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    switch (action) {
      case "health":
        return NextResponse.json({
          status: "healthy",
          timestamp: new Date().toISOString(),
          cdn: "vercel",
          region: process.env.VERCEL_REGION || "unknown",
        });

      case "cache-status":
        const url = searchParams.get("url");
        if (!url) {
          return NextResponse.json(
            { error: "URL parameter required" },
            { status: 400 },
          );
        }

        // Check cache status for a given URL
        const cacheStatus = await checkCacheStatus(url);
        return NextResponse.json(cacheStatus);

      case "warm-cache":
        const urls = searchParams.get("urls")?.split(",") || [];
        if (urls.length === 0) {
          return NextResponse.json(
            { error: "URLs parameter required" },
            { status: 400 },
          );
        }

        // Warm cache for multiple URLs
        const warmResults = await warmCache(urls);
        return NextResponse.json(warmResults);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("CDN API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function checkCacheStatus(url: string) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const cacheControl = response.headers.get("cache-control");
    const cdnCache = response.headers.get("x-vercel-cache");
    const age = response.headers.get("age");

    return {
      url,
      cached: !!cdnCache,
      cacheControl,
      cdnCache,
      age: age ? parseInt(age) : null,
      timestamp: new Date().toISOString(),
    };
  } catch {
    return {
      url,
      error: "Failed to check cache status",
      timestamp: new Date().toISOString(),
    };
  }
}

async function warmCache(urls: string[]) {
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        return {
          url,
          status: response.status,
          warmed: response.ok,
        };
      } catch {
        return {
          url,
          error: "Failed to warm cache",
          warmed: false,
        };
      }
    }),
  );

  return {
    total: urls.length,
    warmed: results.filter((r) => r.status === "fulfilled" && r.value.warmed)
      .length,
    failed: results.filter((r) => r.status === "rejected").length,
    results: results.map((r) =>
      r.status === "fulfilled" ? r.value : { error: "Promise rejected" },
    ),
    timestamp: new Date().toISOString(),
  };
}
