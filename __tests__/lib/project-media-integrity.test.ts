import { PROJECTS } from "@/lib/data/projects";

describe("Project Media Integrity", () => {
  describe("Unique Media Paths", () => {
    it("should ensure all projects have unique video paths", () => {
      const videoPaths = PROJECTS.filter(
        (project) => project.video && project.video.trim() !== "",
      ).map((project) => project.video);

      const uniqueVideoPaths = new Set(videoPaths);

      // Find duplicates for better error reporting
      const duplicates = videoPaths.filter(
        (path, index) => videoPaths.indexOf(path) !== index,
      );

      if (duplicates.length > 0) {
        const duplicateInfo = duplicates.map((path) => {
          const projectsWithPath = PROJECTS.filter((p) => p.video === path);
          return `${path} used by: ${projectsWithPath.map((p) => p.name).join(", ")}`;
        });

        throw new Error(
          `Found duplicate video paths:\n${duplicateInfo.join("\n")}`,
        );
      }

      expect(uniqueVideoPaths.size).toBe(videoPaths.length);
    });

    it("should ensure all projects have unique thumbnail paths when defined", () => {
      const thumbnailPaths = PROJECTS.filter(
        (project) => project.thumbnail && project.thumbnail.trim() !== "",
      ).map((project) => project.thumbnail);

      const uniqueThumbnailPaths = new Set(thumbnailPaths);

      // Find duplicates for better error reporting
      const duplicates = thumbnailPaths.filter(
        (path, index) => thumbnailPaths.indexOf(path) !== index,
      );

      if (duplicates.length > 0) {
        const duplicateInfo = duplicates.map((path) => {
          const projectsWithPath = PROJECTS.filter((p) => p.thumbnail === path);
          return `${path} used by: ${projectsWithPath.map((p) => p.name).join(", ")}`;
        });

        throw new Error(
          `Found duplicate thumbnail paths:\n${duplicateInfo.join("\n")}`,
        );
      }

      expect(uniqueThumbnailPaths.size).toBe(thumbnailPaths.length);
    });

    it("should not have projects sharing the same video and thumbnail combination", () => {
      const mediaComboMap = new Map<string, string[]>();

      PROJECTS.forEach((project) => {
        const combo = `${project.video || "none"}|${project.thumbnail || "none"}`;
        if (!mediaComboMap.has(combo)) {
          mediaComboMap.set(combo, []);
        }
        mediaComboMap.get(combo)!.push(project.name);
      });

      const duplicatedCombos = Array.from(mediaComboMap.entries())
        .filter(([_, projectNames]) => projectNames.length > 1)
        .filter(([combo, _]) => combo !== "none|none"); // Ignore projects with no media

      if (duplicatedCombos.length > 0) {
        const duplicateInfo = duplicatedCombos.map(([combo, projectNames]) => {
          const [video, thumbnail] = combo.split("|");
          return `Video: ${video}, Thumbnail: ${thumbnail} shared by: ${projectNames.join(", ")}`;
        });

        throw new Error(
          `Found projects sharing the same media combination:\n${duplicateInfo.join("\n")}`,
        );
      }

      expect(duplicatedCombos.length).toBe(0);
    });
  });

  describe("Project Media Validation", () => {
    it("should ensure all featured projects have either video or thumbnail defined", () => {
      const featuredProjectsWithoutMedia = PROJECTS.filter(
        (project) => project.featured,
      ).filter(
        (project) =>
          (!project.video || project.video.trim() === "") &&
          (!project.thumbnail || project.thumbnail.trim() === ""),
      );

      expect(featuredProjectsWithoutMedia).toEqual([]);
    });

    it("should ensure video and thumbnail paths are properly formatted", () => {
      const invalidPaths: string[] = [];

      PROJECTS.forEach((project) => {
        if (project.video) {
          if (
            !project.video.startsWith("/") &&
            !project.video.startsWith("http")
          ) {
            invalidPaths.push(
              `${project.name}: Invalid video path format - ${project.video}`,
            );
          }
        }

        if (project.thumbnail) {
          if (
            !project.thumbnail.startsWith("/") &&
            !project.thumbnail.startsWith("http")
          ) {
            invalidPaths.push(
              `${project.name}: Invalid thumbnail path format - ${project.thumbnail}`,
            );
          }
        }
      });

      if (invalidPaths.length > 0) {
        throw new Error(
          `Found invalid media path formats:\n${invalidPaths.join("\n")}`,
        );
      }

      expect(invalidPaths.length).toBe(0);
    });
  });
});
