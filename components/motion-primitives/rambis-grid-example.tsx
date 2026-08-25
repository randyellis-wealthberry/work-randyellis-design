"use client";

import { cn } from "@/lib/utils";
import {
  AnimatedContent,
  AnimatedContentItem,
  GlareHover,
  GlarePresets,
  FadeContent,
  ProgressiveDisclosure,
} from "./index";

// Example grid card component with motion primitives
export function RambisGridCard({
  title,
  description,
  className,
  delay = 0,
}: {
  title: string;
  description: string;
  className?: string;
  delay?: number;
}) {
  return (
    <AnimatedContentItem delay={delay} className={className}>
      <GlareHover
        {...GlarePresets.card}
        className="h-full"
        borderRadius="0.75rem"
      >
        <div
          className={cn(
            "bg-card border-border relative overflow-hidden rounded-xl border",
            "h-full p-6 transition-all duration-300",
            "hover:-translate-y-1 hover:shadow-lg",
            "group cursor-pointer",
          )}
        >
          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Subtle gradient overlay for depth */}
          <div className="to-muted/20 absolute inset-0 bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </GlareHover>
    </AnimatedContentItem>
  );
}

export type RambisGridAction = { label: string; href: string };

export type RambisGridFooter = {
  heading?: string;
  body?: string;
  primary?: RambisGridAction;
  secondary?: RambisGridAction;
};

const DEFAULT_FOOTER: Required<Pick<RambisGridFooter, "heading" | "body">> & {
  primaryLabel: string;
  secondaryLabel: string;
} = {
  heading: "Ready to get started?",
  body: "Explore our component library and start building amazing user interfaces with Rambis UI.",
  primaryLabel: "View Components",
  secondaryLabel: "Documentation",
};

const PRIMARY_ACTION_CLASS =
  "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-lg px-6 py-3 font-medium transition-colors";
const SECONDARY_ACTION_CLASS =
  "border-border hover:bg-muted inline-flex items-center rounded-lg border px-6 py-3 font-medium transition-colors";

function FooterAction({
  action,
  fallbackLabel,
  className,
}: {
  action?: RambisGridAction;
  fallbackLabel: string;
  className: string;
}) {
  if (action?.href) {
    const external = /^https?:\/\//.test(action.href);
    return (
      <a
        href={action.href}
        className={className}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {action.label}
      </a>
    );
  }
  return (
    <button type="button" className={className}>
      {action?.label ?? fallbackLabel}
    </button>
  );
}

// Example grid layout with staggered animations
export function RambisAnimatedGrid({
  title = "Rambis UI Components",
  subtitle = "Professional design system components",
  items = [],
  className,
  footer,
}: {
  title?: string;
  subtitle?: string;
  items?: Array<{ title: string; description: string }>;
  className?: string;
  /** Closing call-to-action block; pass hrefs to turn the buttons into links. */
  footer?: RambisGridFooter;
}) {
  const defaultItems = [
    {
      title: "Component Library",
      description:
        "Comprehensive set of reusable UI components built with modern React patterns and TypeScript for type safety.",
    },
    {
      title: "Design Tokens",
      description:
        "Consistent design tokens for colors, typography, spacing, and shadows that maintain visual harmony.",
    },
    {
      title: "Motion Primitives",
      description:
        "Smooth, performant animations that respect user preferences and enhance the user experience.",
    },
    {
      title: "Accessibility First",
      description:
        "WCAG 2.1 AA compliant components with keyboard navigation, screen reader support, and focus management.",
    },
    {
      title: "Developer Experience",
      description:
        "TypeScript support, comprehensive documentation, and intuitive APIs for rapid development.",
    },
    {
      title: "Performance Optimized",
      description:
        "Lazy loading, code splitting, and optimized bundle sizes for fast loading times.",
    },
  ];

  const gridItems = items.length > 0 ? items : defaultItems;

  return (
    <section className={cn("px-4 py-16", className)}>
      <div className="mx-auto max-w-7xl">
        {/* Header with progressive disclosure */}
        <ProgressiveDisclosure
          staggerDelay={0.2}
          direction="up"
          distance={30}
          duration={0.6}
        >
          {[
            <div key="title" className="mb-4 text-center">
              <h2 className="text-foreground text-3xl font-bold md:text-4xl">
                {title}
              </h2>
            </div>,
            <div key="subtitle" className="mb-16 text-center">
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                {subtitle}
              </p>
            </div>,
          ]}
        </ProgressiveDisclosure>

        {/* Animated grid */}
        <AnimatedContent
          staggerDelay={0.1} // 100ms delay between grid items
          staggerDirection="top"
          duration={0.6}
          distance={30}
          once={true}
          threshold={0.1}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gridItems.map((item, index) => (
              <RambisGridCard
                key={index}
                title={item.title}
                description={item.description}
                delay={index * 0.1} // Stagger each card by 100ms
              />
            ))}
          </div>
        </AnimatedContent>

        {/* Footer with fade content */}
        <FadeContent
          direction="up"
          distance={20}
          duration={0.8}
          delay={0.6}
          className="mt-16 text-center"
        >
          <div className="bg-muted/50 border-border rounded-2xl border p-8">
            <h3 className="text-foreground mb-4 text-xl font-semibold">
              {footer?.heading ?? DEFAULT_FOOTER.heading}
            </h3>
            <p className="text-muted-foreground mx-auto mb-6 max-w-lg">
              {footer?.body ?? DEFAULT_FOOTER.body}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <GlareHover {...GlarePresets.button} borderRadius="0.5rem">
                <FooterAction
                  action={footer?.primary}
                  fallbackLabel={DEFAULT_FOOTER.primaryLabel}
                  className={PRIMARY_ACTION_CLASS}
                />
              </GlareHover>
              <FooterAction
                action={footer?.secondary}
                fallbackLabel={DEFAULT_FOOTER.secondaryLabel}
                className={SECONDARY_ACTION_CLASS}
              />
            </div>
          </div>
        </FadeContent>
      </div>
    </section>
  );
}

// Performance monitoring wrapper
export function PerformanceMonitoredGrid(
  props: Parameters<typeof RambisAnimatedGrid>[0],
) {
  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    // Render without animations for accessibility
    return (
      <section className={cn("px-4 py-16", props.className)}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
              {props.title || "Rambis UI Components"}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              {props.subtitle || "Professional design system components"}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(props.items || []).map((item, index) => (
              <div key={index} className="h-full">
                <div
                  className={cn(
                    "bg-card border-border relative overflow-hidden rounded-xl border",
                    "h-full p-6",
                  )}
                >
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return <RambisAnimatedGrid {...props} />;
}
