// Optimized data exports with lazy loading capabilities
export * from "./types";
export * from "./static-data";

// Lazy-loaded project data (only load when needed)
export const loadProjects = () => import("./projects").then((m) => m.PROJECTS);
export const loadFeaturedProjects = () =>
  import("./projects").then((m) => m.getFeaturedProjects());
export const loadProjectsByCategory = (category: string) =>
  import("./projects").then((m) => m.getProjectsByCategory(category));

// Direct exports for commonly used data
export {
  WORK_EXPERIENCE,
  BLOG_POSTS,
  SOCIAL_LINKS,
  ARCHIVE_ITEMS,
} from "./static-data";
export { getEmail, EMAIL_ENCODED, PROJECT_CATEGORIES } from "./types";
