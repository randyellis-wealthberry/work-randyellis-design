import { Project } from "@/app/data";

export interface ValidationError {
  projectName: string;
  field: "video" | "thumbnail" | "combination";
  message: string;
  duplicatedWith?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates project data for media path integrity
 * Ensures no duplicate video or thumbnail paths across projects
 */
export function validateProjectMediaIntegrity(
  projects: Project[],
): ValidationResult {
  const errors: ValidationError[] = [];

  // Track video paths
  const videoPathMap = new Map<string, string[]>();
  const thumbnailPathMap = new Map<string, string[]>();
  const mediaComboMap = new Map<string, string[]>();

  // Collect all paths
  projects.forEach((project) => {
    if (project.video?.trim()) {
      if (!videoPathMap.has(project.video)) {
        videoPathMap.set(project.video, []);
      }
      videoPathMap.get(project.video)!.push(project.name);
    }

    if (project.thumbnail?.trim()) {
      if (!thumbnailPathMap.has(project.thumbnail)) {
        thumbnailPathMap.set(project.thumbnail, []);
      }
      thumbnailPathMap.get(project.thumbnail)!.push(project.name);
    }

    // Track video + thumbnail combinations
    const combo = `${project.video || "none"}|${project.thumbnail || "none"}`;
    if (!mediaComboMap.has(combo)) {
      mediaComboMap.set(combo, []);
    }
    mediaComboMap.get(combo)!.push(project.name);
  });

  // Check for duplicate video paths
  videoPathMap.forEach((projectNames, videoPath) => {
    if (projectNames.length > 1) {
      projectNames.forEach((projectName) => {
        errors.push({
          projectName,
          field: "video",
          message: `Video path "${videoPath}" is shared with other projects`,
          duplicatedWith: projectNames.filter((name) => name !== projectName),
        });
      });
    }
  });

  // Check for duplicate thumbnail paths
  thumbnailPathMap.forEach((projectNames, thumbnailPath) => {
    if (projectNames.length > 1) {
      projectNames.forEach((projectName) => {
        errors.push({
          projectName,
          field: "thumbnail",
          message: `Thumbnail path "${thumbnailPath}" is shared with other projects`,
          duplicatedWith: projectNames.filter((name) => name !== projectName),
        });
      });
    }
  });

  // Check for duplicate media combinations (ignoring projects with no media)
  mediaComboMap.forEach((projectNames, combo) => {
    if (projectNames.length > 1 && combo !== "none|none") {
      const [video, thumbnail] = combo.split("|");
      projectNames.forEach((projectName) => {
        errors.push({
          projectName,
          field: "combination",
          message: `Media combination (video: "${video}", thumbnail: "${thumbnail}") is shared with other projects`,
          duplicatedWith: projectNames.filter((name) => name !== projectName),
        });
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates that media paths are properly formatted
 */
export function validateMediaPathFormats(
  projects: Project[],
): ValidationResult {
  const errors: ValidationError[] = [];

  projects.forEach((project) => {
    if (project.video && !isValidMediaPath(project.video)) {
      errors.push({
        projectName: project.name,
        field: "video",
        message: `Invalid video path format: "${project.video}". Paths should start with "/" or "http"`,
      });
    }

    if (project.thumbnail && !isValidMediaPath(project.thumbnail)) {
      errors.push({
        projectName: project.name,
        field: "thumbnail",
        message: `Invalid thumbnail path format: "${project.thumbnail}". Paths should start with "/" or "http"`,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if a media path is properly formatted
 */
function isValidMediaPath(path: string): boolean {
  return path.startsWith("/") || path.startsWith("http");
}

/**
 * Validates that featured projects have media defined
 */
export function validateFeaturedProjectsHaveMedia(
  projects: Project[],
): ValidationResult {
  const errors: ValidationError[] = [];

  const featuredProjectsWithoutMedia = projects
    .filter((project) => project.featured)
    .filter((project) => !project.video?.trim() && !project.thumbnail?.trim());

  featuredProjectsWithoutMedia.forEach((project) => {
    errors.push({
      projectName: project.name,
      field: "combination",
      message: "Featured project must have either video or thumbnail defined",
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Comprehensive validation combining all checks
 */
export function validateProjects(projects: Project[]): ValidationResult {
  const results = [
    validateProjectMediaIntegrity(projects),
    validateMediaPathFormats(projects),
    validateFeaturedProjectsHaveMedia(projects),
  ];

  const allErrors = results.flatMap((result) => result.errors);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}
