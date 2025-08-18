"use client";

import {
  motion,
  useInView,
  AnimatePresence,
  LazyMotion,
  domAnimation,
} from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";
import { Spotlight } from "@/components/ui/spotlight";
import {
  ExternalLink,
  Target,
  Zap,
  Star,
  PartyPopper,
  Cloud,
  Brain,
  Search,
  Users,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { PROJECTS } from "@/lib/data/projects";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  memo,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { AnimatedNumber } from "@/components/core/animated-number";
import { parseMetricValue } from "@/lib/utils/parseMetricValue";

// 🚀 PERFORMANCE: Lazy load heavy components with loading fallbacks
const CelebrationParticles = lazy(() =>
  import("@/components/ui/celebration-particles").then((mod) => ({
    default: mod.CelebrationParticles,
  })),
);

const CustomCursor = lazy(() =>
  import("@/components/ui/custom-cursor").then((mod) => ({
    default: mod.CustomCursor,
  })),
);

const ReadingProgress = lazy(() =>
  import("@/components/ui/reading-progress").then((mod) => ({
    default: mod.ReadingProgress,
  })),
);

// 🚀 PERFORMANCE: Optimized animation variants with reduced complexity
const ANIMATION_CONFIG = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Reduced from 0.15
        ease: "easeOut",
      },
    },
  },
  section: {
    hidden: { opacity: 0, y: 12 }, // Reduced transform distance
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" }, // Reduced duration
    },
  },
  card: {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  },
} as const;

// 🚀 PERFORMANCE: Device capability detection hook
function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isHighEnd: false,
    isMobile: false,
    prefersReducedMotion: false,
    supportsHover: false,
  });

  useEffect(() => {
    const checkCapabilities = () => {
      const isHighEnd =
        navigator.hardwareConcurrency >= 4 &&
        (navigator as unknown as { deviceMemory?: number }).deviceMemory !==
          undefined &&
        (navigator as unknown as { deviceMemory: number }).deviceMemory >= 4;

      const isMobile =
        window.innerWidth < 768 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const supportsHover = window.matchMedia("(hover: hover)").matches;

      setCapabilities({
        isHighEnd,
        isMobile,
        prefersReducedMotion,
        supportsHover,
      });
    };

    checkCapabilities();
    window.addEventListener("resize", checkCapabilities);
    return () => window.removeEventListener("resize", checkCapabilities);
  }, []);

  return capabilities;
}

// 🚀 PERFORMANCE: Throttled scroll hook
function useOptimizedScroll() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setHasScrolled(window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return hasScrolled;
}

// Get the Echo project data
const echoProject = PROJECTS.find((p) => p.id === "echo")!;
const enhancedMetrics = [
  { label: "Storage Efficiency", value: "35%" },
  { label: "Search Speed", value: "5x faster" },
  { label: "User Adoption", value: "89%" },
  { label: "Collaboration Boost", value: "67%" },
];

// 🚀 PERFORMANCE: Highly optimized MetricCard with minimal re-renders
const MetricCard = memo(function MetricCard({
  metric,
  index,
  onCelebrate,
  reducedAnimations,
}: {
  metric: { label: string; value: string };
  index: number;
  onCelebrate: () => void;
  reducedAnimations: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  // 🚀 PERFORMANCE: Memoize expensive calculations
  const parsedMetric = useMemo(
    () => parseMetricValue(metric.value),
    [metric.value],
  );

  // 🚀 PERFORMANCE: Optimized animation trigger
  const triggerCelebration = useCallback(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(
        () => {
          setHasAnimated(true);
          onCelebrate();
        },
        reducedAnimations ? 300 + index * 50 : 800 + index * 100,
      );
      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimated, index, onCelebrate, reducedAnimations]);

  useEffect(triggerCelebration, [triggerCelebration]);

  const animationProps = reducedAnimations
    ? {
        initial: { opacity: 0 },
        animate: isInView ? { opacity: 1 } : { opacity: 0 },
        transition: { duration: 0.2 },
      }
    : {
        variants: ANIMATION_CONFIG.card,
        initial: "hidden",
        animate: isInView ? "visible" : "hidden",
        whileHover: { scale: 1.02, transition: { duration: 0.2 } },
        whileTap: { scale: 0.98, transition: { duration: 0.1 } },
      };

  return (
    <motion.div
      ref={ref}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30"
      role="button"
      tabIndex={0}
      aria-label={`${metric.label} metric: ${metric.value}`}
      {...animationProps}
    >
      <Spotlight
        className="from-emerald-900 via-blue-800 to-cyan-700 blur-2xl dark:from-emerald-100 dark:via-blue-200 dark:to-cyan-50"
        size={48} // Reduced from 64
      />

      <div className="relative h-full w-full rounded-[15px] bg-white p-6 dark:bg-zinc-950">
        <div className="text-center">
          {/* Achievement badge */}
          {hasAnimated &&
            metric.value.includes("%") &&
            parseInt(metric.value) >= 30 &&
            !reducedAnimations && (
              <motion.div
                className="absolute -top-2 -right-2 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 p-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3, type: "spring" }}
              >
                <Star className="h-3 w-3 text-white" />
              </motion.div>
            )}

          <div className="mb-2 flex items-center justify-center gap-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {parsedMetric.prefix && <span>{parsedMetric.prefix}</span>}
            <AnimatedNumber
              value={isInView ? parsedMetric.number : 0}
              springOptions={{
                bounce: 0.2,
                duration: reducedAnimations ? 500 : 1000 + index * 100,
              }}
              className="tabular-nums"
            />
            {parsedMetric.suffix && <span>{parsedMetric.suffix}</span>}
          </div>

          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {metric.label}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// 🚀 PERFORMANCE: Optimized ProjectCard
const ProjectCard = memo(function ProjectCard({
  title,
  description,
  index,
  reducedAnimations,
}: {
  title: string;
  description: string;
  index: number;
  reducedAnimations: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 🚀 PERFORMANCE: Memoized icon selection
  const projectIcon = useMemo(() => {
    if (title.includes("AI") || title.includes("Intelligence")) return Brain;
    if (title.includes("Organization") || title.includes("File"))
      return FileText;
    if (title.includes("Collaboration")) return Users;
    if (title.includes("Search")) return Search;
    if (title.includes("Optimization")) return Zap;
    return Cloud;
  }, [title]);

  const IconComponent = projectIcon;

  const animationProps = reducedAnimations
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: index * 0.05, duration: 0.2 },
      }
    : {
        initial: { opacity: 0, x: -15 },
        whileInView: { opacity: 1, x: 0 },
        transition: { delay: index * 0.08, duration: 0.4 },
        whileHover: { scale: 1.01, y: -2 },
        whileTap: { scale: 0.98 },
      };

  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30"
      onClick={() => setIsExpanded(!isExpanded)}
      {...animationProps}
      viewport={{ once: true, margin: "-5%" }}
    >
      <Spotlight
        className="from-emerald-900 via-blue-800 to-cyan-700 blur-2xl dark:from-emerald-100 dark:via-blue-200 dark:to-cyan-50"
        size={48}
      />

      <div className="relative h-full w-full rounded-[15px] bg-white p-6 dark:bg-zinc-950">
        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
            <IconComponent className="h-4 w-4" />
          </div>

          <div className="flex-1 space-y-2">
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
              {title}
            </h4>

            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {description}
            </p>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1 pt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                >
                  <PartyPopper className="h-3 w-3" />
                  Impact: Intelligent cloud storage transformation
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// 🚀 PERFORMANCE: Component loading fallbacks
const ComponentFallback = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 ${className}`}
  />
);

export default function EchoClientPageFinal() {
  const [celebrationMode, setCelebrationMode] = useState(false);

  // 🚀 PERFORMANCE: Device capability detection
  const { isHighEnd, isMobile, prefersReducedMotion, supportsHover } =
    useDeviceCapabilities();
  const hasScrolled = useOptimizedScroll();

  // 🚀 PERFORMANCE: Optimized celebration handler
  const handleCelebration = useCallback(() => {
    if (!isHighEnd && prefersReducedMotion) return;

    setCelebrationMode(true);
    setTimeout(() => setCelebrationMode(false), isHighEnd ? 2000 : 1000);
  }, [isHighEnd, prefersReducedMotion]);

  // 🚀 PERFORMANCE: Memoized data
  const memoizedData = useMemo(
    () => ({
      externalLinks: [
        {
          title: "AI-Powered File Organization Whitepaper",
          url: "#",
          description:
            "Technical deep-dive into machine learning algorithms for intelligent file categorization",
        },
        {
          title: "Cloud Storage Security Best Practices",
          url: "#",
          description:
            "Comprehensive guide to enterprise-grade security in cloud storage systems",
        },
        {
          title: "Collaboration Features Case Study",
          url: "#",
          description:
            "How real-time collaboration features increased team productivity by 67%",
        },
        {
          title: "EchoDrive Architecture Documentation",
          url: "#",
          description:
            "Technical architecture and scalability considerations for cloud storage",
        },
      ],

      aiInitiatives: [
        {
          title: "Intelligent File Organization",
          description:
            "AI-powered system that automatically categorizes and tags files based on content analysis, reducing manual organization time by 78% and improving file discovery by 5x through smart semantic search.",
        },
        {
          title: "Predictive Collaboration Suggestions",
          description:
            "Machine learning algorithms analyze team patterns to suggest optimal collaborations, automatically sharing relevant files with team members before they need to ask, boosting productivity by 67%.",
        },
        {
          title: "Smart Storage Optimization",
          description:
            "Dynamic storage management using AI to predict usage patterns, automatically archiving unused files and optimizing storage costs while maintaining instant access to frequently used content.",
        },
        {
          title: "Advanced Search Intelligence",
          description:
            "Natural language processing enables conversational file search, allowing users to find documents using context and concepts rather than exact filenames, achieving 5x faster search speeds.",
        },
        {
          title: "Automated Workflow Integration",
          description:
            "AI-driven workflow automation that learns team processes and suggests optimized file sharing patterns, reducing manual coordination overhead by 45% and improving collaboration efficiency.",
        },
      ],
    }),
    [],
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="sr-only focus-within:not-sr-only">
        <a
          href="#main-content"
          className="fixed top-4 left-4 z-[100] rounded-lg bg-emerald-600 px-4 py-2 text-white focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        >
          Skip to main content
        </a>
      </div>

      {/* 🚀 PERFORMANCE: Conditional component loading */}
      {!prefersReducedMotion && supportsHover && !isMobile && (
        <Suspense fallback={null}>
          <CustomCursor isActive={true} />
        </Suspense>
      )}

      {!prefersReducedMotion && isHighEnd && (
        <Suspense fallback={null}>
          <CelebrationParticles isActive={celebrationMode} />
        </Suspense>
      )}

      {hasScrolled && (
        <Suspense
          fallback={
            <ComponentFallback className="fixed top-0 left-0 h-1 w-full" />
          }
        >
          <ReadingProgress />
        </Suspense>
      )}

      <motion.main
        id="main-content"
        className="relative space-y-20"
        variants={ANIMATION_CONFIG.container}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section
          variants={ANIMATION_CONFIG.section}
          className="space-y-8"
        >
          <div className="space-y-6">
            <motion.h1
              className="text-4xl font-bold text-zinc-900 md:text-6xl dark:text-zinc-100"
              id="page-title"
              whileHover={
                !prefersReducedMotion
                  ? {
                      textShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
                      transition: { duration: 0.3 },
                    }
                  : {}
              }
            >
              ECHO{" "}
              <motion.span
                className="text-emerald-600"
                animate={
                  !prefersReducedMotion
                    ? {
                        backgroundImage: [
                          "linear-gradient(45deg, #10b981, #3b82f6)",
                          "linear-gradient(45deg, #3b82f6, #06b6d4)",
                          "linear-gradient(45deg, #06b6d4, #10b981)",
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                DRIVE
              </motion.span>
            </motion.h1>

            <p className="max-w-3xl text-xl text-zinc-600 dark:text-zinc-400">
              Intelligent cloud storage solution powered by AI that
              automatically organizes files, predicts collaboration needs, and
              optimizes storage usage. Transforming chaotic file management into
              seamless, intelligent workflows.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                { text: "Jan 2022 - Aug 2022", color: "emerald" },
                { text: "Product Design Lead", color: "blue" },
                { text: "AI-Powered", color: "default" },
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
                  whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
                >
                  <Badge
                    variant="secondary"
                    className={
                      badge.color === "emerald"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                        : badge.color === "blue"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          : ""
                    }
                  >
                    {badge.text}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Metrics Section */}
        <motion.section
          id="metrics-section"
          variants={ANIMATION_CONFIG.section}
          className="relative"
        >
          <div className="mb-5 flex items-center justify-between">
            <div id="metrics-heading">
              <ScrambleSectionTitle className="text-lg font-medium">
                Performance Metrics
              </ScrambleSectionTitle>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Cloud className="h-4 w-4" />
              <span>Powered by AI Intelligence</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {enhancedMetrics.map((metric, index) => (
              <MetricCard
                key={`${metric.label}-${index}`}
                metric={metric}
                index={index}
                onCelebrate={handleCelebration}
                reducedAnimations={prefersReducedMotion || !isHighEnd}
              />
            ))}
          </div>

          <AnimatePresence>
            {celebrationMode && !prefersReducedMotion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 text-center"
                role="status"
                aria-live="polite"
              >
                <p className="bg-gradient-to-r from-emerald-600 via-blue-600 to-cyan-600 bg-clip-text text-lg font-medium text-transparent">
                  🎉 Incredible! These metrics showcase AI-powered
                  transformation! ☁️
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* AI Initiatives */}
        <motion.section
          id="ai-features-section"
          variants={ANIMATION_CONFIG.section}
        >
          <div className="mb-5 flex items-center gap-3">
            <div id="ai-features-heading">
              <ScrambleSectionTitle className="text-lg font-medium">
                AI-Powered Features
              </ScrambleSectionTitle>
            </div>
            <Brain className="h-5 w-5 text-emerald-500" />
          </div>

          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
            variants={{
              visible: {
                transition: {
                  staggerChildren: prefersReducedMotion ? 0.05 : 0.08,
                },
              },
            }}
          >
            {memoizedData.aiInitiatives.map((initiative, index) => (
              <ProjectCard
                key={`${initiative.title}-${index}`}
                title={initiative.title}
                description={initiative.description}
                index={index}
                reducedAnimations={prefersReducedMotion || !isHighEnd}
              />
            ))}
          </motion.div>
        </motion.section>

        {/* Process Story - Simplified for performance */}
        <motion.section variants={ANIMATION_CONFIG.section}>
          <ScrambleSectionTitle className="mb-5 text-lg font-medium">
            The Innovation Journey
          </ScrambleSectionTitle>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-emerald-600" />
                  AI-Powered Transformation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                  EchoDrive transformed how teams interact with their digital
                  assets, achieving exceptional adoption and performance
                  metrics. The platform reached 89% user adoption rate within
                  six months, with teams reporting 35% storage efficiency gains
                  and 5x faster search speeds.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Technologies & Tools */}
        <motion.section variants={ANIMATION_CONFIG.section}>
          <ScrambleSectionTitle className="mb-5 text-lg font-medium">
            Technologies & Architecture
          </ScrambleSectionTitle>

          <div className="flex flex-wrap gap-3">
            {echoProject.technologies?.map((tech, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {tech}
              </Badge>
            ))}
            <Badge variant="outline" className="text-sm">
              TensorFlow
            </Badge>
            <Badge variant="outline" className="text-sm">
              Natural Language Processing
            </Badge>
            <Badge variant="outline" className="text-sm">
              Machine Learning
            </Badge>
            <Badge variant="outline" className="text-sm">
              Computer Vision
            </Badge>
          </div>
        </motion.section>

        {/* Navigation */}
        <motion.section
          variants={ANIMATION_CONFIG.section}
          className="mb-16 border-t border-zinc-200 px-4 pt-8 sm:mb-20 sm:px-6 lg:mb-24 lg:px-8 dark:border-zinc-700"
        >
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-6 py-3 text-zinc-900 transition-all duration-200 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              ← Back to Projects
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-blue-600 px-6 py-3 text-white transition-all duration-200 hover:from-emerald-700 hover:to-blue-700"
            >
              Explore More AI Projects
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </motion.section>
      </motion.main>
    </LazyMotion>
  );
}
