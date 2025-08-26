/**
 * Newsletter Integration End-to-End Testing Suite
 * TDD approach for validating newsletter signup functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

// Import newsletter components
import { NewsletterSignup } from '../../components/ui/newsletter-signup';
import { FloatingInput } from '../../components/ui/input';

// Mock analytics
const mockTrackNewsletterAttempt = jest.fn();
jest.mock('@/lib/analytics', () => ({
  trackNewsletterAttempt: mockTrackNewsletterAttempt,
}));

describe('Newsletter Integration End-to-End Tests', () => {
  beforeEach(() => {
    // Clear mocks before each test
    mockTrackNewsletterAttempt.mockClear();
  });

  describe('Newsletter Signup Form Validation', () => {
    test('should validate email format and show appropriate messages', async () => {
      const user = userEvent.setup();
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      // Test invalid email formats
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test..test@example.com',
        'test space@example.com'
      ];
      
      for (const invalidEmail of invalidEmails) {
        await user.clear(emailInput);
        await user.type(emailInput, invalidEmail);
        await user.click(submitButton);
        
        await waitFor(() => {
          expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
        });
      }
      
      // Test valid email format
      await user.clear(emailInput);
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
      });
    });

    test('should handle empty email submission', async () => {
      const user = userEvent.setup();
      
      render(<NewsletterSignup />);
      
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/email.*required/i)).toBeInTheDocument();
      });
    });

    test('should prevent duplicate submissions during processing', async () => {
      const user = userEvent.setup();
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'test@example.com');
      
      // First click should disable button
      await user.click(submitButton);
      expect(submitButton).toBeDisabled();
      
      // Second click should not trigger another request
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/success|subscribed/i)).toBeInTheDocument();
      });
    });
  });

  describe('API Integration Tests', () => {
    test('should successfully submit valid email to newsletter API', async () => {
      const user = userEvent.setup();
      const testEmail = 'success@example.com';
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, testEmail);
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/success|subscribed/i)).toBeInTheDocument();
      });
      
      // Verify email field is cleared after success
      expect(emailInput).toHaveValue('');
    });

    test('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Override MSW handler to simulate API error
      server.use(
        http.post('/api/newsletter/subscribe', () => {
          return new HttpResponse(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500 }
          );
        })
      );
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'error@example.com');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/error|failed|try again/i)).toBeInTheDocument();
      });
      
      // Button should be re-enabled after error
      expect(submitButton).not.toBeDisabled();
    });

    test('should handle network timeout', async () => {
      const user = userEvent.setup();
      
      // Override MSW handler to simulate timeout
      server.use(
        http.post('/api/newsletter/subscribe', async () => {
          await new Promise(resolve => setTimeout(resolve, 10000)); // 10 second delay
          return HttpResponse.json({ success: true });
        })
      );
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'timeout@example.com');
      await user.click(submitButton);
      
      // Wait for timeout handling
      await waitFor(() => {
        expect(screen.getByText(/timeout|try again/i)).toBeInTheDocument();
      }, { timeout: 15000 });
    });

    test('should handle duplicate email addresses', async () => {
      const user = userEvent.setup();
      
      // Override MSW handler to simulate duplicate email
      server.use(
        http.post('/api/newsletter/subscribe', () => {
          return new HttpResponse(
            JSON.stringify({ error: 'Email already subscribed' }),
            { status: 409 }
          );
        })
      );
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'duplicate@example.com');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/already subscribed|already registered/i)).toBeInTheDocument();
      });
    });
  });

  describe('FloatingInput Component Integration', () => {
    test('should render FloatingInput with proper accessibility attributes', () => {
      render(<FloatingInput type="email" placeholder="Email address" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'Email address');
    });

    test('should handle focus and blur events correctly', async () => {
      const user = userEvent.setup();
      
      render(<FloatingInput type="email" placeholder="Email address" />);
      
      const input = screen.getByRole('textbox');
      
      // Test focus
      await user.click(input);
      expect(input).toHaveFocus();
      
      // Test blur
      await user.tab();
      expect(input).not.toHaveFocus();
    });

    test('should display floating label animation', async () => {
      const user = userEvent.setup();
      
      render(<FloatingInput type="email" placeholder="Email address" />);
      
      const input = screen.getByRole('textbox');
      
      // Initially, placeholder should be visible
      expect(input).toHaveAttribute('placeholder', 'Email address');
      
      // When typing, floating label behavior should activate
      await user.type(input, 'test@example.com');
      expect(input).toHaveValue('test@example.com');
    });
  });

  describe('Newsletter Form Integration with Analytics', () => {
    test('should track newsletter signup events', async () => {
      const user = userEvent.setup();
      
      // Mock analytics tracking
      const mockAnalytics = jest.fn();
      (global as any).gtag = mockAnalytics;
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'analytics@example.com');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/success|subscribed/i)).toBeInTheDocument();
      });
      
      // Verify analytics event was tracked
      expect(mockAnalytics).toHaveBeenCalledWith('event', 'newsletter_signup', {
        event_category: 'engagement',
        event_label: 'footer_newsletter'
      });
    });

    test('should track form abandonment', async () => {
      const user = userEvent.setup();
      
      const mockAnalytics = jest.fn();
      (global as any).gtag = mockAnalytics;
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      
      // Start typing then abandon
      await user.type(emailInput, 'abandon');
      await user.tab(); // Focus away from form
      
      // Wait for potential abandonment tracking
      await waitFor(() => {
        expect(mockAnalytics).toHaveBeenCalledWith('event', 'form_abandonment', {
          event_category: 'engagement',
          event_label: 'newsletter_form',
          value: 'abandon'.length
        });
      });
    });
  });

  describe('Newsletter Form Accessibility', () => {
    test('should have proper ARIA labels and roles', () => {
      render(<NewsletterSignup />);
      
      const form = screen.getByRole('form', { name: /newsletter/i });
      expect(form).toBeInTheDocument();
      
      const emailInput = screen.getByRole('textbox');
      expect(emailInput).toHaveAttribute('aria-describedby');
      expect(emailInput).toHaveAttribute('aria-required', 'true');
      
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      expect(submitButton).toBeInTheDocument();
    });

    test('should announce status messages to screen readers', async () => {
      const user = userEvent.setup();
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'success@example.com');
      await user.click(submitButton);
      
      await waitFor(() => {
        const statusMessage = screen.getByText(/success|subscribed/i);
        expect(statusMessage).toHaveAttribute('aria-live', 'polite');
        expect(statusMessage).toHaveAttribute('role', 'status');
      });
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
      
      // Enter should submit form
      await user.keyboard('{ArrowLeft}');
      await user.type(emailInput, 'keyboard@example.com');
      await user.tab();
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText(/success|subscribed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Newsletter Form Performance', () => {
    test('should handle rapid successive submissions gracefully', async () => {
      const user = userEvent.setup();
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'rapid@example.com');
      
      // Rapid clicks should only trigger one submission
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/success|subscribed/i)).toBeInTheDocument();
      });
      
      // Only one success message should appear
      const successMessages = screen.getAllByText(/success|subscribed/i);
      expect(successMessages).toHaveLength(1);
    });

    test('should meet performance budget for form interaction', async () => {
      const user = userEvent.setup();
      
      const startTime = performance.now();
      
      render(<NewsletterSignup />);
      
      const renderTime = performance.now() - startTime;
      expect(renderTime).toBeLessThan(100); // Should render within 100ms
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      const interactionStart = performance.now();
      
      await user.type(emailInput, 'performance@example.com');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/success|subscribed/i)).toBeInTheDocument();
      });
      
      const interactionTime = performance.now() - interactionStart;
      expect(interactionTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe('Newsletter Form Error Recovery', () => {
    test('should allow retry after API error', async () => {
      const user = userEvent.setup();
      
      // First request fails then succeeds
      let requestCount = 0;
      server.use(
        http.post('/api/newsletter/subscribe', () => {
          requestCount++;
          if (requestCount === 1) {
            return new HttpResponse(
              JSON.stringify({ error: 'Server error' }),
              { status: 500 }
            );
          }
          return HttpResponse.json({
            success: true,
            message: 'Successfully subscribed to newsletter'
          });
        })
      );
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'retry@example.com');
      await user.click(submitButton);
      
      // First attempt should fail
      await waitFor(() => {
        expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
      });
      
      // Retry should succeed (MSW will use default success handler)
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/success|subscribed/i)).toBeInTheDocument();
      });
    });

    test('should handle connection errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Override MSW to simulate network error
      server.use(
        http.post('/api/newsletter/subscribe', () => {
          return HttpResponse.error();
        })
      );
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      await user.type(emailInput, 'network@example.com');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/connection|network|offline/i)).toBeInTheDocument();
      });
      
      // Form should remain usable
      expect(emailInput).toBeEnabled();
      expect(submitButton).toBeEnabled();
    });
  });

  describe('Newsletter Form Data Privacy', () => {
    test('should not expose email in DOM after submission', async () => {
      const user = userEvent.setup();
      
      render(<NewsletterSignup />);
      
      const emailInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      
      const testEmail = 'privacy@example.com';
      await user.type(emailInput, testEmail);
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/success|subscribed/i)).toBeInTheDocument();
      });
      
      // Email should be cleared from input
      expect(emailInput).toHaveValue('');
      
      // Email should not appear anywhere in the DOM
      const domContent = document.body.textContent || '';
      expect(domContent).not.toContain(testEmail);
    });

    test('should include GDPR compliance messaging', () => {
      render(<NewsletterSignup />);
      
      // Should include privacy policy or GDPR notice
      expect(
        screen.getByText(/privacy policy|gdpr|data protection|consent/i)
      ).toBeInTheDocument();
    });
  });
});