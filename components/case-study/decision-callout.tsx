import { Badge } from "@/components/ui/badge";
import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";

export type Decision = {
  title: string;
  decision: string;
  rationale: string;
  outcome?: string;
};

type DecisionCalloutProps = {
  decision: Decision;
  /** 1-based position, rendered as the "Decision N" chip. */
  index: number;
  /** Section id this callout belongs to, used to build unique heading ids. */
  sectionId: string;
};

/**
 * One design decision with its fork made explicit.
 *
 * Deliberately not wrapped in <Card> (D-16): the surrounding section already
 * uses cards for prose blocks, and nesting another card flattens the visual
 * hierarchy exactly where the reader should slow down. A left border does the
 * separating work at a fraction of the visual weight.
 */
export function DecisionCallout({
  decision,
  index,
  sectionId,
}: DecisionCalloutProps) {
  const headingId = `${sectionId}-decision-${index}-heading`;

  return (
    <article
      aria-labelledby={headingId}
      className="border-primary/40 hover:border-primary/70 border-l-2 py-1 pl-5 transition-colors duration-200 md:pl-6"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="px-2 py-0.5 text-xs">
          Decision {index}
        </Badge>
      </div>

      <ScrambleSectionTitle
        as="h3"
        id={headingId}
        className="mb-3 text-xl font-semibold"
      >
        {decision.title}
      </ScrambleSectionTitle>

      <div className="space-y-3">
        <p className="text-foreground text-base leading-relaxed font-medium">
          {decision.decision}
        </p>

        <div>
          <p className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">
            Why, and what I passed on
          </p>
          <p className="text-muted-foreground text-base leading-relaxed">
            {decision.rationale}
          </p>
        </div>

        {decision.outcome && (
          <div>
            <p className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">
              What happened
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              {decision.outcome}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
