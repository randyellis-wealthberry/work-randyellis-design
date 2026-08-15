import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";

type ReflectionBlockProps = {
  reflection: string;
  /** Overrides the default heading, e.g. "What I'd Do Differently". */
  heading?: string;
  sectionId?: string;
};

/**
 * Closing reflection — what the person took away, in their own voice.
 *
 * Held apart from `outcome` deliberately: outcome is what the project did,
 * reflection is what the person learned. Collapsing them is how case studies
 * end up restating metrics and calling it insight.
 */
export function ReflectionBlock({
  reflection,
  heading = "Reflection",
  sectionId = "reflection",
}: ReflectionBlockProps) {
  const headingId = `${sectionId}-heading`;

  return (
    <section
      id={sectionId}
      role="region"
      aria-labelledby={headingId}
      className="border-muted mx-auto max-w-4xl space-y-3 border-l-2 py-1 pl-5 md:pl-6"
    >
      <ScrambleSectionTitle
        as="h2"
        id={headingId}
        className="text-2xl font-bold"
      >
        {heading}
      </ScrambleSectionTitle>
      <p className="text-muted-foreground text-base leading-relaxed">
        {reflection}
      </p>
    </section>
  );
}
