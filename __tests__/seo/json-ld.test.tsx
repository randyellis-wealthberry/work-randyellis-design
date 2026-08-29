import { renderToStaticMarkup } from "react-dom/server";
import { PROJECTS } from "@/lib/data/projects";
import { WEBSITE_URL } from "@/lib/constants";
import {
  buildPersonSchema,
  buildWebSiteSchema,
  buildCreativeWorkSchema,
  buildArticleSchema,
  buildBreadcrumbSchema,
  serializeJsonLd,
  PERSON_ID,
  WEBSITE_ID,
} from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { createBaseMetadata, projectDateCreated } from "@/lib/metadata";
import * as fs from "fs";
import * as path from "path";

describe("serializeJsonLd", () => {
  test("escapes < to \\u003c and > to \\u003e", () => {
    const result = serializeJsonLd({ a: "</script><b>" });
    expect(result).toContain("\\u003c/script\\u003e");
    expect(result).not.toContain("</script>");
    expect(result).toContain("\\u003cb\\u003e");
    expect(result).not.toContain("<b>");
  });

  test("round-trips through JSON.parse", () => {
    const input = {
      nested: { array: [1, 2, { deep: "</script>" }] },
      text: "<>&",
    };
    const serialized = serializeJsonLd(input);
    const parsed = JSON.parse(serialized);
    expect(parsed).toEqual(input);
  });
});

describe("buildPersonSchema", () => {
  const schema = buildPersonSchema();

  test("has correct @context and @type", () => {
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Person");
  });

  test("has correct @id matching PERSON_ID", () => {
    expect(schema["@id"]).toBe(PERSON_ID);
    expect(PERSON_ID).toBe(`${WEBSITE_URL}/#person`);
  });

  test("has name Randy Ellis", () => {
    expect(schema.name).toBe("Randy Ellis");
  });

  test("has jobTitle array with exactly two entries in correct order (D-12)", () => {
    expect(schema.jobTitle).toEqual([
      "Head of Product",
      "Fractional Chief Design Officer",
    ]);
  });

  test("description matches createBaseMetadata().description (single source)", () => {
    const baseMetadata = createBaseMetadata();
    expect(schema.description).toBe(baseMetadata.description);
  });

  test("url is site root", () => {
    expect(schema.url).toBe(`${WEBSITE_URL}/`);
  });

  test("image points to existing file in public/", () => {
    expect(schema.image).toBe(
      `${WEBSITE_URL}/images/randyellis-official-avatar.png`,
    );
    const diskPath = path.join(
      process.cwd(),
      "public/images/randyellis-official-avatar.png",
    );
    expect(fs.existsSync(diskPath)).toBe(true);
  });

  test("sameAs uses x.com not twitter.com", () => {
    expect(schema.sameAs).toEqual([
      "https://www.linkedin.com/in/iamrandyellis/",
      "https://github.com/randyellis-wealthberry",
      "https://x.com/iamrandyellis",
    ]);
  });

  test("award has exactly 4 verbatim strings", () => {
    expect(schema.award).toEqual([
      "Silver Award, The Davey Awards — Mobile Apps/Social (GrowIt!)",
      "Silver Award, The Davey Awards — Mobile Apps/Lifestyle (GrowIt!)",
      "3rd Place, Vega Digital Awards — Best User Interface App/Experience (GrowIt!)",
      "3rd Place, Vega Digital Awards — Best Lifestyle App (GrowIt!)",
    ]);
  });

  test("knowsAbout has 21 items and excludes partner names", () => {
    expect(schema.knowsAbout).toHaveLength(21);
    expect(schema.knowsAbout).toContain("Fractional Chief Design Officer");
    expect(schema.knowsAbout).not.toContain("Chameleon Collective Partnership");
    expect(schema.knowsAbout).not.toContain("Go Fractional Design Leadership");
  });

  test("schema contains no forbidden Organization/business terms", () => {
    const json = JSON.stringify(schema);
    expect(json).not.toContain('"Organization"');
    expect(json).not.toContain("LocalBusiness");
    expect(json).not.toContain("FAQPage");
    expect(json).not.toContain("ProfessionalService");
    expect(json).not.toContain("twitter.com");
    expect(json.toLowerCase()).not.toContain("chameleon");
    expect(json).not.toContain("Wealthberry");
    expect(json).not.toContain("worksFor");
    expect(json).not.toContain("hasOccupation");
    expect(json).not.toContain("performerIn");
    expect(json).not.toContain("alumniOf");
    expect(json).not.toContain("hasCredential");
  });
});

describe("buildWebSiteSchema", () => {
  const schema = buildWebSiteSchema();

  test("has correct casing WebSite (not Website)", () => {
    expect(schema["@type"]).toBe("WebSite");
  });

  test("has correct @id matching WEBSITE_ID", () => {
    expect(schema["@id"]).toBe(WEBSITE_ID);
    expect(WEBSITE_ID).toBe(`${WEBSITE_URL}/#website`);
  });

  test("url is site root", () => {
    expect(schema.url).toBe(`${WEBSITE_URL}/`);
  });

  test("name from createBaseMetadata().openGraph.siteName", () => {
    const baseMetadata = createBaseMetadata();
    expect(schema.name).toBe(baseMetadata.openGraph?.siteName);
    expect(schema.name).toBe("Randy Ellis - Head of Product & Fractional CDO");
  });

  test("description matches createBaseMetadata().description", () => {
    const baseMetadata = createBaseMetadata();
    expect(schema.description).toBe(baseMetadata.description);
  });

  test("inLanguage is en-US", () => {
    expect(schema.inLanguage).toBe("en-US");
  });

  test("author links to Person entity", () => {
    expect(schema.author).toEqual({
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Randy Ellis",
    });
  });

  test("potentialAction has SearchAction with correct template (D-13)", () => {
    expect(schema.potentialAction).toEqual({
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${WEBSITE_URL}/projects?category={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    });
  });

  test("schema contains no Organization", () => {
    const json = JSON.stringify(schema);
    expect(json).not.toContain('"Organization"');
  });
});

describe.each(PROJECTS.map((p) => [p.slug, p]))(
  "buildCreativeWorkSchema(%s)",
  (_slug: string, project: any) => {
    const schema = buildCreativeWorkSchema(project);

    test("@type is CreativeWork", () => {
      expect(schema["@type"]).toBe("CreativeWork");
    });

    test("name, description, url match project data", () => {
      expect(schema.name).toBe(project.name);
      expect(schema.description).toBe(project.description);
      expect(schema.url).toBe(`${WEBSITE_URL}/projects/${project.slug}`);
    });

    test("mainEntityOfPage is WebPage with same url", () => {
      expect(schema.mainEntityOfPage).toEqual({
        "@type": "WebPage",
        "@id": `${WEBSITE_URL}/projects/${project.slug}`,
      });
    });

    test("inLanguage is en-US", () => {
      expect(schema.inLanguage).toBe("en-US");
    });

    test("genre is project.category", () => {
      expect(schema.genre).toBe(project.category);
    });

    test("keywords is comma-joined technologies", () => {
      expect(schema.keywords).toBe(project.technologies.join(", "));
    });

    test("creator links to Person entity with url", () => {
      expect(schema.creator).toEqual({
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Randy Ellis",
        url: `${WEBSITE_URL}/`,
      });
    });

    test("copyrightHolder is Person entity", () => {
      expect(schema.copyrightHolder).toEqual({
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Randy Ellis",
      });
    });

    test("dateCreated matches projectDateCreated when defined", () => {
      const expected = projectDateCreated(project);
      if (expected) {
        expect(schema.dateCreated).toBe(expected);
      } else {
        expect(schema).not.toHaveProperty("dateCreated");
      }
    });

    test("image is ImageObject with url when projectOgImage defined", () => {
      if (schema.image) {
        expect(schema.image).toHaveProperty("@type", "ImageObject");
        expect(schema.image).toHaveProperty("url");
        expect(schema.image.url).toContain(`${WEBSITE_URL}/projects/`);
      }
    });

    test("teamSize echoed when present (D-14)", () => {
      if (project.teamSize !== undefined) {
        expect(schema.teamSize).toBe(project.teamSize);
      } else {
        expect(schema).not.toHaveProperty("teamSize");
      }
    });

    test("role echoed when present (D-14)", () => {
      if (project.role) {
        expect(schema.role).toBe(project.role);
      } else {
        expect(schema).not.toHaveProperty("role");
      }
    });

    test("additionalProperty maps metrics when present", () => {
      if (project.metrics && project.metrics.length > 0) {
        expect(schema.additionalProperty).toBeDefined();
        expect(schema.additionalProperty).toHaveLength(project.metrics.length);
        schema.additionalProperty.forEach((prop: any, i: number) => {
          expect(prop).toEqual({
            "@type": "PropertyValue",
            name: project.metrics[i].label,
            value: project.metrics[i].value,
          });
        });
      } else {
        expect(schema).not.toHaveProperty("additionalProperty");
      }
    });

    test("schema contains no forbidden patterns", () => {
      const json = JSON.stringify(schema);
      expect(json).not.toContain('"Organization"');
      expect(json).not.toContain("roleName");
      // Keyed form, not the bare word: this guards against the schema.org
      // `license` property being emitted, and a project is allowed to say
      // "licensed" in its own prose. Pixelbox's description does, and
      // `skills` lists "MIT License" among its technologies — that one only
      // slipped past the bare-word check because it is capitalised.
      expect(json).not.toContain('"license":');
      expect(json).not.toContain("Team Collaboration");
      expect(json).not.toContain("Wealthberry");
    });
  },
);

describe("buildArticleSchema", () => {
  const input = {
    title: "Test Article",
    description: "Test description",
    datePublished: "2024-01-15",
    url: `${WEBSITE_URL}/blog/test`,
    dateModified: "2024-01-20",
    imageUrl: `${WEBSITE_URL}/images/test.jpg`,
    keywords: ["AI", "Design"],
  };

  const schema = buildArticleSchema(input);

  test("@type is Article", () => {
    expect(schema["@type"]).toBe("Article");
  });

  test("headline, description, url, datePublished echoed", () => {
    expect(schema.headline).toBe(input.title);
    expect(schema.description).toBe(input.description);
    expect(schema.url).toBe(input.url);
    expect(schema.datePublished).toBe(input.datePublished);
  });

  test("dateModified echoed when provided", () => {
    expect(schema.dateModified).toBe(input.dateModified);
  });

  test("dateModified defaults to datePublished when omitted", () => {
    const schemaNoMod = buildArticleSchema({
      title: "No Mod",
      description: "desc",
      datePublished: "2024-01-01",
      url: `${WEBSITE_URL}/blog/no-mod`,
    });
    expect(schemaNoMod.dateModified).toBe("2024-01-01");
  });

  test("author links to Person entity with url (D-15)", () => {
    expect(schema.author).toEqual({
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Randy Ellis",
      url: `${WEBSITE_URL}/`,
    });
  });

  test("publisher is Person entity", () => {
    expect(schema.publisher).toEqual({
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Randy Ellis",
    });
  });

  test("mainEntityOfPage is WebPage with same url", () => {
    expect(schema.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": input.url,
    });
  });

  test("inLanguage is en-US", () => {
    expect(schema.inLanguage).toBe("en-US");
  });

  test("isAccessibleForFree is true", () => {
    expect(schema.isAccessibleForFree).toBe(true);
  });

  test("image is plain string when provided", () => {
    expect(schema.image).toBe(input.imageUrl);
  });

  test("image absent when not provided", () => {
    const schemaNoImg = buildArticleSchema({
      title: "No Image",
      description: "desc",
      datePublished: "2024-01-01",
      url: `${WEBSITE_URL}/blog/no-image`,
    });
    expect(schemaNoImg).not.toHaveProperty("image");
  });

  test("keywords comma-joined when provided as array", () => {
    expect(schema.keywords).toBe("AI, Design");
  });

  test("keywords absent when not provided", () => {
    const schemaNoKw = buildArticleSchema({
      title: "No Keywords",
      description: "desc",
      datePublished: "2024-01-01",
      url: `${WEBSITE_URL}/blog/no-kw`,
    });
    expect(schemaNoKw).not.toHaveProperty("keywords");
  });

  test("schema contains no forbidden patterns", () => {
    const json = JSON.stringify(schema);
    expect(json).not.toContain('"Organization"');
    expect(json).not.toContain("articleSection");
    expect(json).not.toContain("genre");
    expect(json).not.toContain("Wealthberry");
  });
});

describe("buildBreadcrumbSchema", () => {
  test("builds BreadcrumbList with correct structure", () => {
    const items = [
      { name: "Home", url: WEBSITE_URL },
      { name: "Projects", url: `${WEBSITE_URL}/projects` },
      { name: "GrowIt", url: `${WEBSITE_URL}/projects/growit` },
    ];
    const schema = buildBreadcrumbSchema(items);

    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toHaveLength(3);

    items.forEach((item, i) => {
      expect(schema.itemListElement[i]).toEqual({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: item.url,
      });
    });
  });

  test("empty input produces empty itemListElement", () => {
    const schema = buildBreadcrumbSchema([]);
    expect(schema.itemListElement).toEqual([]);
  });
});

describe("JsonLd component", () => {
  test("renders script tag with serialized data", () => {
    const data = { "@type": "Thing", name: "a<b" };
    const html = renderToStaticMarkup(<JsonLd data={data} id="x" />);

    expect(html).toContain('<script type="application/ld+json" id="x">');
    expect(html).toContain("a\\u003cb");
    expect(html).not.toContain("a<b");
  });

  test("renders without id attribute when id prop omitted", () => {
    const data = { "@type": "Thing", name: "test" };
    const html = renderToStaticMarkup(<JsonLd data={data} />);

    expect(html).toContain('<script type="application/ld+json">');
    expect(html).not.toContain(" id=");
  });

  test("renders array data as single script", () => {
    const data = [{ "@type": "Thing" }, { "@type": "Other" }];
    const html = renderToStaticMarkup(<JsonLd data={data} />);

    const parsed = JSON.parse(
      html
        .match(/>(.*?)<\/script>/)?.[1]
        ?.replace(/\\u003c/g, "<")
        .replace(/\\u003e/g, ">") || "[]",
    );
    expect(parsed).toEqual(data);
  });

  test("component file is NOT a client component", () => {
    const filePath = path.join(process.cwd(), "components/seo/json-ld.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content.split("\n")[0]).not.toContain("use client");
  });

  test("component file does NOT import next/script", () => {
    const filePath = path.join(process.cwd(), "components/seo/json-ld.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).not.toContain("next/script");
  });
});
