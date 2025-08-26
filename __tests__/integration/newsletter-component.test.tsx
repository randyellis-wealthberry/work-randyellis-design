/**
 * Newsletter Component Integration Tests
 * TDD approach for validating newsletter signup functionality (without MSW)
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Import newsletter components
import { NewsletterSignup } from '../../components/ui/newsletter-signup';
import { FloatingInput } from '../../components/ui/input';

// Mock analytics
jest.mock('@/lib/analytics', () => ({
  trackNewsletterAttempt: jest.fn(),
}));

import { trackNewsletterAttempt } from '@/lib/analytics';
const mockTrackNewsletterAttempt = trackNewsletterAttempt as jest.MockedFunction<typeof trackNewsletterAttempt>;

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Newsletter Component Integration Tests', () => {
  beforeEach(() => {
    // Clear mocks before each test
    mockTrackNewsletterAttempt.mockClear();
    mockFetch.mockClear();
  });

  describe('Component Rendering and Accessibility', () => {
    test('should render newsletter form with proper accessibility attributes', () => {
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
      
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    test('should have proper ARIA labels and form structure', () => {
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      expect(emailInput).toHaveAttribute('aria-describedby');
      
      // Check for privacy policy text
      expect(screen.getByText(/privacy.*unsubscribe/i)).toBeInTheDocument();
    });

    test('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      
      render(<NewsletterSignup />);
      
      // Tab to email input
      await user.tab();
      const emailInput = screen.getByRole('textbox');
      expect(emailInput).toHaveFocus();
      
      // Tab to submit button
      await user.tab();
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Form Validation', () => {
    test('should show validation error for empty email', async () => {
      const user = userEvent.setup();
      
      render(<NewsletterSignup />);
      
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      await user.click(submitButton);
      
      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/email.*required/i)).toBeInTheDocument();
      });
    });

    test('should validate email format', async () => {
      const user = userEvent.setup();
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      // Test invalid email
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    test('should accept valid email format', async () => {
      const user = userEvent.setup();
      
      // Mock successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Successfully subscribed' })
      });
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);
      
      // Should not show validation error
      await waitFor(() => {
        expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
      });
      
      // Should call API
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/newsletter/subscribe',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com' })
        })
      );
    });
  });

  describe('API Integration', () => {
    test('should handle successful submission', async () => {
      const user = userEvent.setup();
      
      // Mock successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Successfully subscribed' })
      });
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'success@example.com');
      await user.click(submitButton);
      
      // Should show success message
      await waitFor(() => {
        expect(screen.getByText(/successfully subscribed/i)).toBeInTheDocument();
      });
      
      // Should track analytics
      expect(mockTrackNewsletterAttempt).toHaveBeenCalledWith('submit_start', false);
      expect(mockTrackNewsletterAttempt).toHaveBeenCalledWith('submit_success', true);
    });

    test('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock API error response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' })
      });
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'error@example.com');
      await user.click(submitButton);
      
      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
      
      // Should track analytics
      expect(mockTrackNewsletterAttempt).toHaveBeenCalledWith('submit_error', false);
    });

    test('should handle rate limiting', async () => {
      const user = userEvent.setup();
      
      // Mock rate limit response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ message: 'Too many requests. Please wait.' })
      });
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'ratelimit@example.com');
      await user.click(submitButton);
      
      // Should show rate limit message
      await waitFor(() => {
        expect(screen.getByText(/too many requests/i)).toBeInTheDocument();
      });
      
      // Should track analytics
      expect(mockTrackNewsletterAttempt).toHaveBeenCalledWith('submit_rate_limited', false);
    });

    test('should handle network errors', async () => {
      const user = userEvent.setup();
      
      // Mock network error
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'network@example.com');
      await user.click(submitButton);
      
      // Should show network error message
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
      
      // Should track analytics
      expect(mockTrackNewsletterAttempt).toHaveBeenCalledWith('submit_error', false);
    });
  });

  describe('User Experience', () => {
    test('should disable submit button during submission', async () => {
      const user = userEvent.setup();
      
      // Mock slow API response
      let resolvePromise: (value: any) => void;
      const slowPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      
      mockFetch.mockReturnValueOnce(slowPromise);
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'slow@example.com');
      await user.click(submitButton);
      
      // Button should be disabled and show loading state
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent(/subscribing/i);
      });
      
      // Resolve the promise
      resolvePromise!({
        ok: true,
        json: async () => ({ success: true })
      });
      
      // Button should be enabled again after response
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    test('should prevent duplicate submissions', async () => {
      const user = userEvent.setup();
      
      // Mock successful API response
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      });
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'duplicate@example.com');
      
      // Rapid clicks should only trigger one submission
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);
      
      // Should only call API once
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('FloatingInput Component', () => {
    test('should render with proper attributes', () => {
      render(<FloatingInput label="Test Label" type="email" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
      
      const label = screen.getByText('Test Label');
      expect(label).toBeInTheDocument();
    });

    test('should show error message when provided', () => {
      render(<FloatingInput label="Email" type="email" error="Invalid email" />);
      
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    test('should handle focus and blur events', async () => {
      const user = userEvent.setup();
      
      render(<FloatingInput label="Email" type="email" />);
      
      const input = screen.getByRole('textbox');
      
      // Focus input
      await user.click(input);
      expect(input).toHaveFocus();
      
      // Blur input
      await user.tab();
      expect(input).not.toHaveFocus();
    });
  });

  describe('Performance and Accessibility', () => {
    test('should meet performance budget for rendering', () => {
      const startTime = performance.now();
      
      render(<NewsletterSignup />);
      
      const renderTime = performance.now() - startTime;
      
      // Should render within reasonable time (100ms)
      expect(renderTime).toBeLessThan(100);
    });

    test('should announce status changes to screen readers', async () => {
      const user = userEvent.setup();
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'success@example.com');
      await user.click(submitButton);
      
      // Status message should be announced to screen readers
      await waitFor(() => {
        const statusElement = screen.getByText(/successfully subscribed/i);
        expect(statusElement.closest('[role="status"]')).toBeInTheDocument();
      });
    });
  });
});