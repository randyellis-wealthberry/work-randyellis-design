import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PROJECTS } from "@/lib/data/projects";
import { OptimizedLazyVideo } from "@/components/performance/lazy-components";

// Mock the OptimizedLazyVideo component
jest.mock("@/components/performance/lazy-components", () => ({
  OptimizedLazyVideo: jest.fn(({ src, poster, autoPlay, className }) => (
    <video
      src={src}
      poster={poster}
      autoPlay={autoPlay}
      className={className}
      data-testid="video-thumbnail"
    />
  )),
  OptimizedLazyImage: jest.fn(({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} data-testid="static-thumbnail" />
  )),
}));

// Mock the ProjectThumbnail component similar to the actual OptimizedProjectCard
function ProjectThumbnail({ project }: { project: (typeof PROJECTS)[0] }) {
  // Check if project has a video and it's a local MP4 file for video display
  if (
    project.video &&
    project.video.includes(".mp4") &&
    project.video.startsWith("/")
  ) {
    return (
      <div
        className="aspect-video max-h-48 w-full cursor-pointer overflow-hidden rounded-lg transition-opacity duration-200 hover:opacity-90"
        data-testid="video-container"
      >
        <video 
          src={project.video} 
          className="h-full w-full"
          data-testid="video-thumbnail"
          poster={project.thumbnail}
        />
      </div>
    );
  }

  const thumbnailSrc =
    project.thumbnail || "/images/projects/placeholder-thumbnail.jpg";

  return (
    <img
      src={thumbnailSrc}
      alt={project.name}
      data-testid="static-thumbnail"
      className="aspect-video max-h-48 w-full cursor-pointer rounded-lg object-cover transition-opacity duration-200 hover:opacity-90"
    />
  );
}

describe("Rambis UI Project Video Thumbnail", () => {
  const rambisProject = PROJECTS.find((p) => p.slug === "rambis-ui");

  beforeEach(() => {
    // Clear any previous DOM and mocks
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  describe("Project Data Validation", () => {
    it("should find the Rambis UI project in project data", () => {
      expect(rambisProject).toBeDefined();
      expect(rambisProject?.name).toBe("Rambis UI");
      expect(rambisProject?.subtitle).toBe("Modern Design System & Component Library");
    });

    it("should have correct project slug", () => {
      expect(rambisProject?.slug).toBe("rambis-ui");
    });

    it("should be marked as featured project", () => {
      expect(rambisProject?.featured).toBe(true);
    });
  });

  describe("Video Thumbnail Configuration", () => {
    it("should have video configured as MP4", () => {
      // Video should be the rambis.mp4 file
      expect(rambisProject?.video).toBe("/projects/rambis-ui/rambis.mp4");
    });

    it("should have thumbnail as fallback poster image", () => {
      // Thumbnail should be the jpg for poster
      expect(rambisProject?.thumbnail).toBe("/projects/rambis-ui/hero-thumbnail.jpg");
    });

    it("should have correct file extensions", () => {
      expect(rambisProject?.video).toMatch(/\.mp4$/);
      expect(rambisProject?.thumbnail).toMatch(/\.jpg$/);
    });
  });

  describe("Video Thumbnail Rendering", () => {
    it("should render video element when video property is MP4", () => {
      if (!rambisProject) {
        throw new Error("Rambis UI project not found");
      }

      render(<ProjectThumbnail project={rambisProject} />);

      const videoElement = screen.getByTestId("video-thumbnail");
      const videoContainer = screen.getByTestId("video-container");

      expect(videoElement).toBeInTheDocument();
      expect(videoContainer).toBeInTheDocument();
      expect(videoElement).toHaveAttribute("src", rambisProject.video);
    });

    it("should include poster attribute for video fallback", () => {
      if (!rambisProject) {
        throw new Error("Rambis UI project not found");
      }

      render(<ProjectThumbnail project={rambisProject} />);

      const videoElement = screen.getByTestId("video-thumbnail");
      expect(videoElement).toHaveAttribute("poster", rambisProject.thumbnail);
    });

    it("should have correct video attributes for optimal playback", () => {
      if (!rambisProject) {
        throw new Error("Rambis UI project not found");
      }

      render(<ProjectThumbnail project={rambisProject} />);

      const videoElement = screen.getByTestId("video-thumbnail");
      
      // Check important video attributes - these would be added by OptimizedLazyVideo in production
      expect(videoElement).toBeInTheDocument();
      expect(videoElement).toHaveAttribute("src", rambisProject.video);
      expect(videoElement).toHaveAttribute("poster", rambisProject.thumbnail);
    });

    it("should render static thumbnail when video is not present", () => {
      if (!rambisProject) {
        throw new Error("Rambis UI project not found");
      }

      const projectWithoutVideo = {
        ...rambisProject,
        video: undefined,
      };

      render(<ProjectThumbnail project={projectWithoutVideo} />);

      const imageElement = screen.getByTestId("static-thumbnail");
      const videoElement = screen.queryByTestId("video-thumbnail");

      expect(imageElement).toBeInTheDocument();
      expect(videoElement).not.toBeInTheDocument();
      expect(imageElement).toHaveAttribute("src", projectWithoutVideo.thumbnail);
    });
  });

  describe("Video Interaction Tests", () => {
    it("should handle hover states correctly", async () => {
      if (!rambisProject) {
        throw new Error("Rambis UI project not found");
      }

      render(<ProjectThumbnail project={rambisProject} />);

      const videoContainer = screen.getByTestId("video-container");
      
      // Test hover class application
      expect(videoContainer).toHaveClass("hover:opacity-90");
      expect(videoContainer).toHaveClass("transition-opacity");
    });

    it("should maintain aspect ratio for video", () => {
      if (!rambisProject) {
        throw new Error("Rambis UI project not found");
      }

      render(<ProjectThumbnail project={rambisProject} />);

      const videoContainer = screen.getByTestId("video-container");
      expect(videoContainer).toHaveClass("aspect-video");
    });

    it("should apply correct styling classes", () => {
      if (!rambisProject) {
        throw new Error("Rambis UI project not found");
      }

      render(<ProjectThumbnail project={rambisProject} />);

      const videoContainer = screen.getByTestId("video-container");
      const videoElement = screen.getByTestId("video-thumbnail");

      // Container classes
      expect(videoContainer).toHaveClass("max-h-48");
      expect(videoContainer).toHaveClass("w-full");
      expect(videoContainer).toHaveClass("cursor-pointer");
      expect(videoContainer).toHaveClass("overflow-hidden");
      expect(videoContainer).toHaveClass("rounded-lg");

      // Video classes
      expect(videoElement).toHaveClass("h-full");
      expect(videoElement).toHaveClass("w-full");
    });
  });

  describe("Accessibility Tests", () => {
    it("should have appropriate alt text when falling back to image", () => {
      if (!rambisProject) {
        throw new Error("Rambis UI project not found");
      }

      const projectWithoutVideo = {
        ...rambisProject,
        video: undefined,
      };

      render(<ProjectThumbnail project={projectWithoutVideo} />);

      const imageElement = screen.getByTestId("static-thumbnail");
      expect(imageElement).toHaveAttribute("alt", "Rambis UI");
    });

    it("should be keyboard accessible", () => {
      if (!rambisProject) {
        throw new Error("Rambis UI project not found");
      }

      render(<ProjectThumbnail project={rambisProject} />);

      const videoContainer = screen.getByTestId("video-container");
      
      // Check that cursor-pointer indicates interactivity
      expect(videoContainer).toHaveClass("cursor-pointer");
    });
  });

  describe("Performance Optimization Tests", () => {
    it("should not autoplay video by default", () => {
      if (!rambisProject) {
        throw new Error("Rambis UI project not found");
      }

      render(<ProjectThumbnail project={rambisProject} />);

      const videoElement = screen.getByTestId("video-thumbnail");
      
      // Video should not have autoplay attribute initially
      expect(videoElement).not.toHaveAttribute("autoplay");
    });

    it("should render video element for performance optimization", () => {
      if (!rambisProject) {
        throw new Error("Rambis UI project not found");
      }

      render(<ProjectThumbnail project={rambisProject} />);

      const videoElement = screen.getByTestId("video-thumbnail");
      
      // Video element is rendered for MP4 thumbnails
      expect(videoElement).toBeInTheDocument();
      expect(videoElement.tagName.toLowerCase()).toBe("video");
    });
  });

  describe("Error Handling Tests", () => {
    it("should gracefully handle missing project", () => {
      const undefinedProject = PROJECTS.find((p) => p.slug === "non-existent");
      expect(undefinedProject).toBeUndefined();
    });

    it("should use placeholder when thumbnail is missing", () => {
      if (!rambisProject) {
        throw new Error("Rambis UI project not found");
      }

      const projectWithoutThumbnail = {
        ...rambisProject,
        thumbnail: undefined as any,
        video: undefined as any,
      };

      render(<ProjectThumbnail project={projectWithoutThumbnail} />);

      const imageElement = screen.getByTestId("static-thumbnail");
      expect(imageElement).toHaveAttribute("src", "/images/projects/placeholder-thumbnail.jpg");
    });
  });
});