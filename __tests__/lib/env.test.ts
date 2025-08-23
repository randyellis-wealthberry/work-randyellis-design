/**
 * Tests for environment configuration utility
 */

import { getBaseUrl, createAbsoluteUrl, getCanonicalUrl, getEnvironmentConfig, logEnvironmentConfig } from '@/lib/env';

// Mock environment variables for testing
const mockEnv = (env: Record<string, string | undefined>) => {
  const originalEnv = process.env;
  process.env = { ...originalEnv, ...env };
  return () => {
    process.env = originalEnv;
  };
};

describe('Environment Configuration', () => {
  afterEach(() => {
    // Reset any mocked environment variables
    delete process.env.NEXT_PUBLIC_BASE_URL;
    delete process.env.NEXT_PUBLIC_VERCEL_URL;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    delete process.env.PORT;
  });

  describe('getBaseUrl', () => {
    it('should return NEXT_PUBLIC_BASE_URL when set', () => {
      const restore = mockEnv({ NEXT_PUBLIC_BASE_URL: 'https://custom.example.com' });
      expect(getBaseUrl()).toBe('https://custom.example.com');
      restore();
    });

    it('should return Vercel URL when NEXT_PUBLIC_VERCEL_URL is set', () => {
      const restore = mockEnv({ 
        NEXT_PUBLIC_VERCEL_URL: 'my-app-preview.vercel.app',
        NEXT_PUBLIC_BASE_URL: undefined
      });
      expect(getBaseUrl()).toBe('https://my-app-preview.vercel.app');
      restore();
    });

    it('should return localhost for development environment', () => {
      const restore = mockEnv({ 
        NODE_ENV: 'development',
        PORT: '3000',
        NEXT_PUBLIC_BASE_URL: undefined,
        NEXT_PUBLIC_VERCEL_URL: undefined
      });
      expect(getBaseUrl()).toBe('http://localhost:3000');
      restore();
    });

    it('should return production URL by default', () => {
      const restore = mockEnv({ 
        NODE_ENV: 'production',
        NEXT_PUBLIC_BASE_URL: undefined,
        NEXT_PUBLIC_VERCEL_URL: undefined,
        NEXT_PUBLIC_VERCEL_ENV: undefined
      });
      expect(getBaseUrl()).toBe('https://work.randyellis.design');
      restore();
    });
  });

  describe('createAbsoluteUrl', () => {
    it('should create absolute URL from relative path', () => {
      const restore = mockEnv({ NODE_ENV: 'development' });
      expect(createAbsoluteUrl('/projects')).toBe('http://localhost:3000/projects');
      restore();
    });

    it('should handle path without leading slash', () => {
      const restore = mockEnv({ NODE_ENV: 'development' });
      expect(createAbsoluteUrl('projects')).toBe('http://localhost:3000/projects');
      restore();
    });

    it('should handle empty path', () => {
      const restore = mockEnv({ NODE_ENV: 'development' });
      expect(createAbsoluteUrl()).toBe('http://localhost:3000/');
      restore();
    });
  });

  describe('getCanonicalUrl', () => {
    it('should return canonical URL', () => {
      const restore = mockEnv({ NODE_ENV: 'development' });
      expect(getCanonicalUrl('/blog')).toBe('http://localhost:3000/blog');
      restore();
    });
  });

  describe('getEnvironmentConfig', () => {
    it('should return development config', () => {
      const restore = mockEnv({ NODE_ENV: 'development' });
      const config = getEnvironmentConfig();
      expect(config.isDevelopment).toBe(true);
      expect(config.isProduction).toBe(false);
      expect(config.environment).toBe('development');
      expect(config.baseUrl).toBe('http://localhost:3000');
      restore();
    });

    it('should return production config', () => {
      const restore = mockEnv({ 
        NODE_ENV: 'production',
        NEXT_PUBLIC_BASE_URL: undefined,
        NEXT_PUBLIC_VERCEL_URL: undefined,
        NEXT_PUBLIC_VERCEL_ENV: undefined
      });
      const config = getEnvironmentConfig();
      expect(config.isDevelopment).toBe(false);
      expect(config.isProduction).toBe(true);
      expect(config.environment).toBe('production');
      expect(config.baseUrl).toBe('https://work.randyellis.design');
      restore();
    });

    it('should return staging config for preview environment', () => {
      const restore = mockEnv({ 
        NODE_ENV: 'production',
        NEXT_PUBLIC_VERCEL_ENV: 'preview',
        NEXT_PUBLIC_VERCEL_URL: 'my-app-preview.vercel.app'
      });
      const config = getEnvironmentConfig();
      expect(config.isStaging).toBe(true);
      expect(config.isProduction).toBe(false);
      expect(config.environment).toBe('staging');
      expect(config.baseUrl).toBe('https://my-app-preview.vercel.app');
      restore();
    });
  });

  describe('logEnvironmentConfig', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should log in development', () => {
      const restore = mockEnv({ NODE_ENV: 'development' });
      logEnvironmentConfig();
      expect(consoleSpy).toHaveBeenCalledWith(
        '🌍 Environment Configuration:',
        expect.objectContaining({
          baseUrl: 'http://localhost:3000',
          environment: 'development'
        })
      );
      restore();
    });

    it('should not log in production', () => {
      const restore = mockEnv({ NODE_ENV: 'production' });
      logEnvironmentConfig();
      expect(consoleSpy).not.toHaveBeenCalled();
      restore();
    });
  });
});

describe('Environment Routing Integration', () => {
  it('should generate consistent URLs across environments', () => {
    // Test development
    const restoreDev = mockEnv({ NODE_ENV: 'development' });
    expect(createAbsoluteUrl('/projects/test')).toBe('http://localhost:3000/projects/test');
    restoreDev();

    // Test production  
    const restoreProd = mockEnv({ 
      NODE_ENV: 'production',
      NEXT_PUBLIC_BASE_URL: undefined,
      NEXT_PUBLIC_VERCEL_URL: undefined
    });
    expect(createAbsoluteUrl('/projects/test')).toBe('https://work.randyellis.design/projects/test');
    restoreProd();

    // Test staging
    const restoreStaging = mockEnv({
      NODE_ENV: 'production',
      NEXT_PUBLIC_VERCEL_ENV: 'preview',
      NEXT_PUBLIC_VERCEL_URL: 'test-preview.vercel.app'
    });
    expect(createAbsoluteUrl('/projects/test')).toBe('https://test-preview.vercel.app/projects/test');
    restoreStaging();
  });

  it('should handle URL override properly', () => {
    const restore = mockEnv({ 
      NEXT_PUBLIC_BASE_URL: 'https://custom-domain.com',
      NODE_ENV: 'development'
    });
    
    expect(getBaseUrl()).toBe('https://custom-domain.com');
    expect(createAbsoluteUrl('/test')).toBe('https://custom-domain.com/test');
    
    restore();
  });
});