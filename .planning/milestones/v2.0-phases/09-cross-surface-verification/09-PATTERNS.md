# Phase 9: Cross-Surface Verification - Pattern Map

**Mapped:** 2026-08-16
**Files analyzed:** 18 new/modified files
**Analogs found:** 16 / 18

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `lib/metadata.ts` (new helper) | utility | transform | `lib/metadata.ts#createPageMetadata` | exact |
| `app/projects/[slug]/page.tsx` | route | request-response | itself (refactor) | exact |
| `app/projects/addvanced/page.tsx` | route | request-response | `app/projects/rambis-ui/page.tsx` | exact |
| `app/projects/echo/page.tsx` | route | request-response | `app/projects/rambis-ui/page.tsx` | exact |
| `app/projects/nagarro/page.tsx` | route | request-response | `app/projects/rambis-ui/page.tsx` | exact |
| `app/projects/rambis-ui/page.tsx` | route | request-response | itself (partial update) | exact |
| `components/seo/project-faq.tsx` | component | n/a (DELETE) | n/a | n/a |
| `components/seo/structured-data.tsx` | component | n/a (DELETE exports) | n/a | n/a |
| `__tests__/seo/project-metadata.test.ts` | test | validation | `__tests__/app/page.test.tsx` | role-match |
| `.planning/phases/09-cross-surface-verification/09-CROSS-SURFACE-MATRIX.md` | documentation | n/a | `.planning/DECK-COVERAGE-AUDIT.md` | exact |
| `app/opengraph-image.tsx` | OG generator | request-response | itself (claim fix) | exact |
| `app/about/opengraph-image.tsx` | OG generator | request-response | itself (claim fix) | exact |
| `components/core/animated-number-basic.tsx` | component | UI display | itself (claim fix) | exact |
| `app/projects/nagarro/nagarro-client.tsx` | component | UI display | itself (claim fix) | exact |
| `app/about/about-client.tsx` | component | UI display | itself (URL verify) | exact |
| `lib/data/projects.ts` | data | n/a (read-only source) | itself | exact |

## Pattern Assignments

### `lib/metadata.ts` (new `projectMetadata()` helper, utility, transform)

**Analog:** `lib/metadata.ts#createPageMetadata` (lines 77-122) and `createArticleMetadata` (lines 127-182)

**Imports pattern** (lines 1-7):
```typescript
import type { Metadata } from "next";
import { getBaseUrl, createAbsoluteUrl } from "./env";
```

**Helper signature pattern** (lines 77-89):
```typescript
export function createPageMetadata({
  title,
  description,
  path = "",
  image,
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  const canonicalUrl = createAbsoluteUrl(path);
  const ogImage = image ? createAbsoluteUrl(image) : undefined;
  // ...
}
```

**Metadata structure pattern** (lines 93-122):
```typescript
return {
  title,
  description,
  alternates: {
    canonical: canonicalUrl,
  },
  keywords: keywords.length > 0 ? keywords : undefined,
  openGraph: {
    title,
    description,
    url: canonicalUrl,
    ...(ogImage && {
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    }),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    ...(ogImage && { images: [ogImage] }),
  },
};
```

**Article-type pattern** (lines 158-173, for D-06 `og:type article`):
```typescript
openGraph: {
  type: "article",
  title,
  description,
  url: canonicalUrl,
  publishedTime,
  modifiedTime: modifiedTime || publishedTime,
  authors: ["Randy Ellis"],
  tags,
  // ... images
}
```

**New helper will follow:** Same signature pattern, accept a `Project` type, build keywords mechanically (name + technologies + tags + category + "Randy Ellis", "AI Product Design", "Design Engineering"), return Metadata with `og:type: "article"`.

---

### `app/projects/[slug]/page.tsx` (route refactor, request-response)

**Analog:** itself (lines 1-116) — refactor existing `generateMetadata` to use helper

**Current generateMetadata structure** (lines 8-73):
```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  // Image fallback logic (video → first image)
  const isImage = (path: string) =>
    /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(path);

  const imageThumbnail =
    project.thumbnail && isImage(project.thumbnail)
      ? project.thumbnail
      : project.images?.find(isImage);

  return {
    title: `${project.name} | ${project.subtitle || project.category}`,
    description: project.longDescription || project.description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    keywords: [
      project.name,
      ...project.technologies,
      ...project.tags,
      project.category,
      "Randy Ellis",
      "AI Product Design",
      "Design Engineering",
    ],
    openGraph: {
      title: `${project.name} - ${project.subtitle || project.category}`,
      description: project.longDescription || project.description,
      url: `/projects/${project.slug}`,
      images: imageThumbnail ? [/* ... */] : [],
      type: "website", // ← changes to "article" per D-06
    },
    // ...
  };
}
```

**Current schema calls** (lines 92-109):
```typescript
return (
  <>
    <CreativeWorkStructuredData
      name={project.name}
      description={project.longDescription || project.description}
      url={`https://work.randyellis.design/projects/${project.slug}`}
      dateCreated={project.timeline.split(" - ")[0] || "2023"}
      technologies={project.technologies}
      category={project.category}
      metrics={project.metrics}
      imageUrl={
        project.thumbnail
          ? `https://work.randyellis.design${project.thumbnail}`
          : undefined
      }
      teamSize={project.teamSize}
      role={project.role}
    />
    <ProjectFAQStructuredData projectSlug={project.slug} /> {/* ← DELETE per D-09 */}
    <ProjectDetailClient
      project={project}
      relatedProjects={relatedProjects}
    />
  </>
);
```

**Refactor target:** Replace metadata logic with `projectMetadata(project)` call; delete `ProjectFAQStructuredData` import and call; add `BreadcrumbStructuredData` call with items `Home › Projects › {project.name}`.

**New imports needed:**
```typescript
import { BreadcrumbStructuredData } from "@/components/seo/structured-data";
import { projectMetadata } from "@/lib/metadata"; // NEW helper
// REMOVE: import { ProjectFAQStructuredData } from "@/components/seo/project-faq";
```

---

### `app/projects/{addvanced,echo,nagarro}/page.tsx` (route replace metadata, request-response)

**Analog:** `app/projects/rambis-ui/page.tsx` (lines 1-41) — already imports PROJECTS and derives metadata partially

**Rambis-UI pattern** (lines 1-33):
```typescript
import { Metadata } from "next";
import RambisClientPage from "./rambis-client";
import { PROJECTS } from "@/lib/data/projects";

// Get the Rambis UI project data
const rambisProject = PROJECTS.find((p) => p.id === "rambis-ui")!;

export const metadata: Metadata = {
  title: `${rambisProject.name} Case Study | ${rambisProject.subtitle}`,
  description: rambisProject.description,
  alternates: {
    canonical: "/projects/rambis-ui",
  },
  openGraph: {
    title: `${rambisProject.name} Case Study | Modern Design System Innovation`,
    description: rambisProject.description,
    type: "article",
    images: [
      {
        url: rambisProject.thumbnail || "/projects/rambis-ui/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: `${rambisProject.name} design system showcase`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${rambisProject.name} Case Study | Design System Excellence`,
    description: rambisProject.description,
    images: [rambisProject.thumbnail || "/projects/rambis-ui/hero-image.jpg"],
  },
};
```

**Target pattern for addvanced/echo/nagarro:**
```typescript
import { Metadata } from "next";
import { PROJECTS } from "@/lib/data/projects";
import { projectMetadata } from "@/lib/metadata";
import { CreativeWorkStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data";
import XClientPage from "./x-client"; // replace X with project name

const project = PROJECTS.find((p) => p.id === "x")!; // replace x with project id

export const metadata: Metadata = projectMetadata(project);

export default function XPage() {
  return (
    <>
      <CreativeWorkStructuredData
        name={project.name}
        description={project.description} // ← D-03: use description, not longDescription
        url={`https://work.randyellis.design/projects/${project.slug}`}
        dateCreated={project.timeline.split(" - ")[0] || "2023"}
        technologies={project.technologies}
        category={project.category}
        metrics={project.metrics}
        imageUrl={project.thumbnail ? `https://work.randyellis.design${project.thumbnail}` : undefined}
        teamSize={project.teamSize}
        role={project.role}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "https://work.randyellis.design" },
          { name: "Projects", url: "https://work.randyellis.design/projects" },
          { name: project.name, url: `https://work.randyellis.design/projects/${project.slug}` },
        ]}
      />
      <XClientPage />
    </>
  );
}
```

**Addvanced existing** (lines 1-59): Already has `BreadcrumbStructuredData` (lines 44-56), keep it; replace hardcoded metadata (lines 5-41) with helper call; add `CreativeWorkStructuredData`.

**Nagarro/Echo existing:** Hardcoded metadata (nagarro lines 4-32, echo similar); no schema calls at all. Replace metadata with helper; add both CreativeWork and Breadcrumb.

---

### `app/projects/rambis-ui/page.tsx` (route partial update, request-response)

**Analog:** itself (lines 1-41)

**Change:** Replace `export const metadata: Metadata = { ... }` (lines 8-33) with `export const metadata: Metadata = projectMetadata(rambisProject);`. Add `CreativeWorkStructuredData` + `BreadcrumbStructuredData` calls in the component body.

---

### `components/seo/structured-data.tsx` (component, DELETE exports)

**Dead export found:** `FAQStructuredData` (lines 331-372) — zero importers (grep confirmed no usage outside the file itself).

**Action:** Delete lines 331-372.

---

### `components/seo/project-faq.tsx` (component, DELETE file)

**Only importer:** `app/projects/[slug]/page.tsx` line 5 and line 109 (grep confirmed).

**Action:** Delete entire file after removing calls from `[slug]/page.tsx`.

---

### `__tests__/seo/project-metadata.test.ts` (NEW test, validation)

**Analog:** `__tests__/app/page.test.tsx` (lines 1-109) — Jest + RTL structure

**Test setup pattern** (lines 1-82):
```typescript
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ComponentUnderTest from "@/path/to/component";

// Mock motion/react
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    // ... other elements
  },
  // ... other exports
}));

// Mock analytics
jest.mock("@/lib/analytics", () => ({
  trackEvent: jest.fn(),
}));
```

**Test structure pattern** (lines 84-109):
```typescript
describe("Component Test Suite", () => {
  test("should do X", () => {
    render(<Component />);
    expect(screen.getByText(/text/)).toBeInTheDocument();
  });

  test("should do Y", () => {
    const result = functionUnderTest();
    expect(result).toEqual(expectedValue);
  });
});
```

**New test target (D-14):** Assert that for every project in PROJECTS, `projectMetadata(project)` produces metadata with title/description/canonical/og:image/type matching the data; assert `CreativeWorkStructuredData` props derive from PROJECTS fields.

**Test file location:** `__tests__/seo/project-metadata.test.ts` (new directory if needed).

---

### `.planning/phases/09-cross-surface-verification/09-CROSS-SURFACE-MATRIX.md` (NEW documentation)

**Analog:** `.planning/DECK-COVERAGE-AUDIT.md` (lines 1-100+) — per-claim table format

**Table structure pattern** (from DECK-COVERAGE-AUDIT.md):
```markdown
## Verdict Definitions

- **agree** — claim is consistent across all surfaces
- **fixed→X** — claim was inconsistent, fixed to value X
- **pulled** — claim removed (was fabricated / unsupported)
- **open** — requires Randy's decision

## Cross-Surface Matrix

| Project | Claim | Visible Copy | Metadata | OG Image | JSON-LD | Status | Notes |
|---------|-------|--------------|----------|----------|---------|--------|-------|
| GrowIt | 240K+ users | ✓ (client) | ✓ (desc) | ✓ (rendered) | ✓ (metrics) | agree | All surfaces match |
| GrowIt | 4.8★ rating | ✓ (client) | ✓ (desc) | ✓ (rendered) | ✓ (metrics) | agree | Verified real |
| Nagarro | $50M+ impact | ✓ (client) | ✓ (desc) | — | — | fixed→"$50M+ business impact" | Aligned wording |
| ... | ... | ... | ... | ... | ... | ... | ... |

## Open Items for Randy

### GrowIt
- [ ] (none)

### Nagarro
- [ ] Verify $50M+ claim basis (D-15 resolution)

## Placeholder Sweep

| File | Line | Text | Status |
|------|------|------|--------|
| (none found) | — | — | clean |

## Dead Schema Removed

| File | Export | Reason |
|------|--------|--------|
| `components/seo/project-faq.tsx` | entire file | Fabricated FAQs for echo/addvanced; metis orphan |
| `components/seo/structured-data.tsx` | `FAQStructuredData` | Zero importers |
```

**Modeled on:** DECK-COVERAGE-AUDIT.md structure with verdict definitions, per-claim rows, and open items per project.

---

### Claim-wording alignment files (various, claim fix)

**Pattern:** Read current file, identify $50M wording variance, align to canonical wording from CONTEXT.md D-15.

**Files affected:**
- `app/opengraph-image.tsx` — has "$50M" (line grep result)
- `app/about/opengraph-image.tsx` — has "$50M" (line grep result)
- `components/core/animated-number-basic.tsx` — line 102 "in product value"
- `app/projects/nagarro/page.tsx` — line 7 "$50M+ in business impact"
- `app/projects/nagarro/nagarro-client.tsx` — line match for "$50M+"

**Current wording (grep results):**
- Homepage/About OG: "$50M" (abbreviated)
- AnimatedNumberBasic: "$50M" + "in product value"
- lib/metadata.ts base: "$50M+ product value delivered"
- Nagarro metadata: "$50M+ in business impact"
- Nagarro client: "$50M+ in business impact"

**Canonical wording (D-15):**
- Career-wide claim: "$50M in product value" (homepage OG, about OG, AnimatedNumberBasic)
- Nagarro-specific claim: "$50M+ business impact" (nagarro metadata + client)

**Action:** Align wording so each surface says exactly the same string for the same claim. Record in matrix.

---

### `app/about/about-client.tsx` + `components/seo/structured-data.tsx` (Chameleon Collective URL verify)

**Lines found:**
- `app/about/about-client.tsx:57` — `company: "Chameleon Collective"`
- `components/seo/structured-data.tsx:87` — mentions in description text
- `components/seo/structured-data.tsx:133,605,664` — various mentions

**Action (D-16):** Verify the URL resolves (likely https://www.chameleoncollective.com or similar). If it resolves, no change needed. If it doesn't, remove the link/reference or fix the URL. Log outcome in matrix.

**Pattern:** No code change needed if URL is valid; matrix row documents verification.

---

## Shared Patterns

### Project Data Type

**Source:** `lib/data/projects.ts` lines 1-200+
**Apply to:** All new/modified files that consume PROJECTS

**Project type shape** (inferred from GrowIt entry lines 5-88):
```typescript
interface Project {
  id: string;
  name: string;
  subtitle: string;
  slug: string;
  description: string; // 131-222 chars (D-03)
  longDescription: string; // 475-848 chars (on-page only)
  category: string;
  categories: string[];
  tags: string[];
  link?: string;
  video?: string;
  thumbnail: string;
  images: string[];
  timeline: string; // "Q1 2014 - Q2 2016" format
  status: string;
  technologies: string[];
  featured: boolean;
  metrics: Array<{ label: string; value: string }>;
  challenges: string[];
  solutions: string[];
  learnings: string[];
  teamSize: number;
  role: string;
  overview: { /* ... */ };
  constraints: { /* ... */ };
  roleNarrative: string;
  decisions: Array<{ /* ... */ }>;
  processStory: { /* ... */ };
}
```

**Usage:** Every route and helper imports `PROJECTS` and finds the project by `slug` or `id`.

---

### CreativeWorkStructuredData Component

**Source:** `components/seo/structured-data.tsx` lines 444-537
**Apply to:** All 7 project routes (D-11)

**Prop signature** (lines 444-466):
```typescript
export function CreativeWorkStructuredData({
  name,
  description,
  url,
  dateCreated,
  technologies,
  category,
  metrics,
  imageUrl,
  teamSize,
  role,
}: {
  name: string;
  description: string;
  url: string;
  dateCreated: string;
  technologies: string[];
  category: string;
  metrics?: Array<{ label: string; value: string }>;
  imageUrl?: string;
  teamSize?: number;
  role?: string;
})
```

**D-03 rule:** Pass `project.description` (not `longDescription`) to the `description` prop.

---

### BreadcrumbStructuredData Component

**Source:** `components/seo/structured-data.tsx` lines 9-34
**Apply to:** All 7 project routes (D-12)

**Prop signature** (lines 9-13):
```typescript
export function BreadcrumbStructuredData({
  items,
}: {
  items: { name: string; url: string }[];
})
```

**Standard items for project pages:**
```typescript
const breadcrumbItems = [
  { name: "Home", url: "https://work.randyellis.design" },
  { name: "Projects", url: "https://work.randyellis.design/projects" },
  { name: project.name, url: `https://work.randyellis.design/projects/${project.slug}` },
];
```

---

### Image Fallback Logic

**Source:** `app/projects/[slug]/page.tsx` lines 23-33
**Apply to:** `projectMetadata()` helper (D-05)

**Pattern:**
```typescript
// Some projects use a video as their thumbnail (LedgerIQ is an .mp4), which
// cannot be an og:image. Fall back to the first real image rather than
// emitting no preview at all.
const isImage = (path: string) =>
  /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(path);

const imageThumbnail =
  project.thumbnail && isImage(project.thumbnail)
    ? project.thumbnail
    : project.images?.find(isImage);
```

**Copy this logic** into the new helper for consistent OG image handling.

---

### Mechanical Keyword Builder

**Source:** `app/projects/[slug]/page.tsx` lines 41-49
**Apply to:** `projectMetadata()` helper (D-07)

**Pattern:**
```typescript
keywords: [
  project.name,
  ...project.technologies,
  ...project.tags,
  project.category,
  "Randy Ellis",
  "AI Product Design",
  "Design Engineering",
]
```

**Copy this exact logic** into the helper for uniform keyword construction.

---

## No Analog Found

All files have close matches or are self-analogs (refactors/deletions). No files lack a pattern source.

## Metadata

**Analog search scope:** `app/`, `lib/`, `components/`, `__tests__/`, `.planning/`
**Files scanned:** 18
**Pattern extraction date:** 2026-08-16

**Import tracking (D-10):**
- `ProjectFAQStructuredData` imported by: `app/projects/[slug]/page.tsx` only (1 importer)
- Site-level `FAQStructuredData` imported by: none (0 importers) — DELETE

**Claim-wording files (D-15):**
- Career-wide "$50M in product value": `app/opengraph-image.tsx`, `app/about/opengraph-image.tsx`, `components/core/animated-number-basic.tsx`, `lib/metadata.ts`
- Nagarro-specific "$50M+ business impact": `app/projects/nagarro/page.tsx`, `app/projects/nagarro/nagarro-client.tsx`

**Chameleon Collective references (D-16):**
- `app/about/about-client.tsx` line 57
- `components/seo/structured-data.tsx` lines 87, 133, 605, 664

**Project type source:** `lib/data/projects.ts` — every project has all required fields for metadata/schema generation (name, subtitle, description, longDescription, slug, thumbnail, images, technologies, tags, category, timeline, teamSize, role, metrics).

**Verification order (D-19):** `npm run lint` → `npx tsc --noEmit` → `npm test` (build is NOT a gate per CLAUDE.md).
