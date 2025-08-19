/**
 * Examples showing how to use the optimized lazy loading components
 * Replace existing slow-loading components with these optimized versions
 */
"use client";

import {
  OptimizedLazyImage,
  OptimizedLazyVideo,
  OptimizedWebGLLoader,
} from "@/components/performance/lazy-components";

// Example 1: Replace slow project images with optimized lazy images
export function OptimizedProjectShowcase() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* High priority hero image - loads aggressively */}
      <OptimizedLazyImage
        src="/images/projects/hero-project.jpg"
        alt="Featured project"
        width={600}
        height={400}
        priority="high"
        preloadDistance={500}
        className="rounded-lg"
        quality={90}
      />

      {/* Medium priority images - balanced loading */}
      <OptimizedLazyImage
        src="/images/projects/project-2.jpg"
        alt="Project 2"
        width={400}
        height={300}
        priority="medium"
        className="rounded-lg"
        quality={85}
      />

      {/* Low priority images - deferred loading */}
      <OptimizedLazyImage
        src="/images/projects/project-3.jpg"
        alt="Project 3"
        width={400}
        height={300}
        priority="low"
        className="rounded-lg"
        quality={80}
      />
    </div>
  );
}

// Example 2: Replace slow video components with optimized versions
export function OptimizedVideoSection() {
  return (
    <div className="space-y-8">
      {/* High priority demo video */}
      <OptimizedLazyVideo
        src="/videos/demo-main.mp4"
        poster="/images/video-posters/demo-main.jpg"
        priority="high"
        autoPlay={true}
        loop={true}
        muted={true}
        className="rounded-lg"
        containerClassName="w-full max-w-4xl mx-auto"
      />

      {/* Connection-aware secondary videos */}
      <div className="grid gap-6 md:grid-cols-2">
        <OptimizedLazyVideo
          src="/videos/feature-1.mp4"
          poster="/images/video-posters/feature-1.jpg"
          priority="medium"
          preloadDistance={200}
          enableAdaptiveQuality={true}
          className="rounded-lg"
        />

        <OptimizedLazyVideo
          src="/videos/feature-2.mp4"
          poster="/images/video-posters/feature-2.jpg"
          priority="medium"
          preloadDistance={200}
          enableAdaptiveQuality={true}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}

// Example 3: Replace slow WebGL components with optimized versions
export function OptimizedWebGLSection() {
  return (
    <div className="space-y-8">
      {/* Hero 3D scene with video fallback */}
      <OptimizedWebGLLoader
        sceneType="neural"
        fallbackSrc="/videos/neural-fallback.mp4"
        priority="high"
        className="rounded-lg"
        containerClassName="w-full h-96"
        color="#3b82f6"
        speed={1.2}
        intensity={0.8}
      />

      {/* Secondary 3D scenes */}
      <div className="grid gap-6 md:grid-cols-2">
        <OptimizedWebGLLoader
          sceneType="geometric"
          fallbackSrc="/videos/geometric-fallback.mp4"
          priority="medium"
          className="h-64 rounded-lg"
          color="#10b981"
          speed={0.8}
        />

        <OptimizedWebGLLoader
          sceneType="organic"
          fallbackSrc="/videos/organic-fallback.mp4"
          priority="medium"
          className="h-64 rounded-lg"
          color="#f59e0b"
          speed={0.6}
        />
      </div>
    </div>
  );
}

// Example 4: Migration guide - Replace existing components
export function MigrationExamples() {
  return (
    <div className="space-y-8">
      {/* BEFORE: Slow loading Image */}
      {/* 
      <Image 
        src="/large-image.jpg" 
        alt="Slow loading" 
        width={800} 
        height={600} 
      />
      */}

      {/* AFTER: Optimized lazy loading */}
      <OptimizedLazyImage
        src="/large-image.jpg"
        alt="Fast loading with optimization"
        width={800}
        height={600}
        priority="high"
        preloadDistance={400}
        enableWebP={true}
      />

      {/* BEFORE: Slow loading video */}
      {/* 
      <video src="/large-video.mp4" autoPlay loop muted />
      */}

      {/* AFTER: Optimized lazy video */}
      <OptimizedLazyVideo
        src="/large-video.mp4"
        priority="medium"
        autoPlay={true}
        loop={true}
        muted={true}
        enableAdaptiveQuality={true}
        preload="metadata"
      />

      {/* BEFORE: Slow WebGL component */}
      {/* 
      <AnimatedWebGL sceneType="neural" />
      */}

      {/* AFTER: Optimized WebGL with fallback */}
      <OptimizedWebGLLoader
        sceneType="neural"
        fallbackSrc="/videos/neural-fallback.mp4"
        priority="medium"
        enableWebGLFallback={true}
      />
    </div>
  );
}

// Example 5: Performance monitoring integration
export function PerformanceOptimizedPage() {
  return (
    <div className="space-y-8">
      {/* Critical above-the-fold content with high priority */}
      <section className="hero">
        <OptimizedLazyImage
          src="/images/hero-banner.jpg"
          alt="Hero banner"
          width={1200}
          height={600}
          priority="high"
          preloadDistance={500}
          quality={95}
          className="h-auto w-full"
        />
      </section>

      {/* Secondary content with medium priority */}
      <section className="features">
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <OptimizedLazyImage
              key={i}
              src={`/images/feature-${i}.jpg`}
              alt={`Feature ${i}`}
              width={400}
              height={300}
              priority="medium"
              className="rounded-lg"
            />
          ))}
        </div>
      </section>

      {/* Below-the-fold content with low priority */}
      <section className="testimonials">
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <OptimizedLazyVideo
              key={i}
              src={`/videos/testimonial-${i}.mp4`}
              poster={`/images/testimonial-${i}-poster.jpg`}
              priority="low"
              preloadDistance={100}
              enableAdaptiveQuality={true}
              className="rounded-lg"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
