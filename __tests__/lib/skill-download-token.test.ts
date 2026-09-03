import {
  DOWNLOAD_GRANT_TTL_SECONDS,
  signDownloadGrant,
  verifyDownloadGrant,
} from "@/lib/skill/download-token";

const SECRET = "test-secret-long-enough-to-matter";
const NOW = Date.parse("2026-09-02T12:00:00Z");

describe("download grant", () => {
  it("round-trips a grant with a default thirty-day expiry", () => {
    const token = signDownloadGrant(
      { sid: "cs_test_1", skills: ["researcher", "diagram"] },
      SECRET,
      NOW,
    );
    const grant = verifyDownloadGrant(token, SECRET, NOW);
    expect(grant).toEqual({
      sid: "cs_test_1",
      skills: ["researcher", "diagram"],
      exp: Math.floor(NOW / 1000) + DOWNLOAD_GRANT_TTL_SECONDS,
    });
  });

  it("rejects a token signed with another secret", () => {
    const token = signDownloadGrant({ sid: "cs", skills: ["x"] }, SECRET, NOW);
    expect(verifyDownloadGrant(token, "other-secret", NOW)).toBeNull();
  });

  it("rejects a payload edited after signing", () => {
    const token = signDownloadGrant({ sid: "cs", skills: ["x"] }, SECRET, NOW);
    const [, sig] = token.split(".");
    const forged =
      Buffer.from(
        JSON.stringify({ sid: "cs", skills: ["x", "bundle-of-everything"], exp: 9e9 }),
      ).toString("base64url") + `.${sig}`;
    expect(verifyDownloadGrant(forged, SECRET, NOW)).toBeNull();
  });

  it("rejects an expired token but accepts one a second before", () => {
    const token = signDownloadGrant({ sid: "cs", skills: ["x"] }, SECRET, NOW);
    const expiry = (Math.floor(NOW / 1000) + DOWNLOAD_GRANT_TTL_SECONDS) * 1000;
    expect(verifyDownloadGrant(token, SECRET, expiry - 1000)).not.toBeNull();
    expect(verifyDownloadGrant(token, SECRET, expiry)).toBeNull();
  });

  it("rejects malformed input without throwing", () => {
    for (const bad of ["", "abc", "a.b.c", "notbase64.sig", ".sig", "body."]) {
      expect(verifyDownloadGrant(bad, SECRET, NOW)).toBeNull();
    }
  });

  it("returns null rather than throwing when the secret is missing", () => {
    const saved = process.env.SKILL_DOWNLOAD_SECRET;
    delete process.env.SKILL_DOWNLOAD_SECRET;
    try {
      expect(verifyDownloadGrant("x.y", undefined, NOW)).toBeNull();
      expect(() => signDownloadGrant({ sid: "cs", skills: [] })).toThrow(
        "SKILL_DOWNLOAD_SECRET",
      );
    } finally {
      if (saved !== undefined) process.env.SKILL_DOWNLOAD_SECRET = saved;
    }
  });
});
