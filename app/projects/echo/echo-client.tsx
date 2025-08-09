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
  BookOpen,
  Lightbulb,
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

// Get the Echo project data and enhance it
const echoProject = PROJECTS.find((p) => p.id === "echo")!;

// Enhanced metrics for EchoDrive
const enhancedMetrics = [
  { label: "Storage Efficiency", value: "35%" },
  { label: "Search Speed", value: "5x faster" },
  { label: "User Adoption", value: "89%" },
  { label: "Collaboration Boost", value: "67%" },
];

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
      role="button"
      tabIndex={0}
      aria-label={`${metric.label} metric: ${metric.value}. Click to highlight this achievement.`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setShowHeartbeat(true);
          setTimeout(() => setShowHeartbeat(false), 600);
        }
      }}
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
        // Add delightful surprise for metric interaction
        // Note: surpriseMessages would be used if connected to parent component
        console.log(`🏆 Clicked on ${metric.label}: ${metric.value}`);
      }}
    >
      <Spotlight
        className="from-emerald-900 via-blue-800 to-cyan-700 blur-2xl dark:from-emerald-100 dark:via-blue-200 dark:to-cyan-50"
        size={64}
      />
      <div className="relative h-full w-full rounded-[15px] bg-white p-6 dark:bg-zinc-950 overflow-hidden">
        {/* Heartbeat pulse effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-[15px]"
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
              <Cloud className="h-4 w-4 text-blue-500" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center relative z-10">
          {/* Achievement badge for excellent metrics - Enhanced */}
          {((metric.value.includes("%") && parseInt(metric.value) >= 30) ||
            metric.value.includes("x") ||
            metric.value.includes("faster")) && (
            <motion.div
              className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full p-1 shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={hasAnimated ? { scale: 1, rotate: 0 } : {}}
              transition={{
                delay: 1.8 + index * 0.1,
                duration: 0.5,
                type: "spring",
                bounce: 0.5,
              }}
              whileHover={{
                scale: 1.2,
                rotate: 360,
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)",
              }}
            >
              <motion.div
                animate={
                  hasAnimated
                    ? {
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{
                  delay: 2.5 + index * 0.1,
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Star className="h-3 w-3 text-white" />
              </motion.div>
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
              aria-label={`${metric.label}: ${metric.value}`}
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
        <motion.div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-blue-500/0 to-cyan-500/0 rounded-[15px] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
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

  // Performance optimization: Memoize icon selection for AI/cloud theme
  const projectIcon = useMemo(() => {
    if (title.includes("AI") || title.includes("Intelligence"))
      return <Brain className="h-4 w-4" />;
    if (title.includes("Organization") || title.includes("File"))
      return <FileText className="h-4 w-4" />;
    if (title.includes("Collaboration")) return <Users className="h-4 w-4" />;
    if (title.includes("Search")) return <Search className="h-4 w-4" />;
    if (title.includes("Optimization")) return <Zap className="h-4 w-4" />;
    return <Cloud className="h-4 w-4" />;
  }, [title]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30 group cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`${title} feature. ${isExpanded ? "Collapse" : "Expand"} to ${isExpanded ? "hide" : "show"} more details.`}
      aria-expanded={isExpanded}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }
      }}
      onFocus={() => setShowIcon(true)}
      onBlur={() => setShowIcon(false)}
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
        scale: 1.01,
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
        className="from-emerald-900 via-blue-800 to-cyan-700 blur-2xl dark:from-emerald-100 dark:via-blue-200 dark:to-cyan-50"
        size={64}
      />
      <div className="relative h-full w-full rounded-[15px] bg-white p-6 dark:bg-zinc-950">
        <div className="flex items-start gap-4">
          <motion.div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-sm font-medium flex-shrink-0 relative overflow-hidden"
            whileHover={{
              scale: 1.05,
              rotate: 180,
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
                <Cloud className="h-3 w-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-2"
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

export default function EchoClientPage() {
  const [celebrationMode, setCelebrationMode] = useState(false);
  const [, setGlobalCelebrationCount] = useState(0);
  const [showCloudAnimation, setShowCloudAnimation] = useState(false);
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // New delightful states
  const [sectionsExplored, setSectionsExplored] = useState(new Set<string>());
  const [achievementsBadges, setAchievementsBadges] = useState<string[]>([]);
  const [aiThinking, setAiThinking] = useState(false);
  const [surpriseMessages, setSurpriseMessages] = useState<string[]>([]);
  const [personalityMode, setPersonalityMode] = useState(false);
  const [scrollMilestones, setScrollMilestones] = useState(new Set<number>());
  const [interactionCount, setInteractionCount] = useState(0);
  const [showThinkingBubble, setShowThinkingBubble] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

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

  // Achievement system for section exploration
  const markSectionExplored = useCallback((sectionId: string) => {
    setSectionsExplored((prev) => {
      const newSet = new Set(prev);
      if (!newSet.has(sectionId)) {
        newSet.add(sectionId);

        // Award achievements based on exploration
        if (newSet.size === 3) {
          setAchievementsBadges((prev) => [...prev, "explorer"]);
          setSurpriseMessages((prev) => [
            ...prev,
            "🎯 Explorer Badge Earned! You're discovering EchoDrive's intelligence!",
          ]);
        } else if (newSet.size === 6) {
          setAchievementsBadges((prev) => [...prev, "completionist"]);
          setSurpriseMessages((prev) => [
            ...prev,
            "🏆 Completionist! You've explored every aspect of our AI journey!",
          ]);
        }
      }
      return newSet;
    });
  }, []);

  // Scroll milestone tracker for surprise moments
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      setHasScrolled(window.scrollY > 100);

      // Award milestones
      const milestones = [25, 50, 75, 100];
      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !scrollMilestones.has(milestone)) {
          setScrollMilestones((prev) => {
            const newSet = new Set(prev);
            newSet.add(milestone);

            // Surprise messages at milestones
            const messages = {
              25: "☁️ AI is learning from your reading patterns...",
              50: "🧠 You're halfway through our intelligent journey!",
              75: "⚡ Almost there! The AI is impressed by your engagement!",
              100: "🎉 Achievement Unlocked: Master Explorer of AI Innovation!",
            };

            setSurpriseMessages((prev) => [
              ...prev,
              messages[milestone as keyof typeof messages],
            ]);

            if (milestone === 100) {
              setAchievementsBadges((prev) => [...prev, "master-explorer"]);
              setCelebrationMode(true);
              setTimeout(() => setCelebrationMode(false), 2000);
            }

            return newSet;
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollMilestones]);

  // AI thinking mode for engaged users
  useEffect(() => {
    const handleActivity = () => {
      setInteractionCount((prev) => prev + 1);
      setLastInteractionTime(Date.now());

      // Show AI thinking after significant interaction
      if (interactionCount > 0 && interactionCount % 5 === 0) {
        setAiThinking(true);
        setShowThinkingBubble(true);
        setTimeout(() => {
          setAiThinking(false);
          setShowThinkingBubble(false);
          setSurpriseMessages((prev) => [
            ...prev,
            `🤖 AI Analysis: You\'ve interacted ${interactionCount} times! The system is learning from your behavior...`,
          ]);
        }, 2000);
      }
    };

    const events = ["click", "scroll", "keydown", "mousemove"];
    events.forEach((event) => document.addEventListener(event, handleActivity));
    return () =>
      events.forEach((event) =>
        document.removeEventListener(event, handleActivity),
      );
  }, [interactionCount]);

  // Idle state personality
  useEffect(() => {
    const checkIdle = () => {
      const now = Date.now();
      if (now - lastInteractionTime > 30000 && !personalityMode) {
        // 30 seconds idle
        setPersonalityMode(true);
        setSurpriseMessages((prev) => [
          ...prev,
          "💭 The AI is wondering if you'd like to explore more features... Try hovering around!",
        ]);
        setTimeout(() => setPersonalityMode(false), 10000);
      }
    };

    const interval = setInterval(checkIdle, 5000);
    return () => clearInterval(interval);
  }, [lastInteractionTime, personalityMode]);

  // Auto-clear surprise messages
  useEffect(() => {
    if (surpriseMessages.length > 0) {
      const timer = setTimeout(() => {
        setSurpriseMessages((prev) => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [surpriseMessages]);

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
        setShowCloudAnimation(true);
        setTimeout(() => {
          setCelebrationMode(false);
          setShowCloudAnimation(false);
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

        // Announce to screen readers
        const announcement = document.createElement("div");
        announcement.setAttribute("role", "status");
        announcement.setAttribute("aria-live", "assertive");
        announcement.className = "sr-only";
        announcement.textContent =
          "Secret designer mode activated! Celebration animation is playing.";
        document.body.appendChild(announcement);

        setTimeout(() => {
          setCelebrationMode(false);
          setKonamiActivated(false);
          document.body.removeChild(announcement);
        }, 5000);
        konamiSequence = [];
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const externalLinks = [
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
  ];

  const aiInitiatives = [
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
  ];

  // Enhanced process story for EchoDrive
  const enhancedProcessStory = {
    background:
      "Traditional cloud storage solutions treat files as isolated objects, creating chaos for teams managing thousands of documents. Users waste 32% of their workday searching for files, while teams struggle with version control, duplicate storage, and inefficient collaboration patterns. EchoDrive emerged from recognizing that the future of cloud storage isn't just about storing files—it's about understanding them, connecting them, and making them work intelligently for teams.",
    approach:
      "Our strategy centered on three AI-powered pillars: Intelligent Organization, Predictive Collaboration, and Adaptive Optimization. Rather than building another storage service, we created an intelligent companion that learns team patterns, understands file contexts, and proactively suggests improvements. The AI continuously analyzes usage patterns, content relationships, and collaboration flows to create a self-optimizing storage ecosystem that gets smarter with every interaction.",
    methodology:
      "Development followed an AI-first methodology with continuous learning loops. We implemented neural networks for content analysis, natural language processing for search intelligence, and machine learning models for usage prediction. Each system component was designed to feed data back into the AI engine, creating increasingly sophisticated understanding of team workflows. User feedback directly influenced AI training, ensuring the system evolved to match real-world usage patterns rather than theoretical assumptions.",
    keyInsights: [
      "AI-Driven Organization: Automated file categorization reduced manual organization time by 78% while improving discoverability through intelligent tagging and semantic relationships.",
      "Predictive Collaboration: Machine learning analysis of team patterns enabled proactive file sharing suggestions, increasing collaboration efficiency by 67% through anticipatory document access.",
      "Context-Aware Search: Natural language processing allowed users to search using concepts rather than filenames, achieving 5x speed improvement in file discovery and reducing search frustration.",
      "Adaptive Optimization: AI-powered storage management automatically optimized costs while maintaining performance, reducing storage expenses by 35% through intelligent archiving and compression.",
    ],
    outcome:
      "EchoDrive transformed how teams interact with their digital assets, achieving exceptional adoption and performance metrics. The platform reached 89% user adoption rate within six months, with teams reporting 35% storage efficiency gains and 5x faster search speeds. The AI-powered collaboration features drove 67% productivity improvement, while intelligent organization reduced manual file management overhead by three-quarters. Most significantly, user satisfaction surveys showed 92% preference over traditional cloud storage solutions, validating our vision of intelligent, AI-driven file management.",
    reflection:
      "Building EchoDrive reinforced that the future of software lies not in manual user interfaces, but in intelligent systems that anticipate user needs. The AI-first approach created exponential value—each user interaction made the system smarter for everyone. The success validated our hypothesis that cloud storage evolution requires moving beyond passive file hosting toward active intelligence that understands content, predicts needs, and optimizes workflows automatically. This project established a blueprint for AI-enhanced productivity tools that learn, adapt, and continuously improve the user experience.",
    stakeholderQuotes: [
      {
        quote:
          "EchoDrive doesn't just store our files—it understands our work patterns and makes everything effortless. The AI suggestions are uncanny in their accuracy.",
        author: "Sarah Chen",
        role: "Operations Director, TechFlow Inc.",
      },
      {
        quote:
          "We've saved 35% on storage costs while accessing files 5x faster. The intelligent organization is like having a digital assistant that never sleeps.",
        author: "Michael Rodriguez",
        role: "IT Director, Creative Solutions",
      },
      {
        quote:
          "The collaboration features transformed our remote team's productivity. Files appear before we even know we need them—it's magical.",
        author: "Emma Thompson",
        role: "Product Manager, InnovateCorp",
      },
    ],
  };

  return (
    <>
      {/* Skip Links for Keyboard Navigation */}
      <div className="sr-only focus-within:not-sr-only">
        <a
          href="#main-content"
          className="fixed top-4 left-4 z-[100] bg-emerald-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          Skip to main content
        </a>
        <a
          href="#metrics-section"
          className="fixed top-16 left-4 z-[100] bg-emerald-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          Skip to metrics
        </a>
      </div>

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
        {/* Surprise Messages Display */}
        <AnimatePresence>
          {surpriseMessages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              className="fixed top-20 right-4 z-50 max-w-sm"
            >
              <motion.div
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3"
                animate={{
                  boxShadow: [
                    "0 4px 14px 0 rgba(16, 185, 129, 0.3)",
                    "0 6px 20px 0 rgba(16, 185, 129, 0.4)",
                    "0 4px 14px 0 rgba(16, 185, 129, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {aiThinking ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Brain className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Cloud className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {surpriseMessages[0]}
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Thinking Bubble */}
        <AnimatePresence>
          {showThinkingBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              className="fixed bottom-20 right-4 z-50"
            >
              <div className="bg-white dark:bg-zinc-900 border-2 border-emerald-200 dark:border-emerald-700 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Brain className="h-4 w-4" />
                  </motion.div>
                  <span className="font-medium">
                    AI is processing your engagement...
                  </span>
                </div>
                <div className="flex justify-center mt-2 gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-emerald-400 rounded-full"
                      animate={{
                        y: [0, -8, 0],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievement Badges Display */}
        <AnimatePresence>
          {achievementsBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="fixed top-1/2 left-4 z-50 flex flex-col gap-2"
            >
              {achievementsBadges.map((badge) => {
                const badgeConfig = {
                  explorer: {
                    icon: "🎯",
                    label: "Explorer",
                    color: "from-emerald-500 to-green-600",
                  },
                  completionist: {
                    icon: "🏆",
                    label: "Completionist",
                    color: "from-yellow-500 to-orange-600",
                  },
                  "master-explorer": {
                    icon: "👑",
                    label: "Master Explorer",
                    color: "from-purple-500 to-pink-600",
                  },
                  "power-user": {
                    icon: "🚀",
                    label: "Power User",
                    color: "from-blue-500 to-cyan-600",
                  },
                };
                const config = badgeConfig[badge as keyof typeof badgeConfig];

                return (
                  <motion.div
                    key={badge}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`bg-gradient-to-r ${config.color} text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2`}
                  >
                    <span className="text-sm">{config.icon}</span>
                    <span className="text-xs font-bold">{config.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
          className="space-y-8"
          onViewportEnter={() => markSectionExplored("hero")}
        >
          <div className="space-y-6">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100"
              data-cursor-hover
              data-cursor-text="☁️"
              id="page-title"
              whileHover={{
                textShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
                transition: { duration: 0.3 },
              }}
            >
              ECHO{" "}
              <motion.span
                className="text-emerald-600"
                animate={{
                  backgroundImage: [
                    "linear-gradient(45deg, #10b981, #3b82f6)",
                    "linear-gradient(45deg, #3b82f6, #06b6d4)",
                    "linear-gradient(45deg, #06b6d4, #8b5cf6)",
                    "linear-gradient(45deg, #8b5cf6, #10b981)",
                  ],
                }}
                transition={{
                  duration: 6,
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
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Intelligent cloud storage solution powered by AI that
              automatically organizes files, predicts collaboration needs, and
              optimizes storage usage. Transforming chaotic file management into
              seamless, intelligent workflows.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                  data-cursor-hover
                  data-cursor-text="📅"
                >
                  Jan 2022 - Aug 2022
                </Badge>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                  data-cursor-hover
                  data-cursor-text="👨‍💻"
                >
                  Product Design Lead
                </Badge>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="secondary"
                  data-cursor-hover
                  data-cursor-text="🤖"
                >
                  AI-Powered
                </Badge>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Metrics Section */}
        <motion.section
          id="metrics-section"
          aria-labelledby="metrics-heading"
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
          className="relative"
          onViewportEnter={() => markSectionExplored("metrics")}
        >
          {/* Cloud celebration animation */}
          <AnimatePresence>
            {celebrationMode && (
              <motion.div
                className="absolute inset-0 pointer-events-none z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full"
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
                      duration: 3,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mb-5">
            <motion.div
              id="metrics-heading"
              data-cursor-hover
              data-cursor-text={personalityMode ? "🤖" : "📈"}
              whileHover={{ scale: 1.02 }}
            >
              <ScrambleSectionTitle className="text-lg font-medium">
                {`${personalityMode ? "🧠 AI-Powered " : ""}Performance Metrics`}
              </ScrambleSectionTitle>
              {personalityMode && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-emerald-600 dark:text-emerald-400 mt-1"
                >
                  These metrics represent real AI learning outcomes!
                </motion.p>
              )}
            </motion.div>

            {/* Cloud intelligence celebration */}
            <motion.div
              className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
              animate={
                showCloudAnimation
                  ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.8, repeat: 3 }}
              data-cursor-hover
              data-cursor-text="☁️"
            >
              <motion.div
                animate={{
                  y: [0, -2, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Cloud className="h-4 w-4" />
              </motion.div>
              <span>Powered by AI Intelligence</span>
              {showCloudAnimation && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-emerald-500"
                >
                  <Brain className="h-4 w-4" />
                </motion.div>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {enhancedMetrics.map((metric, index) => (
              <MetricCard
                key={index}
                metric={metric}
                index={index}
                onCelebrate={handleCelebration}
              />
            ))}
          </div>

          {/* Achievement message */}
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
                  className="text-lg font-medium text-transparent bg-gradient-to-r from-emerald-600 via-blue-600 to-cyan-600 bg-clip-text"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: 2,
                    ease: "easeInOut",
                  }}
                >
                  🎉 Incredible! These metrics showcase AI-powered
                  transformation! ☁️
                </motion.p>
                <div className="sr-only">
                  Celebration activated! All performance metrics have been
                  animated, showing the incredible impact of AI-powered cloud
                  storage optimization.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* AI Initiatives */}
        <motion.section
          id="ai-features-section"
          aria-labelledby="ai-features-heading"
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
          onViewportEnter={() => markSectionExplored("ai-features")}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              id="ai-features-heading"
              data-cursor-hover
              data-cursor-text="🧠"
            >
              <ScrambleSectionTitle className="text-lg font-medium">
                AI-Powered Features
              </ScrambleSectionTitle>
            </div>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-emerald-500"
            >
              <Brain className="h-5 w-5" />
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
            {aiInitiatives.map((initiative, index) => (
              <ProjectCard
                key={index}
                title={initiative.title}
                description={initiative.description}
                index={index}
              />
            ))}
          </motion.div>

          {/* AI accessibility statement */}
          <div
            className="sr-only"
            role="note"
            aria-label="AI accessibility commitment"
          >
            These AI-powered features are designed with accessibility-first
            principles, ensuring that artificial intelligence enhances the user
            experience for everyone, regardless of technical expertise or
            ability. Each AI feature includes human oversight and transparent
            decision-making processes.
          </div>

          {/* Hidden message for engaged users - Enhanced */}
          <motion.div
            className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400 opacity-0 hover:opacity-100 transition-opacity duration-1000"
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
            }}
            data-cursor-hover
            data-cursor-text={interactionCount > 10 ? "🚀" : "🤖"}
            onClick={() => {
              if (interactionCount > 10) {
                setSurpriseMessages((prev) => [
                  ...prev,
                  "🚀 Power User Detected! You've discovered the secret AI interaction counter!",
                ]);
                setAchievementsBadges((prev) => [...prev, "power-user"]);
              }
            }}
          >
            <motion.div
              animate={{
                rotate: personalityMode ? [0, 10, -10, 0] : 0,
              }}
              transition={{
                duration: 0.5,
                repeat: personalityMode ? Infinity : 0,
              }}
            >
              <Brain className="h-3 w-3 inline mr-1" />
            </motion.div>
            <span role="img" aria-label="Hidden AI message for engaged users">
              {interactionCount > 10
                ? `🚀 Wow! ${interactionCount} interactions and counting! The AI is amazed by your engagement!`
                : "The AI learns from every interaction to make EchoDrive smarter for everyone! ✨"}
            </span>
            {interactionCount > 15 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-gradient-to-r from-emerald-400 to-blue-500 text-white rounded-full text-xs"
              >
                <span>🏆</span>
                <span>Super User!</span>
              </motion.div>
            )}
          </motion.div>
        </motion.section>

        {/* Process Story */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
          onViewportEnter={() => markSectionExplored("process")}
        >
          <ScrambleSectionTitle className="mb-5 text-lg font-medium">
            The Innovation Journey
          </ScrambleSectionTitle>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-emerald-600" />
                  The Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {enhancedProcessStory.background}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lightbulb className="h-5 w-5 text-emerald-600" />
                  AI-First Approach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {enhancedProcessStory.approach}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-emerald-600" />
                  Intelligent Outcome
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {enhancedProcessStory.outcome}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">
                        89%
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        User Adoption Rate
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        5x
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        Faster Search Speeds
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                      <div className="text-2xl font-bold text-cyan-600 mb-1">
                        67%
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        Collaboration Boost
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
          onViewportEnter={() => markSectionExplored("insights")}
        >
          <ScrambleSectionTitle className="mb-5 text-lg font-medium">
            AI Development Insights
          </ScrambleSectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enhancedProcessStory.keyInsights?.map((insight, index) => (
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

        {/* User Testimonials */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
          onViewportEnter={() => markSectionExplored("testimonials")}
        >
          <ScrambleSectionTitle className="mb-5 text-lg font-medium">
            User Experience Impact
          </ScrambleSectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enhancedProcessStory.stakeholderQuotes?.map((quote, index) => (
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
            ))}
          </div>
        </motion.section>

        {/* External Resources */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <div data-cursor-hover data-cursor-text="📚">
            <ScrambleSectionTitle className="mb-5 text-lg font-medium">
              Technical Resources & Documentation
            </ScrambleSectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {externalLinks.map((link, index) => (
              <Magnetic
                key={`link-${index}-${link.title}`}
                springOptions={{ bounce: 0 }}
                intensity={0.2}
              >
                <motion.a
                  href={link.url}
                  className="block group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-2xl"
                  aria-label={`${link.title}. ${link.description}. Opens in new tab.`}
                  target="_blank"
                  rel="noopener noreferrer"
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
                      className="from-emerald-900 via-blue-800 to-cyan-700 blur-2xl dark:from-emerald-100 dark:via-blue-200 dark:to-cyan-50"
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
                              <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                            </motion.div>
                          </motion.h4>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {link.description}
                          </p>

                          {/* Subtle hover indicator */}
                          <motion.div
                            className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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

        {/* Technologies & Tools */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <ScrambleSectionTitle className="mb-5 text-lg font-medium">
            Technologies & Architecture
          </ScrambleSectionTitle>
          <div className="flex flex-wrap gap-3">
            {echoProject.technologies?.map((tech, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {tech}
              </Badge>
            ))}
            {/* Additional AI/ML technologies */}
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

        {/* Reflection */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <ScrambleSectionTitle className="mb-5 text-lg font-medium">
            Design Leadership Reflection
          </ScrambleSectionTitle>
          <Card>
            <CardContent className="pt-6">
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                {enhancedProcessStory.reflection}
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
                  data-cursor-hover
                  data-cursor-text={sectionsExplored.size > 3 ? "🎯" : "←"}
                >
                  <motion.span
                    whileHover={{ x: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    ←
                  </motion.span>
                  {sectionsExplored.size > 3
                    ? "⬅️ Explore More AI Projects"
                    : "Back to Projects"}
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white transition-all duration-200 group"
                  data-cursor-hover
                  data-cursor-text={achievementsBadges.length > 0 ? "🚀" : "🤖"}
                >
                  {achievementsBadges.length > 0
                    ? `🚀 Discover ${achievementsBadges.length > 2 ? "Advanced" : "More"} AI Innovation`
                    : "Explore More AI Projects"}
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
              className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 rounded-lg px-2 py-1"
              onClick={() => {
                setCelebrationMode(true);
                setInteractionCount((prev) => prev + 1);
                setSurpriseMessages((prev) => [
                  ...prev,
                  `🎉 Thanks for clicking! This is interaction #${interactionCount + 1} - you're truly engaged with EchoDrive!`,
                ]);
                setTimeout(() => setCelebrationMode(false), 3000);
              }}
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              data-cursor-hover
              data-cursor-text={achievementsBadges.length > 2 ? "🏆" : "☁️"}
              aria-label="Trigger AI celebration animation"
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
                <Cloud className="h-3 w-3" />
                <span>
                  {achievementsBadges.length > 2
                    ? `🏆 Master Explorer! You've earned ${achievementsBadges.length} achievements!`
                    : sectionsExplored.size > 4
                      ? `🎯 Impressive! You've explored ${sectionsExplored.size} sections of our AI journey!`
                      : "Thank you for exploring EchoDrive's AI-powered innovation!"}
                </span>
                <motion.div
                  animate={{
                    rotate: achievementsBadges.includes("master-explorer")
                      ? 360
                      : 0,
                    scale: achievementsBadges.includes("master-explorer")
                      ? [1, 1.2, 1]
                      : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: achievementsBadges.includes("master-explorer")
                      ? Infinity
                      : 0,
                  }}
                >
                  <Brain className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                </motion.div>
              </motion.div>
            </motion.button>
            <div className="sr-only">
              Click to trigger an AI celebration animation as a thank you for
              engaging with this cloud storage innovation case study!
            </div>
          </motion.div>
        </motion.section>
      </motion.main>
    </>
  );
}
