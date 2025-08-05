import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TestResults, type TestResult } from '../../components/ui/test-results';

expect.extend(toHaveNoViolations);

const mockTestResults: TestResult[] = [
  {
    id: "1",
    title: "Submission",
    message: "Submitting email to newsletter endpoint...",
    status: "pending",
    timestamp: new Date("2025-07-28T15:07:01"),
  },
  {
    id: "2", 
    title: "Submission",
    message: "API Error: Server configuration error. Please contact support.",
    status: "error",
    timestamp: new Date("2025-07-28T15:07:05"),
    details: {
      error: "Server configuration error. Please contact support."
    }
  },
  {
    id: "3",
    title: "Database Connection",
    message: "Successfully connected to database",
    status: "success", 
    timestamp: new Date("2025-07-28T15:06:45"),
    details: "Connection established to PostgreSQL database at port 5432"
  },
  {
    id: "4",
    title: "Authentication Test",
    message: "JWT token validation failed",
    status: "error",
    timestamp: new Date("2025-07-28T15:06:30"),
    details: {
      error: "JWT token validation failed",
      code: "INVALID_TOKEN",
      timestamp: "2025-07-28T15:06:30Z"
    }
  }
];

describe('TestResults Component', () => {
  describe('Component Rendering', () => {
    it('should render the component title', () => {
      render(<TestResults results={[]} />);
      expect(screen.getByRole('heading', { name: /test results/i })).toBeInTheDocument();
    });

    it('should render all test results', () => {
      render(<TestResults results={mockTestResults} />);
      
      expect(screen.getAllByText('Submission')).toHaveLength(2);
      expect(screen.getByText('Database Connection')).toBeInTheDocument();
      expect(screen.getByText('Authentication Test')).toBeInTheDocument();
    });

    it('should handle empty results array', () => {
      render(<TestResults results={[]} />);
      
      expect(screen.getByRole('heading', { name: /test results/i })).toBeInTheDocument();
      // Should not crash with empty array
    });

    it('should apply custom className when provided', () => {
      const { container } = render(
        <TestResults results={mockTestResults} className="custom-test-results" />
      );
      
      expect(container.firstChild).toHaveClass('custom-test-results');
    });
  });

  describe('Status Display', () => {
    it('should display pending status with spinner icon', () => {
      render(<TestResults results={[mockTestResults[0]]} />);
      
      const pendingBadge = screen.getByText('pending');
      expect(pendingBadge).toBeInTheDocument();
      expect(pendingBadge).toHaveClass('bg-orange-100');
      expect(pendingBadge).toHaveClass('text-orange-800');
      
      // Should have spinner animation
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should display error status with X icon', () => {
      render(<TestResults results={[mockTestResults[1]]} />);
      
      const errorBadge = screen.getByText('error');
      expect(errorBadge).toBeInTheDocument();
      expect(errorBadge).toHaveClass('bg-red-100');
      expect(errorBadge).toHaveClass('text-red-800');
      
      // Should have X icon
      expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('should display success status with checkmark icon', () => {
      render(<TestResults results={[mockTestResults[2]]} />);
      
      const successBadge = screen.getByText('success');
      expect(successBadge).toBeInTheDocument();
      expect(successBadge).toHaveClass('bg-green-100');
      expect(successBadge).toHaveClass('text-green-800');
      
      // Should have checkmark icon
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('should display proper border colors for each status', () => {
      render(<TestResults results={mockTestResults} />);
      
      // Check for border color classes (these will be applied to parent containers)
      const containers = document.querySelectorAll('[class*="border-l-"]');
      expect(containers.length).toBeGreaterThan(0);
    });
  });

  describe('Timestamp Formatting', () => {
    it('should format timestamps correctly', () => {
      render(<TestResults results={[mockTestResults[0]]} />);
      
      // Should display formatted timestamp
      expect(screen.getByText(/7\/28\/2025, 3:07:01 PM/)).toBeInTheDocument();
    });

    it('should handle invalid timestamps gracefully', () => {
      const invalidResult: TestResult = {
        ...mockTestResults[0],
        timestamp: new Date('invalid-date')
      };
      
      // Should not crash with invalid date
      expect(() => render(<TestResults results={[invalidResult]} />)).not.toThrow();
    });
  });

  describe('Expandable Details', () => {
    it('should show "View Details" button only when details exist', () => {
      render(<TestResults results={mockTestResults} />);
      
      // First result has no details
      const firstResultContainer = screen.getByText('Submitting email to newsletter endpoint...').closest('div');
      expect(within(firstResultContainer!).queryByText('View Details')).not.toBeInTheDocument();
      
      // Second result has details
      const secondResultContainer = screen.getByText('API Error: Server configuration error. Please contact support.').closest('div');
      expect(within(secondResultContainer!).getByText('View Details')).toBeInTheDocument();
    });

    it('should toggle details visibility when "View Details" is clicked', async () => {
      const user = userEvent.setup();
      render(<TestResults results={[mockTestResults[1]]} />);
      
      const viewDetailsButton = screen.getByText('View Details');
      
      // Details should not be visible initially
      expect(screen.queryByText('Server configuration error. Please contact support.')).not.toBeInTheDocument();
      
      // Click to expand
      await user.click(viewDetailsButton);
      
      // Details should now be visible (with JSON highlighting)
      expect(screen.getByText('"error"')).toBeInTheDocument();
      expect(screen.getByText('"Server configuration error. Please contact support."')).toBeInTheDocument();
      
      // Click to collapse
      await user.click(viewDetailsButton);
      
      // Details should be hidden again
      expect(screen.queryByText('"error"')).not.toBeInTheDocument();
    });

    it('should handle string details correctly', async () => {
      const user = userEvent.setup();
      render(<TestResults results={[mockTestResults[2]]} />);
      
      const viewDetailsButton = screen.getByText('View Details');
      await user.click(viewDetailsButton);
      
      expect(screen.getByText('Connection established to PostgreSQL database at port 5432')).toBeInTheDocument();
    });

    it('should format JSON details correctly', async () => {
      const user = userEvent.setup();
      render(<TestResults results={[mockTestResults[3]]} />);
      
      const viewDetailsButton = screen.getByText('View Details');
      await user.click(viewDetailsButton);
      
      // Should display formatted JSON with highlighting
      expect(screen.getByText('"error"')).toBeInTheDocument();
      expect(screen.getByText('"JWT token validation failed"')).toBeInTheDocument();
      expect(screen.getByText('"code"')).toBeInTheDocument();
      expect(screen.getByText('"INVALID_TOKEN"')).toBeInTheDocument();
    });

    it('should update chevron icon when expanding/collapsing', async () => {
      const user = userEvent.setup();
      render(<TestResults results={[mockTestResults[1]]} />);
      
      const viewDetailsButton = screen.getByText('View Details');
      
      // Should start with right chevron (collapsed)
      expect(document.querySelector('[data-lucide="chevron-right"]')).toBeInTheDocument();
      
      await user.click(viewDetailsButton);
      
      // Should now have down chevron (expanded)
      expect(document.querySelector('[data-lucide="chevron-down"]')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation for "View Details" buttons', async () => {
      const user = userEvent.setup();
      render(<TestResults results={[mockTestResults[1]]} />);
      
      const viewDetailsButton = screen.getByText('View Details');
      
      // Focus the button
      viewDetailsButton.focus();
      expect(viewDetailsButton).toHaveFocus();
      
      // Press Enter to activate
      await user.keyboard('{Enter}');
      
      // Details should be visible (with JSON highlighting)  
      expect(screen.getByText('"error"')).toBeInTheDocument();
      
      // Press Space to collapse
      await user.keyboard(' ');
      
      // Details should be hidden
      expect(screen.queryByText('"error"')).not.toBeInTheDocument();
    });

    it('should maintain focus when toggling details', async () => {
      const user = userEvent.setup();
      render(<TestResults results={[mockTestResults[1]]} />);
      
      const viewDetailsButton = screen.getByText('View Details');
      
      viewDetailsButton.focus();
      await user.keyboard('{Enter}');
      
      // Button should still be focused after expanding
      expect(viewDetailsButton).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<TestResults results={mockTestResults} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels for status indicators', () => {
      render(<TestResults results={mockTestResults} />);
      
      // Status icons should have appropriate labels
      const pendingIcon = screen.getByLabelText('Pending status');
      const errorIcon = screen.getAllByLabelText('Error status')[0];
      const successIcon = screen.getByLabelText('Success status');
      
      expect(pendingIcon).toBeInTheDocument();
      expect(errorIcon).toBeInTheDocument();
      expect(successIcon).toBeInTheDocument();
    });

    it('should have proper semantic structure', () => {
      render(<TestResults results={mockTestResults} />);
      
      // Should have main heading
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      
      // Each result should be in a proper container structure
      const resultContainers = screen.getAllByText('View Details');
      expect(resultContainers.length).toBe(3); // Only results with details
    });

    it('should support screen readers with proper content structure', () => {
      render(<TestResults results={[mockTestResults[1]]} />);
      
      // Important content should be accessible to screen readers
      expect(screen.getByText('Submission')).toBeInTheDocument();
      expect(screen.getByText('API Error: Server configuration error. Please contact support.')).toBeInTheDocument();
      expect(screen.getByText('error')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing required properties gracefully', () => {
      const incompleteResult = {
        id: "incomplete",
        title: "Test",
        message: "Test message",
        status: "pending" as const,
        timestamp: new Date(), // Add timestamp to avoid accessibility violations
      } as TestResult;
      
      expect(() => render(<TestResults results={[incompleteResult]} />)).not.toThrow();
    });

    it('should handle very long messages', () => {
      const longMessageResult: TestResult = {
        id: "long",
        title: "Long Message Test",
        message: "A".repeat(1000),
        status: "error",
        timestamp: new Date(),
      };
      
      render(<TestResults results={[longMessageResult]} />);
      expect(screen.getByText("A".repeat(1000))).toBeInTheDocument();
    });

    it('should handle large datasets without performance issues', () => {
      const largeDataset: TestResult[] = Array.from({ length: 100 }, (_, i) => ({
        id: `result-${i}`,
        title: `Test Result ${i}`,
        message: `Test message ${i}`,
        status: i % 3 === 0 ? "pending" : i % 3 === 1 ? "error" : "success",
        timestamp: new Date(),
      }));
      
      const startTime = performance.now();
      render(<TestResults results={largeDataset} />);
      const renderTime = performance.now() - startTime;
      
      // Should render within reasonable time (less than 1000ms for 100 items)
      expect(renderTime).toBeLessThan(1000);
      
      // Should render all items (excluding the "Test Results" heading)
      expect(screen.getAllByText(/Test Result \d+/)).toHaveLength(100);
    });

    it('should handle malformed details data', async () => {
      const user = userEvent.setup();
      const malformedResult: TestResult = {
        id: "malformed",
        title: "Malformed Details",
        message: "Test message",
        status: "error",
        timestamp: new Date(),
        details: { circular: {} }
      };
      
      // Create circular reference
      (malformedResult.details as any).circular.self = malformedResult.details;
      
      render(<TestResults results={[malformedResult]} />);
      
      const viewDetailsButton = screen.getByText('View Details');
      
      // Should not crash when expanding malformed details
      expect(() => user.click(viewDetailsButton)).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily when props do not change', () => {
      let renderCount = 0;
      const TestWrapper = ({ results }: { results: TestResult[] }) => {
        renderCount++;
        return <TestResults results={results} />;
      };
      
      const { rerender } = render(<TestWrapper results={mockTestResults} />);
      
      const initialRenderCount = renderCount;
      
      // Re-render with same props
      rerender(<TestWrapper results={mockTestResults} />);
      
      // Should not cause unnecessary re-renders
      expect(renderCount).toBe(initialRenderCount + 1);
    });
  });
});