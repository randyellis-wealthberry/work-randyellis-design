import { PROJECTS, Project } from "@/app/data";

describe("Project Data Validation", () => {
  describe("LedgerIQ Project", () => {
    let ledgeriqProject: Project;

    beforeAll(() => {
      ledgeriqProject = PROJECTS.find((p) => p.id === "ledgeriq")!;
    });

    test("LedgerIQ project exists in PROJECTS array", () => {
      expect(ledgeriqProject).toBeDefined();
      expect(ledgeriqProject.id).toBe("ledgeriq");
    });

    test("LedgerIQ project has local MP4 video path", () => {
      expect(ledgeriqProject.video).toBeDefined();
      expect(ledgeriqProject.video).toMatch(/^\/images\/projects\/ledgeriq-glitch\.mp4$/);
      expect(ledgeriqProject.video).not.toMatch(/vimeo\.com/);
      expect(ledgeriqProject.video).not.toMatch(/youtube\.com/);
    });

    test("LedgerIQ project has fallback thumbnail", () => {
      expect(ledgeriqProject.thumbnail).toBeDefined();
      expect(ledgeriqProject.thumbnail).toMatch(/\.jpg$/);
    });

    test("LedgerIQ project maintains required properties", () => {
      expect(ledgeriqProject.name).toBe("LedgerIQ");
      expect(ledgeriqProject.slug).toBe("ledgeriq");
      expect(ledgeriqProject.description).toBeDefined();
      expect(ledgeriqProject.category).toBeDefined();
      expect(ledgeriqProject.featured).toBe(true);
    });

    test("LedgerIQ video path is valid format for HoverVideo component", () => {
      // Should be a local path starting with "/" for HoverVideo component
      expect(ledgeriqProject.video.startsWith("/")).toBe(true);
      expect(ledgeriqProject.video.endsWith(".mp4")).toBe(true);
      
      // Should not be an external URL (which would use iframe)
      expect(ledgeriqProject.video).not.toMatch(/^https?:\/\//);
    });
  });

  describe("All Projects Video Format Validation", () => {
    test("all projects have valid video property", () => {
      PROJECTS.forEach((project) => {
        expect(project.video).toBeDefined();
        expect(typeof project.video).toBe("string");
        expect(project.video.length).toBeGreaterThan(0);
      });
    });

    test("video paths are either local MP4 or external URLs", () => {
      PROJECTS.forEach((project) => {
        const isLocalVideo = project.video.startsWith("/") && project.video.endsWith(".mp4");
        const isExternalVideo = project.video.startsWith("http") || project.video.includes("vimeo.com") || project.video.includes("youtube.com");
        
        expect(isLocalVideo || isExternalVideo).toBe(true);
      });
    });

    test("all featured projects are valid", () => {
      const featuredProjects = PROJECTS.filter((p) => p.featured);
      
      expect(featuredProjects.length).toBeGreaterThan(0);
      featuredProjects.forEach((project) => {
        expect(project.id).toBeDefined();
        expect(project.name).toBeDefined();
        expect(project.slug).toBeDefined();
      });
    });
  });
});