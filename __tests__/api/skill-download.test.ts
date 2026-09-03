/**
 * @jest-environment node
 *
 * The download route: a signed grant plus a module id in, one file out.
 * Verification is local; the file comes from the private repo module, which
 * is mocked here so the test never touches the network.
 */
import { NextRequest } from "next/server";

const fetchProSkillFile = jest.fn();
const isProFilesConfigured = jest.fn(() => true);

jest.mock("@/lib/skill/pro-files", () => ({
  fetchProSkillFile: (...args: unknown[]) => fetchProSkillFile(...args),
  isProFilesConfigured: () => isProFilesConfigured(),
}));

import { GET } from "@/app/api/skill/download/route";
import { signDownloadGrant } from "@/lib/skill/download-token";
import { resetRateLimits } from "@/lib/skill/rate-limit";

const SECRET = "download-secret-for-tests";

function get(params: Record<string, string>) {
  const url = new URL("http://localhost:3000/api/skill/download");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return new NextRequest(url, {
    headers: { "x-forwarded-for": "198.51.100.4" },
  });
}

beforeEach(() => {
  process.env.SKILL_DOWNLOAD_SECRET = SECRET;
  fetchProSkillFile.mockReset();
  isProFilesConfigured.mockReturnValue(true);
  resetRateLimits();
});

afterAll(() => {
  delete process.env.SKILL_DOWNLOAD_SECRET;
});

describe("GET /api/skill/download", () => {
  it("serves a covered module as an attachment that must not be cached", async () => {
    fetchProSkillFile.mockResolvedValue("---\nname: researcher\n---\n# Researcher\n");
    const token = signDownloadGrant({ sid: "cs_1", skills: ["researcher"] });
    const response = await GET(get({ t: token, skill: "researcher" }));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/markdown");
    expect(response.headers.get("content-disposition")).toBe(
      'attachment; filename="researcher-SKILL.md"',
    );
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
    expect(await response.text()).toContain("# Researcher");
    expect(fetchProSkillFile).toHaveBeenCalledWith("researcher");
  });

  it("refuses a module the grant does not cover", async () => {
    const token = signDownloadGrant({ sid: "cs_1", skills: ["researcher"] });
    const response = await GET(get({ t: token, skill: "diagram" }));
    expect(response.status).toBe(403);
    expect(fetchProSkillFile).not.toHaveBeenCalled();
  });

  it("refuses a bad or missing token with a sentence, not a stack trace", async () => {
    const response = await GET(get({ t: "nope.nope", skill: "researcher" }));
    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.error).toMatch(/receipt/);
  });

  it("refuses an id that is not a catalog module even with a grant naming it", async () => {
    const token = signDownloadGrant({ sid: "cs_1", skills: ["../secrets"] });
    const response = await GET(get({ t: token, skill: "../secrets" }));
    expect(response.status).toBe(403);
    expect(fetchProSkillFile).not.toHaveBeenCalled();
  });

  it("reports 404 when the module is not published yet", async () => {
    fetchProSkillFile.mockResolvedValue(null);
    const token = signDownloadGrant({ sid: "cs_1", skills: ["diagram"] });
    const response = await GET(get({ t: token, skill: "diagram" }));
    expect(response.status).toBe(404);
  });

  it("reports 502 when the private repo cannot be reached", async () => {
    fetchProSkillFile.mockRejectedValue(new Error("GitHub returned 500"));
    const token = signDownloadGrant({ sid: "cs_1", skills: ["diagram"] });
    const response = await GET(get({ t: token, skill: "diagram" }));
    expect(response.status).toBe(502);
  });

  it("reports 503 when no repo token is configured", async () => {
    isProFilesConfigured.mockReturnValue(false);
    const token = signDownloadGrant({ sid: "cs_1", skills: ["diagram"] });
    const response = await GET(get({ t: token, skill: "diagram" }));
    expect(response.status).toBe(503);
  });
});
