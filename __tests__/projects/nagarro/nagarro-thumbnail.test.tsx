import { render, screen } from "@testing-library/react";
import { PROJECTS } from "@/lib/data/projects";

// Mock the ProjectThumbnail component from the main page
function ProjectThumbnail({ project }: { project: (typeof PROJECTS)[0] }) {
  // Check if project has a video and it's a local MP4 file for thumbnail display
  if (
    project.video &&
    project.video.includes(".mp4") &&
    project.video.startsWith("/")
  ) {
    return (
      <div
        className="aspect-video w-full max-h-48 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity duration-200"
        data-testid="video-thumbnail"
      >
        <video src={project.video} className="w-full h-full" />
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
      className="aspect-video w-full max-h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
    />
  );
}

describe("Nagarro Project Thumbnail", () => {
  const nagarroProject = PROJECTS.find(p => p.slug === "nagarro");

  beforeEach(() => {
    // Clear any previous DOM
    document.body.innerHTML = "";
  });

  it("should find the Nagarro project in project data", () => {
    expect(nagarroProject).toBeDefined();
    expect(nagarroProject?.name).toBe("Design Leadership @ Nagarro");
  });

  it("should render thumbnail image when video file is missing", () => {
    if (!nagarroProject) {
      throw new Error("Nagarro project not found");
    }

    render(<ProjectThumbnail project={nagarroProject} />);

    // This test should pass when video is removed and thumbnail is used
    const thumbnailElement = screen.queryByTestId("static-thumbnail");
    const videoElement = screen.queryByTestId("video-thumbnail");

    // Should show thumbnail, not video
    expect(thumbnailElement).toBeInTheDocument();
    expect(videoElement).not.toBeInTheDocument();

    // Thumbnail should have correct src
    if (thumbnailElement) {
      expect(thumbnailElement).toHaveAttribute("src", "/projects/nagarro/nagarro-logo.png");
      expect(thumbnailElement).toHaveAttribute("alt", "Design Leadership @ Nagarro");
    }
  });

  it("should have correct thumbnail path configured", () => {
    expect(nagarroProject?.thumbnail).toBe("/projects/nagarro/nagarro-logo.png");
  });

  it("should be marked as featured project", () => {
    expect(nagarroProject?.featured).toBe(true);
  });

  it("should have video reference removed (bug fix verified)", () => {
    if (!nagarroProject) {
      throw new Error("Nagarro project not found");
    }

    // This verifies the bug has been fixed - project has empty video string
    expect(nagarroProject.video).toBe("");
    
    render(<ProjectThumbnail project={nagarroProject} />);

    // Should now correctly render thumbnail element instead of video
    const videoElement = screen.queryByTestId("video-thumbnail");
    const thumbnailElement = screen.queryByTestId("static-thumbnail");

    // Fix: Shows thumbnail element instead of video
    expect(thumbnailElement).toBeInTheDocument();
    expect(videoElement).not.toBeInTheDocument();
  });
});