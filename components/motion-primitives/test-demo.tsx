"use client";

import {
  AnimatedContent,
  AnimatedContentItem,
  GlareHover,
  GlarePresets,
  FadeContent,
  ProgressiveDisclosure,
} from "./index";

const sampleComponents = [
  {
    title: "Button Component",
    description:
      "Interactive button with variants for primary, secondary, and ghost styles. Includes loading states and proper accessibility support.",
    category: "Interactive",
  },
  {
    title: "Card Component",
    description:
      "Flexible card layout with header, content, and footer sections. Supports different sizes and interactive states.",
    category: "Layout",
  },
  {
    title: "Input Field",
    description:
      "Form input with validation states, icons, and helper text. Built with proper ARIA labels and keyboard navigation.",
    category: "Forms",
  },
  {
    title: "Navigation Menu",
    description:
      "Responsive navigation with dropdown support, mobile menu, and active state indicators.",
    category: "Navigation",
  },
  {
    title: "Data Table",
    description:
      "Sortable table component with pagination, filtering, and row selection. Optimized for large datasets.",
    category: "Data",
  },
  {
    title: "Modal Dialog",
    description:
      "Accessible modal with focus management, backdrop dismiss, and responsive sizing for various content types.",
    category: "Overlay",
  },
];

export function MotionPrimitivesDemo() {
  return (
    <div className="bg-background min-h-screen px-4 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header with Progressive Disclosure */}
        <ProgressiveDisclosure
          staggerDelay={0.2}
          direction="up"
          distance={30}
          duration={0.6}
        >
          {[
            <div key="title" className="mb-4 text-center">
              <h1 className="text-foreground text-4xl font-bold md:text-5xl">
                Rambis UI Motion System
              </h1>
            </div>,
            <div key="subtitle" className="mb-6 text-center">
              <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
                Professional motion primitives designed for subtle, accessible
                animations that enhance user experience
              </p>
            </div>,
            <div key="badges" className="mb-16 flex justify-center gap-2">
              <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                60fps Optimized
              </span>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-600">
                Accessibility First
              </span>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-600">
                Reduced Motion Support
              </span>
            </div>,
          ]}
        </ProgressiveDisclosure>

        {/* Animated Grid with Glare Effects */}
        <AnimatedContent
          staggerDelay={0.1}
          staggerDirection="top"
          duration={0.6}
          once={true}
          threshold={0.1}
          className="mb-16"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sampleComponents.map((component, index) => (
              <AnimatedContentItem key={index} delay={index * 0.1}>
                <GlareHover
                  {...GlarePresets.card}
                  borderRadius="0.75rem"
                  className="h-full"
                >
                  <div className="bg-card border-border group relative h-full overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs">
                        {component.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-foreground mb-3 pr-16 text-lg font-semibold">
                        {component.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {component.description}
                      </p>
                    </div>

                    {/* Interactive Indicator */}
                    <div className="absolute right-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
                    </div>

                    {/* Subtle gradient overlay */}
                    <div className="to-muted/10 absolute inset-0 bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </GlareHover>
              </AnimatedContentItem>
            ))}
          </div>
        </AnimatedContent>

        {/* Feature Showcase with Fade Content */}
        <FadeContent
          direction="up"
          distance={40}
          duration={0.8}
          delay={0.4}
          className="text-center"
        >
          <div className="bg-muted/30 border-border mx-auto max-w-4xl rounded-2xl border p-8">
            <h2 className="text-foreground mb-6 text-2xl font-semibold">
              Performance-First Animation System
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  icon: "⚡",
                  title: "GPU Accelerated",
                  description:
                    "All animations use transform-gpu for smooth 60fps performance",
                },
                {
                  icon: "♿",
                  title: "Accessible",
                  description:
                    "Respects prefers-reduced-motion and maintains focus management",
                },
                {
                  icon: "🎯",
                  title: "Professional",
                  description:
                    "Subtle animations that enhance UX without being distracting",
                },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="mb-3 text-3xl">{feature.icon}</div>
                  <h3 className="text-foreground mb-2 font-medium">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Buttons with Glare */}
            <div className="mt-8 flex justify-center gap-4">
              <GlareHover {...GlarePresets.button} borderRadius="0.5rem">
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-medium transition-colors">
                  View Documentation
                </button>
              </GlareHover>

              <GlareHover {...GlarePresets.button} borderRadius="0.5rem">
                <button className="border-border hover:bg-muted rounded-lg border px-6 py-3 font-medium transition-colors">
                  Live Examples
                </button>
              </GlareHover>
            </div>
          </div>
        </FadeContent>

        {/* Performance Note */}
        <div className="text-muted-foreground mt-12 text-center text-sm">
          <p>
            All animations automatically respect{" "}
            <code className="bg-muted rounded px-1">
              prefers-reduced-motion
            </code>{" "}
            settings for accessibility.
          </p>
        </div>
      </div>
    </div>
  );
}
