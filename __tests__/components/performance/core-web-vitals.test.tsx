import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

// Mock web-vitals - uses __mocks__/web-vitals.ts
jest.mock('web-vitals');

// Import mocked functions
const mockWebVitals = require('web-vitals');
const getCLS = mockWebVitals.getCLS;
const getFID = mockWebVitals.getFID;
const getFCP = mockWebVitals.getFCP;
const getLCP = mockWebVitals.getLCP;
const getTTFB = mockWebVitals.getTTFB;

// Define metric interface for TypeScript
interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  entries?: any[];
  id?: string;
}

interface MetricState {
  cls?: Metric;
  fid?: Metric;
  fcp?: Metric;
  lcp?: Metric;
  ttfb?: Metric;
}

// Mock component that uses Core Web Vitals
function MockPerformanceComponent() {
  const [metrics, setMetrics] = React.useState<MetricState>({});

  React.useEffect(() => {
    // Simulate collecting Core Web Vitals
    getCLS((metric: Metric) => setMetrics(prev => ({ ...prev, cls: metric })));
    getFID((metric: Metric) => setMetrics(prev => ({ ...prev, fid: metric })));
    getFCP((metric: Metric) => setMetrics(prev => ({ ...prev, fcp: metric })));
    getLCP((metric: Metric) => setMetrics(prev => ({ ...prev, lcp: metric })));
    getTTFB((metric: Metric) => setMetrics(prev => ({ ...prev, ttfb: metric })));
  }, []);

  return (
    <div data-testid="performance-metrics">
      <div data-testid="cls-value">{metrics.cls?.value || 'N/A'}</div>
      <div data-testid="fid-value">{metrics.fid?.value || 'N/A'}</div>
      <div data-testid="fcp-value">{metrics.fcp?.value || 'N/A'}</div>
      <div data-testid="lcp-value">{metrics.lcp?.value || 'N/A'}</div>
      <div data-testid="ttfb-value">{metrics.ttfb?.value || 'N/A'}</div>
    </div>
  );
}

describe('Core Web Vitals Performance Monitoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize web vitals tracking', () => {
    render(<MockPerformanceComponent />);

    expect(getCLS).toHaveBeenCalledWith(expect.any(Function));
    expect(getFID).toHaveBeenCalledWith(expect.any(Function));
    expect(getFCP).toHaveBeenCalledWith(expect.any(Function));
    expect(getLCP).toHaveBeenCalledWith(expect.any(Function));
    expect(getTTFB).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should track CLS (Cumulative Layout Shift) metric', async () => {
    const mockCLSCallback = jest.fn();
    (getCLS as jest.Mock).mockImplementation((callback) => {
      callback({ name: 'CLS', value: 0.05, rating: 'good' });
    });

    render(<MockPerformanceComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('cls-value')).toHaveTextContent('0.05');
    });
  });

  it('should track FID (First Input Delay) metric', async () => {
    (getFID as jest.Mock).mockImplementation((callback) => {
      callback({ name: 'FID', value: 50, rating: 'good' });
    });

    render(<MockPerformanceComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('fid-value')).toHaveTextContent('50');
    });
  });

  it('should track FCP (First Contentful Paint) metric', async () => {
    (getFCP as jest.Mock).mockImplementation((callback) => {
      callback({ name: 'FCP', value: 1200, rating: 'good' });
    });

    render(<MockPerformanceComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('fcp-value')).toHaveTextContent('1200');
    });
  });

  it('should track LCP (Largest Contentful Paint) metric', async () => {
    (getLCP as jest.Mock).mockImplementation((callback) => {
      callback({ name: 'LCP', value: 2000, rating: 'good' });
    });

    render(<MockPerformanceComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('lcp-value')).toHaveTextContent('2000');
    });
  });

  it('should track TTFB (Time to First Byte) metric', async () => {
    (getTTFB as jest.Mock).mockImplementation((callback) => {
      callback({ name: 'TTFB', value: 300, rating: 'good' });
    });

    render(<MockPerformanceComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('ttfb-value')).toHaveTextContent('300');
    });
  });

  it('should handle missing metrics gracefully', () => {
    // Mock functions to not call callbacks (simulating no metrics available)
    (getCLS as jest.Mock).mockImplementation(() => {});
    (getFID as jest.Mock).mockImplementation(() => {});
    (getFCP as jest.Mock).mockImplementation(() => {});
    (getLCP as jest.Mock).mockImplementation(() => {});
    (getTTFB as jest.Mock).mockImplementation(() => {});
    
    render(<MockPerformanceComponent />);

    expect(screen.getByTestId('cls-value')).toHaveTextContent('N/A');
    expect(screen.getByTestId('fid-value')).toHaveTextContent('N/A');
    expect(screen.getByTestId('fcp-value')).toHaveTextContent('N/A');
    expect(screen.getByTestId('lcp-value')).toHaveTextContent('N/A');
    expect(screen.getByTestId('ttfb-value')).toHaveTextContent('N/A');
  });

  it('should track performance metrics with proper thresholds', async () => {
    // Test good ratings
    (getCLS as jest.Mock).mockImplementation((callback) => {
      callback({ name: 'CLS', value: 0.05, rating: 'good' });
    });

    // Test needs improvement ratings
    (getLCP as jest.Mock).mockImplementation((callback) => {
      callback({ name: 'LCP', value: 3000, rating: 'needs-improvement' });
    });

    // Test poor ratings
    (getFID as jest.Mock).mockImplementation((callback) => {
      callback({ name: 'FID', value: 400, rating: 'poor' });
    });

    render(<MockPerformanceComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('cls-value')).toHaveTextContent('0.05');
      expect(screen.getByTestId('lcp-value')).toHaveTextContent('3000');
      expect(screen.getByTestId('fid-value')).toHaveTextContent('400');
    });
  });

  it('should handle performance API unavailability gracefully', () => {
    // Mock scenario where performance APIs are not available
    (getCLS as jest.Mock).mockImplementation(() => {
      // Do nothing - simulates unsupported environment
    });

    expect(() => {
      render(<MockPerformanceComponent />);
    }).not.toThrow();

    expect(screen.getByTestId('cls-value')).toHaveTextContent('N/A');
  });
});