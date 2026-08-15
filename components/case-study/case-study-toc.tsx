import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";

export type TocItem = {
  /** Must match the target section's `id`. */
  id: string;
  label: string;
};

type CaseStudyTOCProps = {
  items: TocItem[];
  /** Section id for this nav, used to build its heading id (D-12). */
  sectionId?: string;
};

/**
 * In-page anchor nav for a long case study.
 *
 * Plain anchors, no scroll-spy: the scroll listener a spy needs would run on
 * every frame for a purely decorative highlight, and native anchors already
 * give keyboard and screen-reader users the jump targets that matter.
 */
export function CaseStudyTOC({
  items,
  sectionId = "case-study-toc",
}: CaseStudyTOCProps) {
  if (items.length === 0) return null;

  const headingId = `${sectionId}-heading`;

  return (
    <nav
      id={sectionId}
      aria-labelledby={headingId}
      className="border-muted mx-auto max-w-4xl rounded-lg border p-5 md:p-6"
    >
      <ScrambleSectionTitle
        as="h2"
        id={headingId}
        className="text-muted-foreground mb-3 text-sm tracking-wide uppercase"
      >
        On this page
      </ScrambleSectionTitle>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm text-base underline-offset-4 transition-colors duration-200 hover:underline focus-visible:ring-2 focus-visible:outline-none"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
