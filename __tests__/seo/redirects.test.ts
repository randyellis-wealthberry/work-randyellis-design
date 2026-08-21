import * as path from "path";
import * as fs from "fs";

describe("next.config.js redirects", () => {
  let redirects: Array<{
    source: string;
    destination: string;
    permanent: boolean;
  }>;
  let configSource: string;

  beforeAll(async () => {
    const configPath = path.join(process.cwd(), "next.config.js");
    const config = require(configPath);
    redirects = await config.redirects();
    configSource = fs.readFileSync(configPath, "utf-8");
  });

  it("should preserve the existing /ledgeriq redirect", () => {
    const ledgeriqRedirect = redirects.find(
      (r) => r.source === "/ledgeriq",
    );
    expect(ledgeriqRedirect).toEqual({
      source: "/ledgeriq",
      destination: "/projects/ledgeriq",
      permanent: true,
    });
  });

  it("should redirect deleted test routes to home", () => {
    // D-07: deleted dev routes 301 to home
    const testGlowRedirect = redirects.find(
      (r) => r.source === "/test-glow",
    );
    expect(testGlowRedirect).toEqual({
      source: "/test-glow",
      destination: "/",
      permanent: true,
    });

    const testPathRedirect = redirects.find(
      (r) => r.source === "/test/:path*",
    );
    expect(testPathRedirect).toEqual({
      source: "/test/:path*",
      destination: "/",
      permanent: true,
    });
  });

  it("should have exactly one redirects() definition and no PWA remnants", () => {
    // Fix duplicate-definition bug (second silently wins)
    const redirectsCount = (configSource.match(/async redirects\(\)/g) || [])
      .length;
    expect(redirectsCount).toBe(1);

    // D-01 clean break: no next-pwa or withPWA references
    expect(configSource).not.toContain("next-pwa");
    expect(configSource).not.toContain("withPWA");
  });
});
