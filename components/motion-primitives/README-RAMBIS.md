# Motion Primitives for Rambis UI

This guide shows how to use the newly installed Motion Primitives components specifically for the Rambis UI project page with professional, subtle animations.

## Components Installed

### 1. AnimatedContent

Smooth section reveals with staggered timing for grid layouts.

```tsx
import {
  AnimatedContent,
  AnimatedContentItem,
} from "@/components/motion-primitives";

// Basic grid with staggered reveals
<AnimatedContent
  staggerDelay={0.1} // 100ms between items
  staggerDirection="top"
  duration={0.6}
  once={true}
>
  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
    {items.map((item, index) => (
      <AnimatedContentItem key={index} delay={index * 0.1}>
        <div className="card">...</div>
      </AnimatedContentItem>
    ))}
  </div>
</AnimatedContent>;
```

### 2. GlareHover

Subtle shine effects on grid cards with performance optimization.

```tsx
import { GlareHover, GlarePresets } from "@/components/motion-primitives";

// Professional card with subtle glare
<GlareHover
  {...GlarePresets.card} // Preset for cards
  borderRadius="0.75rem"
>
  <div className="bg-card rounded-xl border p-6">
    <h3>Component Title</h3>
    <p>Description...</p>
  </div>
</GlareHover>;
```

**Available Presets:**

- `GlarePresets.card` - Subtle for grid cards
- `GlarePresets.button` - Medium intensity for CTAs
- `GlarePresets.hero` - Strong for hero sections

### 3. FadeContent

Progressive content disclosure with accessibility support.

```tsx
import { FadeContent, ProgressiveDisclosure } from "@/components/motion-primitives";

// Single element fade
<FadeContent direction="up" distance={20} duration={0.6}>
  <div>Content that fades in</div>
</FadeContent>

// Sequential content reveal
<ProgressiveDisclosure staggerDelay={0.15}>
  {[
    <h2 key="title">Main Title</h2>,
    <p key="subtitle">Subtitle text</p>,
    <div key="content">Additional content</div>
  ]}
</ProgressiveDisclosure>
```

## Implementation for Rambis UI Grid

### Complete Example

```tsx
import {
  AnimatedContent,
  AnimatedContentItem,
  GlareHover,
  GlarePresets,
  ProgressiveDisclosure,
} from "@/components/motion-primitives";

export function RambisProjectGrid() {
  return (
    <section className="py-16">
      {/* Header with progressive disclosure */}
      <ProgressiveDisclosure staggerDelay={0.2}>
        {[
          <h2 key="title" className="mb-4 text-center text-4xl font-bold">
            Rambis UI Components
          </h2>,
          <p key="subtitle" className="text-muted-foreground mb-16 text-center">
            Professional design system components
          </p>,
        ]}
      </ProgressiveDisclosure>

      {/* Animated grid */}
      <AnimatedContent
        staggerDelay={0.1}
        staggerDirection="top"
        duration={0.6}
        once={true}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {components.map((component, index) => (
            <AnimatedContentItem key={index} delay={index * 0.1}>
              <GlareHover {...GlarePresets.card} borderRadius="0.75rem">
                <div className="bg-card h-full rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <h3 className="mb-2 font-semibold">{component.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {component.description}
                  </p>
                </div>
              </GlareHover>
            </AnimatedContentItem>
          ))}
        </div>
      </AnimatedContent>
    </section>
  );
}
```

## Performance & Accessibility Features

### Automatic Performance Optimization

- ✅ **GPU Acceleration**: All animations use `transform-gpu` and `will-change` for smooth 60fps
- ✅ **Reduced Motion Support**: Automatically respects `prefers-reduced-motion: reduce`
- ✅ **Memory Optimization**: Animations clean up properly to prevent memory leaks
- ✅ **Viewport Detection**: Only animate when elements come into view

### Staggering Best Practices

- **Grid Cards**: 100ms delays (`staggerDelay={0.1}`)
- **Text Elements**: 150-200ms delays for readability
- **Large Sections**: 200-300ms delays to avoid overwhelming users

### Custom Timing Configuration

```tsx
// Subtle professional animations
<AnimatedContent
  staggerDelay={0.1}        // 100ms between items
  duration={0.6}            // 600ms animation duration
  distance={30}             // 30px initial offset
  threshold={0.1}           // Trigger when 10% visible
  once={true}               // Only animate once
/>

// More dramatic reveals (use sparingly)
<AnimatedContent
  staggerDelay={0.15}
  duration={0.8}
  distance={50}
  threshold={0.2}
/>
```

## CSS Classes for Enhanced Performance

The components automatically apply these optimized classes:

```css
.transform-gpu {
  transform: translateZ(0); /* Force GPU layer */
  will-change: transform, opacity;
  backface-visibility: hidden;
}
```

## Usage in Different Contexts

### Hero Section

```tsx
<GlareHover {...GlarePresets.hero}>
  <div className="hero-content">
    <h1>Rambis UI</h1>
    <p>Professional Design System</p>
  </div>
</GlareHover>
```

### Navigation Cards

```tsx
<AnimatedContent staggerDelay={0.08} direction="left">
  <div className="flex gap-4">
    {navItems.map((item, i) => (
      <AnimatedContentItem key={i} delay={i * 0.08}>
        <GlareHover {...GlarePresets.button}>
          <button>{item.label}</button>
        </GlareHover>
      </AnimatedContentItem>
    ))}
  </div>
</AnimatedContent>
```

### Content Sections

```tsx
<FadeContent direction="up" duration={0.8} delay={0.3}>
  <div className="prose max-w-none">
    <h3>Technical Details</h3>
    <p>Component specifications...</p>
  </div>
</FadeContent>
```

## Integration with Existing Components

These motion primitives work seamlessly with your existing Rambis UI components and can be gradually adopted without breaking changes.

## Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 87+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari 14+, Chrome Mobile 88+)

All animations gracefully degrade in older browsers to static content.
