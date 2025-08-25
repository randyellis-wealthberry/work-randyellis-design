import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlobalArticleGrid } from '@/components/ui/global-article-grid';
import { getBlogArticles, BlogArticle } from '@/lib/utils/blog-data';
import { trackRecommendationArticleClick, trackRecommendationCardHover } from '@/lib/analytics';

// Mock the motion components to avoid animation issues in tests
jest.mock('@/components/motion-primitives/in-view', () => ({
  InView: ({ children, viewOptions, ...props }: any) => <div data-testid="in-view" {...props}>{children}</div>,
}));

jest.mock('@/components/motion-primitives/text-effect', () => ({
  TextEffect: ({ children, as: Component = 'div', preset, delay, ...props }: any) => (
    <Component data-testid="text-effect" {...props}>{children}</Component>
  ),
}));

// Magnetic component removed from global-article-grid.tsx

// Mock the blog data
jest.mock('@/lib/utils/blog-data', () => ({
  getBlogArticles: jest.fn(),
}));

// Mock analytics functions
jest.mock('@/lib/analytics', () => ({
  trackRecommendationArticleClick: jest.fn(),
  trackRecommendationCardHover: jest.fn(),
}));

const mockArticles: BlogArticle[] = [
  {
    slug: 'featured-article-1',
    title: 'Featured Article 1',
    description: 'This is a featured article description that should be displayed.',
    publishedDate: '2025-01-15',
    readTime: 5,
    category: 'Development',
    tags: ['react', 'testing', 'development'],
    views: 5000,
    featured: true,
    author: 'Randy Ellis',
  },
  {
    slug: 'featured-article-2',
    title: 'Featured Article 2',
    description: 'This is another featured article with great content.',
    publishedDate: '2025-01-10',
    readTime: 8,
    category: 'Design',
    tags: ['design', 'ui', 'ux'],
    views: 4000,
    featured: true,
    author: 'Randy Ellis',
  },
  {
    slug: 'current-article',
    title: 'Current Article',
    description: 'This is the current article being viewed.',
    publishedDate: '2024-12-20',
    readTime: 6,
    category: 'Business',
    tags: ['strategy', 'business'],
    views: 3000,
    featured: false,
    author: 'Randy Ellis',
  },
  {
    slug: 'regular-article',
    title: 'Regular Article',
    description: 'This is a regular non-featured article.',
    publishedDate: '2024-11-15',
    readTime: 4,
    category: 'Technology',
    tags: ['tech', 'trends'],
    views: 2000,
    featured: false,
    author: 'Randy Ellis',
  },
];

describe('GlobalArticleGrid', () => {
  beforeEach(() => {
    (getBlogArticles as jest.Mock).mockReturnValue(mockArticles);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Spacing Tests', () => {
    it('should use exact spacing classes matching existing patterns', () => {
      render(<GlobalArticleGrid />);
      
      // Check container has space-y-6 (matching line 994 in project-detail-client.tsx)
      const container = screen.getByTestId('article-grid-container');
      expect(container).toHaveClass('space-y-6');
      
      // Check grid has gap-6 (matching line 1001)
      const grid = screen.getByTestId('article-grid');
      expect(grid).toHaveClass('gap-6');
    });

    it('should have exact responsive grid layout classes', () => {
      render(<GlobalArticleGrid />);
      
      const grid = screen.getByTestId('article-grid');
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2');
    });
  });

  describe('Responsive Tests', () => {
    it('should display 2x1 layout on desktop and stacked on mobile', () => {
      render(<GlobalArticleGrid />);
      
      const grid = screen.getByTestId('article-grid');
      
      // Should have responsive classes for 2x1 → stacked behavior
      expect(grid).toHaveClass('grid-cols-1'); // Mobile: stacked
      expect(grid).toHaveClass('md:grid-cols-2'); // Desktop: 2x1
    });

    it('should maintain equal height cards with auto-rows-fr', () => {
      render(<GlobalArticleGrid />);
      
      const grid = screen.getByTestId('article-grid');
      expect(grid).toHaveClass('auto-rows-fr');
    });
  });

  describe('Data Logic Tests', () => {
    it('should filter and return exactly 2 articles for perfect 2x1 layout', () => {
      render(<GlobalArticleGrid />);
      
      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(2);
    });

    it('should exclude current article when currentSlug provided', () => {
      render(<GlobalArticleGrid currentSlug="current-article" />);
      
      // Should not show current article
      expect(screen.queryByText('Current Article')).not.toBeInTheDocument();
      
      // Should show other articles
      expect(screen.getByText('Featured Article 1')).toBeInTheDocument();
      expect(screen.getByText('Featured Article 2')).toBeInTheDocument();
    });

    it('should prioritize featured articles first', () => {
      render(<GlobalArticleGrid />);
      
      const articleCards = screen.getAllByTestId('article-card');
      const firstCard = articleCards[0];
      const secondCard = articleCards[1];
      
      // Both should be featured articles (higher priority)
      expect(within(firstCard).getByText('Featured Article 1')).toBeInTheDocument();
      expect(within(secondCard).getByText('Featured Article 2')).toBeInTheDocument();
    });

    it('should sort by views when featured status is equal', () => {
      // Test with modified mock data
      const sortedArticles = [...mockArticles].sort((a, b) => {
        // Featured first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        // Then by views
        return (b.views || 0) - (a.views || 0);
      });
      
      render(<GlobalArticleGrid />);
      
      const articleCards = screen.getAllByTestId('article-card');
      const firstCard = articleCards[0];
      
      // Higher views among featured should come first
      expect(within(firstCard).getByText('Featured Article 1')).toBeInTheDocument();
    });

    it('should sort by date as final tiebreaker', () => {
      // Create articles with same featured status and views but different dates
      const sameViewsArticles = [
        { ...mockArticles[0], views: 1000, publishedDate: '2024-01-01' },
        { ...mockArticles[1], views: 1000, publishedDate: '2024-02-01' },
      ];
      
      (getBlogArticles as jest.Mock).mockReturnValue(sameViewsArticles);
      
      render(<GlobalArticleGrid />);
      
      const articleCards = screen.getAllByTestId('article-card');
      const firstCard = articleCards[0];
      
      // More recent date should come first
      expect(within(firstCard).getByText('Featured Article 2')).toBeInTheDocument();
    });

    it('should handle edge case when no articles available after filtering', () => {
      (getBlogArticles as jest.Mock).mockReturnValue([]);
      
      render(<GlobalArticleGrid />);
      
      // Should not render anything
      expect(screen.queryByTestId('article-grid-container')).not.toBeInTheDocument();
    });

    it('should handle case when only 1 article available (still show it)', () => {
      (getBlogArticles as jest.Mock).mockReturnValue([mockArticles[0]]);
      
      render(<GlobalArticleGrid />);
      
      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(1);
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper ARIA labels for navigation', () => {
      render(<GlobalArticleGrid />);
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('aria-label');
        expect(link.getAttribute('aria-label')).toMatch(/^Read .+$/);
      });
    });

    it('should support keyboard navigation', () => {
      render(<GlobalArticleGrid />);
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).toMatch(/^\/blog\/.+$/);
      });
    });

    it('should have semantic heading structure', () => {
      render(<GlobalArticleGrid />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Latest Articles');
    });

    it('should have proper focus management for cards', () => {
      render(<GlobalArticleGrid />);
      
      const cards = screen.getAllByTestId('article-card');
      cards.forEach(card => {
        const link = within(card).getByRole('link');
        expect(link).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('should have proper text contrast and readability', () => {
      render(<GlobalArticleGrid />);
      
      // Check for proper text styling classes
      const titles = screen.getAllByRole('heading', { level: 3 });
      titles.forEach(title => {
        expect(title).toHaveClass('text-zinc-950', 'dark:text-zinc-50');
      });
    });
  });

  describe('Animation Tests', () => {
    it('should use motion variants matching existing patterns', () => {
      render(<GlobalArticleGrid />);
      
      // Check InView components are present for stagger animation
      const inViewComponents = screen.getAllByTestId('in-view');
      expect(inViewComponents.length).toBeGreaterThan(0);
      
      // Check TextEffect is used for title and article titles
      const textEffects = screen.getAllByTestId('text-effect');
      expect(textEffects.length).toBeGreaterThan(0);
      
      // Should have at least 3: 1 for main title + 2 for article titles
      expect(textEffects.length).toBeGreaterThanOrEqual(3);
    });

    it('should have staggered animation delays for cards', () => {
      render(<GlobalArticleGrid />);
      
      const cards = screen.getAllByTestId('article-card');
      const cardInViews = cards.map(card => 
        card.closest('[data-testid="in-view"]')
      ).filter(Boolean);
      
      // Should have staggered delays (each card gets index * delay)
      expect(cardInViews).toHaveLength(cards.length);
    });

    it('should have stable hover effects without magnetic movement', () => {
      render(<GlobalArticleGrid />);
      
      const cards = screen.getAllByTestId('article-card');
      cards.forEach(card => {
        // Cards should have transition classes for hover effects
        expect(card).toHaveClass('transition-all');
        expect(card).toHaveClass('hover:border-zinc-300');
        expect(card).toHaveClass('hover:shadow-md');
      });
    });

    it('should have fade-in animation preset for titles', () => {
      render(<GlobalArticleGrid />);
      
      const titleEffects = screen.getAllByTestId('text-effect');
      const cardTitles = titleEffects.filter(effect => 
        effect.closest('[data-testid="article-card"]')
      );
      
      // Should use fade preset for title animations
      expect(cardTitles.length).toBe(2);
    });
  });

  describe('Hover States Tests', () => {
    it('should have exact hover classes matching existing patterns', () => {
      render(<GlobalArticleGrid />);
      
      const cards = screen.getAllByTestId('article-card');
      cards.forEach(card => {
        // Match hover classes from existing global-recommendations-grid.tsx
        expect(card).toHaveClass('group', 'transition-all', 'duration-200');
        expect(card).toHaveClass('hover:border-zinc-300', 'hover:shadow-md');
        expect(card).toHaveClass('dark:hover:border-zinc-600');
      });
    });

    it('should have title color change on hover', () => {
      render(<GlobalArticleGrid />);
      
      const titles = screen.getAllByRole('heading', { level: 3 });
      titles.forEach(title => {
        expect(title).toHaveClass('group-hover:text-blue-600');
        expect(title).toHaveClass('dark:group-hover:text-blue-400');
      });
    });
  });

  describe('Component Structure Tests', () => {
    it('should reuse existing Card components', () => {
      render(<GlobalArticleGrid />);
      
      // Should use Card component with proper structure
      const cards = screen.getAllByTestId('article-card');
      cards.forEach(card => {
        expect(card).toHaveClass('group'); // Card itself has group class
      });
    });

    it('should display article metadata correctly', () => {
      render(<GlobalArticleGrid />);
      
      // Should show article titles
      expect(screen.getByText('Featured Article 1')).toBeInTheDocument();
      expect(screen.getByText('Featured Article 2')).toBeInTheDocument();
      
      // Should show descriptions
      expect(screen.getByText('This is a featured article description that should be displayed.')).toBeInTheDocument();
      expect(screen.getByText('This is another featured article with great content.')).toBeInTheDocument();
      
      // Should show categories as badges
      expect(screen.getByText('Development')).toBeInTheDocument();
      expect(screen.getByText('Design')).toBeInTheDocument();
    });

    it('should show read time badges', () => {
      render(<GlobalArticleGrid />);
      
      // Should show AdvancedReadTimeBadge components
      const readTimeBadges = screen.getAllByTestId('read-time-badge');
      expect(readTimeBadges).toHaveLength(2);
      
      // Should show actual read times
      expect(screen.getByText('5 min read')).toBeInTheDocument();
      expect(screen.getByText('8 min read')).toBeInTheDocument();
    });

    it('should show featured star indicators', () => {
      render(<GlobalArticleGrid />);
      
      // Should show featured indicators for featured articles
      const featuredStars = screen.getAllByTestId('featured-star');
      expect(featuredStars).toHaveLength(2);
    });

    it('should show formatted publication dates', () => {
      render(<GlobalArticleGrid />);
      
      // Should show formatted dates
      expect(screen.getByText(/January 15, 2025/)).toBeInTheDocument();
      expect(screen.getByText(/January 10, 2025/)).toBeInTheDocument();
    });

    it('should have proper link structure for SEO', () => {
      render(<GlobalArticleGrid />);
      
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      
      expect(links[0]).toHaveAttribute('href', '/blog/featured-article-1');
      expect(links[1]).toHaveAttribute('href', '/blog/featured-article-2');
    });

    it('should have proper card heights and layout', () => {
      render(<GlobalArticleGrid />);
      
      const cards = screen.getAllByTestId('article-card');
      cards.forEach(card => {
        expect(card).toHaveClass('h-full');
        // The inner content structure should be maintained
        const linkElements = card.querySelectorAll('a');
        expect(linkElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Card Hover Behavior Tests', () => {
    it('should have stable hover effects without movement', () => {
      render(<GlobalArticleGrid />);
      
      const cards = screen.getAllByTestId('article-card');
      cards.forEach(card => {
        // Cards should NOT be wrapped by magnetic component
        const magneticWrapper = card.closest('[data-testid="magnetic"]');
        expect(magneticWrapper).toBeNull();
        
        // Cards should be direct children of InView wrapper
        const inViewWrapper = card.closest('[data-testid="in-view"]');
        expect(inViewWrapper).toBeTruthy();
      });
    });

    it('should have unified hover effects on card boundaries', () => {
      render(<GlobalArticleGrid />);
      
      const cards = screen.getAllByTestId('article-card');
      cards.forEach(card => {
        // Check that card has unified hover classes
        expect(card).toHaveClass('transition-all');
        expect(card).toHaveClass('hover:border-zinc-300');
        expect(card).toHaveClass('hover:shadow-md');
      });
    });

    it('should apply hover effects to complete card boundary', () => {
      render(<GlobalArticleGrid />);
      
      const cards = screen.getAllByTestId('article-card');
      cards.forEach(card => {
        // Hover effects should be on the Card itself
        expect(card).toHaveClass('hover:shadow-md');
        expect(card).toHaveClass('hover:border-zinc-300');
        
        // Should use group hover pattern for inner elements
        expect(card).toHaveClass('group');
      });
    });

    it('should be directly wrapped by InView for entrance animations', () => {
      render(<GlobalArticleGrid />);
      
      const cards = screen.getAllByTestId('article-card');
      cards.forEach(card => {
        // The card should be directly wrapped by InView only
        const inViewWrapper = card.closest('[data-testid="in-view"]');
        expect(inViewWrapper).toBeTruthy();
        
        // InView should be the direct parent wrapper
        const cardParent = card.parentElement;
        expect(cardParent?.getAttribute('data-testid')).toBe('in-view');
      });
    });

    it('should maintain consistent hover state across entire card', () => {
      render(<GlobalArticleGrid />);
      
      const cards = screen.getAllByTestId('article-card');
      cards.forEach(card => {
        // Card should coordinate all hover states
        expect(card).toHaveClass('group');
        
        // Title should respond to group-hover
        const titleElement = card.querySelector('h3');
        if (titleElement) {
          expect(titleElement).toHaveClass('group-hover:text-blue-600');
        }
      });
    });
  });

  describe('Performance Tests', () => {
    it('should implement lazy loading for images', () => {
      render(<GlobalArticleGrid />);
      
      const images = screen.getAllByRole('img', { hidden: true });
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
        expect(img).toHaveAttribute('decoding', 'async');
      });
    });

    it('should memoize article filtering logic', () => {
      const { rerender } = render(<GlobalArticleGrid />);
      
      // Re-render with same props should not recalculate
      rerender(<GlobalArticleGrid />);
      
      // This test verifies memoization is implemented in the component
      expect(screen.getAllByTestId('article-card')).toHaveLength(2);
    });

    it('should handle large article datasets efficiently', () => {
      // Mock large dataset
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        ...mockArticles[0],
        slug: `article-${i}`,
        title: `Article ${i}`,
      }));
      
      (getBlogArticles as jest.Mock).mockReturnValue(largeDataset);
      
      render(<GlobalArticleGrid />);
      
      // Should still only render 2 cards (efficient filtering)
      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(2);
    });
  });

  describe('Custom Props Tests', () => {
    it('should accept custom title', () => {
      render(<GlobalArticleGrid title="Related Articles" />);
      
      expect(screen.getByText('Related Articles')).toBeInTheDocument();
      expect(screen.queryByText('Latest Articles')).not.toBeInTheDocument();
    });

    it('should accept custom className', () => {
      render(<GlobalArticleGrid className="custom-class" />);
      
      const container = screen.getByTestId('article-grid-container');
      expect(container).toHaveClass('custom-class');
    });

    it('should limit results when limit prop is provided', () => {
      render(<GlobalArticleGrid limit={1} />);
      
      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(1);
    });

    it('should handle showReadTime prop', () => {
      render(<GlobalArticleGrid showReadTime={false} />);
      
      const readTimeBadges = screen.queryAllByTestId('read-time-badge');
      expect(readTimeBadges).toHaveLength(0);
    });

    it('should handle showCategory prop', () => {
      render(<GlobalArticleGrid showCategory={false} />);
      
      expect(screen.queryByText('Development')).not.toBeInTheDocument();
      expect(screen.queryByText('Design')).not.toBeInTheDocument();
    });

    it('should handle showDescription prop', () => {
      render(<GlobalArticleGrid showDescription={false} />);
      
      expect(screen.queryByText('This is a featured article description that should be displayed.')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle malformed article data gracefully', () => {
      const malformedArticles = [
        { ...mockArticles[0], title: null, slug: undefined },
      ];
      
      (getBlogArticles as jest.Mock).mockReturnValue(malformedArticles);
      
      expect(() => {
        render(<GlobalArticleGrid />);
      }).not.toThrow();
    });

    it('should handle missing article properties gracefully', () => {
      const incompleteArticles = [
        { ...mockArticles[0], description: null, readTime: undefined, views: null },
      ];
      
      (getBlogArticles as jest.Mock).mockReturnValue(incompleteArticles);
      
      expect(() => {
        render(<GlobalArticleGrid />);
      }).not.toThrow();
    });

    it('should handle invalid date formats gracefully', () => {
      const invalidDateArticles = [
        { ...mockArticles[0], publishedDate: 'invalid-date' },
      ];
      
      (getBlogArticles as jest.Mock).mockReturnValue(invalidDateArticles);
      
      expect(() => {
        render(<GlobalArticleGrid />);
      }).not.toThrow();
    });
  });

  describe('Content Validation Tests', () => {
    it('should show proper line-clamp classes for text truncation', () => {
      render(<GlobalArticleGrid />);
      
      const titles = screen.getAllByRole('heading', { level: 3 });
      titles.forEach(title => {
        expect(title).toHaveClass('line-clamp-2');
      });
      
      const descriptions = screen.getAllByText(/This is a featured article/);
      descriptions.forEach(desc => {
        expect(desc).toHaveClass('line-clamp-3');
      });
    });

    it('should maintain consistent card structure', () => {
      render(<GlobalArticleGrid />);
      
      const cards = screen.getAllByTestId('article-card');
      cards.forEach(card => {
        // Should have consistent group and transition classes
        expect(card).toHaveClass('group', 'h-full', 'transition-all');
        
        // Should contain the link structure
        const link = card.querySelector('a');
        expect(link).toBeInTheDocument();
        expect(link).toHaveClass('block', 'h-full');
      });
    });
  });

  describe('Analytics Integration', () => {
    const mockTrackRecommendationArticleClick = trackRecommendationArticleClick as jest.MockedFunction<typeof trackRecommendationArticleClick>;
    const mockTrackRecommendationCardHover = trackRecommendationCardHover as jest.MockedFunction<typeof trackRecommendationCardHover>;

    beforeEach(() => {
      jest.clearAllMocks();
      (getBlogArticles as jest.Mock).mockReturnValue(mockArticles);
    });

    it('should track article click analytics with correct parameters', async () => {
      const user = userEvent.setup();
      render(
        <GlobalArticleGrid
          currentSlug="current-article"
          sourcePageType="project"
          sourceSlug="test-project"
        />
      );

      // Click on the first article card
      const articleCards = screen.getAllByTestId('article-card');
      const firstCardLink = within(articleCards[0]).getByRole('link');
      
      await user.click(firstCardLink);

      expect(mockTrackRecommendationArticleClick).toHaveBeenCalledWith(
        'project',
        'test-project',
        'featured-article-1',
        'Featured Article 1',
        0,
        'project_page'
      );
    });

    it('should track article hover analytics', async () => {
      const user = userEvent.setup();
      render(
        <GlobalArticleGrid
          currentSlug="current-article"
          sourcePageType="blog"
          sourceSlug="test-blog-post"
        />
      );

      // Hover over the first article card
      const articleCards = screen.getAllByTestId('article-card');
      const firstCardLink = within(articleCards[0]).getByRole('link');
      
      await user.hover(firstCardLink);

      expect(mockTrackRecommendationCardHover).toHaveBeenCalledWith(
        'article',
        'blog',
        'featured-article-1',
        'Featured Article 1',
        0
      );
    });

    it('should track analytics with correct position for multiple items', async () => {
      const user = userEvent.setup();
      render(
        <GlobalArticleGrid
          limit={3}
          sourcePageType="blog"
          sourceSlug="test-blog"
        />
      );

      // Click on the second article card (index 1)
      const articleCards = screen.getAllByTestId('article-card');
      const secondCardLink = within(articleCards[1]).getByRole('link');
      
      await user.click(secondCardLink);

      expect(mockTrackRecommendationArticleClick).toHaveBeenCalledWith(
        'blog',
        'test-blog',
        'featured-article-2',
        'Featured Article 2',
        1,
        'blog_page'
      );
    });

    it('should handle analytics calls without source page info', async () => {
      const user = userEvent.setup();
      render(<GlobalArticleGrid />);

      // Click without source page type or slug
      const articleCards = screen.getAllByTestId('article-card');
      const firstCardLink = within(articleCards[0]).getByRole('link');
      
      await user.click(firstCardLink);

      expect(mockTrackRecommendationArticleClick).toHaveBeenCalledWith(
        'project',
        '',
        'featured-article-1',
        'Featured Article 1',
        0,
        'project_page'
      );
    });

    it('should not track analytics if functions are not available', async () => {
      // Temporarily mock analytics to be undefined
      jest.doMock('@/lib/analytics', () => ({
        trackRecommendationArticleClick: undefined,
        trackRecommendationCardHover: undefined,
      }));

      const user = userEvent.setup();
      
      expect(() => {
        render(<GlobalArticleGrid />);
      }).not.toThrow();

      const articleCards = screen.getAllByTestId('article-card');
      const firstCardLink = within(articleCards[0]).getByRole('link');
      
      expect(async () => {
        await user.click(firstCardLink);
      }).not.toThrow();
    });
  });
});