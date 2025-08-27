# Global Recommendation Components - TDD Test Suite

## 🎯 Overview

This directory contains comprehensive failing tests for implementing global recommendation components using Test-Driven Development (TDD) methodology. The components will display featured case studies and articles in 2x1 responsive grids across all case study pages and blog posts.

## 🔴 RED Phase Status: ✅ COMPLETE

All test files are properly failing with "Cannot find module" errors, confirming we're in the correct RED phase of TDD.

## 📁 Test Files Created

### 1. `global-case-study-grid.test.tsx`

**Component:** `@/components/ui/global-case-study-grid`
**Purpose:** Tests for displaying 2 featured case studies in 2x1 responsive grid
**Test Categories:** 12 comprehensive test suites with 60+ individual tests

### 2. `global-article-grid.test.tsx`

**Component:** `@/components/ui/global-article-grid`
**Purpose:** Tests for displaying 2 latest articles in 2x1 responsive grid  
**Test Categories:** 13 comprehensive test suites with 70+ individual tests

### 3. `global-recommendations.test.tsx`

**Component:** `@/components/ui/global-recommendations`
**Purpose:** Tests for wrapper component that combines both grids
**Test Categories:** 12 comprehensive test suites with 50+ individual tests

## 🧪 Key Test Categories Covered

### ✅ Spacing Tests

- Verifies exact spacing classes match existing patterns (`space-y-6`, `gap-6`)
- Tests responsive grid layout classes (`grid-cols-1`, `md:grid-cols-2`)

### ✅ Responsive Tests

- Tests 2x1 desktop → stacked mobile behavior
- Verifies equal height cards with `auto-rows-fr`

### ✅ Data Logic Tests

- Ensures exactly 2 items returned for perfect 2x1 layout
- Tests exclusion logic (exclude current case study/article)
- Validates featured/priority sorting algorithms
- Tests edge cases (empty data, single items, malformed data)

### ✅ Accessibility Tests

- ARIA labels and keyboard navigation
- Semantic heading structure (h2 level headings)
- Focus management and screen reader support

### ✅ Animation Tests

- Motion variants matching existing patterns (`VARIANTS_ITEM`, `TRANSITION_ITEM`)
- Staggered animation delays using `InView` components
- Magnetic wrapper effects matching existing hover interactions

### ✅ Hover States Tests

- Exact hover classes: `group transition-all duration-300 hover:shadow-lg`
- Color transitions for text and borders
- Video/image hover effects

### ✅ Performance Tests

- Lazy loading implementation for videos and images
- Memoization of filtering/sorting logic
- Efficient handling of large datasets

## 📐 Required Spacing Patterns (from existing codebase)

```typescript
// Container spacing (line 994 in project-detail-client.tsx)
className = "space-y-6";

// Grid layout (line 1001)
className = "grid grid-cols-1 gap-6 md:grid-cols-2";

// Card hover (line 1005)
className = "group transition-all duration-300 hover:shadow-lg";

// Motion variants (lines 54-59)
variants = { VARIANTS_ITEM };
transition = { TRANSITION_ITEM };
```

## 🎨 Component Structure Requirements

### GlobalCaseStudyGrid Component

```typescript
interface GlobalCaseStudyGridProps {
  currentSlug?: string; // Exclude current case study
  limit?: number; // Default: 2 for 2x1 layout
  title?: string; // Default: "Featured Case Studies"
  className?: string; // Custom styling
  showDescription?: boolean; // Show/hide descriptions
}
```

### GlobalArticleGrid Component

```typescript
interface GlobalArticleGridProps {
  currentSlug?: string; // Exclude current article
  limit?: number; // Default: 2 for 2x1 layout
  title?: string; // Default: "Latest Articles"
  className?: string; // Custom styling
  showReadTime?: boolean; // Show/hide read time badges
  showCategory?: boolean; // Show/hide category badges
  showDescription?: boolean; // Show/hide descriptions
}
```

### GlobalRecommendations Component

```typescript
interface GlobalRecommendationsProps {
  currentSlug?: string; // Pass to both child grids
  showCaseStudies?: boolean; // Default: true
  showArticles?: boolean; // Default: true
  caseStudyTitle?: string; // Custom case study title
  articleTitle?: string; // Custom article title
  className?: string; // Container styling
  context?: "case-study" | "blog-post"; // Context for default titles
  caseStudyLimit?: number; // Limit for case studies
  articleLimit?: number; // Limit for articles
}
```

## 🔧 Next Steps - GREEN Phase Implementation

### Step 1: Implement GlobalCaseStudyGrid

- Create component at `/components/ui/global-case-study-grid.tsx`
- Implement data filtering from `PROJECTS` array
- Add responsive grid with exact spacing classes
- Implement motion animations and hover states
- Ensure exactly 2 case studies for 2x1 layout

### Step 2: Implement GlobalArticleGrid

- Create component at `/components/ui/global-article-grid.tsx`
- Implement data filtering from `getBlogArticles()`
- Reuse existing `ArticleCard` structure from global-recommendations-grid
- Add featured star indicators and read time badges
- Ensure exactly 2 articles for 2x1 layout

### Step 3: Implement GlobalRecommendations

- Create wrapper component at `/components/ui/global-recommendations.tsx`
- Compose both grid components with proper spacing
- Add conditional rendering logic
- Implement staggered animations between sections
- Handle edge cases (empty data, single components)

### Step 4: Integration Testing

- Add components to case study pages (`project-detail-client.tsx`)
- Add components to blog post layouts (`blog/layout.tsx`)
- Test responsive behavior across devices
- Verify animations and hover states work correctly

## 🎯 Success Criteria

### Performance

- Components load lazily when scrolled into view
- Images and videos implement lazy loading
- Filtering logic is memoized for performance
- No layout shift during loading

### Accessibility

- Full keyboard navigation support
- Screen reader friendly with proper ARIA labels
- Respects reduced motion preferences
- Semantic HTML structure

### Visual Design

- Exact spacing matches existing card layouts
- Hover states consistent with current patterns
- Smooth animations using existing motion variants
- Perfect 2x1 responsive behavior

### Data Integrity

- Always excludes current page from recommendations
- Prioritizes featured content appropriately
- Handles edge cases gracefully (empty data, etc.)
- Maintains data consistency across page loads

## 🔍 Running Tests

```bash
# Run all global recommendation tests
npm test __tests__/components/ui/global-*

# Run specific component tests
npm test __tests__/components/ui/global-case-study-grid.test.tsx
npm test __tests__/components/ui/global-article-grid.test.tsx
npm test __tests__/components/ui/global-recommendations.test.tsx

# Watch mode for development
npm test __tests__/components/ui/global-* --watch
```

## 📚 Reference Files

- **Existing patterns:** `/app/projects/[slug]/project-detail-client.tsx` (lines 990-1010)
- **Motion variants:** `/app/projects/[slug]/project-detail-client.tsx` (lines 54-59)
- **Article structure:** `/components/blog/global-recommendations-grid.tsx`
- **Card patterns:** Search for `group transition-all duration-300 hover:shadow-lg`

---

**Status:** 🔴 RED Phase Complete - Ready for GREEN Phase Implementation  
**Next:** Begin implementing components to make tests pass while maintaining exact requirements
