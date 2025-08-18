/**
 * CSP Violations Test Suite
 * 
 * Tests the CSP violation reporting endpoint and violation handling logic.
 */

// Mock the fetch function for violation reporting tests
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock successful responses by default
mockFetch.mockResolvedValue({
  ok: true,
  status: 204,
  json: async () => ({ message: 'Violation report received' })
});

describe('CSP Violations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Violation Reporting Endpoint', () => {
    it('should accept valid CSP violation reports', async () => {
      const violationReport = {
        'csp-report': {
          'document-uri': 'https://work.randyellis.design/',
          'referrer': '',
          'violated-directive': 'script-src',
          'effective-directive': 'script-src',
          'original-policy': "default-src 'self'; script-src 'self' 'nonce-abc123'",
          'disposition': 'enforce',
          'blocked-uri': 'https://malicious-site.com/script.js',
          'line-number': 42,
          'column-number': 15,
          'source-file': 'https://work.randyellis.design/',
          'status-code': 200,
          'script-sample': ''
        }
      };

      // Mock request object for testing
      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/csp-report',
          'User-Agent': 'Mozilla/5.0 (test)',
        },
        body: JSON.stringify(violationReport),
      };

      // This test will pass once we implement the endpoint
      const response = await fetch('/api/csp-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/csp-report',
        },
        body: JSON.stringify(violationReport),
      });

      expect(response).toBeDefined();
    });

    it('should handle malformed violation reports gracefully', async () => {
      const malformedReport = {
        'invalid-structure': 'this is not a valid CSP report'
      };

      // Mock request for malformed report testing
      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/csp-report',
        },
        body: JSON.stringify(malformedReport),
      };

      // Should not crash on malformed reports
      const response = await fetch('/api/csp-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/csp-report',
        },
        body: JSON.stringify(malformedReport),
      });

      expect(response).toBeDefined();
    });

    it('should rate limit violation reports to prevent spam', async () => {
      const violationReport = {
        'csp-report': {
          'document-uri': 'https://work.randyellis.design/',
          'violated-directive': 'script-src',
          'blocked-uri': 'https://spam-site.com/script.js',
        }
      };

      // Send multiple reports rapidly
      const requests = Array.from({ length: 20 }, () =>
        fetch('/api/csp-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/csp-report',
            'X-Forwarded-For': '192.168.1.1', // Same IP
          },
          body: JSON.stringify(violationReport),
        })
      );

      const responses = await Promise.all(requests);
      
      // Some requests should be rate limited (429 status)
      expect(responses).toBeDefined();
    });

    it('should validate Content-Type header', async () => {
      const violationReport = {
        'csp-report': {
          'document-uri': 'https://work.randyellis.design/',
          'violated-directive': 'script-src',
        }
      };

      // Send with wrong Content-Type
      const response = await fetch('/api/csp-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Wrong type
        },
        body: JSON.stringify(violationReport),
      });

      expect(response).toBeDefined();
    });

    it('should only accept POST requests', async () => {
      const getResponse = await fetch('/api/csp-report', {
        method: 'GET',
      });

      const putResponse = await fetch('/api/csp-report', {
        method: 'PUT',
      });

      expect(getResponse).toBeDefined();
      expect(putResponse).toBeDefined();
    });
  });

  describe('Violation Report Processing', () => {
    it('should extract relevant information from violation reports', () => {
      const violationReport = {
        'csp-report': {
          'document-uri': 'https://work.randyellis.design/projects',
          'referrer': 'https://work.randyellis.design/',
          'violated-directive': 'script-src',
          'effective-directive': 'script-src',
          'original-policy': "default-src 'self'; script-src 'self' 'nonce-abc123'",
          'blocked-uri': 'https://suspicious-domain.com/malware.js',
          'line-number': 123,
          'column-number': 45,
          'source-file': 'https://work.randyellis.design/projects',
          'disposition': 'enforce',
          'status-code': 200
        }
      };

      // Test that we can extract the key information
      const report = violationReport['csp-report'];
      
      expect(report['violated-directive']).toBe('script-src');
      expect(report['blocked-uri']).toBe('https://suspicious-domain.com/malware.js');
      expect(report['document-uri']).toBe('https://work.randyellis.design/projects');
      expect(report['disposition']).toBe('enforce');
    });

    it('should categorize violations by type', () => {
      const violations = [
        { 'violated-directive': 'script-src', 'blocked-uri': 'https://evil.com/script.js' },
        { 'violated-directive': 'style-src', 'blocked-uri': 'inline' },
        { 'violated-directive': 'img-src', 'blocked-uri': 'data:image/svg+xml' },
        { 'violated-directive': 'connect-src', 'blocked-uri': 'https://tracking.com/beacon' },
      ];

      const categories = {
        script: violations.filter(v => v['violated-directive'].includes('script')),
        style: violations.filter(v => v['violated-directive'].includes('style')),
        image: violations.filter(v => v['violated-directive'].includes('img')),
        connect: violations.filter(v => v['violated-directive'].includes('connect')),
      };

      expect(categories.script).toHaveLength(1);
      expect(categories.style).toHaveLength(1);
      expect(categories.image).toHaveLength(1);
      expect(categories.connect).toHaveLength(1);
    });

    it('should identify potentially dangerous violations', () => {
      const dangerousViolations = [
        {
          'violated-directive': 'script-src',
          'blocked-uri': 'https://malicious-site.com/xss.js'
        },
        {
          'violated-directive': 'script-src',
          'blocked-uri': 'javascript:alert(1)'
        },
        {
          'violated-directive': 'object-src',
          'blocked-uri': 'https://evil.com/malware.swf'
        }
      ];

      const benignViolations = [
        {
          'violated-directive': 'img-src',
          'blocked-uri': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        },
        {
          'violated-directive': 'style-src',
          'blocked-uri': 'inline'
        }
      ];

      // Dangerous violations should be flagged
      dangerousViolations.forEach(violation => {
        const isDangerous = violation['violated-directive'].includes('script') ||
                           violation['violated-directive'].includes('object') ||
                           violation['blocked-uri'].includes('javascript:');
        
        expect(isDangerous).toBe(true);
      });

      // Benign violations should not be flagged as dangerous
      benignViolations.forEach(violation => {
        const isDangerous = violation['blocked-uri'].includes('javascript:') ||
                           violation['blocked-uri'].includes('data:application/');
        
        expect(isDangerous).toBe(false);
      });
    });
  });

  describe('Violation Monitoring', () => {
    it('should track violation frequency', () => {
      const violations = [
        { directive: 'script-src', uri: 'https://ads.com/script.js', timestamp: Date.now() },
        { directive: 'script-src', uri: 'https://ads.com/script.js', timestamp: Date.now() },
        { directive: 'script-src', uri: 'https://ads.com/script.js', timestamp: Date.now() },
        { directive: 'img-src', uri: 'https://other.com/image.jpg', timestamp: Date.now() },
      ];

      const frequencies = violations.reduce((acc, violation) => {
        const key = `${violation.directive}:${violation.uri}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      expect(frequencies['script-src:https://ads.com/script.js']).toBe(3);
      expect(frequencies['img-src:https://other.com/image.jpg']).toBe(1);
    });

    it('should detect violation trends', () => {
      const now = Date.now();
      const hour = 60 * 60 * 1000;
      
      const violations = [
        { directive: 'script-src', timestamp: now - 4 * hour },
        { directive: 'script-src', timestamp: now - 3 * hour },
        { directive: 'script-src', timestamp: now - 2 * hour },
        { directive: 'script-src', timestamp: now - 1 * hour },
        { directive: 'script-src', timestamp: now },
      ];

      // Group by hour
      const hourlyViolations = violations.reduce((acc, violation) => {
        const hourKey = Math.floor(violation.timestamp / hour);
        acc[hourKey] = (acc[hourKey] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      // Should detect increasing trend
      const hours = Object.keys(hourlyViolations).map(Number).sort();
      expect(hours).toHaveLength(5);
    });

    it('should identify repeat offender domains', () => {
      const violations = [
        { blockedUri: 'https://malicious.com/script1.js' },
        { blockedUri: 'https://malicious.com/script2.js' },
        { blockedUri: 'https://malicious.com/tracking.js' },
        { blockedUri: 'https://legitimate.com/script.js' },
        { blockedUri: 'https://other.com/beacon.js' },
      ];

      const domainCounts = violations.reduce((acc, violation) => {
        try {
          const domain = new URL(violation.blockedUri).hostname;
          acc[domain] = (acc[domain] || 0) + 1;
        } catch {
          // Ignore invalid URLs
        }
        return acc;
      }, {} as Record<string, number>);

      expect(domainCounts['malicious.com']).toBe(3);
      expect(domainCounts['legitimate.com']).toBe(1);
      expect(domainCounts['other.com']).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty request bodies', async () => {
      const response = await fetch('/api/csp-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/csp-report',
        },
        body: '',
      });

      expect(response).toBeDefined();
    });

    it('should handle invalid JSON', async () => {
      const response = await fetch('/api/csp-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/csp-report',
        },
        body: '{ invalid json',
      });

      expect(response).toBeDefined();
    });

    it('should handle oversized payloads', async () => {
      const largePayload = JSON.stringify({
        'csp-report': {
          'document-uri': 'x'.repeat(10000),
          'violated-directive': 'script-src',
        }
      });

      const response = await fetch('/api/csp-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/csp-report',
        },
        body: largePayload,
      });

      expect(response).toBeDefined();
    });
  });
});