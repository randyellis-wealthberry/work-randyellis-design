import { NextRequest, NextResponse } from 'next/server';

// Cache header configurations
const CACHE_HEADERS = {
  // Static assets - Long-term caching (1 year)
  staticAssets: {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'CDN-Cache-Control': 'public, max-age=31536000',
    'Vercel-CDN-Cache-Control': 'max-age=31536000',
  },
  
  // Images - Optimized with stale-while-revalidate
  images: {
    'Cache-Control': 'public, max-age=31536000, stale-while-revalidate=86400',
    'CDN-Cache-Control': 'public, max-age=31536000',
    'Vercel-CDN-Cache-Control': 'max-age=31536000',
  },
  
  // Fonts - Preload and cache optimization
  fonts: {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'CDN-Cache-Control': 'public, max-age=31536000',
    'Vercel-CDN-Cache-Control': 'max-age=31536000',
    'Access-Control-Allow-Origin': '*',
  },
  
  // Dynamic content - Short-term caching with revalidation
  dynamic: {
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=3600',
    'CDN-Cache-Control': 'public, max-age=60',
    'Vercel-CDN-Cache-Control': 'max-age=60',
  },
  
  // API responses - Strategic caching
  api: {
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=1800',
    'CDN-Cache-Control': 'public, max-age=300',
    'Vercel-CDN-Cache-Control': 'max-age=300',
  },
};

function applyCacheHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const { pathname } = request.nextUrl;
  
  // Static assets (JS, CSS) - immutable with long cache
  if (pathname.match(/\.(js|css)$/)) {
    Object.entries(CACHE_HEADERS.staticAssets).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  // Images - long cache with stale-while-revalidate
  else if (pathname.match(/\.(jpg|jpeg|png|webp|avif|svg|gif|ico)$/)) {
    Object.entries(CACHE_HEADERS.images).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  // Fonts - long cache with CORS
  else if (pathname.match(/\.(woff|woff2|eot|ttf|otf)$/)) {
    Object.entries(CACHE_HEADERS.fonts).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  // API routes - strategic caching
  else if (pathname.startsWith('/api/')) {
    Object.entries(CACHE_HEADERS.api).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  // Dynamic pages - short cache with revalidation
  else if (!pathname.startsWith('/_next/')) {
    Object.entries(CACHE_HEADERS.dynamic).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  return response;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply cache headers based on request path
  const updatedResponse = applyCacheHeaders(request, response);
  
  // Add security headers for fonts and images
  const { pathname } = request.nextUrl;
  
  if (pathname.match(/\.(woff|woff2|eot|ttf|otf)$/)) {
    updatedResponse.headers.set('Access-Control-Allow-Methods', 'GET');
    updatedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }
  
  // Add Vary header for image optimization
  if (pathname.match(/\.(jpg|jpeg|png|webp|avif|svg|gif)$/)) {
    updatedResponse.headers.set('Vary', 'Accept');
  }
  
  return updatedResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};