import { SKILL_CORE_MD } from "@/lib/skill/core";

export const dynamic = "force-static";

/**
 * The free core skill, served as the file it is.
 *
 * `curl work.randyellis.design/skill.md` and an agent fetching the URL both
 * get the markdown, with the frontmatter intact, so it can be dropped into a
 * skills directory unchanged. Same shape as /llms.txt: a route handler over
 * the same source the page renders, not a copy.
 */
export function GET(): Response {
  return new Response(SKILL_CORE_MD, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'inline; filename="SKILL.md"',
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
