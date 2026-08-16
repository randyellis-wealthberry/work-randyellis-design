import {
  buildSearchIndex,
  resetSearchIndexForTests,
  searchSite,
  SITE_PAGES,
} from "@/lib/site-search";
import { PROJECTS } from "@/lib/data/projects";
import { BLOG_POSTS } from "@/lib/data/static-data";

describe("site search index", () => {
  beforeEach(() => resetSearchIndexForTests());

  it("indexes every page, every non-archived project, and every post", () => {
    const index = buildSearchIndex();
    const live = PROJECTS.filter((p) => !p.archived);
    expect(index.filter((r) => r.type === "page")).toHaveLength(SITE_PAGES.length);
    expect(index.filter((r) => r.type === "project")).toHaveLength(live.length);
    expect(index.filter((r) => r.type === "post")).toHaveLength(BLOG_POSTS.length);
  });

  it("gives every entry a usable internal href", () => {
    for (const r of buildSearchIndex()) {
      expect(r.href.startsWith("/")).toBe(true);
    }
  });

  it("memoises the index", () => {
    expect(buildSearchIndex()).toBe(buildSearchIndex());
  });
});

describe("searchSite", () => {
  it("returns nothing for a blank query", () => {
    expect(searchSite("")).toEqual([]);
    expect(searchSite("   ")).toEqual([]);
  });

  it("finds a project by name, ranking title matches first", () => {
    const results = searchSite("waffle");
    expect(results[0]).toMatchObject({ type: "project", href: "/projects/waffle" });
  });

  it("finds a project by tag/category keyword", () => {
    // Waffle is tagged "Recruiting"; nothing else has that word in a title.
    const results = searchSite("recruiting");
    expect(results.some((r) => r.href === "/projects/waffle")).toBe(true);
  });

  it("finds a blog post by a word in its title", () => {
    const results = searchSite("obsidian");
    expect(results[0]).toMatchObject({ type: "post" });
    expect(results[0].href).toContain("/blog/");
  });

  it("finds top-level pages", () => {
    expect(searchSite("about")[0]).toMatchObject({ type: "page", href: "/about" });
  });

  it("uses AND semantics across tokens — extra words narrow, not widen", () => {
    const one = searchSite("payroll");
    const two = searchSite("payroll fraud");
    expect(two.length).toBeLessThanOrEqual(one.length);
    expect(two.every((r) => one.some((o) => o.id === r.id))).toBe(true);
  });

  it("is case- and punctuation-insensitive", () => {
    expect(searchSite("LEDGERIQ!")).toEqual(searchSite("ledgeriq"));
  });

  it("returns nothing for gibberish", () => {
    expect(searchSite("zzqxv plorf")).toEqual([]);
  });

  it("respects the limit", () => {
    expect(searchSite("a", 3).length).toBeLessThanOrEqual(3);
  });
});
