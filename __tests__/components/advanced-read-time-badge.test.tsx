import { render, screen } from '@testing-library/react';
import { AdvancedReadTimeBadge } from '@/components/ui/advanced-read-time-badge';

describe('AdvancedReadTimeBadge', () => {
  it('should render basic read time badge', () => {
    render(<AdvancedReadTimeBadge readTime={5} />);
    
    expect(screen.getByText('5 min read')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toHaveClass('inline-flex');
  });

  it('should render with custom variant', () => {
    render(<AdvancedReadTimeBadge readTime={3} variant="secondary" />);
    
    const badge = screen.getByText('3 min read');
    expect(badge).toHaveClass('bg-secondary');
  });

  it('should render with size variants', () => {
    render(<AdvancedReadTimeBadge readTime={8} size="lg" />);
    
    const badge = screen.getByText('8 min read');
    expect(badge).toHaveClass('px-3', 'py-1');
  });

  it('should show metadata when provided', () => {
    const metadata = {
      wordCount: 1200,
      imageCount: 3,
      codeBlockCount: 2,
      complexityScore: 1
    };
    
    render(<AdvancedReadTimeBadge readTime={6} metadata={metadata} showMetadata />);
    
    expect(screen.getByText('6 min read')).toBeInTheDocument();
    expect(screen.getByText('1,200 words')).toBeInTheDocument();
    expect(screen.getByText('3 images')).toBeInTheDocument();
    expect(screen.getByText('2 code blocks')).toBeInTheDocument();
  });

  it('should handle singular/plural metadata correctly', () => {
    const metadata = {
      wordCount: 500,
      imageCount: 1,
      codeBlockCount: 1,
      complexityScore: 1
    };
    
    render(<AdvancedReadTimeBadge readTime={3} metadata={metadata} showMetadata />);
    
    expect(screen.getByText('1 image')).toBeInTheDocument();
    expect(screen.getByText('1 code block')).toBeInTheDocument();
  });

  it('should not show metadata when showMetadata is false', () => {
    const metadata = {
      wordCount: 1200,
      imageCount: 3,
      codeBlockCount: 2,
      complexityScore: 1
    };
    
    render(<AdvancedReadTimeBadge readTime={6} metadata={metadata} showMetadata={false} />);
    
    expect(screen.getByText('6 min read')).toBeInTheDocument();
    expect(screen.queryByText('1,200 words')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<AdvancedReadTimeBadge readTime={4} className="custom-class" />);
    
    const badge = screen.getByText('4 min read').closest('div');
    expect(badge).toHaveClass('custom-class');
  });

  it('should handle zero values gracefully', () => {
    const metadata = {
      wordCount: 0,
      imageCount: 0,
      codeBlockCount: 0,
      complexityScore: 1
    };
    
    render(<AdvancedReadTimeBadge readTime={1} metadata={metadata} showMetadata />);
    
    expect(screen.getByText('1 min read')).toBeInTheDocument();
    expect(screen.queryByText('0 words')).not.toBeInTheDocument();
    expect(screen.queryByText('0 images')).not.toBeInTheDocument();
  });

  it('should format large word counts with commas', () => {
    const metadata = {
      wordCount: 12500,
      imageCount: 0,
      codeBlockCount: 0,
      complexityScore: 1
    };
    
    render(<AdvancedReadTimeBadge readTime={15} metadata={metadata} showMetadata />);
    
    expect(screen.getByText('12,500 words')).toBeInTheDocument();
  });
});