import { PROJECTS } from "@/lib/data/projects";
import { getBlogArticles } from "@/lib/utils/blog-data";
import { WEBSITE_URL, BOOKING_URL } from "@/lib/constants";

export const dynamic = "force-static";

// llms.txt (https://llmstxt.org): a Markdown map of the site for AI crawlers.
// robots.ts already invites 15 AI agents (D-21); this is the map they land on.
// Generated from the same data modules that render the pages so it cannot
// drift the way a hand-typed copy would.
export function GET(): Response {
  const projects = PROJECTS.filter((p) => !p.archived);
  const posts = getBlogArticles();

  const lines = [
    "# Randy Ellis",
    "",
    "> Head of Product & Fractional Chief Design Officer helping startups ship design-led AI products. 20+ years in design, 8+ years leading teams; ships React, Next.js, and TypeScript. Based in the U.S., working with venture-backed founders on AI product design, design systems, and design-org leadership.",
    "",
    `Portfolio: ${WEBSITE_URL} — case studies, services, and writing. Book a 30-minute intro call: ${BOOKING_URL}`,
    "",
    "## Services",
    "",
    `- [Hire AI Randy](${WEBSITE_URL}/hire-ai-randy): the AI product ship readiness diagnostic — twelve questions across AI surface UX, design system governance, roadmap feasibility, and boardroom metrics, scored with a verdict; free, ten minutes`,
    `- [Fractional CDO retainer](${WEBSITE_URL}/services): a design leader on your team, by the month — design direction, systems, and the decisions a roadmap is waiting on`,
    `- [About Randy](${WEBSITE_URL}/about): experience, certifications, awards, and design philosophy`,
    `- [AI skills](${WEBSITE_URL}/skills): installable Claude agent skills for design work`,
    `- [METIS](${WEBSITE_URL}/metis): AI business strategy agent`,
    "",
    "## Engagement terms",
    "",
    "- Ship-readiness diagnostic: free, online, about ten minutes",
    "- Two-week AI product design sprint: $4,000, credited to month one of the retainer",
    "- Fractional Chief Design Officer retainer: $8,000 a month for 20 guaranteed hours, weekly working session, six-month term then month to month, no equity",
    "- Hours beyond the guarantee: $400 an hour, agreed in advance",
    "",
    "## Case Studies",
    "",
    ...projects.map(
      (p) =>
        `- [${p.name}](${WEBSITE_URL}/projects/${p.slug}): ${p.description}`,
    ),
    "",
    "## Writing",
    "",
    ...posts.map(
      (a) => `- [${a.title}](${WEBSITE_URL}/blog/${a.slug}): ${a.description}`,
    ),
    "",
    "## Contact",
    "",
    `- [Book a 30-minute call](${BOOKING_URL})`,
    "- Email: hello@randyellis.design",
    "- [LinkedIn](https://www.linkedin.com/in/iamrandyellis/)",
    "- [GitHub](https://github.com/randyellis-wealthberry)",
    "- [X](https://x.com/iamrandyellis)",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
