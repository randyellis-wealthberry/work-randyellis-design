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
import { AnimatedWebGL } from "@/components/ui/animated-webgl";
import { TransitionPanel } from "@/components/motion-primitives/transition-panel";
import {
  PROJECTS,
  WORK_EXPERIENCE,
  BLOG_POSTS,
  getEmail,
  SOCIAL_LINKS,
} from "./data";

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

function getWebGLSceneType(
  category: string,
  name: string,
): "organic" | "neural" | "geometric" | "unicorn" {
  if (category === "Mobile App" && name.toLowerCase().includes("grow")) {
    return "unicorn";
  }
  if (category === "AI/ML" || name.toLowerCase().includes("ai")) {
    return "neural";
  }
  return "geometric";
}

function getProjectColor(category: string): string {
  switch (category) {
    case "Mobile App":
      return "#22c55e"; // Green for mobile/growth
    case "AI/ML":
      return "#3b82f6"; // Blue for AI/tech
    default:
      return "#8b5cf6"; // Purple for general projects
  }
}

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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
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
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-[120px] rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900/50"
      >
        {panels.map((panel, index) => (
          <div key={index} className="space-y-3">
            <h4 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              {panel.title}
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
      transition={{ duration: 0.2, ease: "easeInOut" }}
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

export default function Personal() {
  return (
    <motion.main
      className="space-y-32 sm:space-y-24"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="flex-1">
          <p className="text-zinc-600 dark:text-zinc-400">
            AI Product Design Engineer specializing in generative AI, design
            systems, and product leadership. Currently Head of Product at
            Wealthberry Labs, with 2.5M+ users impacted and $50M in product
            value delivered.
          </p>
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
        <h3 className="mb-5 text-lg font-medium">Core Ideologies</h3>
        <TransitionPanelExample />
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="mt-40 sm:mt-32"
      >
        <h3 className="mb-5 text-lg font-medium">What am I working on</h3>
        <div className="grid grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-2">
          {PROJECTS.slice(0, 2).map((project) => (
            <div key={project.id} className="space-y-2">
              <Link href={`/projects/${project.slug}`}>
                <Image
                  src="/images/projects/placeholder-thumbnail.jpg"
                  alt={project.name}
                  width={500}
                  height={281}
                  className="aspect-video w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
                />
              </Link>
              <div className="px-1">
                <Link
                  className="font-base group relative inline-block font-[450] text-zinc-900 dark:text-zinc-50"
                  href={`/projects/${project.slug}`}
                >
                  {project.name}
                  <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 dark:bg-zinc-50 transition-all duration-200 group-hover:max-w-full"></span>
                </Link>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="mt-40 sm:mt-32"
      >
        <h3 className="mb-5 text-lg font-medium">Selected Projects</h3>
        <div className="grid grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <div key={project.id} className="space-y-2">
              {project.thumbnail ? (
                <Link href={`/projects/${project.slug}`}>
                  <Image
                    src={project.thumbnail}
                    alt={project.name}
                    width={500}
                    height={281}
                    className="aspect-video w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
                  />
                </Link>
              ) : (
                <Link
                  href={`/projects/${project.slug}`}
                  className="block cursor-pointer"
                >
                  <AnimatedWebGL
                    sceneType={getWebGLSceneType(
                      project.category,
                      project.name,
                    )}
                    fallbackSrc={project.video}
                    color={getProjectColor(project.category)}
                    speed={1.2}
                    intensity={0.8}
                    hoverScale={1.03}
                    transition={{
                      type: "spring",
                      bounce: 0.1,
                      duration: 0.4,
                    }}
                  />
                </Link>
              )}
              <div className="px-1">
                <Link
                  className="font-base group relative inline-block font-[450] text-zinc-900 dark:text-zinc-50"
                  href={`/projects/${project.slug}`}
                >
                  {project.name}
                  <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 dark:bg-zinc-50 transition-all duration-200 group-hover:max-w-full"></span>
                </Link>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="mt-40 sm:mt-32"
      >
        <h3 className="mb-5 text-lg font-medium">Work Experience</h3>
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
        <h3 className="mb-3 text-lg font-medium">Blog</h3>
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
        <h3 className="mb-5 text-lg font-medium">FAQ</h3>
        <AccordionIcons />
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Connect</h3>
        <p className="mb-5 text-zinc-600 dark:text-zinc-400">
          Feel free to contact me at{" "}
          <a
            className="underline dark:text-zinc-300"
            href={`mailto:${getEmail()}`}
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
    </motion.main>
  );
}
