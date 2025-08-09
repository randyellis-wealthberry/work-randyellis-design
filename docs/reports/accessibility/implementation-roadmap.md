# WCAG 2.1 AA Implementation Roadmap

**Randy Ellis Portfolio - Level 99 Accessibility Enhancement**

_Implementation Guide with Code Examples_

---

## Implementation Phases

### Phase 1: Motion Accessibility (Days 1-3)

**Priority: CRITICAL | WCAG: 2.3.3 | Effort: Medium**

#### 1.1 Create Motion Preference Hook

**File: `/lib/hooks/use-reduced-motion.ts`**

```typescript
import { useEffect, useState } from "react";

/**
 * Custom hook to detect user's motion preferences
 * Respects prefers-reduced-motion media query
 * Updates dynamically if user changes system settings
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Motion configuration hook for Framer Motion
 * Returns safe motion values based on user preferences
 */
export function useMotionConfig() {
  const prefersReducedMotion = useReducedMotion();

  return {
    duration: prefersReducedMotion ? 0.01 : 0.3,
    ease: prefersReducedMotion ? "linear" : "easeInOut",
    stagger: prefersReducedMotion ? 0 : 0.1,
    scale: prefersReducedMotion ? 1 : undefined,
    y: prefersReducedMotion ? 0 : undefined,
    opacity: 1, // Always animate opacity as it's safe
  };
}
```

#### 1.2 Update Global Motion Configuration

**File: `/app/layout.tsx`** (Add to existing layout)

```typescript
// Add these imports
import { MotionConfig } from "motion/react";

// Update RootLayout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PersonStructuredData />
        <WebsiteStructuredData />
        <ProfessionalServiceStructuredData />
        <OrganizationStructuredData />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          {/* Add MotionConfig wrapper */}
          <MotionConfig reducedMotion="user">
            <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
              <div className="relative mx-auto w-full max-w-screen-md flex-1 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-6">
                <Header />
                {children}
                <NewsletterSignup />
                <Footer />
              </div>
            </div>
          </MotionConfig>
        </ThemeProvider>
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <CookieConsent />
      </body>
    </html>
  );
}
```

#### 1.3 Update Text Effect Component

**File: `/components/ui/text-effect.tsx`** (Create accessible version)

```typescript
"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface TextEffectProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  preset?: "fade" | "slide" | "blur";
  per?: "word" | "char";
  className?: string;
  delay?: number;
}

export function TextEffect({
  children,
  as = "p",
  preset = "fade",
  per = "word",
  className = "",
  delay = 0,
}: TextEffectProps) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as] as any;

  // If user prefers reduced motion, return static text
  if (prefersReducedMotion) {
    const StaticComponent = as;
    return (
      <StaticComponent className={className}>
        {children}
      </StaticComponent>
    );
  }

  // Split text based on preference
  const splitText = per === "char"
    ? children.split("")
    : children.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: per === "char" ? 0.02 : 0.08,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: preset === "slide" ? 20 : 0,
      filter: preset === "blur" ? "blur(4px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <Component
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      // Add ARIA attributes for screen readers
      aria-label={children}
    >
      {splitText.map((item, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          style={{ display: "inline-block" }}
          // Prevent screen readers from reading individual characters
          aria-hidden="true"
        >
          {item}
          {per === "word" && index < splitText.length - 1 && " "}
        </motion.span>
      ))}
      {/* Hidden text for screen readers */}
      <span className="sr-only">{children}</span>
    </Component>
  );
}
```

#### 1.4 Update Terminal Component

**File: `/components/magicui/terminal.tsx`** (Enhance existing)

```typescript
// Add to existing imports
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

// Update AnimatedSpan component
export function AnimatedSpan({
  children,
  delay = 0,
  className = ""
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  // If reduced motion, show immediately
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Original animated implementation
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000, duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Update TypingAnimation component
export function TypingAnimation({ children }: { children: string }) {
  const prefersReducedMotion = useReducedMotion();

  // If reduced motion, show complete text immediately
  if (prefersReducedMotion) {
    return <span className="font-mono">{children}</span>;
  }

  // Original typing animation logic here
  // ... existing implementation
}
```

### Phase 2: Focus Management (Days 3-5)

**Priority: CRITICAL | WCAG: 2.4.3, 2.4.7 | Effort: High**

#### 2.1 Enhanced Focus Trap Component

**File: `/components/ui/focus-trap.tsx`** (New file)

```typescript
"use client";

import { useEffect, useRef, useCallback } from "react";

interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  restoreFocus?: boolean;
  onEscape?: () => void;
  initialFocus?: HTMLElement | null;
}

export function FocusTrap({
  children,
  active,
  restoreFocus = true,
  onEscape,
  initialFocus,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  }, []);

  useEffect(() => {
    if (!active) return;

    // Store the currently focused element
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    const focusableElements = getFocusableElements();
    const firstElement = initialFocus || focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element
    if (firstElement) {
      firstElement.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape?.();
        return;
      }

      // Handle Tab key for focus trap
      if (e.key === 'Tab') {
        const currentFocusableElements = getFocusableElements();
        const currentFirstElement = currentFocusableElements[0];
        const currentLastElement = currentFocusableElements[currentFocusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === currentFirstElement) {
            e.preventDefault();
            currentLastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === currentLastElement) {
            e.preventDefault();
            currentFirstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus to previously focused element
      if (restoreFocus && previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [active, getFocusableElements, initialFocus, onEscape, restoreFocus]);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

#### 2.2 Update Header with Focus Management

**File: `/app/header.tsx`** (Update existing)

```typescript
// Add imports
import { FocusTrap } from "@/components/ui/focus-trap";

// Update Header component
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Skip Navigation Link for Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header
        className="mb-12 sm:mb-10 flex items-center justify-between gap-8 sm:gap-6"
        role="banner"
      >
        <div className="pt-20 sm:pt-24">
          <Link
            href="/"
            className="font-medium text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
          >
            Randy Ellis
          </Link>
          <TextEffect
            as="p"
            preset="fade"
            per="char"
            className="text-zinc-600 dark:text-zinc-500"
            delay={0.5}
          >
            Generative AI & Product Design Engineer
          </TextEffect>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden sm:flex items-center gap-8 sm:gap-10 md:gap-12 lg:gap-16"
          role="navigation"
          aria-label="Main navigation"
        >
          <Link
            href="https://randyellis.design"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-3 px-3 sm:px-4 min-h-[44px] flex items-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-3 px-3 sm:px-4 min-h-[44px] flex items-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            About
          </Link>
          <Link
            href="/projects"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-3 px-3 sm:px-4 min-h-[44px] flex items-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Projects
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="sm:hidden p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          ) : (
            <Menu className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          )}
        </button>

        {/* Mobile Navigation Menu with Focus Trap */}
        {isMobileMenuOpen && (
          <FocusTrap active={isMobileMenuOpen} onEscape={closeMobileMenu}>
            <div
              id="mobile-menu"
              className="sm:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg z-50"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <nav className="flex flex-col p-4 space-y-2">
                <Link
                  href="https://randyellis.design"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-3 px-3 min-h-[44px] flex items-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-3 px-3 min-h-[44px] flex items-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
                <Link
                  href="/projects"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-3 px-3 min-h-[44px] flex items-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={closeMobileMenu}
                >
                  Projects
                </Link>
              </nav>
            </div>
          </FocusTrap>
        )}
      </header>
    </>
  );
}
```

#### 2.3 Update Footer Theme Switch with Focus

**File: `/app/footer.tsx`** (Update ThemeSwitch)

```typescript
// Update ThemeSwitch component
function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div role="radiogroup" aria-label="Theme selection">
      <AnimatedBackground
        className="pointer-events-none rounded-lg bg-zinc-100 dark:bg-zinc-800"
        defaultValue={theme}
        transition={{
          type: "spring",
          bounce: 0,
          duration: 0.2,
        }}
        enableHover={false}
        onValueChange={(id) => {
          setTheme(id as string);
        }}
      >
        {THEMES_OPTIONS.map((themeOption) => {
          const isSelected = theme === themeOption.id;
          return (
            <button
              key={themeOption.id}
              className="inline-flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950 data-[checked=true]:text-zinc-950 dark:text-zinc-400 dark:data-[checked=true]:text-zinc-50 rounded-md"
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Switch to ${themeOption.label} theme`}
              data-id={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
            >
              {themeOption.icon}
            </button>
          );
        })}
      </AnimatedBackground>
    </div>
  );
}
```

### Phase 3: ARIA Enhancement (Days 5-7)

**Priority: HIGH | WCAG: 4.1.2 | Effort: Medium**

#### 3.1 Update Main Page with Semantic Structure

**File: `/app/page.tsx`** (Add ARIA landmarks)

```typescript
// Update the main component structure
export default function Personal() {
  const [selectedProjects, setSelectedProjects] = useState<typeof PROJECTS>([]);

  useEffect(() => {
    setSelectedProjects(getRandomProjects(PROJECTS, 2));
  }, []);

  return (
    <motion.main
      id="main-content"
      className="space-y-32 sm:space-y-24"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
      tabIndex={-1}
      role="main"
      aria-label="Randy Ellis Portfolio Content"
    >
      {/* Introduction Section */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        aria-labelledby="intro-heading"
      >
        <h1
          id="intro-heading"
          className="sr-only"
        >
          Randy Ellis - AI Product Design Engineer Introduction
        </h1>
        <div className="flex-1">
          <p className="text-zinc-600 dark:text-zinc-400">
            I&rsquo;m a product design strategist who&rsquo;s generated $50M in
            product value while scaling design teams for Fortune 500 companies.
            With recent AI leadership training and 15+ years bridging design,
            technology, and business strategy, I help organizations build design
            capabilities that drive measurable business outcomes. Also a decent
            cook.
          </p>
        </div>
      </motion.section>

      {/* Metrics Section */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        aria-labelledby="metrics-heading"
      >
        <h2 id="metrics-heading" className="sr-only">
          Impact Metrics
        </h2>
        <AnimatedNumberBasic />
      </motion.section>

      {/* Core Ideologies Section */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        aria-labelledby="ideologies-heading"
      >
        <ScrambleSectionTitle
          id="ideologies-heading"
          className="mb-5 text-lg font-medium"
        >
          Core Ideologies
        </ScrambleSectionTitle>
        <TransitionPanelExample />
      </motion.section>

      {/* Featured Work Section */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="mt-40 sm:mt-32"
        aria-labelledby="featured-work-heading"
        role="region"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-1">
            <ScrambleSectionTitle
              id="featured-work-heading"
              className="text-lg font-medium"
            >
              Featured Work
            </ScrambleSectionTitle>
            <p
              className="text-sm text-zinc-500 dark:text-zinc-400"
              aria-describedby="featured-work-heading"
            >
              Highlights from $50M+ in product value generated
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-xs text-zinc-400 dark:text-zinc-500"
              aria-label={`Showing 2 of ${PROJECTS.filter(p => p.featured).length} featured projects`}
            >
              2 of {PROJECTS.filter(p => p.featured).length} featured
            </span>
            <Link
              href="/projects"
              className="group relative inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-200 py-2 px-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="View all projects page"
            >
              View all projects
              <svg
                className="ml-1 h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="absolute bottom-0 left-3 right-3 block h-[1px] w-auto max-w-0 bg-zinc-900 dark:bg-zinc-50 transition-all duration-200 group-hover:max-w-full"></span>
            </Link>
          </div>
        </div>

        <div
          className="grid grid-cols-1 gap-12 sm:gap-8 sm:grid-cols-2"
          role="list"
          aria-label="Featured projects"
        >
          {selectedProjects.length > 0
            ? selectedProjects.map((project) => (
                <article
                  key={project.id}
                  className="space-y-4"
                  role="listitem"
                  aria-labelledby={`project-${project.id}-title`}
                >
                  <ProjectThumbnail project={project} />
                  <div className="px-1">
                    <Link
                      id={`project-${project.id}-title`}
                      className="font-base group relative inline-block font-[450] text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                      href={`/projects/${project.slug}`}
                      onClick={() => trackProjectView(project.name)}
                      aria-describedby={`project-${project.id}-description`}
                    >
                      {project.name}
                      <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 dark:bg-zinc-50 transition-all duration-200 group-hover:max-w-full"></span>
                    </Link>
                    {project.subtitle && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {project.subtitle}
                      </p>
                    )}
                    <p
                      id={`project-${project.id}-description`}
                      className="text-base text-zinc-600 dark:text-zinc-400 mb-3"
                    >
                      {project.description}
                    </p>
                    {project.metrics && (
                      <div
                        className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400"
                        role="list"
                        aria-label="Project metrics"
                      >
                        {project.metrics.slice(0, 2).map((metric, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1"
                            role="listitem"
                          >
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                              {metric.value}
                            </span>
                            <span>{metric.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))
            : // Loading placeholder during hydration
              Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="space-y-4"
                  role="listitem"
                  aria-label="Loading project"
                >
                  <div className="aspect-video w-full max-h-48 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                  <div className="px-1 space-y-2">
                    <div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-5/6 animate-pulse" />
                  </div>
                </div>
              ))}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        aria-labelledby="connect-heading"
        role="region"
      >
        <ScrambleSectionTitle
          id="connect-heading"
          className="mb-5 text-lg font-medium"
        >
          Connect
        </ScrambleSectionTitle>
        <p className="mb-5 text-zinc-600 dark:text-zinc-400">
          Feel free to contact me at{" "}
          <a
            className="underline dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
            href={`mailto:${getEmail()}`}
            onClick={() => trackContactIntent("email", getEmail())}
            aria-label={`Send email to ${getEmail()}`}
          >
            <DecodedEmail />
          </a>
        </p>
        <div
          className="flex items-center justify-start space-x-3"
          role="list"
          aria-label="Social media links"
        >
          {SOCIAL_LINKS.map((link) => (
            <div key={link.label} role="listitem">
              <MagneticSocialLink link={link.link}>
                {link.label}
              </MagneticSocialLink>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.main>
  );
}
```

#### 3.2 Enhanced Newsletter Form Accessibility

**File: `/components/ui/newsletter-signup.tsx`** (Update existing)

```typescript
// Add ARIA enhancements to the newsletter signup form
export function NewsletterSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error" | "rate_limited"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  // ... existing onSubmit logic ...

  return (
    <motion.section
      className="mt-24 border-t border-zinc-100 dark:border-zinc-800 pt-16 pb-8 min-h-[600px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="newsletter-heading"
      role="region"
    >
      {submitStatus === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-lg mx-auto text-center flex flex-col justify-center h-full min-h-[520px]"
          role="alert"
          aria-live="polite"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-[350px] h-[350px]" aria-hidden="true">
              <DotLottieReact
                src="https://lottie.host/749b3ff8-0097-4e37-8cbd-2fa2687bcae7/ZV6PZUEF3p.json"
                loop={false}
                autoplay={true}
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Successfully subscribed!
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Please check your email for a confirmation message.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-lg mx-auto text-center space-y-8 min-h-[520px] flex flex-col justify-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4" aria-hidden="true">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <div className="w-1 h-1 rounded-full bg-blue-400"></div>
              <div className="w-0.5 h-0.5 rounded-full bg-blue-300"></div>
            </div>
            <h3
              id="newsletter-heading"
              className="text-2xl font-bold text-zinc-900 dark:text-zinc-100"
            >
              Business Strategy Prompts
              <br />
              for Product Designers
            </h3>
            <p
              className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4"
              id="newsletter-description"
            >
              Get weekly insights that bridge design thinking with business
              strategy. Transform from pixel-pusher to strategic partner in the
              boardroom.
            </p>

            {/* Value Preview */}
            <div
              className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 mt-6"
              aria-labelledby="examples-heading"
            >
              <h4
                id="examples-heading"
                className="font-medium text-zinc-900 dark:text-zinc-100 mb-2 text-sm"
              >
                Recent prompt examples:
              </h4>
              <ul
                className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400"
                role="list"
              >
                <li className="flex items-start gap-2" role="listitem">
                  <span className="text-blue-600 mt-1" aria-hidden="true">•</span>
                  <span>"How to quantify design impact in business metrics"</span>
                </li>
                <li className="flex items-start gap-2" role="listitem">
                  <span className="text-blue-600 mt-1" aria-hidden="true">•</span>
                  <span>"Presenting design ROI to C-suite executives"</span>
                </li>
                <li className="flex items-start gap-2" role="listitem">
                  <span className="text-blue-600 mt-1" aria-hidden="true">•</span>
                  <span>"Strategic design decisions that drive revenue"</span>
                </li>
              </ul>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
              role="form"
              aria-labelledby="newsletter-heading"
              aria-describedby="newsletter-description"
            >
              {/* Live region for form status announcements */}
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
              >
                {isSubmitting && "Subscribing to newsletter..."}
                {submitStatus === "success" && "Successfully subscribed!"}
                {submitStatus === "error" && `Error: ${errorMessage}`}
                {submitStatus === "rate_limited" && `Rate limited: ${errorMessage}`}
              </div>

              <FloatingInput
                {...register("email")}
                type="email"
                label="Email Address"
                required
                aria-describedby={errors.email ? "email-error" : "email-help"}
                aria-invalid={!!errors.email}
                disabled={isSubmitting}
                error={errors.email?.message}
              />

              <div
                id="email-help"
                className="sr-only"
              >
                Enter your email address to receive weekly business strategy insights for designers
              </div>

              <fieldset className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <legend className="sr-only">Newsletter consent</legend>
                <div className="flex items-start gap-3">
                  <input
                    {...register("consent")}
                    type="checkbox"
                    id="newsletter-consent"
                    className="mt-0.5 w-4 h-4 text-blue-600 bg-white border-zinc-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600 flex-shrink-0"
                    disabled={isSubmitting}
                    aria-describedby="consent-description"
                    aria-required="true"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="newsletter-consent"
                      className="block text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed cursor-pointer"
                    >
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        Yes, send me weekly strategy insights!
                      </span>
                    </label>
                    <p
                      id="consent-description"
                      className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed"
                    >
                      Free to unsubscribe anytime. Read our{" "}
                      <a
                        href="/privacy-policy"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline decoration-1 underline-offset-2 hover:decoration-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
                        target="_blank"
                        rel="noopener"
                        aria-label="Privacy Policy (opens in new tab)"
                      >
                        Privacy Policy
                      </a>.
                    </p>
                  </div>
                </div>
              </fieldset>

              {errors.consent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 border rounded-lg bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700"
                  role="alert"
                  aria-live="assertive"
                  id="consent-error"
                >
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {errors.consent.message}
                  </p>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500/20 font-medium text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                size="lg"
                aria-describedby={isSubmitting ? "submitting-status" : undefined}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>

              <div id="submitting-status" className="sr-only">
                {isSubmitting && "Please wait while we process your subscription"}
              </div>

              {(submitStatus === "error" || submitStatus === "rate_limited") && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 border rounded-lg ${
                    submitStatus === "rate_limited"
                      ? "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700"
                      : "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700"
                  }`}
                  role="alert"
                  aria-live="assertive"
                >
                  <p
                    className={`text-sm ${
                      submitStatus === "rate_limited"
                        ? "text-orange-700 dark:text-orange-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {errorMessage || "Something went wrong. Please try again."}
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>

          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              No spam. Unsubscribe anytime. Your privacy matters to us.
            </p>
          </div>
        </div>
      )}
    </motion.section>
  );
}
```

### Phase 4: Testing Implementation (Days 7-10)

**Priority: HIGH | Testing Coverage | Effort: Medium**

#### 4.1 Accessibility Testing Setup

**File: `/jest.setup.js`** (Update existing)

```javascript
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock motion preferences
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: query === "(prefers-reduced-motion: reduce)" ? false : true,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));
```

#### 4.2 Component Accessibility Tests

**File: `/__tests__/accessibility/header.test.tsx`** (New file)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Header } from '@/app/header';

expect.extend(toHaveNoViolations);

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

describe('Header Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Header />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper skip navigation link', () => {
    render(<Header />);
    const skipLink = screen.getByText('Skip to main content');

    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(skipLink).toHaveClass('sr-only');
  });

  it('should support keyboard navigation for desktop menu', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const homeLink = screen.getByRole('link', { name: /home/i });
    const aboutLink = screen.getByRole('link', { name: /about/i });
    const projectsLink = screen.getByRole('link', { name: /projects/i });

    // Tab through navigation links
    await user.tab();
    expect(homeLink).toHaveFocus();

    await user.tab();
    expect(aboutLink).toHaveFocus();

    await user.tab();
    expect(projectsLink).toHaveFocus();
  });

  it('should support keyboard navigation for mobile menu', async () => {
    const user = userEvent.setup();

    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640,
    });

    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();

    // Open mobile menu with keyboard
    await user.click(menuButton);

    const mobileHomeLink = screen.getAllByRole('link', { name: /home/i })[1];
    expect(mobileHomeLink).toBeVisible();

    // Test focus trap
    await user.tab();
    expect(mobileHomeLink).toHaveFocus();
  });

  it('should handle escape key in mobile menu', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    await user.click(menuButton);

    // Menu should be open
    expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeVisible();

    // Press escape
    await user.keyboard('{Escape}');

    // Menu should be closed
    expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).not.toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    const mainNav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(mainNav).toBeInTheDocument();

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
  });

  it('should announce mobile menu state changes', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });

    // Initially closed
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu');

    // Open menu
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(menuButton).toHaveAttribute('aria-label', 'Close menu');
  });
});
```

#### 4.3 Motion Accessibility Tests

**File: `/__tests__/accessibility/motion.test.tsx`** (New file)

```typescript
import { render, screen } from '@testing-library/react';
import { TextEffect } from '@/components/ui/text-effect';

// Mock the motion hook
const mockUseReducedMotion = jest.fn();
jest.mock('@/lib/hooks/use-reduced-motion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

describe('Motion Accessibility', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render static text when reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true);

    render(
      <TextEffect preset="fade" per="char">
        Test text content
      </TextEffect>
    );

    const text = screen.getByText('Test text content');
    expect(text).toBeInTheDocument();
    expect(text.tagName).toBe('P'); // Should render as static element
  });

  it('should render animated text when motion is allowed', () => {
    mockUseReducedMotion.mockReturnValue(false);

    render(
      <TextEffect preset="fade" per="char">
        Test text content
      </TextEffect>
    );

    // Should have motion wrapper and hidden text for screen readers
    const hiddenText = screen.getByText('Test text content', {
      selector: '.sr-only'
    });
    expect(hiddenText).toBeInTheDocument();
  });

  it('should provide proper ARIA labels for animated content', () => {
    mockUseReducedMotion.mockReturnValue(false);

    const { container } = render(
      <TextEffect preset="fade" per="char">
        Animated content
      </TextEffect>
    );

    const motionElement = container.querySelector('[aria-label]');
    expect(motionElement).toHaveAttribute('aria-label', 'Animated content');
  });

  it('should handle prefers-reduced-motion media query changes', () => {
    let mediaQueryCallback: ((event: MediaQueryListEvent) => void) | null = null;

    const mockMatchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn((event, callback) => {
        if (event === 'change') {
          mediaQueryCallback = callback;
        }
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    const { rerender } = render(
      <TextEffect>Test content</TextEffect>
    );

    // Simulate media query change
    if (mediaQueryCallback) {
      mediaQueryCallback({ matches: true } as MediaQueryListEvent);
    }

    rerender(<TextEffect>Test content</TextEffect>);

    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });
});
```

#### 4.4 Form Accessibility Tests

**File: `/__tests__/accessibility/newsletter-form.test.tsx`** (New file)

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { NewsletterSignup } from '@/components/ui/newsletter-signup';

expect.extend(toHaveNoViolations);

// Mock fetch for form submission
global.fetch = jest.fn();

describe('Newsletter Form Accessibility', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should not have accessibility violations', async () => {
    const { container } = render(<NewsletterSignup />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper form labels and descriptions', () => {
    render(<NewsletterSignup />);

    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    expect(emailInput).toHaveAttribute('aria-describedby');
    expect(emailInput).toHaveAttribute('aria-required', 'true');

    const consentCheckbox = screen.getByRole('checkbox');
    expect(consentCheckbox).toHaveAttribute('aria-describedby', 'consent-description');
    expect(consentCheckbox).toHaveAttribute('aria-required', 'true');
  });

  it('should announce form validation errors', async () => {
    const user = userEvent.setup();
    render(<NewsletterSignup />);

    const submitButton = screen.getByRole('button', { name: /subscribe/i });

    // Try to submit without filling form
    await user.click(submitButton);

    await waitFor(() => {
      const emailError = screen.getByRole('alert');
      expect(emailError).toBeInTheDocument();
      expect(emailError).toHaveAttribute('aria-live', 'assertive');
    });
  });

  it('should have proper fieldset for consent checkbox', () => {
    render(<NewsletterSignup />);

    const fieldset = screen.getByRole('group');
    expect(fieldset.tagName).toBe('FIELDSET');

    const legend = fieldset.querySelector('legend');
    expect(legend).toHaveTextContent('Newsletter consent');
    expect(legend).toHaveClass('sr-only');
  });

  it('should announce form submission status', async () => {
    const user = userEvent.setup();

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<NewsletterSignup />);

    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const consentCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });

    // Fill and submit form
    await user.type(emailInput, 'test@example.com');
    await user.click(consentCheckbox);
    await user.click(submitButton);

    // Should announce submission status
    await waitFor(() => {
      const statusRegion = screen.getByRole('status');
      expect(statusRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  it('should handle keyboard navigation properly', async () => {
    const user = userEvent.setup();
    render(<NewsletterSignup />);

    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const consentCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    const privacyLink = screen.getByRole('link', { name: /privacy policy/i });

    // Tab through form elements
    await user.tab();
    expect(emailInput).toHaveFocus();

    await user.tab();
    expect(consentCheckbox).toHaveFocus();

    await user.tab();
    expect(privacyLink).toHaveFocus();

    await user.tab();
    expect(submitButton).toHaveFocus();
  });

  it('should provide clear error messages', async () => {
    const user = userEvent.setup();
    render(<NewsletterSignup />);

    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const submitButton = screen.getByRole('button', { name: /subscribe/i });

    // Enter invalid email
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(/invalid email address/i);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.closest('[role="alert"]')).toBeInTheDocument();
    });
  });

  it('should mark invalid fields appropriately', async () => {
    const user = userEvent.setup();
    render(<NewsletterSignup />);

    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const submitButton = screen.getByRole('button', { name: /subscribe/i });

    // Trigger validation
    await user.type(emailInput, 'invalid');
    await user.click(submitButton);

    await waitFor(() => {
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
```

#### 4.5 E2E Accessibility Tests

**File: `/__tests__/e2e/accessibility.spec.ts`** (New file)

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Full Page Accessibility", () => {
  test("homepage should not have accessibility violations", async ({
    page,
  }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should respect reduced motion preferences", async ({ page }) => {
    // Enable reduced motion
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Check that animations are disabled or minimal
    const animatedElements = await page.locator("[data-motion]").count();

    // Verify motion elements respect preferences
    if (animatedElements > 0) {
      const firstAnimated = page.locator("[data-motion]").first();
      await expect(firstAnimated).toHaveCSS("animation-duration", "0.01s");
    }
  });

  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("/");

    // Start keyboard navigation
    await page.keyboard.press("Tab");

    // Should focus skip link first
    const skipLink = page.getByText("Skip to main content");
    await expect(skipLink).toBeFocused();

    // Continue tabbing through interactive elements
    await page.keyboard.press("Tab");
    const firstNavLink = page.getByRole("link", { name: /home/i }).first();
    await expect(firstNavLink).toBeFocused();
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
    const headingLevels: number[] = [];

    for (const heading of headings) {
      const tagName = await heading.evaluate((el) => el.tagName);
      const level = parseInt(tagName.charAt(1));
      headingLevels.push(level);
    }

    // Verify logical heading progression
    for (let i = 1; i < headingLevels.length; i++) {
      const diff = headingLevels[i] - headingLevels[i - 1];
      expect(diff).toBeLessThanOrEqual(1);
    }
  });

  test("should announce dynamic content changes", async ({ page }) => {
    await page.goto("/");

    // Find newsletter form
    const emailInput = page.getByRole("textbox", { name: /email address/i });
    const submitButton = page.getByRole("button", { name: /subscribe/i });

    // Submit invalid form to trigger error announcement
    await emailInput.fill("invalid-email");
    await submitButton.click();

    // Check for live region announcement
    const liveRegion = page.locator('[role="alert"], [aria-live]');
    await expect(liveRegion).toBeVisible();
  });

  test("should have sufficient color contrast", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .include("body")
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === "color-contrast",
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test("should work with high contrast mode", async ({ page }) => {
    // Enable high contrast
    await page.emulateMedia({
      colorScheme: "dark",
      forcedColors: "active",
    });

    await page.goto("/");

    // Verify page still functions and is readable
    const mainContent = page.getByRole("main");
    await expect(mainContent).toBeVisible();

    // Check for proper focus indicators in high contrast
    await page.keyboard.press("Tab");
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("should support screen reader navigation", async ({ page }) => {
    await page.goto("/");

    // Check for proper landmarks
    const main = page.getByRole("main");
    const navigation = page.getByRole("navigation");
    const banner = page.getByRole("banner");

    await expect(main).toBeVisible();
    await expect(navigation).toBeVisible();
    await expect(banner).toBeVisible();

    // Verify landmark labels
    await expect(main).toHaveAttribute("aria-label");
    await expect(navigation.first()).toHaveAttribute("aria-label");
  });
});

test.describe("Mobile Accessibility", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should have adequate touch targets on mobile", async ({ page }) => {
    await page.goto("/");

    const interactiveElements = await page
      .locator('button, a, input, [tabindex]:not([tabindex="-1"])')
      .all();

    for (const element of interactiveElements) {
      const box = await element.boundingBox();
      if (box) {
        // WCAG 2.5.5 - Target Size (minimum 44x44 CSS pixels)
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test("should handle mobile menu accessibility", async ({ page }) => {
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /menu/i });
    await expect(menuButton).toBeVisible();

    // Open mobile menu
    await menuButton.click();

    // Check for proper ARIA attributes
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");

    const mobileNav = page.getByRole("navigation", { name: /mobile/i });
    await expect(mobileNav).toBeVisible();

    // Test focus trap
    await page.keyboard.press("Tab");
    const firstLink = mobileNav.getByRole("link").first();
    await expect(firstLink).toBeFocused();
  });
});
```

---

## Monitoring & Maintenance

### Continuous Integration Setup

**File: `/.github/workflows/accessibility.yml`** (New file)

```yaml
name: Accessibility Testing

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  accessibility:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run accessibility tests
        run: npm run test:a11y

      - name: Build application
        run: npm run build

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E accessibility tests
        run: npm run test:e2e:a11y

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: accessibility-test-results
          path: |
            test-results/
            playwright-report/
```

### Package.json Scripts

```json
{
  "scripts": {
    "test:a11y": "jest --testPathPattern=accessibility",
    "test:e2e:a11y": "playwright test accessibility",
    "test:a11y:watch": "jest --testPathPattern=accessibility --watch",
    "lint:a11y": "eslint . --ext .tsx,.ts --config .eslintrc.a11y.js"
  }
}
```

### ESLint Accessibility Configuration

**File: `/.eslintrc.a11y.js`** (New file)

```javascript
module.exports = {
  extends: ["plugin:jsx-a11y/recommended"],
  plugins: ["jsx-a11y"],
  rules: {
    "jsx-a11y/no-static-element-interactions": "error",
    "jsx-a11y/click-events-have-key-events": "error",
    "jsx-a11y/no-noninteractive-element-interactions": "error",
    "jsx-a11y/aria-role": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/img-redundant-alt": "error",
    "jsx-a11y/label-has-associated-control": "error",
    "jsx-a11y/form-control-has-label": "error",
  },
};
```

---

## Success Metrics & Validation

### Key Performance Indicators

1. **WCAG Compliance Score**: Target 100% AA compliance
2. **Automated Test Coverage**: 95%+ accessibility test coverage
3. **Manual Test Completion**: 100% of critical user flows
4. **Performance Impact**: <5% bundle size increase
5. **User Feedback**: Positive accessibility community response

### Validation Checkpoints

#### Week 1 Checkpoint

- [ ] Motion preferences implemented
- [ ] Focus management enhanced
- [ ] Basic ARIA structure added
- [ ] Initial automated tests passing

#### Week 2 Checkpoint

- [ ] Complete ARIA implementation
- [ ] Form accessibility enhanced
- [ ] Color contrast optimized
- [ ] Manual testing 80% complete

#### Week 3 Checkpoint

- [ ] E2E tests implemented
- [ ] CI/CD pipeline configured
- [ ] Documentation complete
- [ ] Team training delivered

#### Final Validation

- [ ] Third-party accessibility audit
- [ ] Screen reader user testing
- [ ] Performance benchmarks met
- [ ] Legal compliance verified

---

This implementation roadmap provides a comprehensive, step-by-step approach to achieving WCAG 2.1 AA compliance while maintaining the premium user experience of the portfolio website. Each phase builds upon the previous, ensuring systematic improvement toward Level 99 accessibility standards.
