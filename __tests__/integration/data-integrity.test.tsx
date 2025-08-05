/**
 * TDD PHASE 1: Data Integrity Testing
 * Comprehensive tests for all data models and loading functions
 */

import { PROJECTS } from "@/lib/data/projects";
import { WORK_EXPERIENCE, BLOG_POSTS, SOCIAL_LINKS, getEmail } from "@/lib/data";
import type { Project, WorkExperience, BlogPost, SocialLink } from "@/lib/data/types";

describe("TDD PHASE 1: Data Integrity Testing", () => {
  
  describe("Project Data Model Integrity", () => {
    test("should have valid project data structure", () => {
      expect(PROJECTS).toBeDefined();
      expect(Array.isArray(PROJECTS)).toBe(true);
      expect(PROJECTS.length).toBeGreaterThan(0);
    });

    test("should have all required project fields", () => {
      PROJECTS.forEach((project: Project) => {
        // Required fields
        expect(project.id).toBeDefined();
        expect(typeof project.id).toBe("string");
        expect(project.id.length).toBeGreaterThan(0);
        
        expect(project.name).toBeDefined();
        expect(typeof project.name).toBe("string");
        expect(project.name.length).toBeGreaterThan(0);
        
        expect(project.slug).toBeDefined();
        expect(typeof project.slug).toBe("string");
        expect(project.slug.length).toBeGreaterThan(0);
        
        expect(project.description).toBeDefined();
        expect(typeof project.description).toBe("string");
        expect(project.description.length).toBeGreaterThan(0);
        
        expect(project.longDescription).toBeDefined();
        expect(typeof project.longDescription).toBe("string");
        
        expect(project.category).toBeDefined();
        expect(typeof project.category).toBe("string");
        
        expect(project.tags).toBeDefined();
        expect(Array.isArray(project.tags)).toBe(true);
        
        expect(project.technologies).toBeDefined();
        expect(Array.isArray(project.technologies)).toBe(true);
        
        expect(typeof project.featured).toBe("boolean");
        if (project.archived !== undefined) {
          expect(typeof project.archived).toBe("boolean");
        }
      });
    });

    test("should have unique project IDs", () => {
      const ids = PROJECTS.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test("should have unique project slugs", () => {
      const slugs = PROJECTS.map(p => p.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    test("should have valid media references", () => {
      PROJECTS.forEach((project: Project) => {
        // If video exists, it should be a valid string
        if (project.video) {
          expect(typeof project.video).toBe("string");
          expect(project.video.length).toBeGreaterThan(0);
        }
        
        // If thumbnail exists, it should be a valid string
        if (project.thumbnail) {
          expect(typeof project.thumbnail).toBe("string");
          expect(project.thumbnail.length).toBeGreaterThan(0);
        }
        
        // At least one media type should exist
        expect(project.video || project.thumbnail).toBeTruthy();
      });
    });

    test("should have valid metrics structure", () => {
      PROJECTS.forEach((project: Project) => {
        if (project.metrics) {
          expect(Array.isArray(project.metrics)).toBe(true);
          project.metrics.forEach(metric => {
            expect(metric.label).toBeDefined();
            expect(typeof metric.label).toBe("string");
            expect(metric.value).toBeDefined();
            expect(typeof metric.value).toBe("string");
          });
        }
      });
    });
  });

  describe("Work Experience Data Integrity", () => {
    test("should have valid work experience structure", () => {
      expect(WORK_EXPERIENCE).toBeDefined();
      expect(Array.isArray(WORK_EXPERIENCE)).toBe(true);
      expect(WORK_EXPERIENCE.length).toBeGreaterThan(0);
    });

    test("should have all required work experience fields", () => {
      WORK_EXPERIENCE.forEach((job: WorkExperience) => {
        expect(job.id).toBeDefined();
        expect(typeof job.id).toBe("string");
        
        expect(job.title).toBeDefined();
        expect(typeof job.title).toBe("string");
        
        expect(job.company).toBeDefined();
        expect(typeof job.company).toBe("string");
        
        expect(job.start).toBeDefined();
        expect(typeof job.start).toBe("string");
        
        expect(job.end).toBeDefined();
        expect(typeof job.end).toBe("string");
        
        if (job.link) {
          expect(typeof job.link).toBe("string");
          expect(job.link).toMatch(/^https?:\/\//);
        }
      });
    });

    test("should have unique work experience IDs", () => {
      const ids = WORK_EXPERIENCE.map(job => job.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("Blog Posts Data Integrity", () => {
    test("should have valid blog posts structure", () => {
      expect(BLOG_POSTS).toBeDefined();
      expect(Array.isArray(BLOG_POSTS)).toBe(true);
      expect(BLOG_POSTS.length).toBeGreaterThan(0);
    });

    test("should have all required blog post fields", () => {
      BLOG_POSTS.forEach((post: BlogPost) => {
        expect(post.uid).toBeDefined();
        expect(typeof post.uid).toBe("string");
        
        expect(post.title).toBeDefined();
        expect(typeof post.title).toBe("string");
        
        expect(post.description).toBeDefined();
        expect(typeof post.description).toBe("string");
        
        expect(post.link).toBeDefined();
        expect(typeof post.link).toBe("string");
        expect(post.link.startsWith("/blog/")).toBe(true);
      });
    });

    test("should have unique blog post UIDs", () => {
      const uids = BLOG_POSTS.map(post => post.uid);
      const uniqueUids = new Set(uids);
      expect(uniqueUids.size).toBe(uids.length);
    });
  });

  describe("Social Links Data Integrity", () => {
    test("should have valid social links structure", () => {
      expect(SOCIAL_LINKS).toBeDefined();
      expect(Array.isArray(SOCIAL_LINKS)).toBe(true);
      expect(SOCIAL_LINKS.length).toBeGreaterThan(0);
    });

    test("should have all required social link fields", () => {
      SOCIAL_LINKS.forEach((link: SocialLink) => {
        expect(link.label).toBeDefined();
        expect(typeof link.label).toBe("string");
        
        expect(link.link).toBeDefined();
        expect(typeof link.link).toBe("string");
        expect(link.link).toMatch(/^https?:\/\//);
      });
    });
  });

  describe("Email Function Integrity", () => {
    test("should have valid email function", () => {
      const email = getEmail();
      expect(email).toBeDefined();
      expect(typeof email).toBe("string");
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Basic email regex
    });
  });

  describe("Data Loading Functions", () => {
    test("should be able to load projects data", () => {
      expect(PROJECTS).toBeDefined();
      expect(PROJECTS.length).toBeGreaterThan(0);
      
      // Test featured projects
      const featuredProjects = PROJECTS.filter(p => p.featured);
      expect(featuredProjects.length).toBeGreaterThan(0);
      
      // Test archived projects
      const archivedProjects = PROJECTS.filter(p => p.archived);
      expect(Array.isArray(archivedProjects)).toBe(true); // May be empty array
    });

    test("should have consistent data relationships", () => {
      // All projects should have categories that exist in project categories
      const allCategories = new Set(PROJECTS.map(p => p.category));
      expect(allCategories.size).toBeGreaterThan(0);
      
      // All featured projects should be valid
      const featuredProjects = PROJECTS.filter(p => p.featured);
      featuredProjects.forEach(project => {
        expect(project.id).toBeDefined();
        expect(project.name).toBeDefined();
        expect(project.description).toBeDefined();
      });
    });
  });

  describe("Data Cross-References", () => {
    test("should have no broken internal references", () => {
      // Test that all project slugs are URL-safe
      PROJECTS.forEach(project => {
        expect(project.slug).toMatch(/^[a-z0-9-]+$/);
      });
      
      // Test that all blog post links are valid internal links
      BLOG_POSTS.forEach(post => {
        expect(post.link.startsWith("/blog/")).toBe(true);
        expect(post.link).not.toContain(" ");
      });
    });
  });
});