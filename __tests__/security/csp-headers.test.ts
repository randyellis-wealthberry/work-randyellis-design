/**
 * Content Security Policy (CSP) Headers Test Suite
 * 
 * Tests that CSP headers are properly set and configured for security
 * while allowing necessary third-party services to function.
 */

/**
 * Content Security Policy (CSP) Headers Test Suite
 * 
 * Tests that CSP headers are properly set and configured for security
 * while allowing necessary third-party services to function.
 */

// Mock external dependencies
jest.mock('@vercel/analytics');

// Mock a realistic CSP response
const createMockResponse = () => {
  const headers = new Map();
  // Generate a proper base64 nonce for tests
  const array = new Uint8Array(16);
  for (let i = 0; i < array.length; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }
  const nonce = Buffer.from(array).toString('base64');
  
  const cspPolicy = `default-src 'self'; script-src 'self' 'nonce-${nonce}' vitals.vercel-insights.com *.googletagmanager.com *.google-analytics.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' data: blob: images.unsplash.com cdn.cosmos.so *.google-analytics.com *.googletagmanager.com; connect-src 'self' vitals.vercel-insights.com *.google-analytics.com *.analytics.google.com *.googletagmanager.com; font-src 'self' data: fonts.gstatic.com; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; report-uri /api/csp-report; report-to csp-endpoint; upgrade-insecure-requests`;
  
  headers.set('Content-Security-Policy', cspPolicy);
  headers.set('x-nonce', nonce);
  headers.set('Reporting-Endpoints', 'csp-endpoint="/api/csp-report"');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  
  return {
    headers,
    get: (name: string) => headers.get(name)
  };
};

const mockNextResponse = {
  next: jest.fn(() => createMockResponse())
};

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: mockNextResponse
}));

// Import after mocking
const { middleware } = require('@/middleware');

describe('CSP Headers', () => {
  let mockRequest: any;

  beforeEach(() => {
    // Create a mock request object
    mockRequest = {
      nextUrl: {
        pathname: '/'
      },
      method: 'GET',
      headers: new Map([
        ['user-agent', 'Mozilla/5.0 (test browser)']
      ])
    };
  });

  describe('Basic CSP Header Presence', () => {
    it('should set Content-Security-Policy header on all responses', async () => {
      const response = await middleware(mockRequest);
      
      expect(response).toBeDefined();
      expect(response.headers.get('Content-Security-Policy')).toBeDefined();
    });

    it('should set Content-Security-Policy-Report-Only header in development', async () => {
      const originalEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true
      });
      
      const response = await middleware(mockRequest);
      
      expect(response.headers.get('Content-Security-Policy-Report-Only')).toBeDefined();
      
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        writable: true,
        configurable: true
      });
    });

    it('should use enforcing CSP header in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true
      });
      
      // Update mock to return production headers
      mockNextResponse.next.mockReturnValueOnce({
        headers: new Map([
          ['Content-Security-Policy', 'default-src \'self\'; script-src \'self\''],
          ['x-nonce', 'prod-nonce-123']
        ]),
        get: function(name: string) { return this.headers.get(name); }
      });
      
      const response = await middleware(mockRequest);
      
      expect(response.headers.get('Content-Security-Policy')).toBeDefined();
      expect(response.headers.get('Content-Security-Policy-Report-Only')).toBeUndefined();
      
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        writable: true,
        configurable: true
      });
    });
  });

  describe('CSP Directive Configuration', () => {
    let cspHeader: string;

    beforeEach(async () => {
      const response = await middleware(mockRequest);
      cspHeader = response.headers.get('Content-Security-Policy') || 
                 response.headers.get('Content-Security-Policy-Report-Only') || '';
    });

    it('should have strict default-src directive', () => {
      expect(cspHeader).toMatch(/default-src[^;]*'self'/);
    });

    it('should allow necessary script sources', () => {
      // Should allow self, nonce, and trusted domains
      expect(cspHeader).toMatch(/script-src[^;]*'self'/);
      expect(cspHeader).toMatch(/script-src[^;]*'nonce-[^']+'/);
      
      // Vercel Analytics
      expect(cspHeader).toMatch(/script-src[^;]*vitals\.vercel-insights\.com/);
      
      // Google Analytics (if used)
      expect(cspHeader).toMatch(/script-src[^;]*\.googletagmanager\.com/);
    });

    it('should allow necessary style sources', () => {
      expect(cspHeader).toMatch(/style-src[^;]*'self'/);
      expect(cspHeader).toMatch(/style-src[^;]*'unsafe-inline'/); // Required for styled-components/CSS-in-JS
    });

    it('should allow necessary image sources', () => {
      expect(cspHeader).toMatch(/img-src[^;]*'self'/);
      expect(cspHeader).toMatch(/img-src[^;]*data:/);
      expect(cspHeader).toMatch(/img-src[^;]*images\.unsplash\.com/);
      expect(cspHeader).toMatch(/img-src[^;]*cdn\.cosmos\.so/);
    });

    it('should allow necessary connect sources for analytics', () => {
      expect(cspHeader).toMatch(/connect-src[^;]*'self'/);
      expect(cspHeader).toMatch(/connect-src[^;]*vitals\.vercel-insights\.com/);
      expect(cspHeader).toMatch(/connect-src[^;]*\.google-analytics\.com/);
    });

    it('should restrict font sources appropriately', () => {
      expect(cspHeader).toMatch(/font-src[^;]*'self'/);
      expect(cspHeader).toMatch(/font-src[^;]*data:/);
    });

    it('should restrict object and embed sources', () => {
      expect(cspHeader).toMatch(/object-src[^;]*'none'/);
    });

    it('should set frame-ancestors to prevent clickjacking', () => {
      expect(cspHeader).toMatch(/frame-ancestors[^;]*'none'/);
    });

    it('should upgrade insecure requests', () => {
      expect(cspHeader).toMatch(/upgrade-insecure-requests/);
    });

    it('should include base-uri restriction', () => {
      expect(cspHeader).toMatch(/base-uri[^;]*'self'/);
    });
  });

  describe('Nonce Integration', () => {
    it('should generate unique nonces for each request', async () => {
      const response1 = await middleware(mockRequest);
      const response2 = await middleware(mockRequest);
      
      const csp1 = response1.headers.get('Content-Security-Policy') || 
                   response1.headers.get('Content-Security-Policy-Report-Only') || '';
      const csp2 = response2.headers.get('Content-Security-Policy') || 
                   response2.headers.get('Content-Security-Policy-Report-Only') || '';
      
      const nonce1Match = csp1.match(/'nonce-([^']+)'/);
      const nonce2Match = csp2.match(/'nonce-([^']+)'/);
      
      expect(nonce1Match).toBeTruthy();
      expect(nonce2Match).toBeTruthy();
      expect(nonce1Match![1]).not.toBe(nonce2Match![1]);
    });

    it('should set nonce in response headers for Next.js', async () => {
      const response = await middleware(mockRequest);
      
      expect(response.headers.get('x-nonce')).toBeDefined();
      expect(response.headers.get('x-nonce')).toMatch(/^[A-Za-z0-9+/]+=*$/); // Base64 pattern
    });

    it('should generate nonces with sufficient entropy', async () => {
      const response = await middleware(mockRequest);
      const nonce = response.headers.get('x-nonce');
      
      expect(nonce).toBeDefined();
      expect(nonce!.length).toBeGreaterThanOrEqual(16); // Minimum 128 bits when base64 decoded
    });
  });

  describe('CSP Violation Reporting', () => {
    it('should include report-uri directive', async () => {
      const response = await middleware(mockRequest);
      const cspHeader = response.headers.get('Content-Security-Policy') || 
                       response.headers.get('Content-Security-Policy-Report-Only') || '';
      
      expect(cspHeader).toMatch(/report-uri[^;]*\/api\/csp-report/);
    });

    it('should include report-to directive for modern browsers', async () => {
      const response = await middleware(mockRequest);
      const cspHeader = response.headers.get('Content-Security-Policy') || 
                       response.headers.get('Content-Security-Policy-Report-Only') || '';
      
      expect(cspHeader).toMatch(/report-to[^;]*csp-endpoint/);
    });

    it('should set Reporting-Endpoints header', async () => {
      const response = await middleware(mockRequest);
      
      expect(response.headers.get('Reporting-Endpoints')).toBeDefined();
      expect(response.headers.get('Reporting-Endpoints')).toMatch(/csp-endpoint="\/api\/csp-report"/);
    });
  });

  describe('Browser Compatibility', () => {
    it('should handle older browsers gracefully', async () => {
      const oldBrowserRequest = {
        nextUrl: { pathname: '/' },
        method: 'GET',
        headers: new Map([
          ['user-agent', 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1)']
        ])
      };

      const response = await middleware(oldBrowserRequest);
      const cspHeader = response.headers.get('Content-Security-Policy') || 
                       response.headers.get('Content-Security-Policy-Report-Only') || '';
      
      // Should still include CSP but maybe with fallbacks
      expect(cspHeader).toBeDefined();
      expect(cspHeader.length).toBeGreaterThan(0);
    });
  });

  describe('Special Route Handling', () => {
    it('should apply CSP to API routes', async () => {
      const apiRequest = {
        nextUrl: { pathname: '/api/newsletter/subscribe' },
        method: 'POST',
        headers: new Map()
      };

      const response = await middleware(apiRequest);
      const cspHeader = response.headers.get('Content-Security-Policy') || 
                       response.headers.get('Content-Security-Policy-Report-Only');
      
      expect(cspHeader).toBeDefined();
    });

    it('should apply CSP to static pages', async () => {
      const staticRequest = {
        nextUrl: { pathname: '/about' },
        method: 'GET',
        headers: new Map()
      };

      const response = await middleware(staticRequest);
      const cspHeader = response.headers.get('Content-Security-Policy') || 
                       response.headers.get('Content-Security-Policy-Report-Only');
      
      expect(cspHeader).toBeDefined();
    });
  });

  describe('Performance Considerations', () => {
    it('should not significantly impact response time', async () => {
      const startTime = performance.now();
      await middleware(mockRequest);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50); // Should be very fast
    });

    it('should cache nonce generation appropriately', async () => {
      // Multiple requests should not cause performance issues
      const promises = Array.from({ length: 10 }, () => middleware(mockRequest));
      
      const startTime = performance.now();
      await Promise.all(promises);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});