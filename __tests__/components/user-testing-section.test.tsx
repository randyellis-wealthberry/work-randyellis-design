import { render, screen } from "@testing-library/react";
import { UserTestingSection } from "../../components/ui/user-testing-section";

// Mock motion components
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
  },
  useInView: jest.fn(() => true),
}));

// Mock Shadcn UI components
jest.mock("../../components/ui/card", () => ({
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, ...props }: any) => (
    <div data-testid="card-content" {...props}>
      {children}
    </div>
  ),
  CardDescription: ({ children, ...props }: any) => (
    <div data-testid="card-description" {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, ...props }: any) => (
    <div data-testid="card-header" {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, ...props }: any) => (
    <h3 data-testid="card-title" {...props}>
      {children}
    </h3>
  ),
}));

jest.mock("../../components/ui/badge", () => ({
  Badge: ({ children, ...props }: any) => (
    <span data-testid="badge" {...props}>
      {children}
    </span>
  ),
}));

jest.mock("../../components/ui/accordion", () => ({
  Accordion: ({ children, collapsible, ...props }: any) => (
    <div data-testid="accordion" data-collapsible={collapsible} {...props}>
      {children}
    </div>
  ),
  AccordionContent: ({ children, ...props }: any) => (
    <div data-testid="accordion-content" {...props}>
      {children}
    </div>
  ),
  AccordionItem: ({ children, ...props }: any) => (
    <div data-testid="accordion-item" {...props}>
      {children}
    </div>
  ),
  AccordionTrigger: ({ children, ...props }: any) => (
    <button data-testid="accordion-trigger" {...props}>
      {children}
    </button>
  ),
}));

const mockUserTestingData = {
  methodology:
    "15 high school students testing with multiple devices (iOS, Android) in school library and hallways",
  environment: "School Library and Hallways",
  protocol: "Beta app testing for creating sports highlight clips",
  results: [
    { label: "Successful Clip Creation", value: "93%" },
    { label: "Editing Time Reduction", value: "67%" },
    { label: "Student Recommendation Rate", value: "87%" },
  ],
  testimonials: [
    {
      quote:
        "The app made creating highlight reels so intuitive - I had my basketball game clips edited in minutes!",
      author: "Sarah M.",
      role: "Junior",
    },
    {
      quote:
        "Finally an app that gets what student athletes need. The effects are sick!",
      author: "Marcus T.",
      role: "Senior",
    },
  ],
};

describe("UserTestingSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("component rendering", () => {
    it("renders the user testing section title", () => {
      render(<UserTestingSection data={mockUserTestingData} />);

      expect(screen.getByTestId("section-title")).toBeInTheDocument();
      expect(screen.getByTestId("section-title")).toHaveTextContent(
        /user testing/i,
      );
    });

    it("displays methodology information", () => {
      render(<UserTestingSection data={mockUserTestingData} />);

      expect(screen.getByText(/15 high school students/i)).toBeInTheDocument();
      expect(screen.getByText(/iOS, Android/i)).toBeInTheDocument();
    });

    it("shows testing environment details", () => {
      render(<UserTestingSection data={mockUserTestingData} />);

      expect(screen.getByTestId("environment-text")).toBeInTheDocument();
      expect(screen.getByTestId("environment-text")).toHaveTextContent(
        /School Library and Hallways/i,
      );
    });

    it("displays testing protocol", () => {
      render(<UserTestingSection data={mockUserTestingData} />);

      expect(screen.getByText(/Beta app testing/i)).toBeInTheDocument();
      expect(screen.getByText(/sports highlight clips/i)).toBeInTheDocument();
    });
  });

  describe("results display", () => {
    it("renders all result metrics", () => {
      render(<UserTestingSection data={mockUserTestingData} />);

      expect(screen.getByText("93%")).toBeInTheDocument();
      expect(screen.getByText("67%")).toBeInTheDocument();
      expect(screen.getByText("87%")).toBeInTheDocument();
    });

    it("displays result labels", () => {
      render(<UserTestingSection data={mockUserTestingData} />);

      expect(screen.getByText(/Successful Clip Creation/i)).toBeInTheDocument();
      expect(screen.getByText(/Editing Time Reduction/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Student Recommendation Rate/i),
      ).toBeInTheDocument();
    });
  });

  describe("testimonials section", () => {
    it("displays student testimonials", () => {
      render(<UserTestingSection data={mockUserTestingData} />);

      expect(
        screen.getByText(/creating highlight reels so intuitive/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Finally an app that gets what student athletes need/i,
        ),
      ).toBeInTheDocument();
    });

    it("shows testimonial authors and roles", () => {
      render(<UserTestingSection data={mockUserTestingData} />);

      expect(screen.getByText("Sarah M.")).toBeInTheDocument();
      expect(screen.getByText("Junior")).toBeInTheDocument();
      expect(screen.getByText("Marcus T.")).toBeInTheDocument();
      expect(screen.getByText("Senior")).toBeInTheDocument();
    });
  });

  describe("component structure", () => {
    it("uses accordion for methodology sections", () => {
      render(<UserTestingSection data={mockUserTestingData} />);

      expect(screen.getByTestId("accordion")).toBeInTheDocument();
    });

    it("uses cards for results display", () => {
      render(<UserTestingSection data={mockUserTestingData} />);

      const cards = screen.getAllByTestId("card");
      expect(cards.length).toBeGreaterThan(0);
    });

    it("uses badges for key information", () => {
      render(<UserTestingSection data={mockUserTestingData} />);

      const badges = screen.getAllByTestId("badge");
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe("accessibility", () => {
    it("has proper heading structure", () => {
      render(<UserTestingSection data={mockUserTestingData} />);

      const cardTitles = screen.getAllByTestId("card-title");
      expect(cardTitles.length).toBeGreaterThan(0);
    });

    it("has accordion triggers for keyboard navigation", () => {
      render(<UserTestingSection data={mockUserTestingData} />);

      const accordionTriggers = screen.getAllByTestId("accordion-trigger");
      expect(accordionTriggers.length).toBeGreaterThan(0);
    });
  });

  describe("error handling", () => {
    it("handles missing testimonials gracefully", () => {
      const dataWithoutTestimonials = {
        ...mockUserTestingData,
        testimonials: [],
      };

      expect(() => {
        render(<UserTestingSection data={dataWithoutTestimonials} />);
      }).not.toThrow();
    });

    it("handles missing results gracefully", () => {
      const dataWithoutResults = { ...mockUserTestingData, results: [] };

      expect(() => {
        render(<UserTestingSection data={dataWithoutResults} />);
      }).not.toThrow();
    });
  });
});
