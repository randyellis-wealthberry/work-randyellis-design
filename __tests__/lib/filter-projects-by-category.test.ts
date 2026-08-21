import { filterProjectsByCategory } from "@/lib/project-utils";
import { PROJECTS } from "@/lib/data/projects";
import type { Project } from "@/lib/data/types";

describe("filterProjectsByCategory", () => {
  describe("Empty/null term handling", () => {
    test("returns all projects when term is undefined", () => {
      const result = filterProjectsByCategory(PROJECTS, undefined);
      expect(result).toHaveLength(PROJECTS.length);
      expect(result).toEqual(PROJECTS);
    });

    test("returns all projects when term is null", () => {
      const result = filterProjectsByCategory(PROJECTS, null);
      expect(result).toHaveLength(PROJECTS.length);
      expect(result).toEqual(PROJECTS);
    });

    test("returns all projects when term is empty string", () => {
      const result = filterProjectsByCategory(PROJECTS, "");
      expect(result).toHaveLength(PROJECTS.length);
      expect(result).toEqual(PROJECTS);
    });

    test("returns all projects when term is whitespace only", () => {
      const result = filterProjectsByCategory(PROJECTS, "   ");
      expect(result).toHaveLength(PROJECTS.length);
      expect(result).toEqual(PROJECTS);
    });
  });

  describe("Category matching", () => {
    test("filters by exact category match (Mobile App)", () => {
      const result = filterProjectsByCategory(PROJECTS, "Mobile App");
      expect(result.length).toBeGreaterThan(0);
      // GrowIt should be in the results (category: "Mobile App")
      const growit = result.find((p) => p.slug === "growit");
      expect(growit).toBeDefined();
    });

    test("filters by categories array match (UI/UX)", () => {
      const result = filterProjectsByCategory(PROJECTS, "ui/ux");
      expect(result.length).toBeGreaterThan(0);
      // GrowIt should be in the results (categories includes "UI/UX")
      const growit = result.find((p) => p.slug === "growit");
      expect(growit).toBeDefined();
    });

    test("is case-insensitive", () => {
      const lowerResult = filterProjectsByCategory(PROJECTS, "mobile app");
      const upperResult = filterProjectsByCategory(PROJECTS, "MOBILE APP");
      const mixedResult = filterProjectsByCategory(PROJECTS, "MoBiLe ApP");

      expect(lowerResult.length).toBeGreaterThan(0);
      expect(lowerResult).toEqual(upperResult);
      expect(lowerResult).toEqual(mixedResult);
    });

    test("trims whitespace from search term", () => {
      const trimmedResult = filterProjectsByCategory(PROJECTS, "Mobile App");
      const untrimmedResult = filterProjectsByCategory(
        PROJECTS,
        "  MOBILE APP ",
      );

      expect(trimmedResult).toEqual(untrimmedResult);
    });
  });

  describe("Tag matching", () => {
    test("filters by tag match (gardening)", () => {
      const result = filterProjectsByCategory(PROJECTS, "gardening");
      expect(result.length).toBeGreaterThan(0);
      // GrowIt should be in the results (tags includes "Gardening")
      const growit = result.find((p) => p.slug === "growit");
      expect(growit).toBeDefined();
    });

    test("tag matching is case-insensitive", () => {
      const lowerResult = filterProjectsByCategory(PROJECTS, "gardening");
      const upperResult = filterProjectsByCategory(PROJECTS, "GARDENING");

      expect(lowerResult).toEqual(upperResult);
      expect(lowerResult.length).toBeGreaterThan(0);
    });
  });

  describe("Name matching", () => {
    test("filters by project name match (growit)", () => {
      const result = filterProjectsByCategory(PROJECTS, "growit");
      expect(result.length).toBeGreaterThan(0);
      const growit = result.find((p) => p.slug === "growit");
      expect(growit).toBeDefined();
    });

    test("name matching is case-insensitive", () => {
      const lowerResult = filterProjectsByCategory(PROJECTS, "growit");
      const upperResult = filterProjectsByCategory(PROJECTS, "GROWIT");

      expect(lowerResult).toEqual(upperResult);
    });
  });

  describe("No match handling", () => {
    test("returns empty array when no projects match", () => {
      const result = filterProjectsByCategory(
        PROJECTS,
        "zzz-no-such-category",
      );
      expect(result).toEqual([]);
    });
  });

  describe("Type safety and immutability", () => {
    test("does not mutate input array", () => {
      const input: Project[] = [
        {
          id: "test1",
          name: "Test Project",
          slug: "test",
          description: "Test",
          longDescription: "Test",
          category: "Test Category",
          tags: ["tag1"],
          link: "https://example.com",
          video: "video.mp4",
          images: [],
          timeline: "2024",
          status: "completed",
          technologies: ["React"],
          featured: false,
        },
      ];
      const originalLength = input.length;

      filterProjectsByCategory(input, "test");

      expect(input).toHaveLength(originalLength);
    });

    test("works with generic types (categories optional)", () => {
      const items = [
        { name: "A", category: "X", tags: [] },
        { name: "B", category: "Y", tags: [] },
      ];

      const result = filterProjectsByCategory(items, "x");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("A");
    });

    test("works with objects that have categories array", () => {
      const items = [
        { name: "A", category: "X", categories: ["X", "Z"], tags: [] },
        { name: "B", category: "Y", tags: [] },
      ];

      const result = filterProjectsByCategory(items, "z");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("A");
    });
  });

  describe("Integration with real PROJECTS data", () => {
    test("filters work across all searchable fields", () => {
      // This test ensures the helper works with actual project data
      const categoryResult = filterProjectsByCategory(PROJECTS, "Mobile App");
      const tagResult = filterProjectsByCategory(PROJECTS, "Gardening");
      const nameResult = filterProjectsByCategory(PROJECTS, "GrowIt");

      // All should find GrowIt
      expect(categoryResult.find((p) => p.slug === "growit")).toBeDefined();
      expect(tagResult.find((p) => p.slug === "growit")).toBeDefined();
      expect(nameResult.find((p) => p.slug === "growit")).toBeDefined();
    });
  });
});
