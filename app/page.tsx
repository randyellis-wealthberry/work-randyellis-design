"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronUp } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { Magnetic } from "@/components/ui/magnetic";
import Link from "next/link";
import Image from "next/image";
import { AnimatedBackground } from "@/components/ui/animated-background";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/core/accordion";
import { AnimatedNumberBasic } from "@/components/core/animated-number-basic";
import { TransitionPanel } from "@/components/motion-primitives/transition-panel";
import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";
import { isVideoUrl } from "@/lib/video-utils";
import { LazyHoverVideo } from "@/components/ui/lazy-hover-video";
import { getRandomProjects } from "@/lib/project-utils";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/magicui/terminal";
import {
  WORK_EXPERIENCE,
  BLOG_POSTS,
  getEmail,
  SOCIAL_LINKS,
} from "@/lib/data";
import { PROJECTS } from "@/lib/data/projects";
import {
  trackProjectHover,
  trackProjectView,
  trackContactIntent,
} from "@/lib/analytics";
import { FeatureFlagDemo } from "@/components/feature-flag-demo";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";
import { FractionalCDOHiddenSEO } from "@/components/seo/fractional-cdo-hidden-seo";

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

function MagneticSocialLink({
  children,
  link,
}: {
  children: React.ReactNode;
  link: string;
}) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackContactIntent("social_link", link)}
        className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
        >
          <path
            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
    </Magnetic>
  );
}

function TransitionPanelExample() {
  const [activeIndex, setActiveIndex] = useState(0);

  const panels = [
    {
      title: "Design Philosophy",
      content:
        "Creating intuitive interfaces that bridge the gap between user needs and business goals. Every pixel serves a purpose, every interaction tells a story.",
    },
    {
      title: "Technical Expertise",
      content:
        "Specializing in React, Next.js, and modern web technologies. Building scalable, performant applications with attention to detail and user experience.",
    },
    {
      title: "Innovation Focus",
      content:
        "Exploring the intersection of AI and design. Leveraging generative AI tools to enhance creative workflows and deliver exceptional digital experiences.",
    },
  ];

  const variants = {
    enter: { opacity: 0, y: 20, filter: "blur(4px)" },
    center: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -20, filter: "blur(4px)" },
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {panels.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeIndex === index
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {panels[index].title}
          </button>
        ))}
      </div>
      <TransitionPanel
        activeIndex={activeIndex}
        variants={variants}
        transition={{ duration: 0.3 }}
        className="min-h-[120px] rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900/50"
      >
        {panels.map((panel, index) => (
          <div key={index} className="space-y-3">
            <h4 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              {panel.title}
            </h4>
            <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
              {panel.content}
            </p>
          </div>
        ))}
      </TransitionPanel>
    </div>
  );
}

function AccordionIcons() {
  return (
    <Accordion
      className="flex w-full flex-col divide-y divide-zinc-200 dark:divide-zinc-700"
      transition={{ duration: 0.2 }}
    >
      <AccordionItem value="ai-design-approach" className="py-2">
        <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center justify-between">
            <div>What&apos;s your approach to AI in design?</div>
            <ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-zinc-500 dark:text-zinc-400">
            I believe AI should enhance human creativity, not replace it. My
            work on the AI Design System Generator demonstrates how AI can
            accelerate the design process while maintaining design quality and
            accessibility. I focus on leveraging AI to automate repetitive
            tasks, generate intelligent suggestions, and help designers make
            more informed decisions based on data and user behavior patterns.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="design-development-bridge" className="py-2">
        <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center justify-between">
            <div>How do you bridge design and development?</div>
            <ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-zinc-500 dark:text-zinc-400">
            With a background spanning both design leadership and hands-on
            development, I understand the challenges on both sides. I create
            design systems that are technically feasible, write production-ready
            React code, and ensure designs translate seamlessly to
            implementation. My approach involves early technical validation,
            component-driven design, and close collaboration between design and
            engineering teams throughout the product development lifecycle.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="scaling-products" className="py-2">
        <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center justify-between">
            <div>What&apos;s your experience with scaling products?</div>
            <ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-zinc-500 dark:text-zinc-400">
            I&apos;ve led products that have reached significant scale,
            including GrowIt, one of the fastest-growing gardening apps in the
            U.S. with over 100K active users and a 4.8★ App Store rating. My
            experience spans from early-stage product validation to scaling
            infrastructure and teams. I focus on building sustainable growth
            through excellent user experience, data-driven decision making, and
            scalable technical architecture that can handle rapid user growth.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="product-leadership" className="py-2">
        <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center justify-between">
            <div>How do you approach product leadership?</div>
            <ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-zinc-500 dark:text-zinc-400">
            As Head of Product at Wealthberry Labs and former Head of Design at
            Nagarro, I&apos;ve learned that great products emerge from balancing
            user needs, business goals, and technical constraints. I believe in
            empowering teams through clear vision, data-driven decisions, and
            fostering a culture of experimentation. Having mentored 800+
            designers, I&apos;m passionate about developing talent and building
            cross-functional teams that deliver exceptional user experiences.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function DecodedEmail() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(getEmail());
  }, []);

  return email;
}

// Move codeScenarios outside component to prevent recreation on every render
const CODE_SCENARIOS = [
  {
    command: "> npm run dev",
    steps: [
      {
        delay: 1000,
        text: "🚀 Starting Next.js development server...",
        className: "text-blue-500",
      },
      {
        delay: 1500,
        text: "✓ Ready in 2.9s",
        className: "text-green-500",
      },
      {
        delay: 2000,
        text: "- Local: http://localhost:3000",
        className: "text-muted-foreground",
      },
      {
        delay: 2500,
        text: "○ Compiling /",
        className: "text-yellow-500",
      },
      {
        delay: 3000,
        text: "✓ Compiled successfully",
        className: "text-green-500",
      },
      {
        delay: 3500,
        text: "Portfolio loaded with 2.5M+ users impact",
        className: "text-green-500",
      },
    ],
  },
  {
    command: '> git commit -m "feat: add WebGL animations"',
    steps: [
      {
        delay: 1000,
        text: "[main 4159ad5] feat: add WebGL animations",
        className: "text-green-500",
      },
      {
        delay: 1500,
        text: "3 files changed, 127 insertions(+)",
        className: "text-muted-foreground",
      },
      {
        delay: 2000,
        text: "create mode 100644 components/ui/animated-webgl.tsx",
        className: "text-green-500",
      },
      {
        delay: 2500,
        text: "modified   app/projects/[slug]/page.tsx",
        className: "text-yellow-500",
      },
      {
        delay: 3000,
        text: "✓ AI-powered design components ready",
        className: "text-blue-500",
      },
    ],
  },
  {
    command: "> pnpm build",
    steps: [
      {
        delay: 1000,
        text: "▲ Next.js 15.4.4",
        className: "text-blue-500",
      },
      {
        delay: 1500,
        text: "✓ Creating an optimized production build",
        className: "text-green-500",
      },
      {
        delay: 2000,
        text: "✓ Compiled successfully",
        className: "text-green-500",
      },
      {
        delay: 2500,
        text: "✓ Collecting page data",
        className: "text-green-500",
      },
      {
        delay: 3000,
        text: "Generated static pages (8)",
        className: "text-muted-foreground",
      },
      {
        delay: 3500,
        text: "Portfolio optimized for $50M product value",
        className: "text-green-500",
      },
    ],
  },
  {
    command: "> npm test",
    steps: [
      {
        delay: 1000,
        text: "PASS components/AnimatedMetricCard.test.tsx",
        className: "text-green-500",
      },
      {
        delay: 1500,
        text: "PASS lib/project-utils.test.ts",
        className: "text-green-500",
      },
      {
        delay: 2000,
        text: "PASS integration/selected-projects.test.tsx",
        className: "text-green-500",
      },
      {
        delay: 2500,
        text: "Test Suites: 8 passed, 8 total",
        className: "text-green-500",
      },
      {
        delay: 3000,
        text: "Tests: 24 passed, 24 total",
        className: "text-green-500",
      },
      {
        delay: 3500,
        text: "AI Design System validated ✓",
        className: "text-blue-500",
      },
    ],
  },
];

function TerminalDemo() {
  // Use state and useEffect to avoid hydration mismatch
  const [selectedScenario, setSelectedScenario] = useState(CODE_SCENARIOS[0]);

  useEffect(() => {
    // Set random scenario only on client side after mount
    // Empty dependency array - only runs once on mount
    setSelectedScenario(
      CODE_SCENARIOS[Math.floor(Math.random() * CODE_SCENARIOS.length)],
    );
  }, []);

  const handleTerminalClick = () => {
    window.open("https://github.com/randyellis-wealthberry", "_blank");
  };

  return (
    <div
      className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
      onClick={handleTerminalClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleTerminalClick();
        }
      }}
      aria-label="View GitHub profile"
    >
      <Terminal className="transition-shadow hover:shadow-lg">
        <TypingAnimation>{selectedScenario.command}</TypingAnimation>

        {selectedScenario.steps.map((step, index) => (
          <AnimatedSpan
            key={index}
            delay={step.delay}
            className={step.className}
          >
            <span>{step.text}</span>
          </AnimatedSpan>
        ))}
      </Terminal>
    </div>
  );
}

function ProjectThumbnail({ project }: { project: (typeof PROJECTS)[0] }) {
  // Check if project has a video and it's a local MP4 file for thumbnail display
  if (
    project.video &&
    project.video.includes(".mp4") &&
    project.video.startsWith("/")
  ) {
    return (
      <Link href={`/projects/${project.slug}`}>
        <div
          className="aspect-video max-h-48 w-full cursor-pointer overflow-hidden rounded-lg transition-opacity duration-200 hover:opacity-90"
          onMouseEnter={() => trackProjectHover(project.name, project.id)}
          onClick={() => trackProjectView(project.name)}
        >
          <LazyHoverVideo
            src={project.video}
            alt={`${project.name} - Fractional Chief Design Officer portfolio project showcasing startup design leadership, scalable design systems, and AI-powered product innovation by Randy Ellis`}
            className="h-full w-full"
            resetOnLeave={true}
            projectName={project.name}
          />
        </div>
      </Link>
    );
  }

  const thumbnailSrc =
    project.thumbnail || "/images/projects/placeholder-thumbnail.jpg";

  if (isVideoUrl(thumbnailSrc)) {
    return (
      <Link href={`/projects/${project.slug}`}>
        <div
          className="aspect-video max-h-48 w-full cursor-pointer overflow-hidden rounded-lg transition-opacity duration-200 hover:opacity-90"
          onMouseEnter={() => trackProjectHover(project.name, project.id)}
          onClick={() => trackProjectView(project.name)}
        >
          <iframe
            src={thumbnailSrc}
            className="h-full w-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={project.name}
          />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/projects/${project.slug}`}>
      <Image
        src={thumbnailSrc}
        alt={`${project.name} - Fractional Chief Design Officer portfolio project showcasing startup design leadership, scalable design systems, and AI-powered product innovation by Randy Ellis`}
        onMouseEnter={() => trackProjectHover(project.name, project.id)}
        onClick={() => trackProjectView(project.name)}
        width={500}
        height={300}
        className="aspect-video max-h-48 w-full cursor-pointer rounded-lg object-cover transition-opacity duration-200 hover:opacity-90"
      />
    </Link>
  );
}

export default function Personal() {
  // Randomly select 2 projects for display - selection persists during session
  // Use state and useEffect to avoid hydration mismatch with Math.random()
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
    >
      {/* Hidden SEO content for fractional CDO positioning */}
      <FractionalCDOHiddenSEO />

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="flex-1">
          <h1 className="sr-only">
            Randy Ellis - AI Product Design Engineer Portfolio
          </h1>
          <ScrambleSectionTitle className="mb-5 text-lg font-medium">
            AI Product Design Engineer
          </ScrambleSectionTitle>
          <TextGradientScroll
            text="Generative AI consultant and product design engineer delivering $50M+ product value through human-centered AI integration. As Head of Product at Wealthberry Labs and former Head of Design at Nagarro, I've led AI-powered products impacting 2.5M+ users globally while mentoring 800+ designers in AI transformation. Specializing in AI/ML product design, enterprise design systems, and strategic product leadership that bridges the gap between cutting-edge artificial intelligence and business impact."
            type="letter"
            textOpacity="soft"
            className="text-base leading-snug tracking-tight text-zinc-600 dark:text-zinc-400"
          />
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <AnimatedNumberBasic />
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <ScrambleSectionTitle className="mb-5 text-lg font-medium">
          Core Ideologies
        </ScrambleSectionTitle>
        <TransitionPanelExample />
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="mt-32 sm:mt-24"
      >
        <ScrambleSectionTitle className="mb-5 text-lg font-medium">
          AI Product Design Services & Expertise
        </ScrambleSectionTitle>
        <TextGradientScroll
          text="Specializing in AI/ML product design and generative AI integration for enterprise-scale solutions. Expertise spans AI-powered product innovation, design systems architecture for large organizations, and human-centered AI consulting. From AI UX research and interface design to machine learning product strategy and technical implementation, I deliver comprehensive AI product solutions that drive measurable business outcomes. Available for generative AI consulting, AI design systems development, and product leadership for AI-powered ventures."
          type="word"
          textOpacity="medium"
          className="max-w-4xl text-base leading-snug tracking-tight text-zinc-700 dark:text-zinc-300"
        />
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="mt-32 sm:mt-24"
      >
        <div className="mb-5 flex items-center justify-between">
          <ScrambleSectionTitle className="text-lg font-medium">
            Selected Projects
          </ScrambleSectionTitle>
          <Link
            href="/projects"
            className="group relative inline-flex items-center text-sm text-zinc-600 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            View all projects ({PROJECTS.length})
            <span className="absolute bottom-0 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full dark:bg-zinc-50"></span>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-8">
          {selectedProjects.length > 0
            ? selectedProjects.map((project) => (
                <div key={project.id} className="flex h-full flex-col">
                  <div className="mb-4 flex-shrink-0">
                    <ProjectThumbnail project={project} />
                  </div>
                  <div className="flex flex-grow flex-col px-1">
                    <Link
                      className="font-base group relative mb-2 inline-block font-[450] text-zinc-900 dark:text-zinc-50"
                      href={`/projects/${project.slug}`}
                      onClick={() => trackProjectView(project.name)}
                    >
                      {project.name}
                      <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full dark:bg-zinc-50"></span>
                    </Link>
                    {project.subtitle && (
                      <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                        {project.subtitle}
                      </p>
                    )}
                    <p className="flex-grow text-base text-zinc-600 dark:text-zinc-400">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))
            : // Loading placeholder during hydration
              Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="flex h-full flex-col"
                >
                  <div className="mb-4 flex-shrink-0">
                    <div className="aspect-video max-h-48 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                  <div className="flex flex-grow flex-col space-y-2 px-1">
                    <div className="h-6 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                    <div className="h-4 flex-grow animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                </div>
              ))}
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="mt-32 sm:mt-24"
      >
        <ScrambleSectionTitle className="mb-5 text-lg font-medium">
          What am I working on
        </ScrambleSectionTitle>
        <div className="grid grid-cols-1 gap-12 sm:gap-8">
          <div className="space-y-4">
            <Link href="/metis">
              <div className="aspect-video max-h-48 w-full cursor-pointer overflow-hidden rounded-lg transition-opacity duration-200 hover:opacity-90">
                <LazyHoverVideo
                  src="/images/projects/metis/metis-logomark-glitch.mp4"
                  alt="METIS logomark glitch animation"
                  className="h-full w-full"
                  resetOnLeave={true}
                />
              </div>
            </Link>
            <div className="px-1">
              <Link
                className="font-base group relative inline-block font-[450] text-zinc-900 dark:text-zinc-50"
                href="/metis"
              >
                METIS:LAYER - AI BUSINESS STRATEGY FOR DIGITAL DESIGNERS
                <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full dark:bg-zinc-50"></span>
              </Link>
              <p className="text-base text-zinc-600 dark:text-zinc-400">
                My new project to bridge the gap between design excellence and
                boardroom fluency. Inspired by PROFITS, NOT PIXELS Manuscript
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="mt-32 sm:mt-24"
      >
        <ScrambleSectionTitle className="mb-5 text-lg font-medium">
          Github Projects
        </ScrambleSectionTitle>
        <TerminalDemo />
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="mt-32 sm:mt-24"
      >
        <div className="mb-5 flex items-center justify-between">
          <ScrambleSectionTitle className="text-lg font-medium">
            Recent Work Experience
          </ScrambleSectionTitle>
          <Link
            href="/about"
            className="group relative inline-flex items-center text-sm text-zinc-600 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            View all
            <span className="absolute bottom-0 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full dark:bg-zinc-50"></span>
          </Link>
        </div>
        <div className="flex flex-col space-y-2">
          {WORK_EXPERIENCE.map((job) => (
            <a
              className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30"
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              key={job.id}
            >
              <Spotlight
                className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
                size={64}
              />
              <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">
                <div className="relative flex w-full flex-row justify-between">
                  <div>
                    <h4 className="font-normal dark:text-zinc-100">
                      {job.title}
                    </h4>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      {job.company}
                    </p>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {job.start} - {job.end}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="mb-3 flex items-center justify-between">
          <ScrambleSectionTitle className="text-lg font-medium">
            Blog
          </ScrambleSectionTitle>
          <Link
            href="/blog"
            className="group relative inline-flex items-center text-sm text-zinc-600 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            View archive
            <span className="absolute bottom-0 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full dark:bg-zinc-50"></span>
          </Link>
        </div>
        <div className="flex flex-col space-y-0">
          <AnimatedBackground
            enableHover
            className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.2,
            }}
          >
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.uid}
                className="-mx-3 rounded-xl px-3 py-3"
                href={post.link}
                data-id={post.uid}
              >
                <div className="flex flex-col space-y-1">
                  <h4 className="font-normal dark:text-zinc-100">
                    {post.title}
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </AnimatedBackground>
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <ScrambleSectionTitle className="mb-5 text-lg font-medium">
          FAQ
        </ScrambleSectionTitle>
        <AccordionIcons />
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <ScrambleSectionTitle className="mb-5 text-lg font-medium">
          AI Product Design Case Studies & Results
        </ScrambleSectionTitle>
        <TextGradientScroll
          text="Proven track record delivering AI-powered product innovations with quantifiable business impact. LedgerIQ AI payroll fraud detection achieved 78% error reduction and $180K annual savings. EchoDrive cloud intelligence platform delivered 67% productivity boost through AI-powered automation. Rambis UI design system serves 2.5K+ weekly downloads with 100% accessibility compliance. Nagarro design leadership impacted 18,000+ employees across 36 countries with 50% brand recognition growth. Available for AI product design consulting and generative AI integration projects."
          type="letter"
          textOpacity="medium"
          className="mb-8 max-w-3xl text-base leading-snug tracking-tight text-zinc-700 dark:text-zinc-300"
        />
        <p className="mb-5 text-zinc-600 dark:text-zinc-400">
          Interested in AI product design consulting or generative AI
          integration? Contact me at{" "}
          <a
            className="underline dark:text-zinc-300"
            href={`mailto:${getEmail()}`}
            onClick={() => trackContactIntent("email", getEmail())}
          >
            <DecodedEmail />
          </a>
        </p>
        <div className="flex items-center justify-start space-x-3">
          {SOCIAL_LINKS.map((link) => (
            <MagneticSocialLink key={link.label} link={link.link}>
              {link.label}
            </MagneticSocialLink>
          ))}
        </div>
      </motion.section>

      {/* Feature Flag Demo - Development Only */}
      <FeatureFlagDemo />
    </motion.main>
  );
}
