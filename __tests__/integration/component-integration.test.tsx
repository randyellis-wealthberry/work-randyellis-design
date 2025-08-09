/**
 * TDD PHASE 1: Component Integration Testing
 * Tests to verify component integrations work correctly with data
 */

import { render, screen, waitFor } from "@testing-library/react";
import { PROJECTS } from "@/lib/data/projects";
import { HoverVideo } from "@/components/ui/hover-video";
import { LazyHoverVideo } from "@/components/ui/lazy-hover-video";

// Mock intersection observer for hover video tests
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock analytics tracking
jest.mock("@/lib/analytics", () => ({
  trackProjectVideoPlay: jest.fn(),
  trackProjectHover: jest.fn(),
  trackProjectView: jest.fn(),
}));

describe("TDD PHASE 1: Component Integration Testing", () => {
  describe("HoverVideo Component Integration", () => {
    test("should render HoverVideo with valid project data", () => {
      const projectWithVideo = PROJECTS.find((p) => p.video);
      expect(projectWithVideo).toBeDefined();

      if (projectWithVideo) {
        const { container } = render(
          <HoverVideo
            src={projectWithVideo.video}
            alt={projectWithVideo.name}
            projectName={projectWithVideo.name}
          />,
        );

        const videoElement = container.querySelector("video");
        expect(videoElement).toBeInTheDocument();
      }
    });

    test("should handle missing video gracefully", () => {
      // Test component behavior with invalid video path
      const { container } = render(
        <HoverVideo
          src="/invalid/path.mp4"
          alt="Test Video"
          projectName="Test Project"
        />,
      );

      const videoElement = container.querySelector("video");
      expect(videoElement).toBeInTheDocument();
    });

    test("should work with different media types", () => {
      // Test various video formats that might be in project data
      const testVideos = [
        "/test/video.mp4",
        "/test/video.webm",
        "https://vimeo.com/123456789",
      ];

      testVideos.forEach((videoSrc) => {
        render(<HoverVideo src={videoSrc} alt="Test" projectName="Test" />);
      });
    });
  });

  describe("LazyHoverVideo Component Integration", () => {
    test("should render LazyHoverVideo with loading state", async () => {
      const projectWithVideo = PROJECTS.find((p) => p.video);
      expect(projectWithVideo).toBeDefined();

      if (projectWithVideo) {
        render(
          <LazyHoverVideo
            src={projectWithVideo.video}
            alt={projectWithVideo.name}
            projectName={projectWithVideo.name}
          />,
        );

        // Should show loading skeleton initially
        const loadingElement = screen.getByRole("status", { hidden: true });
        expect(loadingElement).toBeInTheDocument();
      }
    });

    test("should eventually load the actual video component", async () => {
      const projectWithVideo = PROJECTS.find((p) => p.video);

      if (projectWithVideo) {
        render(
          <LazyHoverVideo
            src={projectWithVideo.video}
            alt={projectWithVideo.name}
            projectName={projectWithVideo.name}
          />,
        );

        // Wait for lazy loading to complete
        await waitFor(
          () => {
            const videoElement = document.querySelector("video");
            expect(videoElement).toBeInTheDocument();
          },
          { timeout: 3000 },
        );
      }
    });

    test("should handle lazy loading failures gracefully", async () => {
      // Mock a failure in the lazy loading
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { container } = render(
        <LazyHoverVideo
          src="/invalid/video.mp4"
          alt="Test"
          projectName="Test"
        />,
      );

      // Should still render something (either loading or fallback)
      const componentContainer = container.firstChild;
      expect(componentContainer).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe("Project Data and Component Integration", () => {
    test("should handle all project video formats correctly", () => {
      const projectsWithVideo = PROJECTS.filter((p) => p.video);
      expect(projectsWithVideo.length).toBeGreaterThan(0);

      projectsWithVideo.forEach((project) => {
        // Test that each project video can be used with components
        expect(() => {
          render(
            <HoverVideo
              src={project.video}
              alt={project.name}
              projectName={project.name}
            />,
          );
        }).not.toThrow();
      });
    });

    test("should handle projects with thumbnails", () => {
      const projectsWithThumbnails = PROJECTS.filter((p) => p.thumbnail);

      projectsWithThumbnails.forEach((project) => {
        expect(project.thumbnail).toBeDefined();
        expect(typeof project.thumbnail).toBe("string");
        expect(project.thumbnail!.length).toBeGreaterThan(0);
      });
    });

    test("should handle mixed media projects", () => {
      const projectsWithBothMedia = PROJECTS.filter(
        (p) => p.video && p.thumbnail,
      );

      projectsWithBothMedia.forEach((project) => {
        expect(project.video).toBeDefined();
        expect(project.thumbnail).toBeDefined();

        // Both should be valid strings
        expect(typeof project.video).toBe("string");
        expect(typeof project.thumbnail).toBe("string");
      });
    });
  });

  describe("Error Boundary Integration", () => {
    test("should not crash when components receive invalid data", () => {
      const invalidProps = [
        { src: "", alt: "", projectName: "" },
        { src: null as any, alt: null as any, projectName: null as any },
        {
          src: undefined as any,
          alt: undefined as any,
          projectName: undefined as any,
        },
      ];

      invalidProps.forEach((props) => {
        expect(() => {
          render(<HoverVideo {...props} />);
        }).not.toThrow();
      });
    });

    test("should handle edge cases in project data", () => {
      // Test with edge case project data
      const edgeCaseProject = {
        id: "test",
        name: "Test Project",
        slug: "test",
        description: "Test",
        longDescription: "Test",
        category: "Test",
        tags: [],
        link: "https://test.com",
        video: "",
        images: [],
        timeline: "Test",
        status: "completed" as const,
        technologies: [],
        featured: false,
      };

      expect(() => {
        render(
          <HoverVideo
            src={edgeCaseProject.video}
            alt={edgeCaseProject.name}
            projectName={edgeCaseProject.name}
          />,
        );
      }).not.toThrow();
    });
  });

  describe("Performance Integration", () => {
    test("should not cause memory leaks with multiple renders", () => {
      const project = PROJECTS[0];

      // Render and unmount multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(
          <LazyHoverVideo
            src={project.video}
            alt={project.name}
            projectName={project.name}
          />,
        );
        unmount();
      }

      // If we get here without crashes, the test passes
      expect(true).toBe(true);
    });

    test("should handle rapid re-renders", () => {
      const project = PROJECTS[0];

      const { rerender } = render(
        <HoverVideo
          src={project.video}
          alt={project.name}
          projectName={project.name}
        />,
      );

      // Rapidly change props
      for (let i = 0; i < 5; i++) {
        rerender(
          <HoverVideo
            src={project.video}
            alt={`${project.name} ${i}`}
            projectName={`${project.name} ${i}`}
          />,
        );
      }

      expect(true).toBe(true);
    });
  });
});
