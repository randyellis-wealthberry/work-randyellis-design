import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  
  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // CDN and caching optimizations
  generateEtags: true,
  compress: true,
  poweredByHeader: false,
  
  // Image optimization with CDN
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.cosmos.so",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "work.randyellis.design",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for images
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // Additional CDN optimizations
    loader: "default",
    loaderFile: "",
    domains: [],
    path: "/_next/image",
    unoptimized: false,
  },
  
  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    nextScriptWorkers: false,
    scrollRestoration: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
    cpus: Math.max(1, require('os').cpus().length - 1),
    memoryBasedWorkersCount: true,
  },
  
  // Headers for CDN optimization
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
          {
            key: 'Vary',
            value: 'Accept',
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
