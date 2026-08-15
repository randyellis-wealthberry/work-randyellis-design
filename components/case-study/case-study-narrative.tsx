import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";
import {
  CaseStudyTOC,
  type TocItem,
} from "@/components/case-study/case-study-toc";
import { DecisionCallout } from "@/components/case-study/decision-callout";
import { RoleNarrativeSection } from "@/components/case-study/role-narrative-section";
import type { Project } from "@/lib/data/types";

type CaseStudyNarrativeProps = {
  project: Project;
  /**
   * Extra anchors for sections the host page owns (hero, results, reflection).
   * Passed in rather than inferred because each bespoke page names its own
   * sections differently.
   */
  extraTocItems?: TocItem[];
};

/**
 * The shared narrative arc — in-page nav, "my role", and decisions-with-rationale.
 *
 * One composite so the four bespoke project pages and any future surface render
 * an identical component set instead of four hand-copied JSX blocks that drift
 * (MIG-01..04). Reflection is deliberately NOT included: every bespoke page
 * already owns a reflection section in its own layout, and rendering one here
 * too would duplicate the copy.
 *
 * Renders nothing until `roleNarrative` / `decisions` data exists, so wiring a
 * page up early is safe — it stays invisible rather than showing empty scaffolding.
 */
export function CaseStudyNarrative({
  project,
  extraTocItems = [],
}: CaseStudyNarrativeProps) {
  const hasDecisions = Boolean(project.decisions?.length);
  const hasRole = Boolean(project.roleNarrative);

  if (!hasDecisions && !hasRole) return null;

  const tocItems: TocItem[] = [
    ...(hasRole ? [{ id: "my-role", label: "My Role" }] : []),
    ...(hasDecisions ? [{ id: "key-decisions", label: "Key Decisions" }] : []),
    ...extraTocItems,
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-6 py-16 lg:px-8">
      <CaseStudyTOC items={tocItems} />

      {project.roleNarrative && (
        <RoleNarrativeSection
          narrative={project.roleNarrative}
          role={project.role}
          teamSize={project.teamSize}
          deliverables={project.overview?.deliverables}
        />
      )}

      {project.decisions && project.decisions.length > 0 && (
        <section
          id="key-decisions"
          role="region"
          aria-labelledby="key-decisions-heading"
          className="mx-auto max-w-4xl space-y-8"
        >
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm tracking-wide uppercase">
              Key Decisions
            </p>
            <ScrambleSectionTitle
              as="h2"
              id="key-decisions-heading"
              className="text-3xl font-bold"
            >
              What I Decided, And What I Passed On
            </ScrambleSectionTitle>
          </div>
          {project.decisions.map((decision, index) => (
            <DecisionCallout
              key={decision.title}
              decision={decision}
              index={index + 1}
              sectionId="key-decisions"
            />
          ))}
        </section>
      )}
    </div>
  );
}
