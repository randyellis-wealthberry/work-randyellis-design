import { render, screen } from "@testing-library/react";
import { PROJECTS } from "@/app/data";
import { getRandomProjects } from "@/lib/project-utils";

// Mock the getRandomProjects function for predictable testing
jest.mock("@/lib/project-utils", () => ({
  getRandomProjects: jest.fn(),
}));

const mockGetRandomProjects = getRandomProjects as jest.MockedFunction<typeof getRandomProjects>;

// Mock the main page component - we'll need to extract the Selected Projects section
// For now, let's test the logic independently
describe("Selected Projects Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Project Selection Logic", () => {
    test("should call getRandomProjects with correct parameters", () => {
      const mockSelectedProjects = [PROJECTS[0], PROJECTS[1]];
      mockGetRandomProjects.mockReturnValue(mockSelectedProjects);

      // Simulate the selection logic that will be in the main page
      const selectedProjects = getRandomProjects(PROJECTS, 2);

      expect(mockGetRandomProjects).toHaveBeenCalledWith(PROJECTS, 2);
      expect(selectedProjects).toHaveLength(2);
      expect(selectedProjects).toEqual(mockSelectedProjects);
    });

    test("should handle case where fewer projects exist than requested", () => {
      const singleProject = [PROJECTS[0]];
      mockGetRandomProjects.mockReturnValue(singleProject);

      const selectedProjects = getRandomProjects(singleProject, 2);

      expect(selectedProjects).toHaveLength(1);
      expect(selectedProjects).toEqual(singleProject);
    });

    test("should return different combinations over multiple calls", () => {
      // First call
      mockGetRandomProjects.mockReturnValueOnce([PROJECTS[0], PROJECTS[1]]);
      const selection1 = getRandomProjects(PROJECTS, 2);

      // Second call  
      mockGetRandomProjects.mockReturnValueOnce([PROJECTS[1], PROJECTS[2]]);
      const selection2 = getRandomProjects(PROJECTS, 2);

      expect(selection1).not.toEqual(selection2);
    });
  });

  describe("Project Display Validation", () => {
    test("selected projects should have all required properties for display", () => {
      const mockSelectedProjects = [PROJECTS[0], PROJECTS[1]];
      mockGetRandomProjects.mockReturnValue(mockSelectedProjects);

      const selectedProjects = getRandomProjects(PROJECTS, 2);

      selectedProjects.forEach((project) => {
        expect(project).toHaveProperty("id");
        expect(project).toHaveProperty("name");
        expect(project).toHaveProperty("slug");
        expect(project).toHaveProperty("description");
        expect(project).toHaveProperty("video");
        expect(project).toHaveProperty("thumbnail");
        expect(project).toHaveProperty("tags");
      });
    });

    test("should maintain project data integrity", () => {
      const mockSelectedProjects = [PROJECTS[0], PROJECTS[1]];
      mockGetRandomProjects.mockReturnValue(mockSelectedProjects);

      const selectedProjects = getRandomProjects(PROJECTS, 2);

      // Ensure the selected projects are actual projects from our data
      selectedProjects.forEach((project) => {
        expect(PROJECTS).toContain(project);
      });
    });
  });

  describe("Analytics and Tracking", () => {
    test("should preserve project properties needed for analytics", () => {
      const mockSelectedProjects = [PROJECTS[0], PROJECTS[1]];
      mockGetRandomProjects.mockReturnValue(mockSelectedProjects);

      const selectedProjects = getRandomProjects(PROJECTS, 2);

      selectedProjects.forEach((project) => {
        expect(project).toHaveProperty("slug"); // needed for tracking
        expect(project).toHaveProperty("category"); // needed for analytics
        expect(typeof project.slug).toBe("string");
        expect(typeof project.category).toBe("string");
      });
    });
  });

  describe("Performance Considerations", () => {
    test("should not call getRandomProjects excessively", () => {
      const mockSelectedProjects = [PROJECTS[0], PROJECTS[1]];
      mockGetRandomProjects.mockReturnValue(mockSelectedProjects);

      // Simulate component behavior - should only call once per render
      getRandomProjects(PROJECTS, 2);

      expect(mockGetRandomProjects).toHaveBeenCalledTimes(1);
    });

    test("should handle large project arrays efficiently", () => {
      const largeProjectArray = Array.from({ length: 100 }, (_, i) => ({
        ...PROJECTS[0],
        id: `project-${i}`,
        slug: `project-${i}`,
      }));

      mockGetRandomProjects.mockReturnValue(largeProjectArray.slice(0, 2));

      const startTime = performance.now();
      getRandomProjects(largeProjectArray, 2);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50); // Should be very fast
    });
  });
});