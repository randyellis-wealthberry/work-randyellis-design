import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PROJECTS } from "@/lib/data/projects";
import { OptimizedProjectShowcase } from "@/components/optimized-project-showcase";

// Mock the lazy components
jest.mock("@/components/performance/lazy-components", () => ({
  OptimizedLazyVideo: jest.fn(({ src, poster, autoPlay, loop, muted, className, containerClassName }) => (
    <div className={containerClassName} data-testid="lazy-video-container">
      <video
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        className={className}
        data-testid="lazy-video"
      />
    </div>
  )),
  OptimizedLazyImage: jest.fn(({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} data-testid="lazy-image" />
  )),
}));

// Mock analytics
jest.mock("@/lib/analytics", () => ({
  trackProjectHover: jest.fn(),
  trackProjectView: jest.fn(),
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href, onClick }: any) => (
    <a href={href} onClick={onClick} data-testid="project-link">
      {children}
    </a>
  );
});

// Mock motion/react
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, onHoverStart, onHoverEnd, ...props }: any) => (
      <div 
        onMouseEnter={onHoverStart} 
        onMouseLeave={onHoverEnd}
        data-testid="motion-div"
        {...props}
      >
        {children}
      </div>
    ),
  },
}));

describe("Rambis UI Video Integration Tests", () => {
  const rambisProject = PROJECTS.find((p) => p.slug === "rambis-ui");
  
  // Transform project data to match showcase format
  const showcaseProjects = rambisProject ? [{
    slug: rambisProject.slug,
    title: rambisProject.name,
    company: rambisProject.subtitle,
    summary: rambisProject.description,
    thumbnail: rambisProject.thumbnail,
    video: rambisProject.video,
    featured: rambisProject.featured,
  }] : [];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Project Showcase Integration", () => {
    it("should render Rambis UI with video thumbnail in showcase", () => {
      render(<OptimizedProjectShowcase projects={showcaseProjects} />);

      const videoContainers = screen.getAllByTestId("lazy-video-container");
      expect(videoContainers.length).toBeGreaterThan(0);

      const video = screen.getByTestId("lazy-video");
      expect(video).toHaveAttribute("src", "/projects/rambis-ui/rambis.mp4");
    });

    it("should pass correct props to OptimizedLazyVideo", () => {
      const { OptimizedLazyVideo } = require("@/components/performance/lazy-components");
      
      render(<OptimizedProjectShowcase projects={showcaseProjects} />);

      expect(OptimizedLazyVideo).toHaveBeenCalledWith(
        expect.objectContaining({
          src: "/projects/rambis-ui/rambis.mp4",
          poster: "/projects/rambis-ui/hero-thumbnail.jpg", // Uses thumbnail as poster
          loop: true,
          muted: true,
          playsInline: true,
          controls: false,
          enableAdaptiveQuality: true,
        }),
        expect.anything()
      );
    });

    it("should handle hover interactions", async () => {
      const { trackProjectHover } = require("@/lib/analytics");
      
      render(<OptimizedProjectShowcase projects={showcaseProjects} />);

      const motionDiv = screen.getByTestId("motion-div");
      
      // Simulate hover
      fireEvent.mouseEnter(motionDiv);
      
      await waitFor(() => {
        expect(trackProjectHover).toHaveBeenCalledWith("rambis-ui");
      });

      // Check that autoPlay would be triggered
      const { OptimizedLazyVideo } = require("@/components/performance/lazy-components");
      const lastCall = OptimizedLazyVideo.mock.calls[OptimizedLazyVideo.mock.calls.length - 1];
      expect(lastCall[0].autoPlay).toBe(true);
    });

    it("should handle click navigation", () => {
      const { trackProjectView } = require("@/lib/analytics");
      
      render(<OptimizedProjectShowcase projects={showcaseProjects} />);

      const projectLink = screen.getByTestId("project-link");
      expect(projectLink).toHaveAttribute("href", "/projects/rambis-ui");

      fireEvent.click(projectLink);
      expect(trackProjectView).toHaveBeenCalledWith("rambis-ui");
    });
  });

  describe("Video Loading and Performance", () => {
    it("should set appropriate priority for featured projects", () => {
      const { OptimizedLazyVideo } = require("@/components/performance/lazy-components");
      
      render(<OptimizedProjectShowcase projects={showcaseProjects} />);

      // Rambis UI is featured, so should have high priority
      expect(OptimizedLazyVideo).toHaveBeenCalledWith(
        expect.objectContaining({
          priority: "high",
          preloadDistance: 500, // High priority gets 500px preload
        }),
        expect.anything()
      );
    });

    it("should render with correct aspect ratio", () => {
      render(<OptimizedProjectShowcase projects={showcaseProjects} />);

      const videoContainer = screen.getByTestId("lazy-video-container");
      const parentDiv = videoContainer.parentElement;
      
      expect(parentDiv).toHaveClass("aspect-video");
      expect(parentDiv).toHaveClass("max-h-48");
      expect(parentDiv).toHaveClass("w-full");
    });

    it("should apply hover opacity transition", () => {
      render(<OptimizedProjectShowcase projects={showcaseProjects} />);

      const videoContainer = screen.getByTestId("lazy-video-container");
      const parentDiv = videoContainer.parentElement;
      
      expect(parentDiv).toHaveClass("transition-opacity");
      expect(parentDiv).toHaveClass("duration-200");
      expect(parentDiv).toHaveClass("hover:opacity-90");
    });
  });

  describe("Mobile Responsiveness", () => {
    it("should maintain responsive classes", () => {
      render(<OptimizedProjectShowcase projects={showcaseProjects} />);

      const video = screen.getByTestId("lazy-video");
      
      expect(video).toHaveClass("h-full");
      expect(video).toHaveClass("w-full");
      expect(video).toHaveClass("object-cover");
    });

    it("should have playsInline for mobile compatibility", () => {
      const { OptimizedLazyVideo } = require("@/components/performance/lazy-components");
      
      render(<OptimizedProjectShowcase projects={showcaseProjects} />);

      expect(OptimizedLazyVideo).toHaveBeenCalledWith(
        expect.objectContaining({
          playsInline: true,
        }),
        expect.anything()
      );
    });
  });

  describe("Fallback Behavior", () => {
    it("should use poster image as fallback", () => {
      render(<OptimizedProjectShowcase projects={showcaseProjects} />);

      const video = screen.getByTestId("lazy-video");
      expect(video).toHaveAttribute("poster", "/projects/rambis-ui/hero-thumbnail.jpg");
    });

    it("should handle projects without video gracefully", () => {
      const projectWithoutVideo = [{
        ...showcaseProjects[0],
        video: undefined,
        thumbnail: "/projects/rambis-ui/hero-thumbnail.jpg",
      }];

      render(<OptimizedProjectShowcase projects={projectWithoutVideo} />);

      // Should render image instead of video
      const image = screen.queryByTestId("lazy-image");
      const video = screen.queryByTestId("lazy-video");
      
      expect(image).toBeInTheDocument();
      expect(video).not.toBeInTheDocument();
    });
  });

  describe("Multiple Projects Integration", () => {
    it("should handle multiple projects with different media types", () => {
      const mixedProjects = [
        showcaseProjects[0], // Rambis with video
        {
          slug: "test-project",
          title: "Test Project",
          company: "Test Company",
          summary: "Test summary",
          thumbnail: "/test-thumbnail.jpg",
          video: undefined,
          featured: false,
        },
      ];

      render(<OptimizedProjectShowcase projects={mixedProjects} />);

      // Should have one video and one image
      const videos = screen.getAllByTestId("lazy-video");
      const images = screen.getAllByTestId("lazy-image");
      
      expect(videos).toHaveLength(1);
      expect(images).toHaveLength(1);
    });

    it("should apply different priorities based on position", () => {
      const { OptimizedLazyVideo } = require("@/components/performance/lazy-components");
      
      const multipleProjects = [
        showcaseProjects[0],
        { ...showcaseProjects[0], slug: "project-2", featured: false },
        { ...showcaseProjects[0], slug: "project-3", featured: false },
      ];

      render(<OptimizedProjectShowcase projects={multipleProjects} />);

      const calls = OptimizedLazyVideo.mock.calls;
      
      // First project (featured) should have high priority
      expect(calls[0][0].priority).toBe("high");
      expect(calls[0][0].preloadDistance).toBe(500);
      
      // Second project should have medium priority
      expect(calls[1][0].priority).toBe("medium");
      expect(calls[1][0].preloadDistance).toBe(300);
      
      // Third project should have low priority
      expect(calls[2][0].priority).toBe("low");
      expect(calls[2][0].preloadDistance).toBe(150);
    });
  });

  describe("Accessibility Integration", () => {
    it("should have accessible link structure", () => {
      render(<OptimizedProjectShowcase projects={showcaseProjects} />);

      const link = screen.getByTestId("project-link");
      expect(link).toHaveAttribute("href", "/projects/rambis-ui");
    });

    it("should not have controls on video for cleaner UI", () => {
      const { OptimizedLazyVideo } = require("@/components/performance/lazy-components");
      
      render(<OptimizedProjectShowcase projects={showcaseProjects} />);

      expect(OptimizedLazyVideo).toHaveBeenCalledWith(
        expect.objectContaining({
          controls: false,
        }),
        expect.anything()
      );
    });

    it("should mute videos for autoplay compatibility", () => {
      const { OptimizedLazyVideo } = require("@/components/performance/lazy-components");
      
      render(<OptimizedProjectShowcase projects={showcaseProjects} />);

      expect(OptimizedLazyVideo).toHaveBeenCalledWith(
        expect.objectContaining({
          muted: true,
        }),
        expect.anything()
      );
    });
  });
});