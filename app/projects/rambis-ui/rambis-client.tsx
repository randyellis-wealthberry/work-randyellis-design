"use client";

import {
  CaseStudyTemplate,
  SectionLabel,
  SECTION,
} from "@/components/case-study/case-study-template";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/core/accordion";
import { PROJECT_MEDIA } from "@/lib/data/project-media";
import { PROJECTS } from "@/lib/data/projects";

const project = PROJECTS.find((p) => p.slug === "rambis-ui")!;

/**
 * The three areas the fork actually changed, each with the specific work
 * underneath it. Kept as a disclosure list: the headings are the argument, the
 * bullets are the receipts.
 */
const IMPROVEMENTS = [
  {
    title: "Bundle optimization",
    intro: "Reduced bundle size through strategic refactoring:",
    bullets: [
      "Eliminated unused utility functions and dependencies",
      "Implemented proper tree-shaking for component exports",
      "Optimized emotion configuration for production builds",
      "Added bundle analysis tools for continuous monitoring",
    ],
  },
  {
    title: "Enhanced accessibility",
    intro: "Implemented comprehensive accessibility improvements:",
    bullets: [
      "ARIA patterns for complex components (Dropdown, Modal, Tabs)",
      "Keyboard navigation support across all interactive elements",
      "Focus management and visual focus indicators",
      "Screen reader testing and optimization",
      "Color contrast verification tools",
    ],
  },
  {
    title: "Developer experience",
    intro: "Streamlined the development workflow:",
    bullets: [
      "Simplified theming API with design token system",
      "Comprehensive TypeScript definitions for all props",
      "Interactive Storybook documentation with live examples",
      "Automated testing suite with React Testing Library",
      "CLI tools for component generation and theme customization",
    ],
  },
] as const;

/** Named once so the section heading and the contents line cannot drift. */
const IMPROVEMENTS_LABEL = "What the fork changed";

export default function RambisClientPage() {
  return (
    <CaseStudyTemplate
      project={project}
      title="A component library, forked rather than started over."
      lead="Rambis UI takes Chakra UI as its base and rebuilds around the friction that shows up in fast application work — bundle weight, accessibility past WCAG AA, and an API surface developers can hold in their heads."
      media={PROJECT_MEDIA["rambis-ui"]}
      deliverablesLabel="What shipped"
      closeHeadline="Design systems fail on adoption, not on components."
      tocExtra={[{ id: "fork", label: IMPROVEMENTS_LABEL }]}
    >
      <section id="fork" aria-labelledby="fork-heading" className={SECTION}>
        <SectionLabel id="fork-heading">{IMPROVEMENTS_LABEL}</SectionLabel>
        <Accordion
          className="mt-6"
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          {IMPROVEMENTS.map((item) => (
            <AccordionItem
              key={item.title}
              value={item.title}
              className="border-t border-zinc-200 dark:border-zinc-800"
            >
              <AccordionTrigger className="w-full py-5 text-left">
                <span className="text-base font-medium text-zinc-900 dark:text-white">
                  {item.title}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="max-w-[62ch] text-base text-zinc-600 dark:text-zinc-400">
                  {item.intro}
                </p>
                <ul className="mt-3 max-w-[62ch] space-y-2 pb-5">
                  {item.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="text-base text-zinc-600 dark:text-zinc-400"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </CaseStudyTemplate>
  );
}
