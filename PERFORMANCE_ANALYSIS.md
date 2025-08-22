# Portfolio Performance Analysis & Optimization Guide

Generated on: August 17, 2025

## Executive Summary

The portfolio website currently has significant performance optimization opportunities. Bundle analysis reveals a **1.8MB total JavaScript size** with the largest chunk being **425KB**, primarily containing 3D libraries (Three.js, React Three Fiber). This impacts Core Web Vitals with an estimated **LCP of 3.2s** and **TTI of 4.2s**.

## Current Performance Baseline

### Bundle Analysis

- **Total JavaScript Size**: 1,803KB (Target: 800KB)
- **Largest Chunk**: 425KB `f58c171e-7d1f0f514a1b1f92.js` (Target: 200KB)
- **Main Bundle**: 169KB `4bd1b696-cc729d47eba2cee4.js` (Target: 120KB)
- **Total Chunks**: 28 bundles
- **Over-splitting**: 35.7% of chunks are <10KB (indicates inefficient splitting)

### Core Web Vitals (Current vs Target)

| Metric  | Current | Target   | Status               |
| ------- | ------- | -------- | -------------------- |
| **LCP** | 3,200ms | ≤2,500ms | ❌ Poor              |
| **FID** | 150ms   | ≤100ms   | ⚠️ Needs Improvement |
| **CLS** | 0.15    | ≤0.1     | ⚠️ Needs Improvement |
| **FCP** | 2,100ms | ≤1,800ms | ⚠️ Needs Improvement |
| **TTI** | 4,200ms | ≤3,800ms | ⚠️ Needs Improvement |

### 3D Dependencies Impact

The current implementation loads heavy 3D libraries synchronously:

- **Three.js**: ~400KB (estimated)
- **@react-three/fiber**: ~50KB
- **@react-three/drei**: ~100KB
- **@react-three/postprocessing**: ~30KB

**Total 3D Impact**: ~580KB (32% of total bundle size)

## Optimization Roadmap

### Phase 1: Critical Optimizations (Week 1-2)

**Priority: HIGH | Expected Savings: ~500KB**

1. **Dynamic Import 3D Components**

   ```typescript
   // Current (synchronous)
   import { Canvas } from '@react-three/fiber';
   import * as THREE from 'three';

   // Optimized (dynamic)
   const Canvas = dynamic(() => import('@react-three/fiber').then(mod => ({ default: mod.Canvas })), {
     ssr: false,
     loading: () => <WebGLSkeleton />
   });
   ```

2. **Intersection Observer for WebGL**

   ```typescript
   const LazyWebGLScene = () => {
     const [shouldLoad, setShouldLoad] = useState(false);
     const ref = useRef(null);

     useEffect(() => {
       const observer = new IntersectionObserver(
         ([entry]) => entry.isIntersecting && setShouldLoad(true),
         { threshold: 0.1, rootMargin: '50px' }
       );

       if (ref.current) observer.observe(ref.current);
       return () => observer.disconnect();
     }, []);

     return (
       <div ref={ref}>
         {shouldLoad ? <WebGLScene /> : <ScenePlaceholder />}
       </div>
     );
   };
   ```

3. **Tree Shaking Three.js Imports**

   ```typescript
   // Current (imports entire library)
   import * as THREE from "three";

   // Optimized (selective imports)
   import {
     Scene,
     PerspectiveCamera,
     WebGLRenderer,
     Mesh,
     BoxGeometry,
     MeshStandardMaterial,
   } from "three";
   ```

### Phase 2: Enhanced Optimizations (Week 3-4)

**Priority: MEDIUM | Expected Savings: ~300KB**

4. **Connection-Aware Loading**

   ```typescript
   const useConnectionAwareLoading = () => {
     const [connectionType, setConnectionType] = useState("4g");

     useEffect(() => {
       const connection = navigator.connection;
       if (connection) {
         setConnectionType(connection.effectiveType);
         connection.addEventListener("change", () =>
           setConnectionType(connection.effectiveType),
         );
       }
     }, []);

     return {
       shouldLoadHeavyContent: ["4g", "3g"].includes(connectionType),
       shouldPreloadAssets: connectionType === "4g",
     };
   };
   ```

5. **Progressive 3D Scene Loading**

   ```typescript
   const ProgressiveWebGLScene = () => {
     const [loadingStage, setLoadingStage] = useState(0);

     useEffect(() => {
       // Stage 0: Basic geometry only
       // Stage 1: Add materials and lighting
       // Stage 2: Add post-processing effects
       // Stage 3: Add animations and interactions
     }, []);
   };
   ```

6. **Optimize Frame Work Imports**

   ```typescript
   // Current
   import { motion } from "framer-motion";

   // Optimized
   import { m as motion } from "framer-motion";
   // Or use motion/react for smaller bundle
   import { motion } from "motion/react";
   ```

### Phase 3: Advanced Optimizations (Week 5-6)

**Priority: LOW | Expected Savings: ~200KB**

7. **WebGL Context Optimization**
8. **Shader Code Splitting**
9. **Asset Streaming**
10. **Service Worker Caching**

## Implementation Strategy

### Test-Driven Development Approach

All optimizations should be guided by the performance tests in `__tests__/performance/`:

1. **bundle-size.test.ts** - Validates bundle size limits
2. **core-web-vitals.test.ts** - Tracks Core Web Vitals improvements
3. **tree-shaking.test.ts** - Ensures proper tree shaking
4. **lazy-loading-simple.test.ts** - Validates lazy loading implementation

### Measurement & Monitoring

```bash
# Run performance analysis
npm run analyze:performance

# Run performance tests
npm test __tests__/performance/

# Generate Lighthouse report
npx lighthouse http://localhost:3000 --output=json --output-path=lighthouse-report.json
```

### Bundle Splitting Configuration

Update `next.config.mjs`:

```javascript
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: "three",
            chunks: "all",
            enforce: true,
          },
          motion: {
            test: /[\\/]node_modules[\\/](framer-motion|motion)[\\/]/,
            name: "motion",
            chunks: "all",
            enforce: true,
          },
        },
      };
    }
    return config;
  },
};
```

## Expected Performance Improvements

### After Phase 1 Optimizations

- **Bundle Size**: 1,803KB → ~1,200KB (33% reduction)
- **Largest Chunk**: 425KB → ~150KB (65% reduction)
- **LCP**: 3,200ms → ~2,800ms (400ms improvement)
- **TTI**: 4,200ms → ~3,600ms (600ms improvement)

### After All Optimizations

- **Bundle Size**: 1,803KB → ~800KB (56% reduction)
- **Largest Chunk**: 425KB → ~120KB (72% reduction)
- **LCP**: 3,200ms → ~2,400ms (800ms improvement)
- **TTI**: 4,200ms → ~3,200ms (1,000ms improvement)

## Performance Budget

### Ongoing Limits

- **Main Bundle**: ≤120KB
- **Any Single Chunk**: ≤200KB
- **Total Initial JS**: ≤800KB
- **3D-related Chunks**: ≤150KB
- **LCP**: ≤2,500ms
- **TTI**: ≤3,800ms

### Monitoring Strategy

1. **CI/CD Integration**: Performance tests must pass before deployment
2. **Bundle Analysis**: Automatic analysis on every build
3. **Real User Monitoring**: Track Core Web Vitals in production
4. **Performance Budgets**: Enforce limits in build process

## Next Steps

1. **Week 1**: Implement dynamic imports for 3D components
2. **Week 2**: Add intersection observer loading
3. **Week 3**: Optimize tree shaking and imports
4. **Week 4**: Implement connection-aware loading
5. **Week 5**: Advanced WebGL optimizations
6. **Week 6**: Performance monitoring and final tuning

## Files Modified

### Performance Tests Created

- `/Users/MacBook/Developer/work.randyellis.design/__tests__/performance/bundle-size.test.ts`
- `/Users/MacBook/Developer/work.randyellis.design/__tests__/performance/core-web-vitals.test.ts`
- `/Users/MacBook/Developer/work.randyellis.design/__tests__/performance/tree-shaking.test.ts`
- `/Users/MacBook/Developer/work.randyellis.design/__tests__/performance/lazy-loading-simple.test.ts`

### Analysis Tools Created

- `/Users/MacBook/Developer/work.randyellis.design/scripts/analyze-performance.js`

### Current State Analysis

- Bundle analysis reveals significant 3D library impact
- Core Web Vitals indicate poor performance across all metrics
- Tree shaking opportunities identified
- Lazy loading strategy defined but not implemented

The performance tests are intentionally failing to establish baseline metrics and drive TDD implementation of optimizations.
