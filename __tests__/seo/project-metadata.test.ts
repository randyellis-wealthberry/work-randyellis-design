import { PROJECTS } from "@/lib/data/projects";
import { WEBSITE_URL } from "@/lib/constants";
import {
  projectMetadata,
  projectCreativeWorkProps,
  projectBreadcrumbItems,
  projectOgImage,
  projectDateCreated,
} from "@/lib/metadata";
import * as fs from "fs";
import * as path from "path";

describe("projectOgImage (D-05)", () => {
  describe.each(PROJECTS.map((p) => [p.slug, p]))(
    "%s",
    (_slug: string, project: any) => {
      test("returns thumbnail when it matches image extension regex", () => {
        const result = projectOgImage(project);

        // Raster-only since Phase 13 T-10 — SVG is rejected by most OG
        // scrapers, so an SVG thumbnail counts as "no image".
        if (project.thumbnail?.match(/\.(png|jpe?g|webp|avif|gif)$/i)) {
          expect(result).toBe(project.thumbnail);
        }
      });

      test("falls back to first image entry when thumbnail is video", () => {
        const result = projectOgImage(project);

        if (project.thumbnail?.match(/\.mp4$/i)) {
          const firstImage = project.images?.find((img: string) =>
            /\.(png|jpe?g|webp|avif|gif)$/i.test(img),
          );
          expect(result).toBe(firstImage);
        }
      });
    },
  );

  test("ledgeriq returns /projects/ledgeriq/1.jpg (video thumbnail fallback)", () => {
    const ledgeriq = PROJECTS.find((p) => p.slug === "ledgeriq");
    expect(ledgeriq).toBeDefined();
    expect(projectOgImage(ledgeriq!)).toBe("/projects/ledgeriq/1.jpg");
  });

  test("growit returns /projects/growit/hero-thumbnail.jpg", () => {
    const growit = PROJECTS.find((p) => p.slug === "growit");
    expect(growit).toBeDefined();
    expect(projectOgImage(growit!)).toBe(
      "/projects/growit/hero-thumbnail.jpg",
    );
  });

  test("addvanced returns its image thumbnail", () => {
    const addvanced = PROJECTS.find((p) => p.slug === "addvanced");
    expect(addvanced).toBeDefined();
    expect(projectOgImage(addvanced!)).toBe(
      "/projects/addvanced/A0-Addvanced Splash Screen.png",
    );
  });

  test("returned image path exists on disk for every project", () => {
    PROJECTS.forEach((project) => {
      const img = projectOgImage(project);
      if (img) {
        const diskPath = path.join(process.cwd(), "public", img);
        expect(fs.existsSync(diskPath)).toBe(true);
      }
    });
  });
});

describe("projectDateCreated", () => {
  test("growit returns 2014 (first 4-digit year from timeline)", () => {
    const growit = PROJECTS.find((p) => p.slug === "growit");
    expect(growit).toBeDefined();
    expect(projectDateCreated(growit!)).toBe("2014");
  });

  test("ohplays returns 2017", () => {
    const ohplays = PROJECTS.find((p) => p.slug === "ohplays");
    expect(ohplays).toBeDefined();
    expect(projectDateCreated(ohplays!)).toBe("2017");
  });

  test("ledgeriq returns 2023", () => {
    const ledgeriq = PROJECTS.find((p) => p.slug === "ledgeriq");
    expect(ledgeriq).toBeDefined();
    expect(projectDateCreated(ledgeriq!)).toBe("2023");
  });

  test("nagarro returns 2022", () => {
    const nagarro = PROJECTS.find((p) => p.slug === "nagarro");
    expect(nagarro).toBeDefined();
    expect(projectDateCreated(nagarro!)).toBe("2022");
  });

  test("rambis-ui returns 2024", () => {
    const rambisUi = PROJECTS.find((p) => p.slug === "rambis-ui");
    expect(rambisUi).toBeDefined();
    expect(projectDateCreated(rambisUi!)).toBe("2024");
  });

  test("waffle returns 2025", () => {
    const waffle = PROJECTS.find((p) => p.slug === "waffle");
    expect(waffle).toBeDefined();
    expect(projectDateCreated(waffle!)).toBe("2025");
  });

  test("addvanced returns undefined (no year in timeline)", () => {
    const addvanced = PROJECTS.find((p) => p.slug === "addvanced");
    expect(addvanced).toBeDefined();
    expect(projectDateCreated(addvanced!)).toBeUndefined();
  });

  test("echo returns undefined (no year in timeline)", () => {
    const echo = PROJECTS.find((p) => p.slug === "echo");
    expect(echo).toBeDefined();
    expect(projectDateCreated(echo!)).toBeUndefined();
  });
});

describe("projectMetadata (D-02..D-08)", () => {
  describe.each(PROJECTS.map((p) => [p.slug, p]))(
    "%s",
    (_slug: string, project: any) => {
      test("title equals {name} | {subtitle}", () => {
        const metadata = projectMetadata(project);
        const expectedTitle = `${project.name} | ${project.subtitle}`;
        expect(metadata.title).toBe(expectedTitle);
      });

      test("description equals project.description (not longDescription)", () => {
        const metadata = projectMetadata(project);
        expect(metadata.description).toBe(project.description);
        expect(metadata.description).not.toBe(project.longDescription);
      });

      test("alternates.canonical equals /projects/{slug}", () => {
        const metadata = projectMetadata(project);
        expect(metadata.alternates?.canonical).toBe(
          `/projects/${project.slug}`,
        );
      });

      test("openGraph.url equals /projects/{slug}", () => {
        const metadata = projectMetadata(project);
        expect(metadata.openGraph?.url).toBe(`/projects/${project.slug}`);
      });

      test("openGraph.type equals article", () => {
        const metadata = projectMetadata(project);
        expect(metadata.openGraph?.type).toBe("article");
      });

      test("openGraph.authors deep equals ['Randy Ellis']", () => {
        const metadata = projectMetadata(project);
        expect(metadata.openGraph?.authors).toEqual(["Randy Ellis"]);
      });

      test("openGraph.publishedTime is undefined", () => {
        const metadata = projectMetadata(project);
        expect(
          (metadata.openGraph as any)?.publishedTime,
        ).toBeUndefined();
      });

      test("openGraph.title equals metadata.title", () => {
        const metadata = projectMetadata(project);
        expect(metadata.openGraph?.title).toBe(metadata.title);
      });

      test("openGraph.description equals project.description", () => {
        const metadata = projectMetadata(project);
        expect(metadata.openGraph?.description).toBe(project.description);
      });

      test("twitter.card equals summary_large_image", () => {
        const metadata = projectMetadata(project);
        expect(metadata.twitter?.card).toBe("summary_large_image");
      });

      test("twitter.title equals metadata.title", () => {
        const metadata = projectMetadata(project);
        expect(metadata.twitter?.title).toBe(metadata.title);
      });

      test("twitter.description equals project.description", () => {
        const metadata = projectMetadata(project);
        expect(metadata.twitter?.description).toBe(project.description);
      });

      test("keywords deep equals mechanical builder array", () => {
        const metadata = projectMetadata(project);
        const expectedKeywords = [
          project.name,
          ...project.technologies,
          ...project.tags,
          project.category,
          "Randy Ellis",
          "AI Product Design",
          "Design Engineering",
        ];
        expect(metadata.keywords).toEqual(expectedKeywords);
      });

      test("openGraph.images contains correct image object when image exists", () => {
        const metadata = projectMetadata(project);
        const img = projectOgImage(project);

        if (img) {
          expect(metadata.openGraph?.images).toEqual([
            {
              url: img,
              width: 1200,
              height: 630,
              alt: metadata.title,
            },
          ]);
        } else {
          // Phase 13 T-10: `images` must be ABSENT, not an empty array — an
          // explicit [] suppresses the opengraph-image.tsx file-convention
          // fallback that should serve these projects.
          expect(metadata.openGraph?.images).toBeUndefined();
        }
      });

      test("twitter.images contains image when image exists", () => {
        const metadata = projectMetadata(project);
        const img = projectOgImage(project);

        if (img) {
          expect(metadata.twitter?.images).toEqual([img]);
        } else {
          expect(metadata.twitter?.images).toBeUndefined();
        }
      });
    },
  );
});

describe("projectCreativeWorkProps (D-11)", () => {
  describe.each(PROJECTS.map((p) => [p.slug, p]))(
    "%s",
    (_slug: string, project: any) => {
      test("returns correct shape with all required fields", () => {
        const props = projectCreativeWorkProps(project);

        expect(props.name).toBe(project.name);
        expect(props.description).toBe(project.description);
        expect(props.url).toBe(`${WEBSITE_URL}/projects/${project.slug}`);
        expect(props.technologies).toEqual(project.technologies);
        expect(props.category).toBe(project.category);
        expect(props.metrics).toBe(project.metrics);
        expect(props.teamSize).toBe(project.teamSize);
        expect(props.role).toBe(project.role);
      });

      test("description is project.description, never longDescription", () => {
        const props = projectCreativeWorkProps(project);
        expect(props.description).toBe(project.description);
        expect(props.description).not.toBe(project.longDescription);
      });

      test("dateCreated matches projectDateCreated result", () => {
        const props = projectCreativeWorkProps(project);
        const expectedDate = projectDateCreated(project);
        expect(props.dateCreated).toBe(expectedDate);
      });

      test("imageUrl is absolute URL when projectOgImage exists", () => {
        const props = projectCreativeWorkProps(project);
        const img = projectOgImage(project);

        if (img) {
          expect(props.imageUrl).toBe(`${WEBSITE_URL}${img}`);
        } else {
          expect(props.imageUrl).toBeUndefined();
        }
      });
    },
  );
});

describe("projectBreadcrumbItems (D-12)", () => {
  describe.each(PROJECTS.map((p) => [p.slug, p]))(
    "%s",
    (_slug: string, project: any) => {
      test("returns Home > Projects > {name} breadcrumb structure", () => {
        const items = projectBreadcrumbItems(project);

        expect(items).toEqual([
          { name: "Home", url: WEBSITE_URL },
          { name: "Projects", url: `${WEBSITE_URL}/projects` },
          { name: project.name, url: `${WEBSITE_URL}/projects/${project.slug}` },
        ]);
      });

      test("all URLs are absolute with WEBSITE_URL", () => {
        const items = projectBreadcrumbItems(project);

        items.forEach((item) => {
          expect(item.url).toMatch(new RegExp(`^${WEBSITE_URL}`));
        });
      });
    },
  );
});
