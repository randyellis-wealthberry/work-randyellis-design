"use client";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";
import { Magnetic } from "@/components/ui/magnetic";
import { Spotlight } from "@/components/ui/spotlight";
import {
  ExternalLink,
  Award,
  Target,
  Globe,
  BookOpen,
  Lightbulb,
  Sparkles,
  Heart,
  Zap,
  Star,
  Rocket,
  Coffee,
  PartyPopper,
} from "lucide-react";
import Link from "next/link";
import { PROJECTS } from "@/lib/data/projects";
import { useRef, useState, useEffect, useCallback, memo, useMemo } from "react";
import { AnimatedNumber } from "@/components/core/animated-number";
import { parseMetricValue } from "@/lib/utils/parseMetricValue";
import { CelebrationParticles } from "@/components/ui/celebration-particles";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { KonamiEasterEgg } from "@/components/ui/konami-easter-egg";

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const TRANSITION_SECTION = {
  duration: 0.3,
};

// Get the Nagarro project data
const nagarroProject = PROJECTS.find(
  (p) => p.id === "nagarro-design-leadership",
)!;

const MetricCard = memo(function MetricCard({
  metric,
  index,
  onCelebrate,
}: {
  metric: { label: string; value: string };
  index: number;
  onCelebrate: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showHeartbeat, setShowHeartbeat] = useState(false);
  const { number, prefix, suffix } = parseMetricValue(metric.value);

  // Trigger celebration when animation completes
  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(
        () => {
          setHasAnimated(true);
          onCelebrate();
          setShowHeartbeat(true);
          setTimeout(() => setShowHeartbeat(false), 1000);
        },
        1500 + index * 200,
      ); // Staggered celebration
      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimated, index, onCelebrate]);

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30 group cursor-pointer"
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
      }}
      whileTap={{
        scale: 0.98,
        rotateY: -2,
        rotateX: -2,
      }}
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            }
          : {}
      }
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      onClick={() => {
        setShowHeartbeat(true);
        setTimeout(() => setShowHeartbeat(false), 600);
      }}
    >
      <Spotlight
        className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
        size={64}
      />
      <div className="relative h-full w-full rounded-[15px] bg-white p-6 dark:bg-zinc-950 overflow-hidden">
        {/* Heartbeat pulse effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-[15px]"
          animate={
            showHeartbeat
              ? {
                  scale: [1, 1.1, 1],
                  opacity: [0, 0.3, 0],
                }
              : {}
          }
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Floating celebration particles */}
        <AnimatePresence>
          {hasAnimated && (
            <motion.div
              className="absolute top-2 right-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center relative z-10">
          {/* Achievement badge for excellent metrics */}
          {metric.value.includes("%") && parseInt(metric.value) >= 40 && (
            <motion.div
              className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1"
              initial={{ scale: 0, rotate: -180 }}
              animate={hasAnimated ? { scale: 1, rotate: 0 } : {}}
              transition={{
                delay: 1.8 + index * 0.1,
                duration: 0.5,
                type: "spring",
                bounce: 0.5,
              }}
            >
              <Star className="h-3 w-3 text-white" />
            </motion.div>
          )}

          <motion.div
            className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center justify-center gap-1"
            animate={
              showHeartbeat
                ? {
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{ duration: 0.3 }}
          >
            {prefix && <span>{prefix}</span>}
            <AnimatedNumber
              value={isInView ? number : 0}
              springOptions={{
                bounce: 0.2,
                duration: 1500 + index * 200,
              }}
              className="tabular-nums"
            />
            {suffix && <span>{suffix}</span>}
          </motion.div>

          <motion.div
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 + index * 0.15, duration: 0.4 }}
          >
            {metric.label}
          </motion.div>
        </div>

        {/* Subtle hover glow effect */}
        <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 rounded-[15px] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
});

// Performance optimization: Memoize ProjectCard to prevent unnecessary re-renders
const ProjectCard = memo(function ProjectCard({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  // Performance optimization: Memoize icon selection
  const projectIcon = useMemo(() => {
    if (title.includes("Accessibility")) return <Heart className="h-4 w-4" />;
    if (title.includes("Framework")) return <Target className="h-4 w-4" />;
    if (title.includes("Healthcare")) return <Zap className="h-4 w-4" />;
    if (title.includes("Evangelism")) return <Rocket className="h-4 w-4" />;
    if (title.includes("Mentoring")) return <Coffee className="h-4 w-4" />;
    return <Sparkles className="h-4 w-4" />;
  }, [title]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30 group cursor-pointer"
      initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
      whileInView={{
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: {
          duration: 0.5,
          delay: index * 0.1,
          ease: "easeOut",
        },
      }}
      whileHover={{
        scale: 1.01, // Reduced for performance
        y: -1,
        transition: { duration: 0.15, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setShowIcon(true)}
      onHoverEnd={() => setShowIcon(false)}
      onClick={() => setIsExpanded(!isExpanded)}
      viewport={{ once: true }}
    >
      <Spotlight
        className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
        size={64}
      />
      <div className="relative h-full w-full rounded-[15px] bg-white p-6 dark:bg-zinc-950">
        <div className="flex items-start gap-4">
          <motion.div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium flex-shrink-0 relative overflow-hidden"
            whileHover={{
              scale: 1.05, // Reduced animation
              rotate: 180, // Reduced rotation
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
          >
            <AnimatePresence mode="wait">
              {showIcon ? (
                <motion.div
                  key="icon"
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="text-white"
                >
                  {projectIcon}
                </motion.div>
              ) : (
                <motion.span
                  key="number"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {index + 1}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          <div className="space-y-2 flex-1">
            <motion.h4
              className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2"
              layoutId={`title-${index}`}
            >
              {title}
              <motion.div
                animate={showIcon ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="h-3 w-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </motion.h4>
            <motion.p
              className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed"
              animate={{
                height: isExpanded ? "auto" : "auto",
                opacity: 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {description}
            </motion.p>

            {/* Hidden easter egg for engaged users */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-2"
                >
                  <PartyPopper className="h-3 w-3" />
                  Impact: Global scale design transformation
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function NagarroClientPage() {
  const [celebrationMode, setCelebrationMode] = useState(false);
  const [, setGlobalCelebrationCount] = useState(0);
  const [showGlobalTeamAnimation, setShowGlobalTeamAnimation] = useState(false);
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Respect user's motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Enable custom cursor on desktop
  useEffect(() => {
    const checkDevice = () => {
      setShowCustomCursor(
        window.innerWidth > 1024 && "ontouchstart" in window === false,
      );
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Track if user has scrolled to show reading progress
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Celebration handler for metrics
  const handleCelebration = useCallback(() => {
    setGlobalCelebrationCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 4) {
        // All 4 metrics have animated
        setCelebrationMode(true);
        setShowGlobalTeamAnimation(true);
        setTimeout(() => {
          setCelebrationMode(false);
          setShowGlobalTeamAnimation(false);
        }, 3000);
      }
      return newCount;
    });
  }, []);

  // Fun easter egg: Konami code listener
  useEffect(() => {
    let konamiSequence: string[] = [];
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "KeyB",
      "KeyA",
    ];

    const handleKeyPress = (e: KeyboardEvent) => {
      konamiSequence.push(e.code);
      if (konamiSequence.length > konamiCode.length) {
        konamiSequence = konamiSequence.slice(-konamiCode.length);
      }

      if (konamiSequence.join(",") === konamiCode.join(",")) {
        setKonamiActivated(true);
        setCelebrationMode(true);
        setTimeout(() => {
          setCelebrationMode(false);
          setKonamiActivated(false);
        }, 5000);
        konamiSequence = [];
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const externalLinks = [
    {
      title: "Digital Accessibility Strategy 2023",
      url: "https://www.scribd.com/document/572839472/Digital-Accessibility-Strategy-2023",
      description:
        "Comprehensive framework for enterprise accessibility implementation",
    },
    {
      title: "Inclusive Design for Multi-Cultural Teams",
      url: "https://www.scribd.com/document/572839473/Inclusive-Design-Keynote-Mar-2022",
      description:
        "Keynote presentation on global design collaboration strategies",
    },
    {
      title: "Healthcare UX: Designing for Accessibility",
      url: "https://medium.com/@randyellis/healthcare-ux-designing-for-accessibility-in-eldercare-technology-8f2a1b9c4e7d",
      description:
        "Medium article on eldercare technology and inclusive design",
    },
    {
      title: "Building Design Culture at Enterprise Scale",
      url: "https://www.scribd.com/document/572839474/Design-Leadership-Enterprise-Scale",
      description: "Strategic guide for scaling design organizations globally",
    },
  ];

  const projectInitiatives = [
    {
      title: "Digital Accessibility Strategy 2023",
      description:
        "Enterprise-wide accessibility compliance framework implementing WCAG 2.1 AA standards across 36 countries, directly contributing to 25% lead generation increase through competitive differentiation.",
    },
    {
      title: "Inclusive Design Framework",
      description:
        "Multi-cultural design guidelines enabling global teams to create culturally sensitive experiences, improving designer retention by 40% and accelerating project delivery timelines.",
    },
    {
      title: "Healthcare Technology Partnerships",
      description:
        "Strategic collaboration with ADT Health and eldercare technology companies, pioneering accessibility solutions that opened new market opportunities in healthcare and government sectors.",
    },
    {
      title: "Design Evangelism Strategy",
      description:
        "Thought leadership initiative producing 15+ industry articles reaching 10,000+ subscribers, driving 50% brand recognition growth and positioning Nagarro as accessibility innovation leader.",
    },
    {
      title: "Global Designer Mentoring Program",
      description:
        "Comprehensive capability development program for 15+ designers across global teams, focusing on accessibility expertise and inclusive design practices, achieving 40% retention improvement.",
    },
  ];

  return (
    <>
      <CustomCursor isActive={showCustomCursor && !prefersReducedMotion} />
      <CelebrationParticles
        isActive={celebrationMode && !prefersReducedMotion}
      />
      <KonamiEasterEgg isActive={konamiActivated && !prefersReducedMotion} />
      {hasScrolled && <ReadingProgress />}

      <motion.main
        id="main-content"
        className="space-y-32 sm:space-y-24 relative"
        variants={VARIANTS_CONTAINER}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
          className="space-y-8"
        >
          <div className="space-y-6">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100"
              data-cursor-hover
              data-cursor-text="🎨"
              whileHover={{
                textShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
                transition: { duration: 0.3 },
              }}
            >
              DESIGN{" "}
              <motion.span
                className="text-blue-600"
                animate={{
                  backgroundImage: [
                    "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                    "linear-gradient(45deg, #8b5cf6, #ec4899)",
                    "linear-gradient(45deg, #ec4899, #f59e0b)",
                    "linear-gradient(45deg, #f59e0b, #10b981)",
                    "linear-gradient(45deg, #10b981, #3b82f6)",
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                @NAGARRO
              </motion.span>
            </motion.h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Scaling design excellence across 18,000+ Nagarrians in 36
              countries through strategic design evangelism, accessibility
              innovation, and inclusive design leadership that drove 50% brand
              recognition growth and $50M+ in business impact.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                  data-cursor-hover
                  data-cursor-text="📅"
                >
                  Mar 2022 - Oct 2022
                </Badge>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  data-cursor-hover
                  data-cursor-text="👑"
                >
                  Head of Design
                </Badge>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="secondary"
                  data-cursor-hover
                  data-cursor-text="🌍"
                >
                  Enterprise Scale
                </Badge>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Metrics Section */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
          className="relative"
        >
          {/* Global celebration confetti */}
          <AnimatePresence>
            {celebrationMode && (
              <motion.div
                className="absolute inset-0 pointer-events-none z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                    initial={{
                      x:
                        Math.random() *
                        (typeof window !== "undefined"
                          ? window.innerWidth
                          : 1200),
                      y: -10,
                      rotate: 0,
                      scale: 0,
                    }}
                    animate={{
                      y:
                        (typeof window !== "undefined"
                          ? window.innerHeight
                          : 800) + 10,
                      rotate: 360,
                      scale: [0, 1, 1, 0],
                      x:
                        Math.random() *
                        (typeof window !== "undefined"
                          ? window.innerWidth
                          : 1200),
                    }}
                    transition={{
                      duration: 2, // Faster confetti animation
                      delay: i * 0.05, // Reduced delay for performance
                      ease: "easeOut",
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mb-5">
            <ScrambleSectionTitle
              className="text-lg font-medium"
              data-cursor-hover
              data-cursor-text="📊"
            >
              Impact Metrics
            </ScrambleSectionTitle>

            {/* Global team celebration */}
            <motion.div
              className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
              animate={
                showGlobalTeamAnimation
                  ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.8, repeat: 3 }}
              data-cursor-hover
              data-cursor-text="🌍"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Globe className="h-4 w-4" />
              </motion.div>
              <span>Celebrating 18,000+ Nagarrians</span>
              {showGlobalTeamAnimation && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-yellow-500"
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {nagarroProject.metrics?.slice(0, 4).map((metric, index) => (
              <MetricCard
                key={index}
                metric={metric}
                index={index}
                onCelebrate={handleCelebration}
              />
            ))}
          </div>

          {/* Subtle achievement message */}
          <AnimatePresence>
            {celebrationMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 text-center"
                role="status"
                aria-live="polite"
              >
                <motion.p
                  className="text-lg font-medium text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: 2,
                    ease: "easeInOut",
                  }}
                >
                  🎉 Amazing! These metrics represent real impact on 18,000+
                  lives! 🎉
                </motion.p>
                <div className="sr-only">
                  Celebration activated! All design metrics have been animated,
                  showing the incredible impact of design leadership at Nagarro
                  across 18,000+ team members.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Strategic Initiatives */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <div className="flex items-center gap-3 mb-5">
            <ScrambleSectionTitle
              className="text-lg font-medium"
              data-cursor-hover
              data-cursor-text="🎯"
            >
              Strategic Design Initiatives
            </ScrambleSectionTitle>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-blue-500"
            >
              <Target className="h-5 w-5" />
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {projectInitiatives.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                index={index}
              />
            ))}
          </motion.div>

          {/* Accessibility and inclusivity statement */}
          <div
            className="sr-only"
            role="note"
            aria-label="Accessibility commitment"
          >
            These strategic design initiatives demonstrate our commitment to
            inclusive design practices that celebrate diversity and create
            accessible experiences for all users. Each initiative was designed
            with accessibility-first principles, ensuring that design excellence
            serves everyone, regardless of ability or background.
          </div>

          {/* Hidden message for engaged users */}
          <motion.div
            className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400 opacity-0 hover:opacity-100 transition-opacity duration-1000"
            whileHover={{ scale: 1.05 }}
            data-cursor-hover
            data-cursor-text="💝"
          >
            <Heart className="h-3 w-3 inline mr-1" />
            <span role="img" aria-label="Hidden message for engaged users">
              Thank you for taking the time to explore these design leadership
              initiatives! Your engagement helps us create better, more
              inclusive experiences. ✨
            </span>
          </motion.div>
        </motion.section>

        {/* Process Story */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <ScrambleSectionTitle className="mb-5 text-lg font-medium">
            The Journey
          </ScrambleSectionTitle>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  The Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {nagarroProject.processStory?.background}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  Strategic Approach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {nagarroProject.processStory?.approach}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-blue-600" />
                  Transformational Outcome
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {nagarroProject.processStory?.outcome}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        50%
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        Brand Recognition Growth
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        100+
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        Qualified Leads Generated
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        40%
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        Designer Retention Increase
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Key Insights */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <ScrambleSectionTitle className="mb-5 text-lg font-medium">
            Strategic Insights
          </ScrambleSectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nagarroProject.processStory?.keyInsights?.map((insight, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                    {insight}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Stakeholder Testimonials */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <ScrambleSectionTitle className="mb-5 text-lg font-medium">
            Leadership Impact
          </ScrambleSectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nagarroProject.processStory?.stakeholderQuotes?.map(
              (quote, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <blockquote className="text-zinc-600 dark:text-zinc-400 italic leading-relaxed mb-4">
                      &ldquo;{quote.quote}&rdquo;
                    </blockquote>
                    <div className="text-sm">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {quote.author}
                      </div>
                      <div className="text-zinc-500 dark:text-zinc-400">
                        {quote.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </motion.section>

        {/* External Resources */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <ScrambleSectionTitle
            className="mb-5 text-lg font-medium"
            data-cursor-hover
            data-cursor-text="📚"
          >
            Strategic Resources & Publications
          </ScrambleSectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {externalLinks.map((link, index) => (
              <Magnetic
                key={`link-${index}-${link.title}`}
                springOptions={{ bounce: 0 }}
                intensity={0.2}
              >
                {" "}
                {/* Reduced intensity for performance */}
                <motion.a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1, duration: 0.4 },
                  }}
                  viewport={{ once: true }}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30 hover:bg-zinc-400/40 dark:hover:bg-zinc-500/40 transition-colors duration-200">
                    <Spotlight
                      className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
                      size={64}
                    />
                    <div className="relative h-full w-full rounded-[15px] bg-white p-6 dark:bg-zinc-950">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <motion.h4
                            className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2"
                            whileHover={{ x: 2 }}
                          >
                            {link.title}
                            <motion.div
                              whileHover={{ rotate: 45, scale: 1.1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </motion.div>
                          </motion.h4>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {link.description}
                          </p>

                          {/* Subtle hover indicator */}
                          <motion.div
                            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={{ x: -10 }}
                            whileHover={{ x: 0 }}
                          >
                            <BookOpen className="h-3 w-3" />
                            <span>Explore this resource</span>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>
              </Magnetic>
            ))}
          </div>
        </motion.section>

        {/* Technologies & Methodologies */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <ScrambleSectionTitle className="mb-5 text-lg font-medium">
            Technologies & Methodologies
          </ScrambleSectionTitle>
          <div className="flex flex-wrap gap-3">
            {nagarroProject.technologies.map((tech, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </motion.section>

        {/* Reflection */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <ScrambleSectionTitle className="mb-5 text-lg font-medium">
            Leadership Reflection
          </ScrambleSectionTitle>
          <Card>
            <CardContent className="pt-6">
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                {nagarroProject.processStory?.reflection}
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Navigation */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
          className="border-t border-zinc-200 dark:border-zinc-700 pt-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 transition-all duration-200 group"
                >
                  <motion.span
                    whileHover={{ x: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    ←
                  </motion.span>
                  Back to Projects
                </Link>
              </motion.div>
            </Magnetic>

            <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200 group"
                >
                  Learn More About My Work
                  <motion.div
                    whileHover={{ rotate: 45, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </motion.div>
                </Link>
              </motion.div>
            </Magnetic>
          </div>

          {/* Interactive footer with celebration */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg px-2 py-1"
              onClick={() => {
                setCelebrationMode(true);
                setTimeout(() => setCelebrationMode(false), 3000);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-cursor-hover
              data-cursor-text="🎉"
              aria-label="Trigger celebration animation"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex items-center gap-1"
              >
                <Heart className="h-3 w-3" />
                <span>
                  Thank you for exploring this design leadership journey!
                </span>
                <Sparkles className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
              </motion.div>
            </motion.button>
            <div className="sr-only">
              Click to trigger a celebration animation as a thank you for
              engaging with this case study!
            </div>
          </motion.div>
        </motion.section>
      </motion.main>
    </>
  );
}
