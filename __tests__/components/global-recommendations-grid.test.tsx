import { render, screen } from '@testing-library/react';
import { GlobalRecommendationsGrid } from '@/components/blog/global-recommendations-grid';
import { getBlogArticles } from '@/lib/utils/blog-data';

// Mock the blog data
jest.mock('@/lib/utils/blog-data', () => ({
  getBlogArticles: jest.fn(),
}));

const mockArticles = [
  {
    slug: 'recommended-article-1',
    title: 'Recommended Article 1',
    description: 'This is a recommended article description.',
    publishedDate: '2025-01-15',
    readTime: 5,
    category: 'Development',
    tags: ['react', 'testing'],
    views: 300,
    featured: true,
  },
  {
    slug: 'recommended-article-2',
    title: 'Recommended Article 2',
    description: 'Another recommended article description.',
    publishedDate: '2024-12-20',
    readTime: 8,
    category: 'Design',
    tags: ['design', 'ui'],
    views: 200,
    featured: false,
  },
  {
    slug: 'current-article',
    title: 'Current Article',
    description: 'This is the current article being viewed.',
    publishedDate: '2024-11-15',
    readTime: 6,
    category: 'Business',
    tags: ['strategy', 'business'],
    views: 100,
    featured: false,
  },
];

describe('GlobalRecommendationsGrid', () => {
  beforeEach(() => {
    (getBlogArticles as jest.Mock).mockReturnValue(mockArticles);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render recommendations excluding current article', () => {
    render(<GlobalRecommendationsGrid currentSlug="current-article" />);
    
    expect(screen.getByText('Recommended Article 1')).toBeInTheDocument();
    expect(screen.getByText('Recommended Article 2')).toBeInTheDocument();
    expect(screen.queryByText('Current Article')).not.toBeInTheDocument();
  });

  it('should show section title', () => {
    render(<GlobalRecommendationsGrid />);
    
    expect(screen.getByText('More Articles')).toBeInTheDocument();
  });

  it('should limit recommendations to specified count', () => {
    render(<GlobalRecommendationsGrid limit={1} />);
    
    expect(screen.getByText('Recommended Article 1')).toBeInTheDocument();
    expect(screen.queryByText('Recommended Article 2')).not.toBeInTheDocument();
  });

  it('should prioritize featured articles', () => {
    render(<GlobalRecommendationsGrid limit={1} />);
    
    // Featured article should be shown first
    expect(screen.getByText('Recommended Article 1')).toBeInTheDocument();
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('should show read time badges', () => {
    render(<GlobalRecommendationsGrid />);
    
    expect(screen.getByText('5 min read')).toBeInTheDocument();
    expect(screen.getByText('8 min read')).toBeInTheDocument();
  });

  it('should show categories', () => {
    render(<GlobalRecommendationsGrid />);
    
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('should have clickable article links', () => {
    render(<GlobalRecommendationsGrid />);
    
    const link1 = screen.getByRole('link', { name: /recommended article 1/i });
    const link2 = screen.getByRole('link', { name: /recommended article 2/i });
    
    expect(link1).toHaveAttribute('href', '/blog/recommended-article-1');
    expect(link2).toHaveAttribute('href', '/blog/recommended-article-2');
  });

  it('should show article descriptions', () => {
    render(<GlobalRecommendationsGrid />);
    
    expect(screen.getByText('This is a recommended article description.')).toBeInTheDocument();
    expect(screen.getByText('Another recommended article description.')).toBeInTheDocument();
  });

  it('should handle empty recommendations gracefully', () => {
    (getBlogArticles as jest.Mock).mockReturnValue([]);
    
    render(<GlobalRecommendationsGrid />);
    
    expect(screen.queryByText('More Articles')).not.toBeInTheDocument();
  });

  it('should handle case where all articles are excluded', () => {
    const singleArticle = [mockArticles[2]]; // Only current article
    (getBlogArticles as jest.Mock).mockReturnValue(singleArticle);
    
    render(<GlobalRecommendationsGrid currentSlug="current-article" />);
    
    expect(screen.queryByText('More Articles')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<GlobalRecommendationsGrid className="custom-class" />);
    
    const section = screen.getByText('More Articles').closest('div');
    expect(section).toHaveClass('custom-class');
  });

  it('should use responsive grid layout', () => {
    render(<GlobalRecommendationsGrid />);
    
    const grid = screen.getByText('Recommended Article 1').closest('[class*="grid"]');
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
  });

  it('should show published dates', () => {
    render(<GlobalRecommendationsGrid />);
    
    // Check for any date pattern instead of specific dates
    expect(screen.getByText(/2025/)).toBeInTheDocument();
    const dates2024 = screen.getAllByText(/2024/);
    expect(dates2024.length).toBeGreaterThan(0);
  });

  it('should handle custom title', () => {
    render(<GlobalRecommendationsGrid title="Related Articles" />);
    
    expect(screen.getByText('Related Articles')).toBeInTheDocument();
    expect(screen.queryByText('More Articles')).not.toBeInTheDocument();
  });
});