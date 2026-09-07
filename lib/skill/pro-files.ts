/**
 * Where the paid module files live, and how the site reads them.
 *
 * This repository is public, so a paid SKILL.md committed here would be a
 * free SKILL.md with extra steps. The modules live in a private GitHub repo
 * instead, and the download route reads them server-side with a token that
 * never leaves the server. Authoring stays in git, where Randy already edits
 * the free collection, and a module update is a commit rather than a re-upload.
 *
 * The alternative was Vercel Blob with private access. It would have worked
 * and it adds a second place to author. A private repo keeps one.
 */
export const SKILLS_PRO_REPO =
  process.env.SKILLS_PRO_REPO ?? "randyellis-wealthberry/skills-pro";
export const SKILLS_PRO_REF = process.env.SKILLS_PRO_REF ?? "main";

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { body: string; fetchedAt: number }>();

export function isProFilesConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

/** Path of a module's file inside the private repo. */
export function proSkillPath(id: string): string {
  return `skills/${id}/SKILL.md`;
}

/**
 * Fetches one module's SKILL.md from the private repo. Returns null when the
 * file does not exist or the token cannot read it; throws only on a network
 * failure, which the route turns into a 502 so a buyer sees "try again" rather
 * than an empty file.
 *
 * `id` must already be validated against the catalog by the caller. This
 * function does not consult the catalog so it can be unit-tested alone.
 */
export async function fetchProSkillFile(
  id: string,
  fetchImpl: typeof fetch = fetch,
  now: number = Date.now(),
): Promise<string | null> {
  const key = `${SKILLS_PRO_REPO}@${SKILLS_PRO_REF}:${id}`;
  const cached = cache.get(key);
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.body;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const url = `https://api.github.com/repos/${SKILLS_PRO_REPO}/contents/${proSkillPath(id)}?ref=${encodeURIComponent(SKILLS_PRO_REF)}`;
  const response = await fetchImpl(url, {
    headers: {
      Accept: "application/vnd.github.raw+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "work.randyellis.design skill delivery",
    },
    // Never let Next's fetch cache hold a paid file in a shared data cache.
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(
      `GitHub returned ${response.status} for ${proSkillPath(id)}`,
    );
  }

  const body = await response.text();
  cache.set(key, { body, fetchedAt: now });
  return body;
}

/** Test seam: forget everything fetched so far. */
export function clearProFileCache(): void {
  cache.clear();
}
