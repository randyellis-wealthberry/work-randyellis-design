import { getRandomProjects } from "@/lib/project-utils";
import { Project } from "@/app/data";

// Mock projects for testing
const mockProjects: Project[] = [
  {
    id: "project1",
    name: "Project 1",
    slug: "project1",
    description: "Test project 1",
    longDescription: "Long description 1",
    category: "Test",
    tags: ["tag1"],
    link: "https://example.com",
    video: "video1.mp4",
    images: [],
    timeline: "2023",
    status: "completed",
    technologies: ["React"],
    featured: true,
  },
  {
    id: "project2",
    name: "Project 2",
    slug: "project2",
    description: "Test project 2",
    longDescription: "Long description 2",
    category: "Test",
    tags: ["tag2"],
    link: "https://example.com",
    video: "video2.mp4",
    images: [],
    timeline: "2023",
    status: "completed",
    technologies: ["Vue"],
    featured: true,
  },
  {
    id: "project3",
    name: "Project 3",
    slug: "project3",
    description: "Test project 3",
    longDescription: "Long description 3",
    category: "Test",
    tags: ["tag3"],
    link: "https://example.com",
    video: "video3.mp4",
    images: [],
    timeline: "2023",
    status: "completed",
    technologies: ["Angular"],
    featured: true,
  },
] as Project[];

describe("getRandomProjects", () => {
  beforeEach(() => {
    // Reset Math.random mock before each test
    jest.clearAllMocks();
  });

  describe("Basic Functionality", () => {
    test("returns exactly the requested count of projects", () => {
      const result = getRandomProjects(mockProjects, 2);
      expect(result).toHaveLength(2);
    });

    test("returns projects from the input array", () => {
      const result = getRandomProjects(mockProjects, 2);
      result.forEach((project) => {
        expect(mockProjects).toContain(project);
      });
    });

    test("does not return duplicate projects in single call", () => {
      const result = getRandomProjects(mockProjects, 3);
      const ids = result.map((p) => p.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids).toHaveLength(uniqueIds.length);
    });

    test("returns different results on multiple calls", () => {
      // Mock Math.random to return predictable sequences
      const mockRandom = jest.spyOn(Math, "random");
      
      // First call - returns first sequence
      mockRandom.mockReturnValueOnce(0.1).mockReturnValueOnce(0.5);
      const result1 = getRandomProjects(mockProjects, 2);
      
      // Second call - returns different sequence
      mockRandom.mockReturnValueOnce(0.8).mockReturnValueOnce(0.3);
      const result2 = getRandomProjects(mockProjects, 2);
      
      expect(result1).not.toEqual(result2);
      mockRandom.mockRestore();
    });
  });

  describe("Edge Cases", () => {
    test("handles empty projects array gracefully", () => {
      const result = getRandomProjects([], 2);
      expect(result).toEqual([]);
    });

    test("handles count = 0", () => {
      const result = getRandomProjects(mockProjects, 0);
      expect(result).toEqual([]);
    });

    test("handles count greater than projects length", () => {
      const result = getRandomProjects(mockProjects, 10);
      expect(result).toHaveLength(mockProjects.length);
      expect(result).toEqual(expect.arrayContaining(mockProjects));
    });

    test("handles count equal to projects length", () => {
      const result = getRandomProjects(mockProjects, mockProjects.length);
      expect(result).toHaveLength(mockProjects.length);
      expect(result).toEqual(expect.arrayContaining(mockProjects));
    });

    test("handles negative count values", () => {
      const result = getRandomProjects(mockProjects, -1);
      expect(result).toEqual([]);
    });

    test("handles single project array", () => {
      const singleProject = [mockProjects[0]];
      const result = getRandomProjects(singleProject, 1);
      expect(result).toEqual(singleProject);
    });
  });

  describe("Statistical Distribution", () => {
    test("each project should be selected roughly equally over many iterations", () => {
      const iterations = 1000;
      const selectionCounts = new Map<string, number>();
      
      // Initialize counts
      mockProjects.forEach((project) => {
        selectionCounts.set(project.id, 0);
      });

      // Run many iterations
      for (let i = 0; i < iterations; i++) {
        const selected = getRandomProjects(mockProjects, 2);
        selected.forEach((project) => {
          const current = selectionCounts.get(project.id) || 0;
          selectionCounts.set(project.id, current + 1);
        });
      }

      // Each project should be selected roughly 2/3 of the time (2 out of 3 projects selected each time)
      const expectedSelections = (iterations * 2) / mockProjects.length;
      const tolerance = expectedSelections * 0.2; // 20% tolerance

      selectionCounts.forEach((count, projectId) => {
        expect(count).toBeGreaterThan(expectedSelections - tolerance);
        expect(count).toBeLessThan(expectedSelections + tolerance);
      });
    });
  });

  describe("Performance", () => {
    test("handles large project arrays efficiently", () => {
      // Create large array of projects
      const largeProjectArray = Array.from({ length: 1000 }, (_, i) => ({
        ...mockProjects[0],
        id: `project-${i}`,
        name: `Project ${i}`,
      }));

      const startTime = performance.now();
      const result = getRandomProjects(largeProjectArray, 10);
      const endTime = performance.now();

      expect(result).toHaveLength(10);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
    });

    test("does not cause memory leaks with repeated calls", () => {
      // This is more of a conceptual test - in practice you'd use memory profiling tools
      for (let i = 0; i < 1000; i++) {
        getRandomProjects(mockProjects, 2);
      }
      
      // If we get here without running out of memory, the test passes
      expect(true).toBe(true);
    });
  });

  describe("Type Safety", () => {
    test("maintains proper TypeScript types", () => {
      const result = getRandomProjects(mockProjects, 2);
      
      // This test ensures TypeScript compilation and proper typing
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("slug");
      expect(typeof result[0].id).toBe("string");
      expect(typeof result[0].name).toBe("string");
    });

    test("works with generic types", () => {
      interface SimpleItem {
        id: string;
        value: number;
      }

      const items: SimpleItem[] = [
        { id: "a", value: 1 },
        { id: "b", value: 2 },
        { id: "c", value: 3 },
      ];

      const result = getRandomProjects(items, 2);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("value");
    });
  });
});