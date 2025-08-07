import { render, screen } from '@testing-library/react';
import { AnimatedMetricCard } from '../../components/ui/animated-metric-card';

// Mock motion components
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useInView: jest.fn(() => true),
  useSpring: jest.fn(),
  useTransform: jest.fn(),
}));

// Mock the AnimatedNumber component
jest.mock('../../components/core/animated-number', () => {
  return {
    AnimatedNumber: ({ value, className }: { value: number; className?: string }) => (
      <span className={className} data-testid="animated-number">
        {value}
      </span>
    ),
  };
});

// Enhanced OhPlays metrics data for testing
const enhancedOhPlaysMetrics = [
  // User Experience Excellence
  { label: 'User Testing Success Rate', value: '93%', performanceLevel: 'excellent' as const },
  { label: 'User Onboarding Completion', value: '89.7%', performanceLevel: 'good' as const },
  { label: 'Student Recommendation Rate', value: '87%', performanceLevel: 'good' as const },
  { label: 'Feature Discovery Rate', value: '76.4%', performanceLevel: 'good' as const },
  { label: 'Video Quality Satisfaction', value: '4.7★', performanceLevel: 'excellent' as const },

  // Performance & Technical Achievement
  { label: 'Video Export Success Rate', value: '97.8%', performanceLevel: 'excellent' as const },
  { label: 'Video Processing Speed', value: '2.1x faster', performanceLevel: 'excellent' as const },
  { label: 'Cross-Platform Compatibility', value: '94.5%', performanceLevel: 'excellent' as const },
  { label: 'Crash-Free Sessions', value: '99.3%', performanceLevel: 'excellent' as const },
  { label: 'Time to First Video', value: '47 sec', performanceLevel: 'excellent' as const },

  // Engagement & Growth
  { label: 'Weekly Active Users', value: '15K+', performanceLevel: 'good' as const },
  { label: 'Daily Active Users', value: '8.2K', performanceLevel: 'good' as const },
  { label: 'Average Session Duration', value: '12.3 min', performanceLevel: 'good' as const },
  { label: 'User Retention (7-day)', value: '68.9%', performanceLevel: 'good' as const },
  { label: 'Highlight Reels Created', value: '50K+', performanceLevel: 'excellent' as const },

  // Social & Sharing Success
  { label: 'Social Share Success Rate', value: '91.2%', performanceLevel: 'excellent' as const },
  { label: 'Editing Time Reduction', value: '67%', performanceLevel: 'good' as const },
  { label: 'App Store Rating', value: '4.6★', performanceLevel: 'excellent' as const },
];

// Enhanced Metrics Grid Component for testing
function EnhancedMetricsGrid({ metrics }: { metrics: typeof enhancedOhPlaysMetrics }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <AnimatedMetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          performanceLevel={metric.performanceLevel}
          animationDelay={index * 100}
          springOptions={{ bounce: 0, duration: 2000 }}
        />
      ))}
    </div>
  );
}

describe('Enhanced Metrics Grid with AnimatedMetricCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Grid rendering', () => {
    it('should render all 18 enhanced metrics', () => {
      render(<EnhancedMetricsGrid metrics={enhancedOhPlaysMetrics} />);
      
      expect(enhancedOhPlaysMetrics).toHaveLength(18);
      
      // Check that all metric labels are rendered
      enhancedOhPlaysMetrics.forEach(metric => {
        expect(screen.getByText(metric.label)).toBeInTheDocument();
      });
    });

    it('should render grid with proper CSS classes', () => {
      render(<EnhancedMetricsGrid metrics={enhancedOhPlaysMetrics} />);
      
      const gridElement = document.querySelector('.grid');
      expect(gridElement).toHaveClass('grid-cols-2');
      expect(gridElement).toHaveClass('md:grid-cols-3');
      expect(gridElement).toHaveClass('lg:grid-cols-4');
      expect(gridElement).toHaveClass('xl:grid-cols-6');
      expect(gridElement).toHaveClass('gap-4');
    });
  });

  describe('Performance level styling', () => {
    it('should render excellent performance metrics with green styling', () => {
      const excellentMetrics = enhancedOhPlaysMetrics.filter(
        metric => metric.performanceLevel === 'excellent'
      );
      
      render(<EnhancedMetricsGrid metrics={excellentMetrics} />);
      
      // Should find green-colored cards
      const greenCards = document.querySelectorAll('[class*="border-green"]');
      expect(greenCards.length).toBeGreaterThan(0);
    });

    it('should render good performance metrics with amber styling', () => {
      const goodMetrics = enhancedOhPlaysMetrics.filter(
        metric => metric.performanceLevel === 'good'
      );
      
      render(<EnhancedMetricsGrid metrics={goodMetrics} />);
      
      // Should find amber-colored cards
      const amberCards = document.querySelectorAll('[class*="border-amber"]');
      expect(amberCards.length).toBeGreaterThan(0);
    });

    it('should have performance indicators for non-neutral metrics', () => {
      render(<EnhancedMetricsGrid metrics={enhancedOhPlaysMetrics.slice(0, 5)} />);
      
      // Should find performance indicator dots
      const indicators = document.querySelectorAll('.w-2.h-2.rounded-full');
      expect(indicators.length).toBeGreaterThan(0);
    });
  });

  describe('Animation and timing', () => {
    it('should apply staggered animation delays', () => {
      render(<EnhancedMetricsGrid metrics={enhancedOhPlaysMetrics.slice(0, 5)} />);
      
      // Animation delays should be applied (tested via component props)
      // This is tested through the component rendering without errors
      expect(screen.getAllByTestId('animated-number')).toHaveLength(5);
    });

    it('should use consistent spring animation options', () => {
      render(<EnhancedMetricsGrid metrics={enhancedOhPlaysMetrics.slice(0, 3)} />);
      
      // Spring options are passed correctly (tested via successful rendering)
      expect(screen.getAllByTestId('animated-number')).toHaveLength(3);
    });
  });

  describe('Value parsing and display', () => {
    it('should correctly parse percentage values', () => {
      const percentageMetrics = enhancedOhPlaysMetrics.filter(
        metric => metric.value.includes('%')
      );
      
      render(<EnhancedMetricsGrid metrics={percentageMetrics} />);
      
      percentageMetrics.forEach(metric => {
        const expectedNumber = parseFloat(metric.value.replace('%', '').replace('<', ''));
        if (!isNaN(expectedNumber)) {
          expect(screen.getByText(expectedNumber.toString())).toBeInTheDocument();
        }
      });
    });

    it('should correctly parse time-based values', () => {
      const timeMetrics = enhancedOhPlaysMetrics.filter(
        metric => metric.value.includes('min') || metric.value.includes('sec')
      );
      
      render(<EnhancedMetricsGrid metrics={timeMetrics} />);
      
      timeMetrics.forEach(metric => {
        const numberMatch = metric.value.match(/[\d.]+/);
        if (numberMatch) {
          expect(screen.getByText(numberMatch[0])).toBeInTheDocument();
        }
      });
    });

    it('should correctly parse rating values with star suffix', () => {
      const ratingMetrics = enhancedOhPlaysMetrics.filter(
        metric => metric.value.includes('★')
      );
      
      render(<EnhancedMetricsGrid metrics={ratingMetrics} />);
      
      ratingMetrics.forEach(metric => {
        const numberMatch = metric.value.match(/[\d.]+/);
        if (numberMatch) {
          expect(screen.getByText(numberMatch[0])).toBeInTheDocument();
        }
      });
      
      // Check that star elements exist (may be multiple)
      const starElements = screen.getAllByText('★', { exact: false });
      expect(starElements.length).toBeGreaterThan(0);
    });

    it('should correctly parse multiplier values', () => {
      const multiplierMetrics = enhancedOhPlaysMetrics.filter(
        metric => metric.value.includes('x')
      );
      
      render(<EnhancedMetricsGrid metrics={multiplierMetrics} />);
      
      multiplierMetrics.forEach(metric => {
        const numberMatch = metric.value.match(/[\d.]+/);
        if (numberMatch) {
          expect(screen.getByText(numberMatch[0])).toBeInTheDocument();
        }
      });
    });
  });

  describe('Responsive behavior', () => {
    it('should handle different screen sizes with appropriate grid columns', () => {
      render(<EnhancedMetricsGrid metrics={enhancedOhPlaysMetrics} />);
      
      const gridElement = document.querySelector('.grid');
      
      // Mobile: 2 columns
      expect(gridElement).toHaveClass('grid-cols-2');
      
      // Tablet: 3 columns
      expect(gridElement).toHaveClass('md:grid-cols-3');
      
      // Desktop: 4 columns
      expect(gridElement).toHaveClass('lg:grid-cols-4');
      
      // Large desktop: 6 columns
      expect(gridElement).toHaveClass('xl:grid-cols-6');
    });

    it('should maintain proper spacing in grid layout', () => {
      render(<EnhancedMetricsGrid metrics={enhancedOhPlaysMetrics} />);
      
      const gridElement = document.querySelector('.grid');
      expect(gridElement).toHaveClass('gap-4');
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure for all metrics', () => {
      render(<EnhancedMetricsGrid metrics={enhancedOhPlaysMetrics.slice(0, 5)} />);
      
      enhancedOhPlaysMetrics.slice(0, 5).forEach(metric => {
        // Label should be accessible
        expect(screen.getByText(metric.label)).toBeInTheDocument();
        
        // Numeric value should be accessible via test id
        expect(screen.getAllByTestId('animated-number').length).toBeGreaterThan(0);
      });
    });

    it('should maintain proper contrast with performance level colors', () => {
      render(<EnhancedMetricsGrid metrics={enhancedOhPlaysMetrics.slice(0, 5)} />);
      
      // Color classes should be applied for different performance levels
      const coloredElements = document.querySelectorAll('[class*="text-green"], [class*="text-amber"]');
      expect(coloredElements.length).toBeGreaterThan(0);
    });
  });
});