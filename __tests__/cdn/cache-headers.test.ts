/**
 * @jest-environment jsdom
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock CDN configuration utilities
const mockCacheHeaders = {
  // Static assets - Long-term caching (1 year)
  getStaticAssetHeaders: () => ({
    'Cache-Control': 'public, max-age=31536000, immutable',
    'CDN-Cache-Control': 'public, max-age=31536000',
    'Vercel-CDN-Cache-Control': 'max-age=31536000',
  }),
  
  // Images - Optimized with stale-while-revalidate
  getImageHeaders: () => ({
    'Cache-Control': 'public, max-age=31536000, stale-while-revalidate=86400',
    'CDN-Cache-Control': 'public, max-age=31536000',
    'Vercel-CDN-Cache-Control': 'max-age=31536000',
  }),
  
  // Fonts - Preload and cache optimization
  getFontHeaders: () => ({
    'Cache-Control': 'public, max-age=31536000, immutable',
    'CDN-Cache-Control': 'public, max-age=31536000',
    'Vercel-CDN-Cache-Control': 'max-age=31536000',
    'Access-Control-Allow-Origin': '*',
  }),
  
  // Dynamic content - Short-term caching with revalidation
  getDynamicHeaders: () => ({
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=3600',
    'CDN-Cache-Control': 'public, max-age=60',
    'Vercel-CDN-Cache-Control': 'max-age=60',
  }),
  
  // API responses - Strategic caching
  getAPIHeaders: () => ({
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=1800',
    'CDN-Cache-Control': 'public, max-age=300',
    'Vercel-CDN-Cache-Control': 'max-age=300',
  }),
};

// Mock middleware function for cache headers
const applyCacheHeaders = (request: NextRequest, response: NextResponse) => {
  const { pathname } = request.nextUrl;
  
  // Static assets (JS, CSS)
  if (pathname.match(/\.(js|css)$/)) {
    const headers = mockCacheHeaders.getStaticAssetHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  // Images
  if (pathname.match(/\.(jpg|jpeg|png|webp|avif|svg|gif|ico)$/)) {
    const headers = mockCacheHeaders.getImageHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  // Fonts
  if (pathname.match(/\.(woff|woff2|eot|ttf|otf)$/)) {
    const headers = mockCacheHeaders.getFontHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  // API routes
  if (pathname.startsWith('/api/')) {
    const headers = mockCacheHeaders.getAPIHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  return response;
};

describe('CDN Cache Headers', () => {
  describe('Static Assets', () => {
    it('should set long-term cache headers for JavaScript files', () => {
      const request = { nextUrl: { pathname: '/_next/static/chunks/app.js' } } as NextRequest;
      const response = new NextResponse();
      
      const result = applyCacheHeaders(request, response);
      
      expect(result.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
      expect(result.headers.get('CDN-Cache-Control')).toBe('public, max-age=31536000');
      expect(result.headers.get('Vercel-CDN-Cache-Control')).toBe('max-age=31536000');
    });
    
    it('should set long-term cache headers for CSS files', () => {
      const request = { nextUrl: { pathname: '/_next/static/css/app.css' } } as NextRequest;
      const response = new NextResponse();
      
      const result = applyCacheHeaders(request, response);
      
      expect(result.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
      expect(result.headers.get('CDN-Cache-Control')).toBe('public, max-age=31536000');
      expect(result.headers.get('Vercel-CDN-Cache-Control')).toBe('max-age=31536000');
    });
    
    it('should include immutable directive for static assets', () => {
      const request = { nextUrl: { pathname: '/_next/static/chunks/main.js' } } as NextRequest;
      const response = new NextResponse();
      
      const result = applyCacheHeaders(request, response);
      
      expect(result.headers.get('Cache-Control')).toContain('immutable');
    });
  });
  
  describe('Image Assets', () => {
    it('should set optimized cache headers for images with stale-while-revalidate', () => {
      const request = { nextUrl: { pathname: '/images/profile.jpg' } } as NextRequest;
      const response = new NextResponse();
      
      const result = applyCacheHeaders(request, response);
      
      expect(result.headers.get('Cache-Control')).toBe('public, max-age=31536000, stale-while-revalidate=86400');
      expect(result.headers.get('CDN-Cache-Control')).toBe('public, max-age=31536000');
    });
    
    it('should handle WebP images with appropriate headers', () => {
      const request = { nextUrl: { pathname: '/images/hero.webp' } } as NextRequest;
      const response = new NextResponse();
      
      const result = applyCacheHeaders(request, response);
      
      expect(result.headers.get('Cache-Control')).toContain('stale-while-revalidate');
      expect(result.headers.get('Vercel-CDN-Cache-Control')).toBe('max-age=31536000');
    });
    
    it('should handle AVIF images with appropriate headers', () => {
      const request = { nextUrl: { pathname: '/images/banner.avif' } } as NextRequest;
      const response = new NextResponse();
      
      const result = applyCacheHeaders(request, response);
      
      expect(result.headers.get('Cache-Control')).toContain('public, max-age=31536000');
    });
  });
  
  describe('Font Assets', () => {
    it('should set long-term cache headers for WOFF2 fonts', () => {
      const request = { nextUrl: { pathname: '/fonts/geist.woff2' } } as NextRequest;
      const response = new NextResponse();
      
      const result = applyCacheHeaders(request, response);
      
      expect(result.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
      expect(result.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
    
    it('should include CORS headers for fonts', () => {
      const request = { nextUrl: { pathname: '/fonts/geist-mono.woff' } } as NextRequest;
      const response = new NextResponse();
      
      const result = applyCacheHeaders(request, response);
      
      expect(result.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(result.headers.get('CDN-Cache-Control')).toBe('public, max-age=31536000');
    });
  });
  
  describe('API Routes', () => {
    it('should set strategic cache headers for API responses', () => {
      const request = { nextUrl: { pathname: '/api/projects' } } as NextRequest;
      const response = new NextResponse();
      
      const result = applyCacheHeaders(request, response);
      
      expect(result.headers.get('Cache-Control')).toBe('public, max-age=300, stale-while-revalidate=1800');
      expect(result.headers.get('CDN-Cache-Control')).toBe('public, max-age=300');
    });
    
    it('should handle newsletter API with appropriate caching', () => {
      const request = { nextUrl: { pathname: '/api/newsletter' } } as NextRequest;
      const response = new NextResponse();
      
      const result = applyCacheHeaders(request, response);
      
      expect(result.headers.get('Vercel-CDN-Cache-Control')).toBe('max-age=300');
    });
  });
  
  describe('Cache Header Utilities', () => {
    it('should provide correct static asset headers configuration', () => {
      const headers = mockCacheHeaders.getStaticAssetHeaders();
      
      expect(headers['Cache-Control']).toBe('public, max-age=31536000, immutable');
      expect(headers['CDN-Cache-Control']).toBe('public, max-age=31536000');
      expect(headers['Vercel-CDN-Cache-Control']).toBe('max-age=31536000');
    });
    
    it('should provide correct image headers configuration', () => {
      const headers = mockCacheHeaders.getImageHeaders();
      
      expect(headers['Cache-Control']).toBe('public, max-age=31536000, stale-while-revalidate=86400');
    });
    
    it('should provide correct font headers configuration', () => {
      const headers = mockCacheHeaders.getFontHeaders();
      
      expect(headers['Access-Control-Allow-Origin']).toBe('*');
      expect(headers['Cache-Control']).toContain('immutable');
    });
    
    it('should provide correct API headers configuration', () => {
      const headers = mockCacheHeaders.getAPIHeaders();
      
      expect(headers['Cache-Control']).toContain('stale-while-revalidate=1800');
      expect(headers['CDN-Cache-Control']).toBe('public, max-age=300');
    });
  });
  
  describe('Cache Invalidation Strategies', () => {
    it('should use appropriate max-age values for different content types', () => {
      const staticHeaders = mockCacheHeaders.getStaticAssetHeaders();
      const dynamicHeaders = mockCacheHeaders.getDynamicHeaders();
      const apiHeaders = mockCacheHeaders.getAPIHeaders();
      
      // Static assets should have 1 year cache
      expect(staticHeaders['Cache-Control']).toContain('max-age=31536000');
      
      // Dynamic content should have 1 minute cache
      expect(dynamicHeaders['Cache-Control']).toContain('max-age=60');
      
      // API responses should have 5 minute cache
      expect(apiHeaders['Cache-Control']).toContain('max-age=300');
    });
    
    it('should implement stale-while-revalidate for appropriate content', () => {
      const imageHeaders = mockCacheHeaders.getImageHeaders();
      const dynamicHeaders = mockCacheHeaders.getDynamicHeaders();
      
      expect(imageHeaders['Cache-Control']).toContain('stale-while-revalidate=86400');
      expect(dynamicHeaders['Cache-Control']).toContain('stale-while-revalidate=3600');
    });
  });
});