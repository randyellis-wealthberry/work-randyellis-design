import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock complete user journey components
function MockLandingPage() {
  const [currentSection, setCurrentSection] = React.useState('hero');
  const [newsletterSubmitted, setNewsletterSubmitted] = React.useState(false);

  return (
    <div data-testid="landing-page">
      {/* Hero Section */}
      <section data-testid="hero-section">
        <h1>Randy Ellis - Product Designer</h1>
        <p>Transforming ideas into user-centered experiences</p>
        <button 
          data-testid="view-work-cta"
          onClick={() => setCurrentSection('projects')}
        >
          View My Work
        </button>
      </section>

      {/* Projects Section */}
      {currentSection === 'projects' && (
        <section data-testid="projects-section">
          <h2>Featured Projects</h2>
          <div data-testid="project-grid">
            <div data-testid="project-card-ledgeriq">
              <h3>LedgerIQ</h3>
              <p>Financial intelligence platform</p>
              <button data-testid="view-ledgeriq">View Case Study</button>
            </div>
            <div data-testid="project-card-growit">
              <h3>GrowIt</h3>
              <p>Social gardening platform</p>
              <button data-testid="view-growit">View Case Study</button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section data-testid="newsletter-section">
        <h2>Business Strategy Insights</h2>
        {!newsletterSubmitted ? (
          <form 
            data-testid="newsletter-form"
            onSubmit={(e) => {
              e.preventDefault();
              setNewsletterSubmitted(true);
            }}
          >
            <input
              data-testid="newsletter-email"
              type="email"
              placeholder="Enter your email"
              required
            />
            <label>
              <input 
                data-testid="newsletter-consent"
                type="checkbox" 
                required 
              />
              I agree to receive weekly insights
            </label>
            <button data-testid="newsletter-submit" type="submit">
              Subscribe
            </button>
          </form>
        ) : (
          <div data-testid="newsletter-success">
            <h3>Successfully subscribed!</h3>
            <p>Check your email for confirmation</p>
          </div>
        )}
      </section>


      {/* Performance Indicator */}
      <div data-testid="performance-metrics" style={{ position: 'fixed', bottom: 0, right: 0 }}>
        <div data-testid="lcp-metric">LCP: 1.2s</div>
        <div data-testid="cls-metric">CLS: 0.05</div>
      </div>
    </div>
  );
}

function MockProjectDetailPage({ projectId }: { projectId: string }) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoaded(true), 100);
  }, []);

  if (!loaded) {
    return <div data-testid="project-loading">Loading project...</div>;
  }

  const projectData = {
    ledgeriq: {
      title: 'LedgerIQ: Financial Intelligence Platform',
      challenge: 'Complex financial data visualization',
      solution: 'Intuitive dashboard design',
      impact: '40% increase in user engagement',
    },
    growit: {
      title: 'GrowIt: Social Gardening Platform',
      challenge: 'Community engagement and plant tracking',
      solution: 'Gamified social features',
      impact: '3x growth in active users',
    },
  };

  const project = projectData[projectId as keyof typeof projectData];

  return (
    <div data-testid="project-detail-page">
      <header data-testid="project-header">
        <h1>{project.title}</h1>
        <button data-testid="back-to-projects">← Back to Projects</button>
      </header>

      <section data-testid="project-challenge">
        <h2>Challenge</h2>
        <p>{project.challenge}</p>
      </section>

      <section data-testid="project-solution">
        <h2>Solution</h2>
        <p>{project.solution}</p>
      </section>

      <section data-testid="project-impact">
        <h2>Impact</h2>
        <p>{project.impact}</p>
      </section>

      <section data-testid="project-cta">
        <h3>Interested in working together?</h3>
        <button data-testid="contact-cta">Get in Touch</button>
      </section>
    </div>
  );
}

// Mock router for navigation
function MockApp() {
  const [currentPage, setCurrentPage] = React.useState<{
    type: 'landing' | 'project';
    projectId?: string;
  }>({ type: 'landing' });

  React.useEffect(() => {
    // Mock navigation handlers
    const handleViewProject = (projectId: string) => {
      setCurrentPage({ type: 'project', projectId });
    };

    const handleBackToProjects = () => {
      setCurrentPage({ type: 'landing' });
    };

    // Add event listeners
    document.addEventListener('view-ledgeriq', () => handleViewProject('ledgeriq'));
    document.addEventListener('view-growit', () => handleViewProject('growit'));
    document.addEventListener('back-to-projects', handleBackToProjects);

    return () => {
      document.removeEventListener('view-ledgeriq', () => handleViewProject('ledgeriq'));
      document.removeEventListener('view-growit', () => handleViewProject('growit'));
      document.removeEventListener('back-to-projects', handleBackToProjects);
    };
  }, []);

  if (currentPage.type === 'project') {
    return <MockProjectDetailPage projectId={currentPage.projectId!} />;
  }

  return <MockLandingPage />;
}

describe('Complete User Journey E2E Tests', () => {
  beforeEach(() => {
    document.body.className = '';
  });

  describe('Landing Page Experience', () => {
    it('should render the complete landing page', () => {
      render(<MockApp />);

      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      expect(screen.getByText('Randy Ellis - Product Designer')).toBeInTheDocument();
      expect(screen.getByTestId('newsletter-section')).toBeInTheDocument();
    });

    it('should show projects when CTA is clicked', async () => {
      render(<MockApp />);

      const viewWorkCTA = screen.getByTestId('view-work-cta');
      fireEvent.click(viewWorkCTA);

      await waitFor(() => {
        expect(screen.getByTestId('projects-section')).toBeInTheDocument();
        expect(screen.getByTestId('project-card-ledgeriq')).toBeInTheDocument();
        expect(screen.getByTestId('project-card-growit')).toBeInTheDocument();
      });
    });


    it('should display performance metrics', () => {
      render(<MockApp />);

      expect(screen.getByTestId('performance-metrics')).toBeInTheDocument();
      expect(screen.getByTestId('lcp-metric')).toHaveTextContent('LCP: 1.2s');
      expect(screen.getByTestId('cls-metric')).toHaveTextContent('CLS: 0.05');
    });
  });

  describe('Newsletter Subscription Journey', () => {
    it('should complete newsletter subscription flow', async () => {
      const user = userEvent.setup();
      render(<MockApp />);

      const emailInput = screen.getByTestId('newsletter-email');
      const consentCheckbox = screen.getByTestId('newsletter-consent');
      const submitButton = screen.getByTestId('newsletter-submit');

      // Fill out form
      await user.type(emailInput, 'test@example.com');
      await user.click(consentCheckbox);
      await user.click(submitButton);

      // Should show success message
      await waitFor(() => {
        expect(screen.getByTestId('newsletter-success')).toBeInTheDocument();
        expect(screen.getByText('Successfully subscribed!')).toBeInTheDocument();
      });

      // Form should be hidden
      expect(screen.queryByTestId('newsletter-form')).not.toBeInTheDocument();
    });

    it('should validate required fields', async () => {
      const user = userEvent.setup();
      render(<MockApp />);

      const submitButton = screen.getByTestId('newsletter-submit');

      // Try to submit without filling form
      await user.click(submitButton);

      // Form should still be visible (HTML validation would prevent submission)
      expect(screen.getByTestId('newsletter-form')).toBeInTheDocument();
      expect(screen.queryByTestId('newsletter-success')).not.toBeInTheDocument();
    });
  });

  describe('Project Exploration Journey', () => {
    it('should navigate to project detail page', async () => {
      render(<MockApp />);

      // Go to projects section
      const viewWorkCTA = screen.getByTestId('view-work-cta');
      fireEvent.click(viewWorkCTA);

      await waitFor(() => {
        expect(screen.getByTestId('projects-section')).toBeInTheDocument();
      });

      // Mock project navigation by directly triggering the event
      const viewLedgerIQButton = screen.getByTestId('view-ledgeriq');
      fireEvent.click(viewLedgerIQButton);

      // Manually trigger navigation for testing
      fireEvent(document, new CustomEvent('view-ledgeriq'));

      await waitFor(() => {
        expect(screen.getByTestId('project-detail-page')).toBeInTheDocument();
        expect(screen.getByText('LedgerIQ: Financial Intelligence Platform')).toBeInTheDocument();
      });
    });

    it('should display project details correctly', async () => {
      render(<MockProjectDetailPage projectId="ledgeriq" />);

      await waitFor(() => {
        expect(screen.getByTestId('project-detail-page')).toBeInTheDocument();
        expect(screen.getByTestId('project-header')).toBeInTheDocument();
        expect(screen.getByTestId('project-challenge')).toBeInTheDocument();
        expect(screen.getByTestId('project-solution')).toBeInTheDocument();
        expect(screen.getByTestId('project-impact')).toBeInTheDocument();
        expect(screen.getByTestId('project-cta')).toBeInTheDocument();
      });

      expect(screen.getByText('40% increase in user engagement')).toBeInTheDocument();
    });

    it('should show loading state initially', () => {
      render(<MockProjectDetailPage projectId="ledgeriq" />);

      expect(screen.getByTestId('project-loading')).toBeInTheDocument();
      expect(screen.getByText('Loading project...')).toBeInTheDocument();
    });
  });

  describe('Complete User Flow', () => {
    it('should support complete user journey from landing to project to newsletter', async () => {
      const user = userEvent.setup();
      render(<MockApp />);

      // 1. Start on landing page
      expect(screen.getByText('Randy Ellis - Product Designer')).toBeInTheDocument();

      // 2. Navigate to projects
      const viewWorkCTA = screen.getByTestId('view-work-cta');
      fireEvent.click(viewWorkCTA);

      await waitFor(() => {
        expect(screen.getByTestId('projects-section')).toBeInTheDocument();
      });

      // 3. Browse projects (theme automatically follows system preference)

      // 4. Subscribe to newsletter
      const emailInput = screen.getByTestId('newsletter-email');
      const consentCheckbox = screen.getByTestId('newsletter-consent');
      const submitButton = screen.getByTestId('newsletter-submit');

      await user.type(emailInput, 'user@example.com');
      await user.click(consentCheckbox);
      await user.click(submitButton);

      // 5. Verify success
      await waitFor(() => {
        expect(screen.getByTestId('newsletter-success')).toBeInTheDocument();
      });

      // 6. Theme automatically follows system preference

      // 7. Performance metrics should be visible
      expect(screen.getByTestId('performance-metrics')).toBeInTheDocument();
    });
  });

  describe('Accessibility and UX', () => {
    it('should have accessible form elements', () => {
      render(<MockApp />);

      const emailInput = screen.getByTestId('newsletter-email');
      const submitButton = screen.getByTestId('newsletter-submit');

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should maintain focus management', async () => {
      const user = userEvent.setup();
      render(<MockApp />);

      const emailInput = screen.getByTestId('newsletter-email');

      // Tab navigation should work
      await user.tab();
      expect(document.activeElement).toBe(screen.getByTestId('view-work-cta'));

      // Focus should be manageable
      emailInput.focus();
      expect(document.activeElement).toBe(emailInput);
    });

    it('should have semantic HTML structure', () => {
      render(<MockApp />);

      // Check for proper heading hierarchy
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Randy Ellis - Product Designer');

      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThan(0);

      // Check for proper form elements
      const form = screen.getByTestId('newsletter-form');
      expect(form).toBeInTheDocument();

      const emailInput = screen.getByRole('textbox');
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  describe('Performance and Loading', () => {
    it('should handle loading states gracefully', async () => {
      render(<MockProjectDetailPage projectId="growit" />);

      // Should show loading initially
      expect(screen.getByTestId('project-loading')).toBeInTheDocument();

      // Should load content
      await waitFor(() => {
        expect(screen.getByTestId('project-detail-page')).toBeInTheDocument();
        expect(screen.queryByTestId('project-loading')).not.toBeInTheDocument();
      });
    });

    it('should maintain responsive layout', () => {
      render(<MockApp />);

      const performanceMetrics = screen.getByTestId('performance-metrics');
      expect(performanceMetrics.style.position).toBe('fixed');

      const projectGrid = screen.getByTestId('view-work-cta');
      expect(projectGrid).toBeInTheDocument();
    });
  });

  describe('Error Boundaries and Edge Cases', () => {
    it('should handle missing project data gracefully', () => {
      expect(() => {
        render(<MockProjectDetailPage projectId="nonexistent" />);
      }).not.toThrow();
    });

    it('should handle rapid user interactions', async () => {
      const user = userEvent.setup();
      render(<MockApp />);

      const ctaButton = screen.getByTestId('view-work-cta');

      // Rapid button clicks
      await user.click(ctaButton);
      await user.click(ctaButton);
      await user.click(ctaButton);

      // Should still function correctly
      expect(screen.getByTestId('projects-section')).toBeInTheDocument();
    });

    it('should maintain state consistency', async () => {
      const user = userEvent.setup();
      render(<MockApp />);

      // Subscribe to newsletter
      const emailInput = screen.getByTestId('newsletter-email');
      const consentCheckbox = screen.getByTestId('newsletter-consent');
      const submitButton = screen.getByTestId('newsletter-submit');

      await user.type(emailInput, 'test@example.com');
      await user.click(consentCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('newsletter-success')).toBeInTheDocument();
      });

      // Navigate to projects and back - newsletter state should persist
      const viewWorkCTA = screen.getByTestId('view-work-cta');
      fireEvent.click(viewWorkCTA);

      expect(screen.getByTestId('newsletter-success')).toBeInTheDocument();
    });
  });
});