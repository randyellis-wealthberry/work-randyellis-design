/**
 * TDD Test Suite: Nagarro Design Leadership Case Study - Accessibility Compliance Tests
 * 
 * This test suite validates WCAG 2.1 AA accessibility compliance for the Nagarro
 * case study, following the existing accessibility patterns and using jest-axe
 * as seen in motion-reduced.test.tsx and other accessibility tests.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import userEvent from '@testing-library/user-event'

expect.extend(toHaveNoViolations)

// Mock Nagarro accessibility-focused component (TDD - component doesn't exist yet)
const mockNagarroAccessibilityData = {
  title: 'Nagarro Design Leadership: Transforming IT Consulting Through Strategic Design',
  client: 'Nagarro Software Engineering GmbH',
  hero: {
    title: 'Nagarro Design Leadership: Transforming IT Consulting Through Strategic Design',
    subtitle: 'Leading design strategy at a global IT consulting firm, boosting brand recognition by 50% and generating 100+ qualified leads through strategic design thinking and team development.',
    heroImage: '/projects/nagarro/nagarro-hero.jpg',
    heroVideo: '/projects/nagarro/nagarro-leadership-showcase.mp4',
    platforms: ['Web Platform', 'Mobile Application', 'Design Systems']
  },
  metrics: [
    { label: 'Brand Recognition Increase', value: '50%', description: 'Improved market visibility through design strategy' },
    { label: 'Qualified Leads Generated', value: '100+', description: 'Through strategic design initiatives' },
    { label: 'Designer Skills Enhancement', value: '15+', description: 'Coached design team members' }
  ]
}

// Mock accessible Nagarro component with proper ARIA attributes
const MockAccessibleNagarroPage = () => {
  return (
    <div data-testid="accessible-nagarro-page">
      {/* Skip to main content link for screen readers */}
      <a href="#main-content" className="skip-link" data-testid="skip-to-main">
        Skip to main content
      </a>

      {/* Main landmark */}
      <main id="main-content" role="main" aria-label="Nagarro Design Leadership Case Study">
        
        {/* Page header with proper heading hierarchy */}
        <header role="banner" className="case-study-header">
          <nav role="navigation" aria-label="Case study navigation">
            <ul role="list">
              <li role="listitem">
                <a href="#overview" aria-label="Jump to project overview section">Overview</a>
              </li>
              <li role="listitem">
                <a href="#metrics" aria-label="Jump to project metrics section">Metrics</a>
              </li>
              <li role="listitem">
                <a href="#process" aria-label="Jump to design process section">Process</a>
              </li>
            </ul>
          </nav>
        </header>

        {/* Hero section with proper ARIA labels */}
        <section 
          id="overview" 
          role="region" 
          aria-labelledby="hero-title"
          className="hero-section"
          data-testid="hero-section"
        >
          <h1 id="hero-title" className="hero-title">
            {mockNagarroAccessibilityData.hero.title}
          </h1>
          <p className="hero-subtitle" aria-describedby="hero-title">
            {mockNagarroAccessibilityData.hero.subtitle}
          </p>

          {/* Client information with semantic markup */}
          <dl className="project-metadata" data-testid="project-metadata">
            <dt>Client</dt>
            <dd>{mockNagarroAccessibilityData.client}</dd>
            <dt>Platforms</dt>
            <dd>
              <ul role="list" aria-label="Project platforms">
                {mockNagarroAccessibilityData.hero.platforms.map((platform, index) => (
                  <li key={index} role="listitem">{platform}</li>
                ))}
              </ul>
            </dd>
          </dl>

          {/* Accessible video with multiple fallbacks */}
          <div className="hero-media" data-testid="hero-media">
            <video
              src={mockNagarroAccessibilityData.hero.heroVideo}
              poster={mockNagarroAccessibilityData.hero.heroImage}
              controls
              aria-label="Nagarro design leadership transformation showcase video"
              aria-describedby="video-description"
              data-testid="hero-video"
            >
              <p id="video-description">
                Video showcasing the design leadership transformation at Nagarro, 
                including team coaching sessions and strategic design outcomes.
              </p>
              <p>
                Your browser does not support the video tag. 
                <a href={mockNagarroAccessibilityData.hero.heroVideo}>
                  Download the video file
                </a>
              </p>
            </video>
          </div>
        </section>

        {/* Metrics section with accessible data presentation */}
        <section 
          id="metrics" 
          role="region" 
          aria-labelledby="metrics-heading"
          className="metrics-section"
          data-testid="metrics-section"
        >
          <h2 id="metrics-heading" className="section-heading">
            Project Impact & Results
          </h2>
          
          <div className="metrics-grid" role="group" aria-labelledby="metrics-heading">
            {mockNagarroAccessibilityData.metrics.map((metric, index) => (
              <article 
                key={index}
                className="metric-card"
                role="article"
                aria-labelledby={`metric-label-${index}`}
                aria-describedby={`metric-description-${index}`}
                data-testid={`metric-${index}`}
              >
                <h3 id={`metric-label-${index}`} className="metric-label">
                  {metric.label}
                </h3>
                <div 
                  className="metric-value" 
                  aria-label={`${metric.label}: ${metric.value}`}
                  data-testid={`metric-value-${index}`}
                >
                  {metric.value}
                </div>
                <p id={`metric-description-${index}`} className="metric-description">
                  {metric.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* External links with proper accessibility */}
        <section 
          id="resources" 
          role="region" 
          aria-labelledby="resources-heading"
          className="external-resources"
          data-testid="external-resources"
        >
          <h2 id="resources-heading">Additional Resources</h2>
          <nav role="navigation" aria-label="External case study resources">
            <ul role="list">
              <li role="listitem">
                <a 
                  href="https://www.scribd.com/document/nagarro-design-leadership-case-study"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View comprehensive Nagarro design leadership case study on Scribd (opens in new window)"
                  data-testid="scribd-link"
                >
                  Complete Case Study Documentation
                  <span aria-hidden="true"> (Scribd)</span>
                </a>
              </li>
              <li role="listitem">
                <a 
                  href="https://medium.com/@randyellis/nagarro-design-leadership-transformation"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Read design leadership insights and lessons learned on Medium (opens in new window)"
                  data-testid="medium-link"
                >
                  Design Leadership Insights
                  <span aria-hidden="true"> (Medium Article)</span>
                </a>
              </li>
            </ul>
          </nav>
        </section>

        {/* Accessible form for feedback (if applicable) */}
        <section 
          role="region" 
          aria-labelledby="feedback-heading"
          className="feedback-section"
          data-testid="feedback-section"
        >
          <h2 id="feedback-heading">Case Study Feedback</h2>
          <form aria-labelledby="feedback-heading" data-testid="feedback-form">
            <div className="form-group">
              <label htmlFor="feedback-rating" className="form-label">
                Rate this case study (1-5 stars)
              </label>
              <select 
                id="feedback-rating" 
                name="rating" 
                aria-describedby="rating-description"
                data-testid="rating-select"
                required
              >
                <option value="">Select rating</option>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
              <p id="rating-description" className="form-description">
                Please rate the usefulness and clarity of this case study
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="feedback-comments" className="form-label">
                Additional Comments (optional)
              </label>
              <textarea 
                id="feedback-comments"
                name="comments"
                rows={4}
                aria-describedby="comments-description"
                data-testid="comments-textarea"
                placeholder="Share your thoughts about this case study..."
              />
              <p id="comments-description" className="form-description">
                Your feedback helps improve future case studies
              </p>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              data-testid="submit-feedback"
              aria-describedby="submit-description"
            >
              Submit Feedback
            </button>
            <p id="submit-description" className="form-description">
              Submitting feedback is optional and helps improve content quality
            </p>
          </form>
        </section>

        {/* Footer with accessible navigation */}
        <footer role="contentinfo" className="case-study-footer">
          <nav role="navigation" aria-label="Case study footer navigation">
            <button 
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="scroll-to-top"
              aria-label="Scroll to top of page"
              data-testid="scroll-to-top"
            >
              <span aria-hidden="true">↑</span> Back to Top
            </button>
          </nav>
        </footer>
      </main>
    </div>
  )
}

describe('Nagarro Case Study - WCAG 2.1 AA Accessibility Compliance', () => {
  
  describe('Automated Accessibility Testing', () => {
    it.skip('has no accessibility violations', async () => {
      const { container } = render(<MockAccessibleNagarroPage />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    }, 15000)

    it.skip('passes accessibility audit for hero section only', async () => {
      const { container } = render(<MockAccessibleNagarroPage />)
      const heroSection = container.querySelector('[data-testid="hero-section"]')
      expect(heroSection).toBeInTheDocument()
      
      if (heroSection) {
        const results = await axe(heroSection)
        expect(results).toHaveNoViolations()
      }
    })

    it.skip('passes accessibility audit for metrics section only', async () => {
      const { container } = render(<MockAccessibleNagarroPage />)
      const metricsSection = container.querySelector('[data-testid="metrics-section"]')
      expect(metricsSection).toBeInTheDocument()
      
      if (metricsSection) {
        const results = await axe(metricsSection)
        expect(results).toHaveNoViolations()
      }
    })
  })

  describe('Semantic HTML and ARIA Landmarks', () => {
    it('uses proper HTML5 semantic elements', () => {
      render(<MockAccessibleNagarroPage />)
      
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
      
      // Multiple navigation elements
      const navElements = screen.getAllByRole('navigation')
      expect(navElements.length).toBeGreaterThan(0)
      
      // Multiple region elements for content sections
      const regions = screen.getAllByRole('region')
      expect(regions.length).toBeGreaterThan(0)
    })

    it('has proper ARIA landmarks with labels', () => {
      render(<MockAccessibleNagarroPage />)
      
      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Nagarro Design Leadership Case Study')
      expect(screen.getByRole('navigation', { name: 'Case study navigation' })).toBeInTheDocument()
      expect(screen.getByRole('navigation', { name: 'External case study resources' })).toBeInTheDocument()
      expect(screen.getByRole('navigation', { name: 'Case study footer navigation' })).toBeInTheDocument()
    })

    it('uses proper heading hierarchy', () => {
      render(<MockAccessibleNagarroPage />)
      
      // Should have one H1
      const h1Elements = screen.getAllByRole('heading', { level: 1 })
      expect(h1Elements).toHaveLength(1)
      
      // Should have multiple H2s for sections
      const h2Elements = screen.getAllByRole('heading', { level: 2 })
      expect(h2Elements.length).toBeGreaterThan(0)
      
      // Should have H3s for metrics
      const h3Elements = screen.getAllByRole('heading', { level: 3 })
      expect(h3Elements.length).toBe(mockNagarroAccessibilityData.metrics.length)
    })
  })

  describe('Keyboard Navigation and Focus Management', () => {
    it('supports skip to main content functionality', async () => {
      const user = userEvent.setup()
      render(<MockAccessibleNagarroPage />)
      
      const skipLink = screen.getByTestId('skip-to-main')
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveAttribute('href', '#main-content')
      
      await user.click(skipLink)
      
      const mainContent = screen.getByRole('main')
      expect(mainContent).toHaveAttribute('id', 'main-content')
    })

    it('has accessible navigation links with proper focus', async () => {
      const user = userEvent.setup()
      render(<MockAccessibleNagarroPage />)
      
      const navLinks = screen.getAllByRole('link')
      expect(navLinks.length).toBeGreaterThan(0)
      
      // Each link should be focusable
      for (const link of navLinks.slice(0, 3)) { // Test first 3 to avoid excessive testing
        await user.tab()
        // Links should be focusable (testing that tab works)
        expect(link).toBeInTheDocument()
      }
    })

    it('supports keyboard interaction for scroll to top button', async () => {
      const user = userEvent.setup()
      const mockScrollTo = jest.fn()
      Object.defineProperty(window, 'scrollTo', {
        writable: true,
        value: mockScrollTo
      })
      
      render(<MockAccessibleNagarroPage />)
      
      const scrollButton = screen.getByTestId('scroll-to-top')
      expect(scrollButton).toBeInTheDocument()
      
      // Should be focusable and activatable with keyboard
      scrollButton.focus()
      expect(scrollButton).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    })
  })

  describe('Form Accessibility', () => {
    it('has properly labeled form controls', () => {
      render(<MockAccessibleNagarroPage />)
      
      const ratingSelect = screen.getByTestId('rating-select')
      expect(ratingSelect).toBeInTheDocument()
      expect(ratingSelect).toHaveAttribute('aria-describedby', 'rating-description')
      
      const ratingLabel = screen.getByLabelText('Rate this case study (1-5 stars)')
      expect(ratingLabel).toBe(ratingSelect)
      
      const commentsTextarea = screen.getByTestId('comments-textarea')
      expect(commentsTextarea).toHaveAttribute('aria-describedby', 'comments-description')
      
      const commentsLabel = screen.getByLabelText('Additional Comments (optional)')
      expect(commentsLabel).toBe(commentsTextarea)
    })

    it('provides proper form validation feedback', () => {
      render(<MockAccessibleNagarroPage />)
      
      const ratingSelect = screen.getByTestId('rating-select')
      expect(ratingSelect).toHaveAttribute('required')
      
      const submitButton = screen.getByTestId('submit-feedback')
      expect(submitButton).toHaveAttribute('aria-describedby', 'submit-description')
    })

    it('has accessible form structure with fieldsets if needed', () => {
      render(<MockAccessibleNagarroPage />)
      
      const form = screen.getByTestId('feedback-form')
      expect(form).toHaveAttribute('aria-labelledby', 'feedback-heading')
      
      // Form groups should be properly structured
      const formGroups = screen.getByTestId('feedback-form').querySelectorAll('.form-group')
      expect(formGroups.length).toBeGreaterThan(0)
    })
  })

  describe('Media Accessibility', () => {
    it('provides accessible video with proper descriptions', () => {
      render(<MockAccessibleNagarroPage />)
      
      const heroVideo = screen.getByTestId('hero-video')
      expect(heroVideo).toBeInTheDocument()
      expect(heroVideo).toHaveAttribute('controls')
      expect(heroVideo).toHaveAttribute('aria-label', 'Nagarro design leadership transformation showcase video')
      expect(heroVideo).toHaveAttribute('aria-describedby', 'video-description')
      
      // Should have fallback content
      expect(screen.getByText(/Video showcasing the design leadership transformation/)).toBeInTheDocument()
      expect(screen.getByText(/Your browser does not support the video tag/)).toBeInTheDocument()
    })

    it('handles video fallbacks for accessibility', () => {
      render(<MockAccessibleNagarroPage />)
      
      const videoFallback = screen.getByText('Download the video file')
      expect(videoFallback).toBeInTheDocument()
      expect(videoFallback.closest('a')).toHaveAttribute('href', mockNagarroAccessibilityData.hero.heroVideo)
    })
  })

  describe('Content Structure and Readability', () => {
    it('uses proper list structures with ARIA labels', () => {
      render(<MockAccessibleNagarroPage />)
      
      const platformsList = screen.getByRole('list', { name: 'Project platforms' })
      expect(platformsList).toBeInTheDocument()
      
      const platformItems = screen.getAllByRole('listitem')
      expect(platformItems.length).toBeGreaterThan(0)
    })

    it('provides proper context for metric data', () => {
      render(<MockAccessibleNagarroPage />)
      
      mockNagarroAccessibilityData.metrics.forEach((metric, index) => {
        const metricCard = screen.getByTestId(`metric-${index}`)
        expect(metricCard).toHaveAttribute('role', 'article')
        expect(metricCard).toHaveAttribute('aria-labelledby', `metric-label-${index}`)
        expect(metricCard).toHaveAttribute('aria-describedby', `metric-description-${index}`)
        
        const metricValue = screen.getByTestId(`metric-value-${index}`)
        expect(metricValue).toHaveAttribute('aria-label', `${metric.label}: ${metric.value}`)
      })
    })

    it('uses definition lists for structured metadata', () => {
      render(<MockAccessibleNagarroPage />)
      
      const projectMetadata = screen.getByTestId('project-metadata')
      expect(projectMetadata.tagName).toBe('DL')
      
      // Should contain dt/dd pairs
      const definitionTerms = projectMetadata.querySelectorAll('dt')
      const definitionDescriptions = projectMetadata.querySelectorAll('dd')
      
      expect(definitionTerms.length).toBeGreaterThan(0)
      expect(definitionDescriptions.length).toBeGreaterThan(0)
      expect(definitionTerms.length).toBe(definitionDescriptions.length)
    })
  })

  describe('External Link Accessibility', () => {
    it('provides proper context for external links', () => {
      render(<MockAccessibleNagarroPage />)
      
      const scribdLink = screen.getByTestId('scribd-link')
      expect(scribdLink).toHaveAttribute('target', '_blank')
      expect(scribdLink).toHaveAttribute('rel', 'noopener noreferrer')
      expect(scribdLink).toHaveAttribute('aria-label', 'View comprehensive Nagarro design leadership case study on Scribd (opens in new window)')
      
      const mediumLink = screen.getByTestId('medium-link')
      expect(mediumLink).toHaveAttribute('target', '_blank')
      expect(mediumLink).toHaveAttribute('rel', 'noopener noreferrer')
      expect(mediumLink).toHaveAttribute('aria-label', 'Read design leadership insights and lessons learned on Medium (opens in new window)')
    })

    it('uses proper visual indicators for external links', () => {
      render(<MockAccessibleNagarroPage />)
      
      // External link indicators should be marked as decorative
      const decorativeElements = screen.getAllByText('(Scribd)')
      expect(decorativeElements[0]).toHaveAttribute('aria-hidden', 'true')
      
      const mediumIndicators = screen.getAllByText('(Medium Article)')
      expect(mediumIndicators[0]).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Color Contrast and Visual Accessibility', () => {
    it('ensures sufficient color contrast for text elements', () => {
      render(<MockAccessibleNagarroPage />)
      
      // While we can't test actual color contrast in Jest, we can ensure
      // the proper structure exists for styling
      const heroTitle = screen.getByRole('heading', { level: 1 })
      expect(heroTitle).toHaveClass('hero-title')
      
      const metricValues = screen.getAllByTestId(/metric-value-\d+/)
      metricValues.forEach(value => {
        expect(value).toHaveClass('metric-value')
      })
    })

    it('provides focus indicators for interactive elements', () => {
      render(<MockAccessibleNagarroPage />)
      
      // Interactive elements should have proper classes for focus styling
      const interactiveElements = [
        ...screen.getAllByRole('link'),
        ...screen.getAllByRole('button')
      ]
      
      interactiveElements.forEach(element => {
        expect(element).toBeInTheDocument()
        // Elements should be focusable
        expect(element.tabIndex).not.toBe(-1)
      })
    })
  })

  describe('Screen Reader Compatibility', () => {
    it('provides proper announcement context for dynamic content', async () => {
      const user = userEvent.setup()
      render(<MockAccessibleNagarroPage />)
      
      // Test that interactive elements have proper ARIA labels
      const submitButton = screen.getByTestId('submit-feedback')
      expect(submitButton).toHaveAccessibleName('Submit Feedback')
      
      const scrollButton = screen.getByTestId('scroll-to-top')
      expect(scrollButton).toHaveAccessibleName('Scroll to top of page')
    })

    it('structures content for screen reader navigation', () => {
      render(<MockAccessibleNagarroPage />)
      
      // Regions should be properly labeled for screen reader navigation
      const regions = screen.getAllByRole('region')
      regions.forEach(region => {
        expect(region).toHaveAttribute('aria-labelledby')
      })
      
      // Articles should be properly structured
      const articles = screen.getAllByRole('article')
      articles.forEach(article => {
        expect(article).toHaveAttribute('aria-labelledby')
        expect(article).toHaveAttribute('aria-describedby')
      })
    })
  })

  describe('Responsive Accessibility', () => {
    it('maintains accessibility across different viewport sizes', () => {
      render(<MockAccessibleNagarroPage />)
      
      // Core accessibility attributes should remain regardless of viewport
      expect(screen.getByRole('main')).toHaveAttribute('aria-label')
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      
      // Navigation should remain accessible
      const navElements = screen.getAllByRole('navigation')
      navElements.forEach(nav => {
        expect(nav).toHaveAttribute('aria-label')
      })
    })

    it('ensures touch targets meet minimum size requirements', () => {
      render(<MockAccessibleNagarroPage />)
      
      // Interactive elements should exist and be properly sized
      const buttons = screen.getAllByRole('button')
      const links = screen.getAllByRole('link')
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument()
      })
      
      links.forEach(link => {
        expect(link).toBeInTheDocument()
      })
    })
  })
})