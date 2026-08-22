"use client";

import { SectionLabel, SECTION } from "./section-chrome";

type RoleNarrativeSectionProps = {
  /** First-person account of what this person actually owned. */
  narrative: string;
  /** Job title as held on the engagement. */
  role?: string;
  teamSize?: number;
  sectionId?: string;
};

/**
 * "My role" — what the person actually owned, separate from what the team
 * shipped, for the case studies whose work does not break into problem/response
 * pairs.
 *
 * Exists because a case study that says "we built X" leaves a hiring manager
 * unable to tell which parts were this person's. The title and team size run as
 * one quiet line above the account rather than as chips: they are context for
 * the paragraph, not accomplishments in their own right.
 */
export function RoleNarrativeSection({
  narrative,
  role,
  teamSize,
  sectionId = "my-role",
}: RoleNarrativeSectionProps) {
  const headingId = `${sectionId}-heading`;
  const context = [
    role,
    typeof teamSize === "number" ? `team of ${teamSize}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section id={sectionId} aria-labelledby={headingId} className={SECTION}>
      <SectionLabel id={headingId}>My role</SectionLabel>
      {context && (
        <p className="mt-6 text-base text-zinc-900 dark:text-white">
          {context}
        </p>
      )}
      <p
        className={`${context ? "mt-3" : "mt-6"} max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400`}
      >
        {narrative}
      </p>
    </section>
  );
}
