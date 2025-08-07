import { render, screen } from '@testing-library/react';
import AboutClient from '@/app/about/about-client';

// Mock motion components to avoid animation issues in tests
jest.mock('motion/react', () => ({
  motion: {
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useAnimation: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  })),
  useMotionValue: jest.fn(() => ({
    get: jest.fn(() => 0),
    set: jest.fn(),
  })),
  useTransform: jest.fn(() => ({
    get: jest.fn(() => 0),
    set: jest.fn(),
  })),
  AnimatePresence: ({ children }: any) => children,
}));

// Mock accordion components 
jest.mock('@/components/core/accordion', () => ({
  Accordion: ({ children }: any) => <div data-testid="accordion">{children}</div>,
  AccordionItem: ({ children, value }: any) => <div data-testid={`accordion-item-${value}`}>{children}</div>,
  AccordionTrigger: ({ children }: any) => <button data-testid="accordion-trigger">{children}</button>,
  AccordionContent: ({ children }: any) => <div data-testid="accordion-content">{children}</div>,
}));

// Mock email utility
jest.mock('@/app/data', () => ({
  getEmail: () => 'test@example.com',
}));

describe('About Page Professional Experience', () => {
  beforeEach(() => {
    render(<AboutClient />);
  });

  describe('Professional Experience Section', () => {
    it('should render the Professional Experience heading', () => {
      expect(screen.getByText('Professional Experience')).toBeInTheDocument();
    });

    it('should display all 7 professional experience entries', () => {
      const expectedRoles = [
        'Head of Product',
        'Lead UX Researcher',
        'Head of Design',
        'Director of DesignOps',
        'Associate Director of UX/Product Design',
        'Lead Product Designer', 
        'User Experience Strategist'
      ];

      expectedRoles.forEach(role => {
        expect(screen.getByText(role)).toBeInTheDocument();
      });
    });

    it('should display promotion badge for Head of Design role', () => {
      expect(screen.getByText('⭐ Promotion')).toBeInTheDocument();
    });

    it('should display all 7 companies', () => {
      const expectedCompanies = [
        'Wealthberry Labs',
        'Clockwork', 
        'Nagarro',
        'Nagarro DV',
        'Alight Solutions',
        'DigitasLBi',
        'Eight Bit Studios'
      ];

      expectedCompanies.forEach(company => {
        expect(screen.getByText(company)).toBeInTheDocument();
      });
    });

    it('should display entries in chronological order (newest first)', () => {
      const roleElements = screen.getAllByText(/Head of Product|Lead UX Researcher|Head of Design|Director of DesignOps|Associate Director|Lead Product Designer|User Experience Strategist/);
      
      // Verify the order matches expected chronological sequence
      expect(roleElements[0]).toHaveTextContent('Head of Product'); // 2022-Present
      expect(roleElements[1]).toHaveTextContent('Lead UX Researcher'); // 2023 
      expect(roleElements[2]).toHaveTextContent('Head of Design'); // 2022
      expect(roleElements[3]).toHaveTextContent('Director of DesignOps'); // 2020-2022
      expect(roleElements[4]).toHaveTextContent('Associate Director of UX/Product Design'); // 2018-2019
      expect(roleElements[5]).toHaveTextContent('Lead Product Designer'); // 2018-2019
      expect(roleElements[6]).toHaveTextContent('User Experience Strategist'); // 2016-2018
    });

    it('should have external links for all companies', () => {
      const companyLinks = [
        { company: 'Wealthberry Labs', url: 'https://www.buildyourlegacywithai.com' },
        { company: 'Clockwork', url: 'https://www.clockwork.com' },
        { company: 'Alight Solutions', url: 'https://www.alight.com' },
        { company: 'DigitasLBi', url: 'https://www.digitas.com/en-us/offices/chicago' },
        { company: 'Eight Bit Studios', url: 'https://eightbitstudios.com' }
      ];

      companyLinks.forEach(({ company, url }) => {
        const link = screen.getByRole('link', { name: new RegExp(company, 'i') });
        expect(link).toHaveAttribute('href', url);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });

      // Handle Nagarro companies separately due to duplicate names
      const nagarroLinks = screen.getAllByRole('link', { name: /nagarro/i });
      expect(nagarroLinks).toHaveLength(2);
      nagarroLinks.forEach(link => {
        expect(link).toHaveAttribute('href', 'https://www.nagarro.com');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('should display period badges for all roles', () => {
      const expectedPeriods = [
        '2022 - Present',
        '2023', 
        '2020 - 2022',
        'Feb 2020 - Mar 2022',
        'Sep 2018 - Jul 2019',
        'Jul 2018 - Sep 2019',
        'Mar 2016 - Jun 2018'
      ];

      expectedPeriods.forEach(period => {
        expect(screen.getByText(period)).toBeInTheDocument();
      });
    });

    it('should display achievements for all roles', () => {
      // Test that Key Achievements sections exist (7 professional + 2 teaching = 9 total)
      const achievementHeaders = screen.getAllByText('Key Achievements:');
      expect(achievementHeaders).toHaveLength(9); // Should have 7 professional + 2 teaching roles

      // Test specific achievements from resume data (using getAllByText for potentially duplicate content)
      expect(screen.getAllByText(/design cycle time by 35%/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/AI anomaly payroll detection system/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/website engagement by 25%/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/user retention by 15%/).length).toBeGreaterThanOrEqual(1);
    });

    it('should have proper accessibility attributes', () => {
      const experienceSection = screen.getByText('Professional Experience').closest('section');
      expect(experienceSection).toBeInTheDocument();
      
      // Check that all company links have proper accessibility attributes
      const companyLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('href')?.startsWith('http') && 
        !link.getAttribute('href')?.includes('mailto') &&
        !link.getAttribute('href')?.includes('coursera')
      );
      
      expect(companyLinks.length).toBeGreaterThanOrEqual(7); // At least 7 company links
      
      companyLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link).toHaveAttribute('target', '_blank');
      });
    });
  });

  describe('Experience Data Integrity', () => {
    it('should have valid company URLs', () => {
      const links = screen.getAllByRole('link');
      const companyLinks = links.filter(link => 
        link.getAttribute('href')?.startsWith('http') && 
        !link.getAttribute('href')?.includes('mailto')
      );

      companyLinks.forEach(link => {
        const href = link.getAttribute('href');
        expect(href).toMatch(/^https?:\/\/.+\..+/);
      });
    });

    it('should display quantified achievements with metrics', () => {
      // Test for specific quantified metrics from resume (using getAllByText for duplicates)
      const metrics = [
        '22%', '18%', '34%', // Wealthberry Labs
        '12%', '23%', // Clockwork
        '50%', '100%', '40%', '25%', // Nagarro
        '35%', '30%', '38%', // Nagarro DV
        '60%', '50%', // Alight Solutions
        '15%' // Eight Bit Studios
      ];

      metrics.forEach(metric => {
        const elements = screen.getAllByText(new RegExp(metric));
        expect(elements.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('College Badges for ThriveDX', () => {
    it('should display Partner Universities heading for ThriveDX', () => {
      expect(screen.getByText('Partner Universities:')).toBeInTheDocument();
    });

    it('should display all 4 college badges for ThriveDX', () => {
      const colleges = [
        'University of Wisconsin',
        'Institute of Technology of New Jersey',
        'University of Miami',
        'University of Kansas'
      ];

      colleges.forEach(college => {
        expect(screen.getByText(college)).toBeInTheDocument();
      });
    });

    it('should display graduation cap icon with Partner Universities heading', () => {
      const partnerUniversitiesSection = screen.getByText('Partner Universities:').closest('h4');
      expect(partnerUniversitiesSection).toBeInTheDocument();
      expect(partnerUniversitiesSection).toHaveClass('flex', 'items-center', 'gap-2');
    });

    it('should not display college badges for General Assembly role', () => {
      // The General Assembly role should not have college badges
      // We test this by ensuring the college names only appear once (under ThriveDX)
      const wisconsinElements = screen.getAllByText('University of Wisconsin');
      expect(wisconsinElements).toHaveLength(1);
    });
  });
});