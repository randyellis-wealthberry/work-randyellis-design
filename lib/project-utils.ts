/**
 * Utility functions for project management and selection
 */

/**
 * Filters projects by category, tags, or name
 *
 * Backs the `/projects?category=` URL filter that the WebSite SearchAction advertises (Phase 10 D-13).
 * Searches across project.name, project.category, project.categories[], and project.tags[].
 * Case-insensitive, trims whitespace. Returns all projects when term is empty/null/undefined.
 *
 * @template T Object with name, category, tags, and optional categories
 * @param projects - Array of projects to filter
 * @param term - Search term (case-insensitive, trimmed)
 * @returns Filtered array of projects matching the term
 *
 * @example
 * ```typescript
 * const mobileProjects = filterProjectsByCategory(PROJECTS, "Mobile App");
 * const gardeningProjects = filterProjectsByCategory(PROJECTS, "gardening");
 * ```
 */
export function filterProjectsByCategory<
  T extends {
    name: string;
    category: string;
    categories?: string[];
    tags: string[];
  },
>(projects: readonly T[], term: string | null | undefined): T[] {
  const q = term?.trim().toLowerCase() ?? "";
  if (!q) return [...projects];

  return projects.filter((p) => {
    const searchableFields = [
      p.name,
      p.category,
      ...(p.categories ?? []),
      ...p.tags,
    ];

    return searchableFields.some((field) => field.toLowerCase().includes(q));
  });
}

/**
 * Randomly selects a specified number of items from an array
 * Uses Fisher-Yates shuffle algorithm for optimal performance and fairness
 *
 * @template T The type of items in the array
 * @param items - Array of items to select from
 * @param count - Number of items to select (must be non-negative integer)
 * @returns Array of randomly selected items without duplicates
 *
 * @example
 * ```typescript
 * const projects = [project1, project2, project3];
 * const randomTwo = getRandomProjects(projects, 2);
 * // Returns 2 random projects without duplicates
 * ```
 */
export function getRandomProjects<T>(items: readonly T[], count: number): T[] {
  // Handle edge cases
  if (!items || items.length === 0 || count <= 0) {
    return [];
  }

  // If count is greater than or equal to array length, return all items
  if (count >= items.length) {
    return [...items];
  }

  // Use Fisher-Yates shuffle for first 'count' elements
  // This is more efficient than shuffling the entire array
  const result = [...items]; // Create a copy to avoid mutation

  for (let i = 0; i < count; i++) {
    // Generate random index from i to end of array
    const randomIndex = Math.floor(Math.random() * (result.length - i)) + i;

    // Swap current element with randomly selected element
    [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
  }

  // Return only the first 'count' elements
  return result.slice(0, count);
}
