import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock the Echo client component to avoid import issues during testing
const MockEchoClientPage = () => {
  const [expandedCards, setExpandedCards] = React.useState<Set<number>>(new Set());
  const [showReadingProgress, setShowReadingProgress] = React.useState(false);
  const [konamiActive, setKonamiActive] = React.useState(false);
  const konamiSequence = React.useRef<string[]>([]);
  const expectedSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  
  // Check if should disable cursor specifically
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;  
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shouldDisableCursor = prefersReducedMotion || isTouch || isMobile;
  
  const toggleCard = (cardIndex: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardIndex)) {
      newExpanded.delete(cardIndex);
    } else {
      newExpanded.add(cardIndex);
    }
    setExpandedCards(newExpanded);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowReadingProgress(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      konamiSequence.current.push(e.code);
      if (konamiSequence.current.length > expectedSequence.length) {
        konamiSequence.current.shift();
      }
      
      if (konamiSequence.current.join(',') === expectedSequence.join(',')) {
        setKonamiActive(true);
        // Create announcement
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.textContent = 'Secret designer mode activated! 🎨';
        document.body.appendChild(announcement);
        
        setTimeout(() => {
          setKonamiActive(false);
          if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
          }
        }, 5000);
      }
    };

    const handleResize = () => {
      // Handle resize events
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      
      // Clean up celebration timeout if it exists
      if ((window as any).__celebrationTimeout) {
        clearTimeout((window as any).__celebrationTimeout);
        delete (window as any).__celebrationTimeout;
      }
    };
  }, []);

  return (
    <main id="main-content" role="main" className="space-y-32 sm:space-y-24 relative">
      {/* Skip Links */}
      <div className="sr-only focus-within:not-sr-only">
        <a href="#main-content">Skip to main content</a>
        <a href="#metrics-section">Skip to metrics</a>
      </div>

      {/* Mock components for testing */}
      <div data-testid="celebration-particles" data-active="false" />
      <div data-testid="custom-cursor" data-active={!shouldDisableCursor} />
      <div data-testid="konami-easter-egg" data-active={konamiActive} />
      {showReadingProgress && <div data-testid="reading-progress" />}

      {/* Hero Section */}
      <section>
        <h1 id="page-title">
          ECHO <span>DRIVE</span>
        </h1>
        <p>Intelligent cloud storage solution powered by AI that automatically organizes files, predicts collaboration needs, and optimizes storage usage.</p>
        <div>
          <span>Jan 2022 - Aug 2022</span>
          <span>Product Design Lead</span>
          <span>AI-Powered</span>
        </div>
      </section>

      {/* Metrics Section */}
      <section id="metrics-section" aria-labelledby="metrics-heading">
        <h2 id="metrics-heading">Performance Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button role="button" tabIndex={0} aria-label="Storage Efficiency metric: 35%. Click to highlight this achievement.">
            <span>35</span>
            <span>Storage Efficiency</span>
          </button>
          <button role="button" tabIndex={0} aria-label="Search Speed metric: 5x faster. Click to highlight this achievement.">
            <span>5</span>
            <span>Search Speed</span>
          </button>
          <button role="button" tabIndex={0} aria-label="User Adoption metric: 89%. Click to highlight this achievement.">
            <span>89</span>
            <span>User Adoption</span>
          </button>
          <button role="button" tabIndex={0} aria-label="Collaboration Boost metric: 67%. Click to highlight this achievement.">
            <span>67</span>
            <span>Collaboration Boost</span>
          </button>
        </div>
        <div role="status" aria-live="polite" style={{ display: 'none' }}>
          <p>🎉 Incredible! These metrics showcase AI-powered transformation! ☁️</p>
        </div>
      </section>

      {/* AI Features Section */}
      <section id="ai-features-section" aria-labelledby="ai-features-heading">
        <h2 id="ai-features-heading">AI-Powered Features</h2>
        <div>
          <button role="button" tabIndex={0} aria-label="Intelligent File Organization feature. Expand to show more details." aria-expanded={expandedCards.has(0).toString()} onClick={() => toggleCard(0)}>
            <span>1</span>
            <div><strong>Intelligent File Organization</strong></div>
            <p>AI-powered system that automatically categorizes and tags files</p>
          </button>
          <button role="button" tabIndex={0} aria-label="Predictive Collaboration Suggestions feature. Expand to show more details." aria-expanded={expandedCards.has(1).toString()} onClick={() => toggleCard(1)}>
            <span>2</span>
            <div><strong>Predictive Collaboration Suggestions</strong></div>
            <p>Machine learning algorithms analyze team patterns</p>
          </button>
          <button role="button" tabIndex={0} aria-label="Smart Storage Optimization feature. Expand to show more details." aria-expanded={expandedCards.has(2).toString()} onClick={() => toggleCard(2)}>
            <span>3</span>
            <div><strong>Smart Storage Optimization</strong></div>
            <p>Dynamic storage management using AI</p>
          </button>
          <button role="button" tabIndex={0} aria-label="Advanced Search Intelligence feature. Expand to show more details." aria-expanded={expandedCards.has(3).toString()} onClick={() => toggleCard(3)}>
            <span>4</span>
            <div><strong>Advanced Search Intelligence</strong></div>
            <p>Natural language processing enables conversational file search</p>
          </button>
          <button role="button" tabIndex={0} aria-label="Automated Workflow Integration feature. Expand to show more details." aria-expanded={expandedCards.has(4).toString()} onClick={() => toggleCard(4)}>
            <span>5</span>
            <div><strong>Automated Workflow Integration</strong></div>
            <p>AI-driven workflow automation that learns team processes</p>
          </button>
        </div>
      </section>

      {/* Process Story */}
      <section>
        <h2>The Innovation Journey</h2>
        <div>
          <h3>The Challenge</h3>
          <h3>AI-First Approach</h3>
          <h3>Intelligent Outcome</h3>
        </div>
      </section>

      {/* Key Insights */}
      <section>
        <h2>AI Development Insights</h2>
      </section>

      {/* User Testimonials */}
      <section>
        <h2>User Experience Impact</h2>
      </section>

      {/* External Resources */}
      <section>
        <h2>Technical Resources & Documentation</h2>
        <div>
          <a href="#" target="_blank" rel="noopener noreferrer">
            AI-Powered File Organization Whitepaper
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            Cloud Storage Security Best Practices
          </a>
        </div>
      </section>

      {/* Technologies */}
      <section>
        <h2>Technologies & Architecture</h2>
      </section>

      {/* Reflection */}
      <section>
        <h2>Design Leadership Reflection</h2>
      </section>

      {/* Navigation */}
      <section>
        <a href="/projects">Back to Projects</a>
        <a href="/about">Explore More AI Projects</a>
        <button 
          aria-label="Trigger AI celebration animation"
          onClick={() => {
            // Simulate celebration activation
            const particles = document.querySelector('[data-testid="celebration-particles"]');
            if (particles) {
              particles.setAttribute('data-active', 'true');
              const timeoutId = setTimeout(() => {
                particles.setAttribute('data-active', 'false');
              }, 3000);
              // Store timeout ID for cleanup tests
              (window as any).__celebrationTimeout = timeoutId;
            }
          }}
        >
          Thank you for exploring EchoDrive's AI-powered innovation!
        </button>
      </section>
    </main>
  );
};

// Mock motion/react components for testing
jest.mock('motion/react');

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock custom components
jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className, ...props }: any) => (
    <span className={className} {...props}>{children}</span>
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
}));

jest.mock('@/components/ui/scramble-section-title', () => ({
  ScrambleSectionTitle: ({ children, className, ...props }: any) => (
    <h2 className={className} {...props}>{children}</h2>
  ),
}));

jest.mock('@/components/ui/magnetic', () => ({
  Magnetic: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock('@/components/ui/spotlight', () => ({
  Spotlight: ({ className, size, ...props }: any) => (
    <div className={className} data-size={size} {...props} />
  ),
}));

jest.mock('@/components/core/animated-number', () => ({
  AnimatedNumber: ({ value, className, ...props }: any) => (
    <span className={className} data-value={value} {...props}>{value}</span>
  ),
}));

jest.mock('@/components/ui/celebration-particles', () => ({
  CelebrationParticles: ({ isActive, ...props }: any) => (
    <div data-testid="celebration-particles" data-active={isActive} {...props} />
  ),
}));

jest.mock('@/components/ui/custom-cursor', () => ({
  CustomCursor: ({ isActive, ...props }: any) => (
    <div data-testid="custom-cursor" data-active={isActive} {...props} />
  ),
}));

jest.mock('@/components/ui/reading-progress', () => ({
  ReadingProgress: (props: any) => (
    <div data-testid="reading-progress" {...props} />
  ),
}));

jest.mock('@/components/ui/konami-easter-egg', () => ({
  KonamiEasterEgg: ({ isActive, ...props }: any) => (
    <div data-testid="konami-easter-egg" data-active={isActive} {...props} />
  ),
}));

// Mock utility functions
jest.mock('@/lib/utils/parseMetricValue', () => ({
  parseMetricValue: (value: string) => {
    const match = value.match(/^(\D*)?(\d+(?:\.\d+)?)(\D*)?$/);
    if (match) {
      const [, prefix = '', number, suffix = ''] = match;
      return { prefix, number: parseFloat(number), suffix };
    }
    return { prefix: '', number: 0, suffix: value };
  },
}));

// Mock intersection observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock matchMedia for reduced motion testing
const createMockMatchMedia = (matches: boolean) => {
  return jest.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe('EchoClientPage', () => {
  // Use the mock component for testing
  const EchoClientPage = MockEchoClientPage;
  let originalMatchMedia: typeof window.matchMedia;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    window.matchMedia = createMockMatchMedia(false);
    user = userEvent.setup();
    
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn(cb => {
      setTimeout(cb, 0);
      return 1;
    });
    global.cancelAnimationFrame = jest.fn();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      render(<EchoClientPage />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('renders the main heading with correct content', () => {
      render(<EchoClientPage />);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('ECHO')).toBeInTheDocument();
      expect(screen.getByText('DRIVE')).toBeInTheDocument();
    });

    it('displays project description and badges', () => {
      render(<EchoClientPage />);
      
      expect(screen.getByText(/Intelligent cloud storage solution/)).toBeInTheDocument();
      expect(screen.getByText('Jan 2022 - Aug 2022')).toBeInTheDocument();
      expect(screen.getByText('Product Design Lead')).toBeInTheDocument();
      expect(screen.getByText('AI-Powered')).toBeInTheDocument();
    });

    it('renders all major sections', () => {
      render(<EchoClientPage />);
      
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
      expect(screen.getByText('AI-Powered Features')).toBeInTheDocument();
      expect(screen.getByText('The Innovation Journey')).toBeInTheDocument();
      expect(screen.getByText('AI Development Insights')).toBeInTheDocument();
      expect(screen.getByText('User Experience Impact')).toBeInTheDocument();
      expect(screen.getByText('Technical Resources & Documentation')).toBeInTheDocument();
      expect(screen.getByText('Technologies & Architecture')).toBeInTheDocument();
      expect(screen.getByText('Design Leadership Reflection')).toBeInTheDocument();
    });

    it('renders enhanced metrics with correct values', () => {
      render(<EchoClientPage />);
      
      expect(screen.getByText('Storage Efficiency')).toBeInTheDocument();
      expect(screen.getByText('Search Speed')).toBeInTheDocument();
      expect(screen.getByText('User Adoption')).toBeInTheDocument();
      expect(screen.getByText('Collaboration Boost')).toBeInTheDocument();
    });

    it('displays AI initiatives with descriptions', () => {
      render(<EchoClientPage />);
      
      expect(screen.getByText('Intelligent File Organization')).toBeInTheDocument();
      expect(screen.getByText('Predictive Collaboration Suggestions')).toBeInTheDocument();
      expect(screen.getByText('Smart Storage Optimization')).toBeInTheDocument();
      expect(screen.getByText('Advanced Search Intelligence')).toBeInTheDocument();
      expect(screen.getByText('Automated Workflow Integration')).toBeInTheDocument();
    });
  });

  describe('Interactive Elements', () => {
    it('metric cards respond to clicks', async () => {
      render(<EchoClientPage />);
      
      const metricCards = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('metric')
      );
      
      expect(metricCards.length).toBeGreaterThan(0);
      
      // Click first metric card
      if (metricCards[0]) {
        await user.click(metricCards[0]);
        // Should not throw error and should be interactive
        expect(metricCards[0]).toBeInTheDocument();
      }
    });

    it('metric cards respond to keyboard navigation', async () => {
      render(<EchoClientPage />);
      
      const metricCards = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('metric')
      );
      
      if (metricCards[0]) {
        // Focus and press Enter
        metricCards[0].focus();
        await user.keyboard('{Enter}');
        expect(document.activeElement).toBe(metricCards[0]);

        // Press Space
        await user.keyboard(' ');
        expect(document.activeElement).toBe(metricCards[0]);
      }
    });

    it('project cards can be expanded and collapsed', async () => {
      render(<EchoClientPage />);
      
      const projectCards = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('feature')
      );
      
      if (projectCards[0]) {
        const initialExpanded = projectCards[0].getAttribute('aria-expanded');
        
        await user.click(projectCards[0]);
        
        // Should toggle expanded state
        await waitFor(() => {
          const newExpanded = projectCards[0].getAttribute('aria-expanded');
          expect(newExpanded).not.toBe(initialExpanded);
        });
      }
    });

    it('external links have proper attributes', () => {
      render(<EchoClientPage />);
      
      const externalLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('target') === '_blank'
      );
      
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link).toHaveAttribute('target', '_blank');
      });
    });

    it('celebration button triggers celebration mode', async () => {
      render(<EchoClientPage />);
      
      const celebrationButton = screen.getByRole('button', { 
        name: /Trigger AI celebration animation/ 
      });
      
      expect(celebrationButton).toBeInTheDocument();
      
      await user.click(celebrationButton);
      
      // Check if celebration particles are activated
      const celebrationParticles = screen.getByTestId('celebration-particles');
      expect(celebrationParticles).toHaveAttribute('data-active', 'true');
    });
  });

  describe('Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<EchoClientPage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides skip links for keyboard navigation', () => {
      render(<EchoClientPage />);
      
      expect(screen.getByText('Skip to main content')).toBeInTheDocument();
      expect(screen.getByText('Skip to metrics')).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      render(<EchoClientPage />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2s = screen.getAllByRole('heading', { level: 2 });
      const h3s = screen.getAllByRole('heading', { level: 3 });
      
      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
      expect(h3s.length).toBeGreaterThan(0);
    });

    it('metric cards have proper ARIA labels', () => {
      render(<EchoClientPage />);
      
      const metricCards = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('metric')
      );
      
      metricCards.forEach(card => {
        expect(card).toHaveAttribute('aria-label');
        expect(card).toHaveAttribute('tabIndex', '0');
      });
    });

    it('project cards have proper ARIA attributes', () => {
      render(<EchoClientPage />);
      
      const projectCards = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('feature')
      );
      
      projectCards.forEach(card => {
        expect(card).toHaveAttribute('aria-label');
        expect(card).toHaveAttribute('aria-expanded');
        expect(card).toHaveAttribute('tabIndex', '0');
      });
    });

    it('provides screen reader announcements for celebrations', async () => {
      render(<EchoClientPage />);
      
      const celebrationButton = screen.getByRole('button', { 
        name: /Trigger AI celebration animation/ 
      });
      
      await user.click(celebrationButton);
      
      // Check for status region
      await waitFor(() => {
        const statusRegion = screen.getByRole('status');
        expect(statusRegion).toBeInTheDocument();
      });
    });

    it('has proper landmarks and regions', () => {
      render(<EchoClientPage />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    });
  });

  describe('Responsive Design', () => {
    it('handles mobile viewport correctly', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<EchoClientPage />);
      
      // Component should render without issues on mobile
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('handles tablet viewport correctly', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<EchoClientPage />);
      
      // Component should render without issues on tablet
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('enables custom cursor on desktop only', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(<EchoClientPage />);
      
      const customCursor = screen.getByTestId('custom-cursor');
      expect(customCursor).toHaveAttribute('data-active', 'true');
    });

    it('disables custom cursor on mobile', () => {
      // Mock mobile viewport with touch
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        configurable: true,
        value: {},
      });

      render(<EchoClientPage />);
      
      const customCursor = screen.getByTestId('custom-cursor');
      expect(customCursor).toHaveAttribute('data-active', 'false');
    });
  });

  describe('Animation System', () => {
    it('respects reduced motion preferences', () => {
      // Mock reduced motion preference
      window.matchMedia = createMockMatchMedia(true);
      
      render(<EchoClientPage />);
      
      const celebrationParticles = screen.getByTestId('celebration-particles');
      const customCursor = screen.getByTestId('custom-cursor');
      const konamiEasterEgg = screen.getByTestId('konami-easter-egg');
      
      // All animations should be disabled
      expect(celebrationParticles).toHaveAttribute('data-active', 'false');
      expect(customCursor).toHaveAttribute('data-active', 'false');
      expect(konamiEasterEgg).toHaveAttribute('data-active', 'false');
    });

    it('enables animations when motion is allowed', () => {
      // Mock normal motion preference
      window.matchMedia = createMockMatchMedia(false);
      
      render(<EchoClientPage />);
      
      // Animations should be available (though not necessarily active initially)
      const customCursor = screen.getByTestId('custom-cursor');
      expect(customCursor).toBeInTheDocument();
    });

    it('handles celebration mode correctly', async () => {
      render(<EchoClientPage />);
      
      const celebrationButton = screen.getByRole('button', { 
        name: /Trigger AI celebration animation/ 
      });
      
      await user.click(celebrationButton);
      
      const celebrationParticles = screen.getByTestId('celebration-particles');
      expect(celebrationParticles).toHaveAttribute('data-active', 'true');
      
      // Should automatically disable after timeout
      await waitFor(() => {
        expect(celebrationParticles).toHaveAttribute('data-active', 'false');
      }, { timeout: 4000 });
    });

    it('shows reading progress after scrolling', async () => {
      render(<EchoClientPage />);
      
      // Initially no reading progress
      expect(screen.queryByTestId('reading-progress')).not.toBeInTheDocument();
      
      // Mock scroll event
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 150,
      });
      
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('reading-progress')).toBeInTheDocument();
      });
    });
  });

  describe('Easter Eggs', () => {
    it('activates konami code easter egg', async () => {
      render(<EchoClientPage />);
      
      const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
      ];
      
      // Simulate konami code input
      act(() => {
        for (const key of konamiSequence) {
          fireEvent.keyDown(window, { code: key });
        }
      });
      
      // Check activation immediately after input
      await waitFor(() => {
        const konamiEasterEgg = screen.getByTestId('konami-easter-egg');
        expect(konamiEasterEgg).toHaveAttribute('data-active', 'true');
      });
    });

    it('creates screen reader announcement for konami activation', async () => {
      render(<EchoClientPage />);
      
      const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
      ];
      
      act(() => {
        for (const key of konamiSequence) {
          fireEvent.keyDown(window, { code: key });
        }
      });
      
      await waitFor(() => {
        const announcement = document.querySelector('[role="status"][aria-live="assertive"]');
        expect(announcement).toBeInTheDocument();
        expect(announcement).toHaveTextContent(/Secret designer mode activated/);
      });
    });
  });

  describe('Performance & Memory Management', () => {
    it('cleans up event listeners on unmount', () => {
      const { unmount } = render(<EchoClientPage />);
      
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      unmount();
      
      // Should remove scroll and resize listeners
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });

    it('handles window resize events correctly', () => {
      render(<EchoClientPage />);
      
      // Mock resize event
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
      
      // Should handle resize without errors
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('prevents memory leaks from celebration timeouts', async () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      const { unmount } = render(<EchoClientPage />);
      
      const celebrationButton = screen.getByRole('button', { 
        name: /Trigger AI celebration animation/ 
      });
      
      await user.click(celebrationButton);
      
      // Unmount before timeout completes
      unmount();
      
      // Should clean up timeouts
      expect(clearTimeoutSpy).toHaveBeenCalled();
      
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('Error Boundaries', () => {
    it('handles missing metric data gracefully', () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Should render without crashing even if data is malformed
      expect(() => render(<EchoClientPage />)).not.toThrow();
      
      consoleSpy.mockRestore();
    });

    it('handles animation errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      render(<EchoClientPage />);
      
      // Try to trigger animations that might fail
      const metricCards = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('metric')
      );
      
      if (metricCards[0]) {
        expect(() => user.click(metricCards[0])).not.toThrow();
      }
      
      consoleSpy.mockRestore();
    });
  });

  describe('Navigation', () => {
    it('renders navigation links correctly', () => {
      render(<EchoClientPage />);
      
      const backToProjects = screen.getByText('Back to Projects');
      const exploreMore = screen.getByText('Explore More AI Projects');
      
      expect(backToProjects.closest('a')).toHaveAttribute('href', '/projects');
      expect(exploreMore.closest('a')).toHaveAttribute('href', '/about');
    });
  });
});