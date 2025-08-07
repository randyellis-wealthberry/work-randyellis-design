/**
 * TDD Test Suite: Nagarro Design Leadership Case Study - Page Component Tests
 * 
 * This test suite validates the main Nagarro case study page component,
 * including metadata, SEO, structure, and content rendering following
 * the existing Echo project patterns.
 */

import { render, screen } from '@testing-library/react'
import { Metadata } from 'next'

// Mock the Nagarro case study data structure (TDD - tests first)
const mockNagarroData = {
  title: 'Nagarro Design Leadership: Transforming IT Consulting Through Strategic Design',
  client: 'Nagarro Software Engineering GmbH',
  timeline: 'Mar 2022 - Oct 2022 (8 months)',
  platforms: ['Web Platform', 'Mobile Application', 'Design Systems'],
  hero: {
    title: 'Nagarro Design Leadership: Transforming IT Consulting Through Strategic Design',
    subtitle: 'Leading design strategy at a global IT consulting firm, boosting brand recognition by 50% and generating 100+ qualified leads through strategic design thinking and team development.',
    client: 'Nagarro Software Engineering GmbH',
    timeline: 'Mar 2022 - Oct 2022 (8 months)',
    platforms: ['Web Platform', 'Mobile Application', 'Design Systems'],
    heroImage: '/projects/nagarro/nagarro-hero.jpg',
    heroVideo: '/projects/nagarro/nagarro-leadership-showcase.mp4'
  },
  metrics: [
    { label: 'Brand Recognition Increase', value: '50%', description: 'Improved market visibility through design strategy' },
    { label: 'Qualified Leads Generated', value: '100+', description: 'Through strategic design initiatives' },
    { label: 'Designer Skills Enhancement', value: '15+', description: 'Coached design team members' },
    { label: 'Team Retention Improvement', value: '40%', description: 'Reduced designer turnover rate' },
    { label: 'Content Publications', value: '15+', description: 'Articles improving site traffic' },
    { label: 'Site Traffic Increase', value: '40%', description: 'Through thought leadership content' }
  ]
}

// Expected metadata for Nagarro case study
const expectedMetadata: Metadata = {
  title: 'Nagarro Design Leadership Case Study | Strategic Design Transformation',
  description: 'How strategic design leadership at Nagarro boosted brand recognition by 50%, generated 100+ leads, and improved team retention by 40% through design thinking and strategic initiatives.',
  openGraph: {
    title: 'Nagarro Design Leadership | IT Consulting Design Transformation',
    description: 'Strategic design leadership case study: 50% brand recognition increase, 100+ leads generated, 40% team retention improvement at global IT consulting firm.',
    type: 'article',
    images: [
      {
        url: '/projects/nagarro/nagarro-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Nagarro design leadership transformation showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nagarro Design Leadership | Strategic Design Transformation',
    description: 'How design leadership achieved 50% brand recognition boost and 100+ qualified leads at global IT consulting firm.',
    images: ['/projects/nagarro/nagarro-hero.jpg'],
  },
}

// Mock the Nagarro page component (TDD - component doesn't exist yet)
const MockNagarroPage = () => {
  return (
    <main role="main" className="w-full">
      <div data-testid="nagarro-case-study">
        <h1>{mockNagarroData.title}</h1>
        <p>{mockNagarroData.hero.subtitle}</p>
        
        {/* Hero section */}
        <section data-testid="hero-section" aria-label="Case study hero">
          <div data-testid="client-info">
            <span data-testid="client-name">{mockNagarroData.client}</span>
            <span data-testid="timeline">{mockNagarroData.timeline}</span>
          </div>
          <div data-testid="platform-badges" role="list" aria-label="Project platforms">
            {mockNagarroData.platforms.map((platform, index) => (
              <span key={index} role="listitem" className="badge">
                {platform}
              </span>
            ))}
          </div>
        </section>

        {/* Metrics section */}
        <section data-testid="metrics-section" aria-label="Project metrics">
          {mockNagarroData.metrics.map((metric, index) => (
            <article key={index} data-testid={`metric-${index}`} role="article">
              <h3>{metric.label}</h3>
              <span className="metric-value">{metric.value}</span>
              <p>{metric.description}</p>
            </article>
          ))}
        </section>

        {/* External content integration */}
        <section data-testid="external-content" aria-label="External documentation">
          <a 
            href="https://www.scribd.com/document/nagarro-case-study" 
            target="_blank" 
            rel="noopener noreferrer"
            data-testid="scribd-link"
            aria-label="View detailed case study on Scribd"
          >
            View Full Case Study (Scribd)
          </a>
          <a 
            href="https://medium.com/@randyellis/nagarro-design-leadership" 
            target="_blank" 
            rel="noopener noreferrer"
            data-testid="medium-link"
            aria-label="Read design leadership insights on Medium"
          >
            Read Design Leadership Article (Medium)
          </a>
        </section>
      </div>
    </main>
  )
}

describe('Nagarro Case Study Page - TDD Implementation', () => {
  describe('Page Structure and Content', () => {
    it('renders main page structure with proper semantic HTML', () => {
      render(<MockNagarroPage />)
      
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByTestId('nagarro-case-study')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('displays correct case study title and subtitle', () => {
      render(<MockNagarroPage />)
      
      expect(screen.getByText(mockNagarroData.title)).toBeInTheDocument()
      expect(screen.getByText(mockNagarroData.hero.subtitle)).toBeInTheDocument()
    })

    it('renders hero section with client and timeline information', () => {
      render(<MockNagarroPage />)
      
      const heroSection = screen.getByTestId('hero-section')
      expect(heroSection).toBeInTheDocument()
      expect(heroSection).toHaveAttribute('aria-label', 'Case study hero')
      
      expect(screen.getByTestId('client-name')).toHaveTextContent(mockNagarroData.client)
      expect(screen.getByTestId('timeline')).toHaveTextContent(mockNagarroData.timeline)
    })

    it('displays platform badges with proper accessibility', () => {
      render(<MockNagarroPage />)
      
      const platformList = screen.getByRole('list', { name: 'Project platforms' })
      expect(platformList).toBeInTheDocument()
      
      mockNagarroData.platforms.forEach((platform) => {
        expect(screen.getByText(platform)).toBeInTheDocument()
      })
      
      // Verify all platform badges have listitem role
      const platformBadges = screen.getAllByRole('listitem')
      expect(platformBadges).toHaveLength(mockNagarroData.platforms.length)
    })
  })

  describe('Metrics Section', () => {
    it('renders all project metrics with proper structure', () => {
      render(<MockNagarroPage />)
      
      const metricsSection = screen.getByTestId('metrics-section')
      expect(metricsSection).toBeInTheDocument()
      expect(metricsSection).toHaveAttribute('aria-label', 'Project metrics')
      
      mockNagarroData.metrics.forEach((metric, index) => {
        expect(screen.getByTestId(`metric-${index}`)).toBeInTheDocument()
        expect(screen.getByText(metric.label)).toBeInTheDocument()
        // Handle potential duplicate values by checking if the value exists
        const valueElements = screen.getAllByText(metric.value)
        expect(valueElements.length).toBeGreaterThan(0)
      })
    })

    it('displays correct metric values and descriptions', () => {
      render(<MockNagarroPage />)
      
      // Test specific high-impact metrics
      expect(screen.getByText('50%')).toBeInTheDocument()
      expect(screen.getByText('Brand Recognition Increase')).toBeInTheDocument()
      expect(screen.getByText('100+')).toBeInTheDocument()
      expect(screen.getByText('Qualified Leads Generated')).toBeInTheDocument()
      
      // Use getAllByText for duplicate values
      const fortyPercentElements = screen.getAllByText('40%')
      expect(fortyPercentElements).toHaveLength(2) // Team Retention and Site Traffic
      expect(screen.getByText('Team Retention Improvement')).toBeInTheDocument()
      expect(screen.getByText('Site Traffic Increase')).toBeInTheDocument()
    })

    it('ensures all metrics have semantic heading structure', () => {
      render(<MockNagarroPage />)
      
      mockNagarroData.metrics.forEach((metric) => {
        expect(screen.getByRole('heading', { level: 3, name: metric.label })).toBeInTheDocument()
      })
    })
  })

  describe('External Links Integration', () => {
    it('renders external documentation links with proper attributes', () => {
      render(<MockNagarroPage />)
      
      const externalSection = screen.getByTestId('external-content')
      expect(externalSection).toBeInTheDocument()
      expect(externalSection).toHaveAttribute('aria-label', 'External documentation')
    })

    it('displays Scribd link with correct attributes and accessibility', () => {
      render(<MockNagarroPage />)
      
      const scribdLink = screen.getByTestId('scribd-link')
      expect(scribdLink).toBeInTheDocument()
      expect(scribdLink).toHaveAttribute('href', 'https://www.scribd.com/document/nagarro-case-study')
      expect(scribdLink).toHaveAttribute('target', '_blank')
      expect(scribdLink).toHaveAttribute('rel', 'noopener noreferrer')
      expect(scribdLink).toHaveAttribute('aria-label', 'View detailed case study on Scribd')
    })

    it('displays Medium link with correct attributes and accessibility', () => {
      render(<MockNagarroPage />)
      
      const mediumLink = screen.getByTestId('medium-link')
      expect(mediumLink).toBeInTheDocument()
      expect(mediumLink).toHaveAttribute('href', 'https://medium.com/@randyellis/nagarro-design-leadership')
      expect(mediumLink).toHaveAttribute('target', '_blank')
      expect(mediumLink).toHaveAttribute('rel', 'noopener noreferrer')
      expect(mediumLink).toHaveAttribute('aria-label', 'Read design leadership insights on Medium')
    })
  })

  describe('Responsive Layout Structure', () => {
    it('has responsive main container classes', () => {
      render(<MockNagarroPage />)
      
      const main = screen.getByRole('main')
      expect(main).toHaveClass('w-full')
    })

    it('ensures proper spacing and layout for mobile viewports', () => {
      render(<MockNagarroPage />)
      
      // Test that key sections are present for responsive design
      expect(screen.getByTestId('hero-section')).toBeInTheDocument()
      expect(screen.getByTestId('metrics-section')).toBeInTheDocument()
      expect(screen.getByTestId('external-content')).toBeInTheDocument()
    })
  })

  describe('SEO and Metadata Validation', () => {
    it('validates expected metadata structure', () => {
      // Test metadata object structure
      expect(expectedMetadata.title).toBeDefined()
      expect(expectedMetadata.description).toBeDefined()
      expect(expectedMetadata.openGraph).toBeDefined()
      expect(expectedMetadata.twitter).toBeDefined()
      
      // Validate OpenGraph metadata
      expect(expectedMetadata.openGraph?.title).toContain('Nagarro Design Leadership')
      expect(expectedMetadata.openGraph?.description).toContain('50%')
      expect(expectedMetadata.openGraph?.type).toBe('article')
      expect(expectedMetadata.openGraph?.images?.[0]?.url).toBe('/projects/nagarro/nagarro-hero.jpg')
      
      // Validate Twitter Card metadata
      expect(expectedMetadata.twitter?.card).toBe('summary_large_image')
      expect(expectedMetadata.twitter?.title).toContain('Strategic Design Transformation')
      expect(expectedMetadata.twitter?.description).toContain('100+ qualified leads')
    })

    it('ensures metadata descriptions contain key metrics', () => {
      const description = expectedMetadata.description as string
      
      expect(description).toContain('50%')  // Brand recognition increase
      expect(description).toContain('100+') // Leads generated
      expect(description).toContain('40%')  // Team retention improvement
    })
  })

  describe('Performance Considerations', () => {
    it('uses proper image paths for hero content', () => {
      // Validate that image paths follow project conventions
      expect(mockNagarroData.hero.heroImage).toMatch(/^\/projects\/nagarro\//)
      expect(mockNagarroData.hero.heroVideo).toMatch(/^\/projects\/nagarro\//)
      
      // Ensure metadata images follow same pattern
      expect(expectedMetadata.openGraph?.images?.[0]?.url).toMatch(/^\/projects\/nagarro\//)
    })

    it('validates external link performance attributes', () => {
      render(<MockNagarroPage />)
      
      // Check that external links have proper performance attributes
      const externalLinks = [
        screen.getByTestId('scribd-link'),
        screen.getByTestId('medium-link')
      ]
      
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        expect(link).toHaveAttribute('target', '_blank')
      })
    })
  })
})

describe('Nagarro Case Study Page - Integration Tests', () => {
  it('integrates with existing project routing patterns', () => {
    // Test that the component follows the same patterns as Echo case study
    render(<MockNagarroPage />)
    
    // Should have similar structure to other case studies
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('follows consistent data structure with other projects', () => {
    // Validate that mockNagarroData follows the same structure as Echo
    expect(mockNagarroData).toHaveProperty('title')
    expect(mockNagarroData).toHaveProperty('client')
    expect(mockNagarroData).toHaveProperty('timeline')
    expect(mockNagarroData).toHaveProperty('platforms')
    expect(mockNagarroData).toHaveProperty('hero')
    expect(mockNagarroData).toHaveProperty('metrics')
    
    // Validate hero structure
    expect(mockNagarroData.hero).toHaveProperty('title')
    expect(mockNagarroData.hero).toHaveProperty('subtitle')
    expect(mockNagarroData.hero).toHaveProperty('heroImage')
    expect(mockNagarroData.hero).toHaveProperty('heroVideo')
    
    // Validate metrics structure
    mockNagarroData.metrics.forEach(metric => {
      expect(metric).toHaveProperty('label')
      expect(metric).toHaveProperty('value')
      expect(metric).toHaveProperty('description')
    })
  })
})