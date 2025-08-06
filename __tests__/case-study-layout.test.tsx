import { render, screen } from '@testing-library/react'
import { CaseStudyLayout } from '@/components/case-study/case-study-layout'
import { CaseStudyHero } from '@/components/case-study/case-study-hero'
import { CaseStudySection } from '@/components/case-study/case-study-section'
import { MetricsCard } from '@/components/case-study/metrics-card'
import { ImageGallery } from '@/components/case-study/image-gallery'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

const mockCaseStudyData = {
  title: 'EchoDrive: Streamlining Logistics Through Digital Innovation',
  client: 'Echo Global Logistics, Inc.',
  partner: 'Eight Bit Studios',
  timeline: 'Alpha → Beta → Launch',
  platforms: ['iOS', 'Android', 'Web Application'],
  hero: {
    title: 'EchoDrive: Streamlining Logistics Through Digital Innovation',
    subtitle: 'Transforming traditional logistics operations through strategic digital innovation, user-centered design, and comprehensive development execution.',
    client: 'Echo Global Logistics, Inc.',
    partner: 'Eight Bit Studios',
    timeline: 'Alpha → Beta → Launch',
    platforms: ['iOS', 'Android', 'Web Application'],
    heroImage: '/projects/echo/showcase1.jpg',
    heroVideo: '/projects/echo/echodrive-mockup-video.mp4'
  },
  metrics: [
    { label: 'Revenue Increase', value: '16%', description: 'LTL shipment revenues to $184.4M' },
    { label: 'Volume Growth', value: '12%', description: 'Through self-serve booking' },
    { label: 'Beta Downloads', value: '1,000', description: 'During testing phase' },
    { label: 'Active Users', value: '10,000+', description: 'Post-launch drivers' }
  ]
}

describe('CaseStudyLayout', () => {
  it('renders case study layout with proper structure', () => {
    render(<CaseStudyLayout data={mockCaseStudyData} />)
    
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText('EchoDrive: Streamlining Logistics Through Digital Innovation')).toBeInTheDocument()
  })

  it.skip('has no accessibility violations', async () => {
    const { container } = render(<CaseStudyLayout data={mockCaseStudyData} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  }, 10000)

  it('renders responsive layout correctly', () => {
    render(<CaseStudyLayout data={mockCaseStudyData} />)
    
    const main = screen.getByRole('main')
    expect(main).toHaveClass('w-full')
  })
})

describe('CaseStudyHero', () => {
  it('renders hero section with title and metadata', () => {
    render(<CaseStudyHero {...mockCaseStudyData.hero} />)
    
    expect(screen.getByText('EchoDrive: Streamlining Logistics Through Digital Innovation')).toBeInTheDocument()
    expect(screen.getByText('Echo Global Logistics, Inc.')).toBeInTheDocument()
    expect(screen.getByText('Eight Bit Studios')).toBeInTheDocument()
    expect(screen.getByText('Alpha → Beta → Launch')).toBeInTheDocument()
  })

  it('renders platform badges', () => {
    render(<CaseStudyHero {...mockCaseStudyData.hero} />)
    
    expect(screen.getByText('iOS')).toBeInTheDocument()
    expect(screen.getByText('Android')).toBeInTheDocument()
    expect(screen.getByText('Web Application')).toBeInTheDocument()
  })

  it('has proper heading hierarchy', () => {
    render(<CaseStudyHero {...mockCaseStudyData.hero} />)
    
    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toBeInTheDocument()
  })
})

describe('CaseStudySection', () => {
  it('renders section with title and content', () => {
    render(
      <CaseStudySection title="Test Section" id="test-section">
        <p>Test content</p>
      </CaseStudySection>
    )
    
    expect(screen.getByText('Test Section')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('has proper section structure', () => {
    render(
      <CaseStudySection title="Test Section" id="test-section">
        <p>Test content</p>
      </CaseStudySection>
    )
    
    const section = screen.getByRole('region')
    expect(section).toHaveAttribute('id', 'test-section')
  })
})

describe('MetricsCard', () => {
  it('renders metric card with value and description', () => {
    const metric = { label: 'Revenue Increase', value: '16%', description: 'LTL shipment revenues' }
    render(<MetricsCard metric={metric} />)
    
    expect(screen.getByText('Revenue Increase')).toBeInTheDocument()
    expect(screen.getByText('16%')).toBeInTheDocument()
    expect(screen.getByText('LTL shipment revenues')).toBeInTheDocument()
  })

  it('has proper card structure', () => {
    const metric = { label: 'Revenue Increase', value: '16%', description: 'LTL shipment revenues' }
    render(<MetricsCard metric={metric} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})

describe('ImageGallery', () => {
  const images = [
    { src: '/projects/echo/research1.jpg', alt: 'Research phase 1', caption: 'Field research' },
    { src: '/projects/echo/research2.jpg', alt: 'Research phase 2', caption: 'User interviews' }
  ]

  it('renders image gallery with proper images', () => {
    render(<ImageGallery images={images} />)
    
    expect(screen.getByAltText('Research phase 1')).toBeInTheDocument()
    expect(screen.getByAltText('Research phase 2')).toBeInTheDocument()
  })

  it('renders image captions', () => {
    render(<ImageGallery images={images} />)
    
    expect(screen.getByText('Field research')).toBeInTheDocument()
    expect(screen.getByText('User interviews')).toBeInTheDocument()
  })

  it('has proper responsive grid layout', () => {
    const { container } = render(<ImageGallery images={images} />)
    
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-1')
    expect(grid).toHaveClass('md:grid-cols-2')
  })
})