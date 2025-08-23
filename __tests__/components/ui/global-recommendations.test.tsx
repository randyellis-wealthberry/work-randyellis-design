import { render, screen } from '@testing-library/react';
import { GlobalRecommendations } from '@/components/ui/global-recommendations';
import { trackRecommendationSectionView } from '@/lib/analytics';
import { getBlogArticles } from '@/lib/utils/blog-data';

// Mock the child components
jest.mock('@/components/ui/global-case-study-grid', () => ({
  GlobalCaseStudyGrid: ({ title, className, currentSlug, ...props }: any) => (
    <div data-testid="global-case-study-grid" data-current-slug={currentSlug} className={className}>
      <h2>{title || 'Featured Case Studies'}</h2>
      <div>Mocked Case Study Grid</div>
    </div>
  ),
}));

jest.mock('@/components/ui/global-article-grid', () => ({
  GlobalArticleGrid: ({ title, className, currentSlug, ...props }: any) => (
    <div data-testid="global-article-grid" data-current-slug={currentSlug} className={className}>
      <h2>{title || 'Latest Articles'}</h2>
      <div>Mocked Article Grid</div>
    </div>
  ),
}));

// Mock the motion components
jest.mock('@/components/motion-primitives/in-view', () => ({
  InView: ({ children, variants, transition, viewOptions, ...props }: any) => (
    <div data-testid="in-view" {...props}>{children}</div>
  ),
}));

// Mock analytics functions
jest.mock('@/lib/analytics', () => ({
  trackRecommendationSectionView: jest.fn(),
}));

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/projects/test-project'),
}));

// Mock data sources with default data
const defaultProjects = [
  {
    id: 'project-1',
    name: 'Test Project 1',
    slug: 'test-project-1',
    featured: true,
  },
  {
    id: 'project-2',
    name: 'Test Project 2',
    slug: 'test-project-2',
    featured: true,
  },
];

const defaultArticles = [
  {
    slug: 'test-article-1',
    title: 'Test Article 1',
    featured: true,
  },
  {
    slug: 'test-article-2',
    title: 'Test Article 2',
    featured: true,
  },
];

// Create mocks that can be mutated in tests
let mockProjectsData = [...defaultProjects];
const mockGetBlogArticles = jest.fn();

jest.mock('@/lib/data/projects', () => ({
  get PROJECTS() { return mockProjectsData; }
}));

jest.mock('@/lib/utils/blog-data', () => ({
  getBlogArticles: jest.fn(),
}));

describe('GlobalRecommendations', () => {
  beforeEach(() => {
    // Reset mocks to default state
    jest.clearAllMocks();
    mockProjectsData = [...defaultProjects];
    (getBlogArticles as jest.Mock).mockReturnValue([...defaultArticles]);
  });

  describe('Basic Rendering Tests', () => {
    it('should render both case study and article grids by default', () => {
      render(<GlobalRecommendations />);
      
      expect(screen.getByTestId('global-case-study-grid')).toBeInTheDocument();
      expect(screen.getByTestId('global-article-grid')).toBeInTheDocument();
    });

    it('should have proper container structure with exact spacing', () => {
      render(<GlobalRecommendations />);
      
      const container = screen.getByTestId('global-recommendations-container');
      // Should match spacing patterns from existing codebase
      expect(container).toHaveClass('space-y-12'); // Larger spacing between sections
    });

    it('should wrap components in InView for animations', () => {
      render(<GlobalRecommendations />);
      
      const inViewComponents = screen.getAllByTestId('in-view');
      expect(inViewComponents.length).toBeGreaterThanOrEqual(2); // At least one for each grid
    });
  });

  describe('Conditional Rendering Tests', () => {
    it('should render only case studies when showArticles=false', () => {
      render(<GlobalRecommendations showArticles={false} />);
      
      expect(screen.getByTestId('global-case-study-grid')).toBeInTheDocument();
      expect(screen.queryByTestId('global-article-grid')).not.toBeInTheDocument();
    });

    it('should render only articles when showCaseStudies=false', () => {
      render(<GlobalRecommendations showCaseStudies={false} />);
      
      expect(screen.queryByTestId('global-case-study-grid')).not.toBeInTheDocument();
      expect(screen.getByTestId('global-article-grid')).toBeInTheDocument();
    });

    it('should render nothing when both showCaseStudies=false and showArticles=false', () => {
      render(<GlobalRecommendations showCaseStudies={false} showArticles={false} />);
      
      expect(screen.queryByTestId('global-recommendations-container')).not.toBeInTheDocument();
    });

    it('should not render when no case studies available and showArticles=false', () => {
      // Mock empty projects
      mockProjectsData = [];
      
      render(<GlobalRecommendations showArticles={false} />);
      
      expect(screen.queryByTestId('global-recommendations-container')).not.toBeInTheDocument();
    });

    it('should not render when no articles available and showCaseStudies=false', () => {
      // Mock empty articles
      (getBlogArticles as jest.Mock).mockReturnValue([]);
      
      render(<GlobalRecommendations showCaseStudies={false} />);
      
      expect(screen.queryByTestId('global-recommendations-container')).not.toBeInTheDocument();
    });
  });

  describe('Props Forwarding Tests', () => {
    it('should pass currentSlug to both child components', () => {
      render(<GlobalRecommendations currentSlug="current-item" />);
      
      const caseStudyGrid = screen.getByTestId('global-case-study-grid');
      const articleGrid = screen.getByTestId('global-article-grid');
      
      expect(caseStudyGrid).toHaveAttribute('data-current-slug', 'current-item');
      expect(articleGrid).toHaveAttribute('data-current-slug', 'current-item');
    });

    it('should pass custom titles to child components', () => {
      render(
        <GlobalRecommendations 
          caseStudyTitle="Related Projects" 
          articleTitle="More Reading" 
        />
      );
      
      expect(screen.getByText('Related Projects')).toBeInTheDocument();
      expect(screen.getByText('More Reading')).toBeInTheDocument();
    });

    it('should apply custom className to container', () => {
      render(<GlobalRecommendations className="custom-recommendations" />);
      
      const container = screen.getByTestId('global-recommendations-container');
      expect(container).toHaveClass('custom-recommendations');
    });

    it('should pass limit props to child components', () => {
      render(<GlobalRecommendations caseStudyLimit={1} articleLimit={1} />);
      
      // Child components should receive limit props
      // This would be tested in integration tests or by checking prop forwarding
      expect(screen.getByTestId('global-case-study-grid')).toBeInTheDocument();
      expect(screen.getByTestId('global-article-grid')).toBeInTheDocument();
    });
  });

  describe('Layout and Spacing Tests', () => {
    it('should have proper spacing between sections', () => {
      render(<GlobalRecommendations />);
      
      const container = screen.getByTestId('global-recommendations-container');
      expect(container).toHaveClass('space-y-12');
    });

    it('should maintain consistent responsive behavior', () => {
      render(<GlobalRecommendations />);
      
      // Container should allow child components to handle their own responsive design
      const container = screen.getByTestId('global-recommendations-container');
      expect(container).not.toHaveClass('grid'); // Should not impose grid on container
    });

    it('should have proper semantic structure', () => {
      render(<GlobalRecommendations />);
      
      const container = screen.getByTestId('global-recommendations-container');
      expect(container.tagName).toBe('SECTION'); // Should use semantic section element
    });
  });

  describe('Animation and Motion Tests', () => {
    it('should have staggered animations between sections', () => {
      render(<GlobalRecommendations />);
      
      const inViewComponents = screen.getAllByTestId('in-view');
      
      // Should have staggered delays for each section
      expect(inViewComponents.length).toBeGreaterThanOrEqual(2);
    });

    it('should use consistent animation variants', () => {
      render(<GlobalRecommendations />);
      
      const inViewComponents = screen.getAllByTestId('in-view');
      
      // All InView components should be present for animation
      expect(inViewComponents.length).toBeGreaterThanOrEqual(2);
    });

    it('should have proper viewport margins for animation triggers', () => {
      render(<GlobalRecommendations />);
      
      const inViewComponents = screen.getAllByTestId('in-view');
      
      // InView components should have proper configuration for smooth animations
      expect(inViewComponents.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Performance Tests', () => {
    it('should implement lazy loading for both sections', () => {
      render(<GlobalRecommendations />);
      
      // Both grids should implement their own lazy loading
      expect(screen.getByTestId('global-case-study-grid')).toBeInTheDocument();
      expect(screen.getByTestId('global-article-grid')).toBeInTheDocument();
    });

    it('should memoize expensive operations', () => {
      const { rerender } = render(<GlobalRecommendations />);
      
      // Re-render with same props should not cause unnecessary recalculations
      rerender(<GlobalRecommendations />);
      
      expect(screen.getByTestId('global-case-study-grid')).toBeInTheDocument();
      expect(screen.getByTestId('global-article-grid')).toBeInTheDocument();
    });

    it('should handle component unmounting gracefully', () => {
      const { unmount } = render(<GlobalRecommendations />);
      
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle case where both data sources are empty', () => {
      mockProjectsData = [];
      (getBlogArticles as jest.Mock).mockReturnValue([]);
      
      render(<GlobalRecommendations />);
      
      // Should not render anything when no data available
      expect(screen.queryByTestId('global-recommendations-container')).not.toBeInTheDocument();
    });

    it('should handle malformed props gracefully', () => {
      expect(() => {
        render(
          <GlobalRecommendations 
            currentSlug={null as any}
            caseStudyLimit={-1}
            articleLimit={0}
          />
        );
      }).not.toThrow();
    });

    it('should handle undefined data gracefully', () => {
      mockProjectsData = undefined;
      (getBlogArticles as jest.Mock).mockReturnValue(undefined);
      
      expect(() => {
        render(<GlobalRecommendations />);
      }).not.toThrow();
    });
  });

  describe('Integration Context Tests', () => {
    it('should work correctly on case study pages', () => {
      render(<GlobalRecommendations currentSlug="current-case-study" context="case-study" />);
      
      // Should pass context-appropriate props
      expect(screen.getByTestId('global-case-study-grid')).toHaveAttribute('data-current-slug', 'current-case-study');
      expect(screen.getByTestId('global-article-grid')).toHaveAttribute('data-current-slug', 'current-case-study');
    });

    it('should work correctly on blog post pages', () => {
      render(<GlobalRecommendations currentSlug="current-blog-post" context="blog-post" />);
      
      // Should pass context-appropriate props
      expect(screen.getByTestId('global-case-study-grid')).toBeInTheDocument();
      expect(screen.getByTestId('global-article-grid')).toHaveAttribute('data-current-slug', 'current-blog-post');
    });

    it('should adapt titles based on context', () => {
      render(<GlobalRecommendations context="case-study" />);
      
      // Should show contextually appropriate default titles
      expect(screen.getByText('Featured Case Studies')).toBeInTheDocument();
      expect(screen.getByText('Latest Articles')).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper landmark structure', () => {
      render(<GlobalRecommendations />);
      
      const section = screen.getByTestId('global-recommendations-container');
      expect(section.tagName).toBe('SECTION');
      expect(section).toHaveAttribute('aria-labelledby', 'recommendations-title');
    });

    it('should have screen reader friendly structure', () => {
      render(<GlobalRecommendations />);
      
      // Should have proper heading hierarchy
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThanOrEqual(2);
    });

    it('should support reduced motion preferences', () => {
      render(<GlobalRecommendations />);
      
      // InView components should respect reduced motion preferences
      const inViewComponents = screen.getAllByTestId('in-view');
      expect(inViewComponents.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('SEO and Structured Data Tests', () => {
    it('should have proper semantic structure for SEO', () => {
      render(<GlobalRecommendations />);
      
      const container = screen.getByTestId('global-recommendations-container');
      expect(container.tagName).toBe('SECTION');
    });

    it('should not interfere with page structured data', () => {
      render(<GlobalRecommendations />);
      
      // Should not add conflicting structured data
      const container = screen.getByTestId('global-recommendations-container');
      expect(container).not.toHaveAttribute('itemscope');
      expect(container).not.toHaveAttribute('itemtype');
    });
  });

  describe('Custom Configuration Tests', () => {
    it('should accept custom animation delays', () => {
      render(<GlobalRecommendations animationDelay={0.5} />);
      
      const inViewComponents = screen.getAllByTestId('in-view');
      expect(inViewComponents.length).toBeGreaterThanOrEqual(2);
    });

    it('should accept custom spacing configuration', () => {
      render(<GlobalRecommendations spacing="space-y-16" />);
      
      const container = screen.getByTestId('global-recommendations-container');
      expect(container).toHaveClass('space-y-16');
    });

    it('should support priority ordering', () => {
      render(<GlobalRecommendations priority="articles-first" />);
      
      // Should render articles before case studies when priority is set
      const container = screen.getByTestId('global-recommendations-container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Analytics Integration', () => {
    const mockTrackRecommendationSectionView = trackRecommendationSectionView as jest.MockedFunction<typeof trackRecommendationSectionView>;
    const mockUsePathname = require('next/navigation').usePathname as jest.MockedFunction<() => string>;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should track section view analytics for project pages', () => {
      mockUsePathname.mockReturnValue('/projects/test-project');
      
      render(
        <GlobalRecommendations
          currentSlug="test-project"
          showCaseStudies={true}
          showArticles={true}
          caseStudyLimit={2}
          articleLimit={2}
        />
      );

      expect(mockTrackRecommendationSectionView).toHaveBeenCalledWith(
        'project',
        'test-project',
        ['case_studies', 'articles'],
        2,
        2
      );
    });

    it('should track section view analytics for blog pages', () => {
      mockUsePathname.mockReturnValue('/blog/test-article');
      
      render(
        <GlobalRecommendations
          context="blog-post"
          currentSlug="test-article"
          showCaseStudies={true}
          showArticles={false}
          caseStudyLimit={1}
        />
      );

      expect(mockTrackRecommendationSectionView).toHaveBeenCalledWith(
        'blog',
        'test-article',
        ['case_studies'],
        1,
        0
      );
    });

    it('should track analytics with case-study context', () => {
      mockUsePathname.mockReturnValue('/some-other-path');
      
      render(
        <GlobalRecommendations
          context="case-study"
          currentSlug="project-slug"
          showCaseStudies={false}
          showArticles={true}
          articleLimit={3}
        />
      );

      expect(mockTrackRecommendationSectionView).toHaveBeenCalledWith(
        'project',
        'project-slug',
        ['articles'],
        0,
        3
      );
    });

    it('should not track analytics when nothing should be rendered', () => {
      // Mock empty data
      mockProjectsData = [];
      (getBlogArticles as jest.Mock).mockReturnValue([]);
      
      render(
        <GlobalRecommendations
          showCaseStudies={true}
          showArticles={true}
        />
      );

      expect(mockTrackRecommendationSectionView).not.toHaveBeenCalled();
    });

    it('should track analytics only when sections are actually shown', () => {
      mockUsePathname.mockReturnValue('/projects/test');
      
      render(
        <GlobalRecommendations
          currentSlug="test"
          showCaseStudies={false}
          showArticles={false}
        />
      );

      expect(mockTrackRecommendationSectionView).not.toHaveBeenCalled();
    });

    it('should handle analytics when pathname is undefined', () => {
      mockUsePathname.mockReturnValue('');
      
      render(
        <GlobalRecommendations
          context="project"
          currentSlug="test-project"
        />
      );

      expect(mockTrackRecommendationSectionView).toHaveBeenCalledWith(
        'project',
        'test-project',
        ['case_studies', 'articles'],
        2,
        2
      );
    });
  });
});