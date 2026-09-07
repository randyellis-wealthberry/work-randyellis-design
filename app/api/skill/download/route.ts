import { NextRequest, NextResponse } from "next/server";
import { verifyDownloadGrant } from "@/lib/skill/download-token";
import { fetchProSkillFile, isProFilesConfigured } from "@/lib/skill/pro-files";
import { isSkillModuleId } from "@/lib/data/skill-catalog";
import { clientKey, rateLimit } from "@/lib/skill/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Hands a buyer one module file.
 *
 * The grant in `t` names the session and the modules it paid for; `skill`
 * picks one. Verification is local (an HMAC check) so a download never waits
 * on Stripe. The file itself is read from the private repo on each fresh
 * request and cached briefly in memory, so an edit to a module reaches
 * buyers within minutes without a deploy.
 */
const RATE_MAX = 60;
const RATE_WINDOW_MS = 60 * 1000;

const NO_STORE = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

function refuse(status: number, message: string): NextResponse {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE });
}

export async function GET(request: NextRequest) {
  const limit = rateLimit(
    `skill-download:${clientKey(request.headers)}`,
    RATE_MAX,
    RATE_WINDOW_MS,
  );
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many downloads. Try again in a minute." },
      {
        status: 429,
        headers: {
          ...NO_STORE,
          "Retry-After": String(limit.retryAfterSeconds),
        },
      },
    );
  }

  const token = request.nextUrl.searchParams.get("t") ?? "";
  const skill = request.nextUrl.searchParams.get("skill") ?? "";

  const grant = verifyDownloadGrant(token);
  if (!grant) {
    return refuse(
      403,
      "This download link is not valid or has expired. Open the link in your receipt to get a fresh one.",
    );
  }
  if (!isSkillModuleId(skill) || !grant.skills.includes(skill)) {
    return refuse(403, "This link does not cover that module.");
  }

  if (!isProFilesConfigured()) {
    return refuse(503, "Downloads are not configured yet.");
  }

  let body: string | null;
  try {
    body = await fetchProSkillFile(skill);
  } catch (error) {
    console.error("[skill/download] fetch failed", error);
    return refuse(502, "Could not fetch the file. Try again in a moment.");
  }
  if (body === null) {
    return refuse(
      404,
      "That module has not been published yet. You will get an email when it is.",
    );
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      ...NO_STORE,
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${skill}-SKILL.md"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
