/** @jest-environment node */
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import * as fs from "fs";
import * as path from "path";

describe("middleware indexing and caching", () => {
  const createRequest = (url: string, host: string) => {
    return new NextRequest(url, {
      headers: { host },
    });
  };

  it("should serve /sw.js with max-age=0 and no immutable", () => {
    // D-03: kill-switch service worker must always be re-fetched
    const request = createRequest(
      "https://work.randyellis.design/sw.js",
      "work.randyellis.design",
    );
    const response = middleware(request);

    const cacheControl = response.headers.get("Cache-Control");
    expect(cacheControl).toContain("max-age=0");
    expect(cacheControl).not.toContain("immutable");
  });

  it("should noindex /admin/* and /api/* routes", () => {
    // D-06: keep /admin/ noindexed
    const adminRequest = createRequest(
      "https://work.randyellis.design/admin/email-test",
      "work.randyellis.design",
    );
    const adminResponse = middleware(adminRequest);
    expect(adminResponse.headers.get("X-Robots-Tag")).toBe(
      "noindex, nofollow",
    );

    const apiRequest = createRequest(
      "https://work.randyellis.design/api/newsletter/stats",
      "work.randyellis.design",
    );
    const apiResponse = middleware(apiRequest);
    expect(apiResponse.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });

  it("should allow indexing on production host, block on preview hosts", () => {
    const prodRequest = createRequest(
      "https://work.randyellis.design/about",
      "work.randyellis.design",
    );
    const prodResponse = middleware(prodRequest);
    expect(prodResponse.headers.get("X-Robots-Tag")).toBeNull();

    const previewRequest = createRequest(
      "https://preview-abc.vercel.app/about",
      "preview-abc.vercel.app",
    );
    const previewResponse = middleware(previewRequest);
    expect(previewResponse.headers.get("X-Robots-Tag")).toBe(
      "noindex, nofollow",
    );
  });

  it("should not contain dead route checks in middleware source", () => {
    // Deleted routes: /test-glow redirected, /offline deleted by Plan 10-01
    const middlewarePath = path.join(process.cwd(), "middleware.ts");
    const middlewareSource = fs.readFileSync(middlewarePath, "utf-8");

    expect(middlewareSource).not.toContain('"/test-glow"');
    expect(middlewareSource).not.toContain('"/offline"');
  });
});
