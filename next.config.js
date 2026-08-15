// Temporarily commented out next-pwa due to Next.js 15 compatibility issues
// TODO: Update to @ducanh2912/next-pwa when ready
// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
//   fallbacks: {
//     image: "/static/images/fallback.png",
//     document: "/offline",
//   },
//   runtimeCaching: [
//     {
//       urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
//       handler: "CacheFirst",
//       options: {
//         cacheName: "google-fonts",
//         expiration: {
//           maxEntries: 4,
//           maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
//         },
//       },
//     },
//     {
//       urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
//       handler: "StaleWhileRevalidate",
//       options: {
//         cacheName: "static-image-assets",
//         expiration: {
//           maxEntries: 64,
//           maxAgeSeconds: 24 * 60 * 60, // 24 hours
//         },
//       },
//     },
//     {
//       urlPattern: /\.(?:js)$/i,
//       handler: "StaleWhileRevalidate",
//       options: {
//         cacheName: "static-js-assets",
//         expiration: {
//           maxEntries: 32,
//           maxAgeSeconds: 24 * 60 * 60, // 24 hours
//         },
//       },
//     },
//     {
//       urlPattern: /\.(?:css|less)$/i,
//       handler: "StaleWhileRevalidate",
//       options: {
//         cacheName: "static-style-assets",
//         expiration: {
//           maxEntries: 32,
//           maxAgeSeconds: 24 * 60 * 60, // 24 hours
//         },
//       },
//     },
//   ],
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // PERFORMANCE OPTIMIZATION ENHANCEMENTS
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // EXPERIMENTAL OPTIMIZATIONS
  experimental: {
    // Optimize package imports - already configured well
    optimizePackageImports: [
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-progress",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "lucide-react",
      "motion",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
    ],
    // Enable tree shaking improvements
    webVitalsAttribution: ["CLS", "LCP"],
  },

  // COMPILER OPTIMIZATIONS
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    // Enable React compiler optimizations
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

  // WEBPACK OPTIMIZATIONS - ENHANCED
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // PRODUCTION-ONLY OPTIMIZATIONS
      config.optimization = {
        ...config.optimization,
        // ADVANCED BUNDLE SPLITTING
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 244000, // Increased to avoid over-splitting
          maxAsyncRequests: 10,
          maxInitialRequests: 5,
          cacheGroups: {
            // CRITICAL PATH - Load immediately
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              name: "react-vendor",
              chunks: "all",
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },

            // HIGH-PERFORMANCE LAZY LOADING
            lazyLoading: {
              test: /[\\/](use-optimized-lazy-loading|optimized-lazy|performance)[\\/]/,
              name: "lazy-loading",
              chunks: "async",
              priority: 35,
            },

            // THREE.JS ECOSYSTEM - Heavy libraries (lazy loaded)
            threejs: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: "threejs",
              chunks: "async",
              priority: 30,
              maxSize: 150000, // Split large three.js bundles
            },

            // ANIMATION LIBRARIES - Lazy loaded with size limits
            animations: {
              test: /[\\/]node_modules[\\/](motion|framer-motion|lottie|@lottiefiles)[\\/]/,
              name: "animations",
              chunks: "async",
              priority: 25,
              maxSize: 100000,
            },

            // UI LIBRARIES - Optimized chunking
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|@remixicon)[\\/]/,
              name: "ui-libs",
              chunks: "async",
              priority: 20,
              maxSize: 80000,
            },

            // UTILITIES - Small, frequently used
            utils: {
              test: /[\\/]node_modules[\\/](clsx|tailwind-merge|class-variance-authority)[\\/]/,
              name: "utils",
              chunks: "all",
              priority: 15,
            },

            // DEFAULT VENDOR - Don't split too aggressively to avoid module resolution issues
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendor",
              chunks: "all",
              priority: 10,
              // Removed maxSize to prevent over-splitting vendor bundle
              reuseExistingChunk: true,
            },
          },
        },

        // ADVANCED OPTIMIZATIONS
        concatenateModules: true,
        mergeDuplicateChunks: true,
        flagIncludedChunks: true,
        // sideEffects removed - can cause issues with module resolution

        // MINIMIZER OPTIMIZATIONS
        minimize: true,
        minimizer: [
          // Keep existing minimizers and add optimization flags
          ...config.optimization.minimizer,
        ],
      };

      // PERFORMANCE PLUGINS
      config.plugins.push(
        new (require("webpack").DefinePlugin)({
          "process.env.ENABLE_LAZY_LOADING_OPTIMIZATIONS": JSON.stringify(true),
          "process.env.ENABLE_PERFORMANCE_MONITORING": JSON.stringify(true),
        }),
      );
    }

    // DEVELOPMENT: no custom splitChunks. A hand-rolled `vendor` cache group
    // fights Next 15's app-router webpack runtime and corrupts the dev module
    // graph — it produced "exports is not defined" (server) and
    // "Cannot read properties of undefined (reading 'call')" (client). Next's
    // default dev chunking is correct; leave it alone. Custom splitChunks stays
    // gated to production only (the `!isServer && !dev` block above).

    return config;
  },

  // MDX configuration
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

  // ENHANCED IMAGE OPTIMIZATION
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    domains: ["images.unsplash.com", "picsum.photos"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vercel.app",
      },
    ],
  },

  // OUTPUT OPTIMIZATION
  trailingSlash: false,

  // HEADERS FOR CACHING - Enhanced
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  // REDIRECTS
  async redirects() {
    return [
      {
        source: "/ledgeriq",
        destination: "/projects/ledgeriq",
        permanent: true,
      },
    ];
  },
};

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// Temporarily disable PWA to test build
module.exports = withMDX(nextConfig);
// module.exports = withPWA(withMDX(nextConfig));
