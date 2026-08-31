/**
 * Phase 13 (T-04): /llms.txt is the machine map for the AI crawlers
 * app/robots.ts explicitly allows (D-21). It must be generated from the same
 * data modules that render the pages, so every live project and post appears.
 */
import { GET } from "@/app/llms.txt/route";
import { PROJECTS } from "@/lib/data/projects";
import { getBlogArticles } from "@/lib/utils/blog-data";
import { WEBSITE_URL, BOOKING_URL } from "@/lib/constants";

describe("llms.txt route", () => {
  let body: string;
  let response: Response;

  beforeAll(async () => {
    response = GET();
    body = await response.text();
  });

  it("serves markdown as text/plain", () => {
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(body.startsWith("# Randy Ellis")).toBe(true);
  });

  it("opens with a blockquote positioning summary", () => {
    expect(body).toMatch(/^> .*Fractional Chief Design Officer/m);
  });

  it("links every non-archived project with an absolute URL", () => {
    for (const project of PROJECTS.filter((p) => !p.archived)) {
      expect(body).toContain(`${WEBSITE_URL}/projects/${project.slug}`);
      expect(body).toContain(project.name);
    }
  });

  it("links every blog post with an absolute URL", () => {
    for (const article of getBlogArticles()) {
      expect(body).toContain(`${WEBSITE_URL}/blog/${article.slug}`);
    }
  });

  it("carries the booking link and profile links", () => {
    expect(body).toContain(BOOKING_URL);
    expect(body).toContain("https://www.linkedin.com/in/iamrandyellis/");
    expect(body).toContain("https://github.com/randyellis-wealthberry");
  });
});
