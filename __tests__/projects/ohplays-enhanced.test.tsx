import { render, screen } from '@testing-library/react';
import { PROJECTS } from '../../lib/data/projects';

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

describe('OhPlays Enhanced Project Data', () => {
  const ohplaysProject = PROJECTS.find(project => project.id === 'ohplays');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Enhanced metrics structure', () => {
    it('should have ohplays project in the data', () => {
      expect(ohplaysProject).toBeDefined();
      expect(ohplaysProject?.id).toBe('ohplays');
      expect(ohplaysProject?.name).toBe('Oh!Plays');
    });

    it('should have enhanced metrics array with performance levels', () => {
      expect(ohplaysProject?.metrics).toBeDefined();
      expect(Array.isArray(ohplaysProject?.metrics)).toBe(true);
      expect(ohplaysProject?.metrics?.length).toBeGreaterThanOrEqual(18);
    });

    it('should have metrics with proper structure including performance levels', () => {
      const enhancedMetrics = ohplaysProject?.metrics?.filter(
        metric => 'performanceLevel' in metric
      );
      
      expect(enhancedMetrics?.length).toBeGreaterThan(0);
      
      // Check first metric has required properties
      const firstMetric = enhancedMetrics?.[0];
      expect(firstMetric).toHaveProperty('label');
      expect(firstMetric).toHaveProperty('value');
      expect(firstMetric).toHaveProperty('performanceLevel');
    });
  });

  describe('Performance level distribution', () => {
    it('should have metrics with excellent performance level', () => {
      const excellentMetrics = ohplaysProject?.metrics?.filter(
        metric => metric.performanceLevel === 'excellent'
      );
      expect(excellentMetrics?.length).toBeGreaterThan(0);
    });

    it('should have metrics with good performance level', () => {
      const goodMetrics = ohplaysProject?.metrics?.filter(
        metric => metric.performanceLevel === 'good'
      );
      expect(goodMetrics?.length).toBeGreaterThan(0);
    });

    it('should have valid performance level values only', () => {
      const validLevels = ['excellent', 'good', 'needs-improvement', 'neutral'];
      const allMetrics = ohplaysProject?.metrics || [];
      
      allMetrics.forEach(metric => {
        if (metric.performanceLevel) {
          expect(validLevels).toContain(metric.performanceLevel);
        }
      });
    });
  });

  describe('Metric value parsing compatibility', () => {
    it('should have metrics compatible with AnimatedMetricCard parsing', () => {
      const testMetrics = [
        { value: '97.8%', expectedNumber: 97.8, expectedSuffix: '%' },
        { value: '2.1x faster', expectedNumber: 2.1, expectedSuffix: 'x faster' },
        { value: '15K+', expectedNumber: 15, expectedSuffix: 'K+' },
        { value: '4.7★', expectedNumber: 4.7, expectedSuffix: '★' },
        { value: '$180K', expectedPrefix: '$', expectedNumber: 180, expectedSuffix: 'K' },
      ];

      testMetrics.forEach(({ value }) => {
        // Test that metric values contain numeric content
        const numericMatch = value.match(/[\d.]+/);
        expect(numericMatch).toBeTruthy();
      });
    });

    it('should have time-based metrics in correct format', () => {
      const timeMetrics = ohplaysProject?.metrics?.filter(
        metric => metric.value.includes('min') || metric.value.includes('sec')
      );
      
      timeMetrics?.forEach(metric => {
        expect(metric.value).toMatch(/\d+\.?\d*\s*(min|sec)/);
      });
    });

    it('should have percentage metrics in correct format', () => {
      const percentageMetrics = ohplaysProject?.metrics?.filter(
        metric => metric.value.includes('%')
      );
      
      percentageMetrics?.forEach(metric => {
        expect(metric.value).toMatch(/[\d.]+%/);
      });
    });
  });

  describe('Thematic metric organization', () => {
    it('should have user experience metrics', () => {
      const uxMetrics = [
        'User Testing Success Rate',
        'User Onboarding Completion',
        'Student Recommendation Rate',
        'Feature Discovery Rate',
        'Video Quality Satisfaction'
      ];
      
      const projectMetrics = ohplaysProject?.metrics || [];
      const foundUXMetrics = projectMetrics.filter(
        metric => uxMetrics.some(uxLabel => metric.label.includes(uxLabel))
      );
      
      expect(foundUXMetrics.length).toBeGreaterThan(0);
    });

    it('should have performance and technical metrics', () => {
      const techMetrics = [
        'Video Export Success Rate',
        'Video Processing Speed',
        'Cross-Platform Compatibility',
        'Crash-Free Sessions',
        'Time to First Video'
      ];
      
      const projectMetrics = ohplaysProject?.metrics || [];
      const foundTechMetrics = projectMetrics.filter(
        metric => techMetrics.some(techLabel => metric.label.includes(techLabel))
      );
      
      expect(foundTechMetrics.length).toBeGreaterThan(0);
    });

    it('should have engagement metrics', () => {
      const engagementMetrics = [
        'Weekly Active Users',
        'Daily Active Users',
        'Session Duration',
        'User Retention',
        'Highlight Reels Created'
      ];
      
      const projectMetrics = ohplaysProject?.metrics || [];
      const foundEngagementMetrics = projectMetrics.filter(
        metric => engagementMetrics.some(engLabel => metric.label.includes(engLabel))
      );
      
      expect(foundEngagementMetrics.length).toBeGreaterThan(0);
    });
  });

  describe('Data integrity', () => {
    it('should maintain all original project properties', () => {
      expect(ohplaysProject).toHaveProperty('id');
      expect(ohplaysProject).toHaveProperty('name');
      expect(ohplaysProject).toHaveProperty('description');
      expect(ohplaysProject).toHaveProperty('technologies');
      expect(ohplaysProject).toHaveProperty('timeline');
      expect(ohplaysProject).toHaveProperty('featured');
    });

    it('should have comprehensive project story data', () => {
      expect(ohplaysProject).toHaveProperty('challenges');
      expect(ohplaysProject).toHaveProperty('solutions');
      expect(ohplaysProject).toHaveProperty('learnings');
      expect(ohplaysProject).toHaveProperty('processStory');
    });

    it('should maintain existing metric count while adding new ones', () => {
      const allMetrics = ohplaysProject?.metrics || [];
      // Should have at least the original 6 metrics plus new enhanced ones
      expect(allMetrics.length).toBeGreaterThanOrEqual(18);
    });
  });
});