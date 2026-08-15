import { Badge } from "@/components/ui/badge";
import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";

type RoleNarrativeSectionProps = {
  /** First-person account of what this person actually owned. */
  narrative: string;
  /** Job title as held on the engagement. */
  role?: string;
  teamSize?: number;
  /** Artifacts personally produced — rendered as chips (D-16: Badge only). */
  deliverables?: string[];
  sectionId?: string;
};

/**
 * "My role" — what the person actually owned, separate from what the team shipped.
 *
 * Exists because a case study that says "we built X" leaves a hiring manager
 * unable to tell which parts were this person's. Deliverables render as chips
 * rather than a bulleted list so they read as scope, not as accomplishments.
 */
export function RoleNarrativeSection({
  narrative,
  role,
  teamSize,
  deliverables,
  sectionId = "my-role",
}: RoleNarrativeSectionProps) {
  const headingId = `${sectionId}-heading`;

  return (
    <section
      id={sectionId}
      role="region"
      aria-labelledby={headingId}
      className="mx-auto max-w-4xl space-y-4"
    >
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm tracking-wide uppercase">
          My Role
        </p>
        <ScrambleSectionTitle
          as="h2"
          id={headingId}
          className="text-3xl font-bold"
        >
          {role || "My Role"}
        </ScrambleSectionTitle>
        {typeof teamSize === "number" && (
          <p className="text-muted-foreground text-base">
            {`One of ${teamSize} on the team`}
          </p>
        )}
      </div>

      <p className="text-muted-foreground text-base leading-relaxed">
        {narrative}
      </p>

      {deliverables && deliverables.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {deliverables.map((item) => (
            <Badge key={item} variant="outline" className="px-2 py-0.5 text-xs">
              {item}
            </Badge>
          ))}
        </div>
      )}
    </section>
  );
}
