import { jest } from '@jest/globals';

// Mock Vercel Analytics
const mockTrack = jest.fn();
jest.mock('@vercel/analytics', () => ({
  track: mockTrack,
}));

// Mock window.gtag
const mockGtag = jest.fn();
Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true,
});

describe('Blog Analytics Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGtag.mockClear();
    mockTrack.mockClear();
    // Mock process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'GA_TEST_ID';
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  });

  describe('trackBlogHeroImageView', () => {
    it('should track when blog hero images are viewed', () => {
      const { trackBlogHeroImageView } = require('../../lib/analytics');
      
      trackBlogHeroImageView('claude-obsidian-workflows', 'Obsidian knowledge graph visualization');

      expect(mockGtag).toHaveBeenCalledWith('event', 'blog_hero_image_view', {
        event_category: 'blog_engagement',
        event_label: 'claude-obsidian-workflows',
        blog_slug: 'claude-obsidian-workflows',
        image_alt: 'Obsidian knowledge graph visualization',
      });

      expect(mockTrack).toHaveBeenCalledWith('blog_hero_image_view', {
        category: 'blog_engagement',
        label: 'claude-obsidian-workflows',
        blog_slug: 'claude-obsidian-workflows',
        image_alt: 'Obsidian knowledge graph visualization',
      });
    });
  });

  describe('trackCodeBlockCopy', () => {
    it('should track when users copy code blocks', () => {
      const { trackCodeBlockCopy } = require('../../lib/analytics');
      
      trackCodeBlockCopy('typescript', 'claude-obsidian-workflows', 15);

      expect(mockGtag).toHaveBeenCalledWith('event', 'code_block_copy', {
        event_category: 'blog_engagement',
        event_label: 'typescript',
        language: 'typescript',
        blog_slug: 'claude-obsidian-workflows',
        line_count: 15,
      });

      expect(mockTrack).toHaveBeenCalledWith('code_block_copy', {
        category: 'blog_engagement',
        label: 'typescript',
        language: 'typescript',
        blog_slug: 'claude-obsidian-workflows',
        line_count: 15,
      });
    });

    it('should handle missing optional parameters', () => {
      const { trackCodeBlockCopy } = require('../../lib/analytics');
      
      trackCodeBlockCopy('javascript');

      expect(mockGtag).toHaveBeenCalledWith('event', 'code_block_copy', {
        event_category: 'blog_engagement',
        event_label: 'javascript',
        language: 'javascript',
      });

      expect(mockTrack).toHaveBeenCalledWith('code_block_copy', {
        category: 'blog_engagement',
        label: 'javascript',
        language: 'javascript',
      });
    });
  });

  describe('trackRelatedArticleClick', () => {
    it('should track clicks on related articles', () => {
      const { trackRelatedArticleClick } = require('../../lib/analytics');
      
      trackRelatedArticleClick(
        'AI Design System Generator',
        '/blog/ai-design-system-generator',
        'claude-obsidian-workflows',
        2
      );

      expect(mockGtag).toHaveBeenCalledWith('event', 'related_article_click', {
        event_category: 'blog_engagement',
        event_label: 'AI Design System Generator',
        related_title: 'AI Design System Generator',
        related_url: '/blog/ai-design-system-generator',
        source_article: 'claude-obsidian-workflows',
        position: 2,
      });

      expect(mockTrack).toHaveBeenCalledWith('related_article_click', {
        category: 'blog_engagement',
        label: 'AI Design System Generator',
        related_title: 'AI Design System Generator',
        related_url: '/blog/ai-design-system-generator',
        source_article: 'claude-obsidian-workflows',
        position: 2,
      });
    });
  });

  describe('trackReadingProgress', () => {
    it('should track granular reading progress', () => {
      const { trackReadingProgress } = require('../../lib/analytics');
      
      trackReadingProgress('claude-obsidian-workflows', 75, 180);

      expect(mockGtag).toHaveBeenCalledWith('event', 'reading_progress', {
        event_category: 'blog_engagement',
        event_label: 'claude-obsidian-workflows',
        value: 75,
        blog_slug: 'claude-obsidian-workflows',
        progress_percentage: 75,
        time_spent: 180,
      });

      expect(mockTrack).toHaveBeenCalledWith('reading_progress', {
        category: 'blog_engagement',
        label: 'claude-obsidian-workflows',
        value: 75,
        blog_slug: 'claude-obsidian-workflows',
        progress_percentage: 75,
        time_spent: 180,
      });
    });
  });

  describe('trackBlogSearchUsage', () => {
    it('should track blog search usage', () => {
      const { trackBlogSearchUsage } = require('../../lib/analytics');
      
      trackBlogSearchUsage('ai design', 5, true);

      expect(mockGtag).toHaveBeenCalledWith('event', 'blog_search_usage', {
        event_category: 'blog_engagement',
        event_label: 'ai design',
        search_query: 'ai design',
        results_count: 5,
        had_results: true,
      });

      expect(mockTrack).toHaveBeenCalledWith('blog_search_usage', {
        category: 'blog_engagement',
        label: 'ai design',
        search_query: 'ai design',
        results_count: 5,
        had_results: true,
      });
    });
  });

  describe('trackBlogCommentInteraction', () => {
    it('should track blog comment interactions', () => {
      const { trackBlogCommentInteraction } = require('../../lib/analytics');
      
      trackBlogCommentInteraction('like', 'claude-obsidian-workflows', 'comment-123');

      expect(mockGtag).toHaveBeenCalledWith('event', 'blog_comment_interaction', {
        event_category: 'blog_engagement',
        event_label: 'like',
        interaction_type: 'like',
        blog_slug: 'claude-obsidian-workflows',
        comment_id: 'comment-123',
      });

      expect(mockTrack).toHaveBeenCalledWith('blog_comment_interaction', {
        category: 'blog_engagement',
        label: 'like',
        interaction_type: 'like',
        blog_slug: 'claude-obsidian-workflows',
        comment_id: 'comment-123',
      });
    });
  });

  describe('Error handling', () => {
    it('should handle window.gtag being undefined', () => {
      const originalGtag = window.gtag;
      delete (window as any).gtag;

      const { trackCodeBlockCopy } = require('../../lib/analytics');
      
      expect(() => {
        trackCodeBlockCopy('javascript');
      }).not.toThrow();

      expect(mockTrack).toHaveBeenCalledWith('code_block_copy', {
        category: 'blog_engagement',
        label: 'javascript',
        language: 'javascript',
      });

      // Restore gtag
      window.gtag = originalGtag;
    });
  });
});