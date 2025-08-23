// Mock the core trackEvent function
jest.mock('@/lib/analytics', () => {
  const actualAnalytics = jest.requireActual('@/lib/analytics');
  return {
    ...actualAnalytics,
    trackEvent: jest.fn(),
  };
});

import {
  trackRecommendationSectionView,
  trackRecommendationCaseStudyClick,
  trackRecommendationArticleClick,
  trackRecommendationCardHover,
  trackRecommendationConversion,
  trackEvent,
} from '@/lib/analytics';

const mockTrackEvent = trackEvent as jest.MockedFunction<typeof trackEvent>;

describe('Recommendation Analytics Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trackRecommendationSectionView', () => {
    it('should track section view with all parameters', () => {
      trackRecommendationSectionView(
        'project',
        'test-project-slug',
        ['case_studies', 'articles'],
        2,
        3
      );

      expect(mockTrackEvent).toHaveBeenCalledWith(
        'recommendation_section_view',
        'recommendation_engagement',
        'project',
        undefined,
        expect.objectContaining({
          source_page_type: 'project',
          source_slug: 'test-project-slug',
          sections_shown: 'case_studies,articles',
          case_study_count: 2,
          article_count: 3,
          recommendation_context: 'project_page',
        })
      );
    });

    it('should handle blog page type correctly', () => {
      trackRecommendationSectionView(
        'blog',
        'test-blog-slug',
        ['articles'],
        0,
        2
      );

      expect(mockTrackEvent).toHaveBeenCalledWith(
        'recommendation_section_view',
        'recommendation_engagement',
        'blog',
        undefined,
        expect.objectContaining({
          source_page_type: 'blog',
          source_slug: 'test-blog-slug',
          sections_shown: 'articles',
          case_study_count: 0,
          article_count: 2,
          recommendation_context: 'blog_page',
        })
      );
    });

    it('should handle empty sections array', () => {
      trackRecommendationSectionView(
        'project',
        'test-slug',
        [],
        0,
        0
      );

      expect(mockTrackEvent).toHaveBeenCalledWith(
        'recommendation_section_view',
        'recommendation_engagement',
        'project',
        undefined,
        expect.objectContaining({
          sections_shown: '',
          case_study_count: 0,
          article_count: 0,
        })
      );
    });
  });

  describe('trackRecommendationCaseStudyClick', () => {
    it('should track case study click with all parameters', () => {
      trackRecommendationCaseStudyClick(
        'blog',
        'source-blog-slug',
        'target-project-slug',
        'Target Project Name',
        1,
        'blog_page'
      );

      expect(mockTrackEvent).toHaveBeenCalledWith(
        'recommendation_case_study_click',
        'recommendation_engagement',
        'Target Project Name',
        undefined,
        expect.objectContaining({
          source_page_type: 'blog',
          source_slug: 'source-blog-slug',
          recommended_project_slug: 'target-project-slug',
          recommended_project_name: 'Target Project Name',
          position: 1,
          recommendation_context: 'blog_page',
        })
      );
    });

    it('should use default context when not provided', () => {
      trackRecommendationCaseStudyClick(
        'project',
        'source-slug',
        'target-slug',
        'Target Name',
        0
      );

      expect(mockTrackEvent).toHaveBeenCalledWith(
        'recommendation_case_study_click',
        'recommendation_engagement',
        'Target Name',
        undefined,
        expect.objectContaining({
          recommendation_context: 'project_page',
        })
      );
    });
  });

  describe('trackRecommendationArticleClick', () => {
    it('should track article click with all parameters', () => {
      trackRecommendationArticleClick(
        'project',
        'source-project-slug',
        'target-article-slug',
        'Target Article Title',
        0,
        'project_page'
      );

      expect(mockTrackEvent).toHaveBeenCalledWith(
        'recommendation_article_click',
        'recommendation_engagement',
        'Target Article Title',
        undefined,
        expect.objectContaining({
          source_page_type: 'project',
          source_slug: 'source-project-slug',
          recommended_article_slug: 'target-article-slug',
          recommended_article_title: 'Target Article Title',
          position: 0,
          recommendation_context: 'project_page',
        })
      );
    });

    it('should use default context when not provided', () => {
      trackRecommendationArticleClick(
        'blog',
        'source-slug',
        'target-slug',
        'Target Title',
        1
      );

      expect(mockTrackEvent).toHaveBeenCalledWith(
        'recommendation_article_click',
        'recommendation_engagement',
        'Target Title',
        undefined,
        expect.objectContaining({
          recommendation_context: 'blog_page',
        })
      );
    });
  });

  describe('trackRecommendationCardHover', () => {
    it('should track case study card hover', () => {
      trackRecommendationCardHover(
        'case_study',
        'project',
        'project-slug',
        'Project Name',
        0
      );

      expect(mockTrackEvent).toHaveBeenCalledWith(
        'recommendation_card_hover',
        'recommendation_engagement',
        'case_study',
        undefined,
        expect.objectContaining({
          card_type: 'case_study',
          source_page_type: 'project',
          item_slug: 'project-slug',
          item_name: 'Project Name',
          position: 0,
        })
      );
    });

    it('should track article card hover', () => {
      trackRecommendationCardHover(
        'article',
        'blog',
        'article-slug',
        'Article Title',
        1
      );

      expect(mockTrackEvent).toHaveBeenCalledWith(
        'recommendation_card_hover',
        'recommendation_engagement',
        'article',
        undefined,
        expect.objectContaining({
          card_type: 'article',
          source_page_type: 'blog',
          item_slug: 'article-slug',
          item_name: 'Article Title',
          position: 1,
        })
      );
    });
  });

  describe('trackRecommendationConversion', () => {
    it('should track conversion with all parameters', () => {
      trackRecommendationConversion(
        'project',
        'source-slug',
        'case_study',
        'target-slug',
        'view',
        1500
      );

      expect(mockTrackEvent).toHaveBeenCalledWith(
        'recommendation_conversion',
        'recommendation_engagement',
        'view',
        1500,
        expect.objectContaining({
          source_page_type: 'project',
          source_slug: 'source-slug',
          target_type: 'case_study',
          target_slug: 'target-slug',
          conversion_type: 'view',
          time_to_conversion: 1500,
        })
      );
    });

    it('should handle conversion without time parameter', () => {
      trackRecommendationConversion(
        'blog',
        'source-slug',
        'article',
        'target-slug',
        'engagement'
      );

      expect(mockTrackEvent).toHaveBeenCalledWith(
        'recommendation_conversion',
        'recommendation_engagement',
        'engagement',
        undefined,
        expect.objectContaining({
          source_page_type: 'blog',
          source_slug: 'source-slug',
          target_type: 'article',
          target_slug: 'target-slug',
          conversion_type: 'engagement',
          time_to_conversion: undefined,
        })
      );
    });
  });

  describe('Parameter Validation', () => {
    it('should handle empty strings gracefully', () => {
      trackRecommendationSectionView(
        'project',
        '',
        ['case_studies'],
        1,
        0
      );

      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(String),
        undefined,
        expect.objectContaining({
          source_slug: '',
        })
      );
    });

    it('should handle undefined optional parameters', () => {
      trackRecommendationCaseStudyClick(
        'project',
        'source',
        'target',
        'name',
        0,
        undefined
      );

      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(String),
        undefined,
        expect.objectContaining({
          recommendation_context: 'project_page',
        })
      );
    });

    it('should handle zero position correctly', () => {
      trackRecommendationCardHover(
        'article',
        'blog',
        'slug',
        'name',
        0
      );

      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(String),
        undefined,
        expect.objectContaining({
          position: 0,
        })
      );
    });
  });

  describe('Integration with Core Analytics', () => {
    it('should call trackEvent with proper parameters structure', () => {
      trackRecommendationSectionView(
        'project',
        'test-slug',
        ['case_studies', 'articles'],
        2,
        2
      );

      expect(mockTrackEvent).toHaveBeenCalledTimes(1);
      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(Object), // properties object
        expect.any(Object)  // filtered properties
      );
    });

    it('should use recommendation_engagement category consistently', () => {
      const functions = [
        () => trackRecommendationSectionView('project', 'slug', [], 0, 0),
        () => trackRecommendationCaseStudyClick('project', 'slug1', 'slug2', 'name', 0),
        () => trackRecommendationArticleClick('project', 'slug1', 'slug2', 'title', 0),
        () => trackRecommendationCardHover('article', 'project', 'slug', 'name', 0),
        () => trackRecommendationConversion('project', 'slug1', 'article', 'slug2', 'view'),
      ];

      functions.forEach((fn) => {
        mockTrackEvent.mockClear();
        fn();
        expect(mockTrackEvent).toHaveBeenCalledWith(
          expect.any(String),
          'recommendation_engagement',
          expect.any(String),
          expect.anything(),
          expect.anything()
        );
      });
    });
  });
});