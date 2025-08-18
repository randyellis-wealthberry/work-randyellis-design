const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    image: '/static/images/fallback.png',
    document: '/offline'
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
        }
      }
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    },
    {
      urlPattern: /\.(?:js)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-js-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    },
    {
      urlPattern: /\.(?:css|less)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-style-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    }
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-progress',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'lucide-react',
      'framer-motion'
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // More aggressive bundle splitting for performance
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 8000,
          maxSize: 150000, // Reduced max size
          cacheGroups: {
            // Force Three.js to be async-only
            threejsCore: {
              test: /[\\/]node_modules[\\/]three[\\/]/,
              name: 'threejs-core',
              chunks: 'async',
              priority: 40,
              enforce: true,
            },
            // React Three Fiber - async only
            reactThreeFiber: {
              test: /[\\/]node_modules[\\/]@react-three[\\/]/,
              name: 'react-three-fiber',
              chunks: 'async',
              priority: 35,
              enforce: true,
            },
            // Framer Motion - async only
            framerMotion: {
              test: /[\\/]node_modules[\\/](framer-motion|motion)[\\/]/,
              name: 'framer-motion',
              chunks: 'async',
              priority: 30,
              enforce: true,
            },
            // Radix UI - split into smaller chunks
            radixDialog: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]react-dialog[\\/]/,
              name: 'radix-dialog',
              chunks: 'async',
              priority: 25,
              enforce: true,
            },
            radixUI: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix-ui',
              chunks: 'all',
              priority: 20,
              maxSize: 80000,
            },
            // Icons - async loading
            lucideIcons: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'lucide-icons',
              chunks: 'async',
              priority: 18,
              enforce: true,
            },
            // React core stays in vendor
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react-vendor',
              chunks: 'all',
              priority: 15,
              maxSize: 120000,
            },
            // Form libraries - async
            formLibs: {
              test: /[\\/]node_modules[\\/](react-hook-form|@hookform)[\\/]/,
              name: 'form-libs',
              chunks: 'async',
              priority: 12,
              enforce: true,
            },
            // Split remaining vendors by package name hash
            vendorA: {
              test: /[\\/]node_modules[\\/][a-f]/,
              name: 'vendor-a-f',
              chunks: 'all',
              priority: 8,
              maxSize: 120000,
            },
            vendorG: {
              test: /[\\/]node_modules[\\/][g-l]/,
              name: 'vendor-g-l',
              chunks: 'all',
              priority: 7,
              maxSize: 120000,
            },
            vendorM: {
              test: /[\\/]node_modules[\\/][m-r]/,
              name: 'vendor-m-r',
              chunks: 'all',
              priority: 6,
              maxSize: 120000,
            },
            vendorS: {
              test: /[\\/]node_modules[\\/][s-z]/,
              name: 'vendor-s-z',
              chunks: 'all',
              priority: 5,
              maxSize: 120000,
            },
            // Default for application code
            default: {
              minChunks: 2,
              chunks: 'all',
              name: 'default',
              priority: 1,
              maxSize: 100000,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    return config;
  },
  // MDX configuration
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
  },
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

module.exports = withPWA(withMDX(nextConfig));