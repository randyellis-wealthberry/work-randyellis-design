# Recommendation Analytics Documentation

This document describes the comprehensive analytics tracking implemented for the global recommendations feature.

## Overview

The global recommendations feature now includes detailed analytics tracking to measure:

- User engagement with recommended content
- Recommendation effectiveness across different contexts
- Conversion rates from recommendations to actual views
- User behavior patterns across project and blog pages

## Analytics Events

### 1. Section View Tracking

**Event:** `recommendation_section_view`
**Category:** `recommendation_engagement`

Tracks when recommendation sections are viewed/rendered on pages.

```typescript
trackRecommendationSectionView(
  sourcePageType: "project" | "blog",
  sourceSlug: string,
  sectionsShown: ("case_studies" | "articles")[],
  caseStudyCount: number,
  articleCount: number
);
```

**Properties:**

- `source_page_type`: Type of page where recommendations are shown
- `source_slug`: Slug of the current page
- `sections_shown`: Array of sections displayed (comma-separated)
- `case_study_count`: Number of case studies shown
- `article_count`: Number of articles shown
- `recommendation_context`: Context where shown (e.g., "project_page")

### 2. Case Study Click Tracking

**Event:** `recommendation_case_study_click`
**Category:** `recommendation_engagement`

Tracks clicks on case study recommendation cards.

```typescript
trackRecommendationCaseStudyClick(
  sourcePageType: "project" | "blog",
  sourceSlug: string,
  recommendedProjectSlug: string,
  recommendedProjectName: string,
  position: number,
  recommendationContext?: string
);
```

**Properties:**

- `source_page_type`: Type of source page
- `source_slug`: Slug of source page
- `recommended_project_slug`: Slug of clicked project
- `recommended_project_name`: Name of clicked project
- `position`: Position in grid (0-based index)
- `recommendation_context`: Context of recommendation

### 3. Article Click Tracking

**Event:** `recommendation_article_click`
**Category:** `recommendation_engagement`

Tracks clicks on article recommendation cards.

```typescript
trackRecommendationArticleClick(
  sourcePageType: "project" | "blog",
  sourceSlug: string,
  recommendedArticleSlug: string,
  recommendedArticleTitle: string,
  position: number,
  recommendationContext?: string
);
```

**Properties:**

- Similar to case study click tracking but for articles
- `recommended_article_slug`: Slug of clicked article
- `recommended_article_title`: Title of clicked article

### 4. Card Hover Tracking

**Event:** `recommendation_card_hover`
**Category:** `recommendation_engagement`

Tracks hover interactions with recommendation cards.

```typescript
trackRecommendationCardHover(
  cardType: "case_study" | "article",
  sourcePageType: "project" | "blog",
  itemSlug: string,
  itemName: string,
  position: number
);
```

**Properties:**

- `card_type`: Type of card being hovered
- `source_page_type`: Type of source page
- `item_slug`: Slug of hovered item
- `item_name`: Name/title of hovered item
- `position`: Position in grid

### 5. Conversion Tracking

**Event:** `recommendation_conversion`
**Category:** `recommendation_engagement`

Tracks recommendation performance and conversion metrics.

```typescript
trackRecommendationConversion(
  sourcePageType: "project" | "blog",
  sourceSlug: string,
  targetType: "case_study" | "article",
  targetSlug: string,
  conversionType: "view" | "engagement" | "exit",
  timeToConversion?: number
);
```

**Properties:**

- `source_page_type`: Type of source page
- `source_slug`: Slug of source page
- `target_type`: Type of target content
- `target_slug`: Slug of target content
- `conversion_type`: Type of conversion event
- `time_to_conversion`: Time in milliseconds (optional)

## Integration Points

### Components with Analytics

1. **GlobalRecommendations** (`/components/ui/global-recommendations.tsx`)
   - Tracks section view events when sections are rendered
   - Passes context information to child components

2. **GlobalCaseStudyGrid** (`/components/ui/global-case-study-grid.tsx`)
   - Tracks case study click and hover events
   - Includes position tracking for performance analysis

3. **GlobalArticleGrid** (`/components/ui/global-article-grid.tsx`)
   - Tracks article click and hover events
   - Includes position tracking for performance analysis

### Pages with Recommendations

1. **Project Pages** (`app/projects/[slug]/project-detail-client.tsx`)
   - Recommendations shown in project context
   - Source page type: "project"

2. **Blog Pages** (`app/blog/layout.tsx`)
   - Recommendations shown in blog context
   - Source page type: "blog"

## Analytics Data Flow

```
User Action → Component Event Handler → Analytics Function → trackEvent → Vercel Analytics + Google Analytics
```

1. User interacts with recommendation (click, hover, view)
2. Component captures event with relevant context
3. Specific analytics function called with typed parameters
4. Core `trackEvent` function processes and sends to analytics providers
5. Data flows to both Vercel Analytics and Google Analytics

## Key Metrics Tracked

### Engagement Metrics

- Click-through rates by position
- Hover engagement patterns
- Section view rates across contexts

### Performance Metrics

- Recommendation effectiveness by page type
- Content performance across different contexts
- User journey patterns

### Conversion Metrics

- Recommendation to view conversion rates
- Time to conversion measurements
- Cross-content engagement patterns

## Privacy and Compliance

- All analytics tracking respects existing privacy settings
- No personally identifiable information (PII) is collected
- Uses the existing analytics infrastructure for consent management
- Data is anonymized and aggregated for analysis

## Testing

Comprehensive test coverage includes:

1. **Unit Tests** (`__tests__/lib/analytics-recommendations.test.ts`)
   - Tests all analytics functions
   - Validates parameter handling
   - Ensures proper integration with core analytics

2. **Component Tests**
   - Tests analytics integration in all recommendation components
   - Validates event firing on user interactions
   - Tests context propagation and parameter accuracy

3. **Integration Tests**
   - End-to-end analytics flow testing
   - Cross-component analytics coordination
   - Error handling and edge cases

## Usage Examples

### Basic Implementation

```typescript
// In a component
import { trackRecommendationSectionView } from "@/lib/analytics";

useEffect(() => {
  trackRecommendationSectionView(
    "project",
    "my-project-slug",
    ["case_studies", "articles"],
    2,
    3,
  );
}, []);
```

### Click Tracking

```typescript
// In click handler
const handleProjectClick = (project: Project, position: number) => {
  trackRecommendationCaseStudyClick(
    "blog",
    "current-blog-post",
    project.slug,
    project.name,
    position,
    "blog_page",
  );
};
```

## Monitoring and Insights

### Key Performance Indicators (KPIs)

- Overall recommendation engagement rate
- Click-through rate by position and context
- Content discovery effectiveness
- User retention through recommendations

### Analytics Dashboard Metrics

- Daily/weekly recommendation interactions
- Most effective recommendation contexts
- Content performance across recommendations
- User journey analytics

### Optimization Opportunities

- A/B test recommendation algorithms
- Optimize content positioning based on engagement
- Improve recommendation relevance using conversion data
- Enhance user experience based on interaction patterns

## Future Enhancements

1. **Advanced Conversion Tracking**
   - Track full user journey from recommendation to goal completion
   - Implement revenue attribution for recommended content

2. **Machine Learning Integration**
   - Use analytics data to improve recommendation algorithms
   - Personalize recommendations based on user behavior

3. **Real-time Analytics**
   - Implement real-time recommendation performance monitoring
   - Dynamic content optimization based on current engagement

4. **Cross-Platform Tracking**
   - Extend analytics to mobile apps and other platforms
   - Unified recommendation performance across touchpoints
