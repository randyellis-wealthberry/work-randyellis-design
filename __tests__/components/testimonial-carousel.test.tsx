import * as React from "react";
import { render, screen } from "@testing-library/react";
import { TestimonialCarousel } from "../../components/ui/testimonial-carousel";

// Mock motion components
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useInView: jest.fn(() => true),
  useReducedMotion: jest.fn(() => false),
}));

// Mock Shadcn UI carousel
jest.mock("../../components/ui/carousel", () => ({
  Carousel: ({ children, setApi, ...props }: any) => {
    // Handle setApi separately to avoid passing it to DOM
    React.useEffect(() => {
      if (setApi) {
        const mockApi: any = {
          scrollPrev: jest.fn(),
          scrollNext: jest.fn(),
          canScrollPrev: false,
          canScrollNext: false,
          scrollSnapList: jest.fn(() => [0, 1, 2]), // Mock returning 3 items
          selectedScrollSnap: jest.fn(() => 0), // Mock returning first item selected
          on: jest.fn((event: string, callback: () => void): any => {
            // Mock event listener - could be enhanced to simulate events
            return mockApi;
          }),
          off: jest.fn(),
        };
        setApi(mockApi);
      }
    }, [setApi]);
    return (
      <div data-testid="carousel" {...props}>
        {children}
      </div>
    );
  },
  CarouselContent: ({ children, ...props }: any) => (
    <div data-testid="carousel-content" {...props}>
      {children}
    </div>
  ),
  CarouselItem: ({ children, ...props }: any) => (
    <div data-testid="carousel-item" {...props}>
      {children}
    </div>
  ),
  CarouselNext: ({ ...props }: any) => (
    <button data-testid="carousel-next" {...props}>
      Next
    </button>
  ),
  CarouselPrevious: ({ ...props }: any) => (
    <button data-testid="carousel-previous" {...props}>
      Previous
    </button>
  ),
}));

const mockTestimonials = [
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
  {
    quote:
      "I loved how easy it was to share my volleyball spikes with the team",
    author: "Emma L.",
    role: "Sophomore",
  },
  {
    quote: "Way better than trying to edit on my phone's default app",
    author: "Jordan K.",
    role: "Freshman",
  },
];

describe("TestimonialCarousel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("component rendering", () => {
    it("renders the testimonial carousel", () => {
      render(<TestimonialCarousel testimonials={mockTestimonials} />);

      expect(screen.getByTestId("carousel")).toBeInTheDocument();
    });

    it("displays all testimonial quotes", () => {
      render(<TestimonialCarousel testimonials={mockTestimonials} />);

      expect(
        screen.getByText(/creating highlight reels so intuitive/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Finally an app that gets what student athletes need/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /I loved how easy it was to share my volleyball spikes/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Way better than trying to edit/i),
      ).toBeInTheDocument();
    });

    it("shows testimonial authors and roles", () => {
      render(<TestimonialCarousel testimonials={mockTestimonials} />);

      expect(screen.getByText("Sarah M.")).toBeInTheDocument();
      expect(screen.getByText("Junior")).toBeInTheDocument();
      expect(screen.getByText("Marcus T.")).toBeInTheDocument();
      expect(screen.getByText("Senior")).toBeInTheDocument();
      expect(screen.getByText("Emma L.")).toBeInTheDocument();
      expect(screen.getByText("Sophomore")).toBeInTheDocument();
      expect(screen.getByText("Jordan K.")).toBeInTheDocument();
      expect(screen.getByText("Freshman")).toBeInTheDocument();
    });

    it("renders proper number of carousel items", () => {
      render(<TestimonialCarousel testimonials={mockTestimonials} />);

      const carouselItems = screen.getAllByTestId("carousel-item");
      expect(carouselItems).toHaveLength(mockTestimonials.length);
    });
  });

  describe("carousel navigation", () => {
    it("includes navigation buttons", () => {
      render(<TestimonialCarousel testimonials={mockTestimonials} />);

      expect(screen.getByTestId("carousel-next")).toBeInTheDocument();
      expect(screen.getByTestId("carousel-previous")).toBeInTheDocument();
    });

    it("has proper button labels", () => {
      render(<TestimonialCarousel testimonials={mockTestimonials} />);

      expect(screen.getByText("Next")).toBeInTheDocument();
      expect(screen.getByText("Previous")).toBeInTheDocument();
    });
  });

  describe("quote structure", () => {
    // Each quote is a figure bounded by hairlines, not a card: the editorial
    // surfaces build structure from rules, and a shadowed box would group
    // content the way this design system never does.
    it("renders each testimonial as a figure with a blockquote", () => {
      const { container } = render(
        <TestimonialCarousel testimonials={mockTestimonials} />,
      );

      expect(container.querySelectorAll("figure")).toHaveLength(
        mockTestimonials.length,
      );
      expect(container.querySelectorAll("blockquote")).toHaveLength(
        mockTestimonials.length,
      );
    });

    it("attributes every quote in a figcaption", () => {
      const { container } = render(
        <TestimonialCarousel testimonials={mockTestimonials} />,
      );

      expect(container.querySelectorAll("figcaption")).toHaveLength(
        mockTestimonials.length,
      );
    });
  });

  describe("accessibility", () => {
    it("gives every pager control a 44px target and a label", () => {
      render(<TestimonialCarousel testimonials={mockTestimonials} />);

      const dots = screen.getAllByRole("button", {
        name: /go to testimonial/i,
      });
      expect(dots.length).toBeGreaterThan(0);
      dots.forEach((dot) => {
        expect(dot).toHaveClass("h-11");
      });
    });

    it("marks the current testimonial for assistive technology", () => {
      render(<TestimonialCarousel testimonials={mockTestimonials} />);

      const current = screen
        .getAllByRole("button", { name: /go to testimonial/i })
        .filter((dot) => dot.getAttribute("aria-current") === "true");
      expect(current).toHaveLength(1);
    });
  });

  describe("edge cases", () => {
    it("handles empty testimonials array", () => {
      expect(() => {
        render(<TestimonialCarousel testimonials={[]} />);
      }).not.toThrow();
    });

    it("handles single testimonial", () => {
      const singleTestimonial = [mockTestimonials[0]];

      render(<TestimonialCarousel testimonials={singleTestimonial} />);

      expect(
        screen.getByText(/creating highlight reels so intuitive/i),
      ).toBeInTheDocument();
      expect(screen.getByText("Sarah M.")).toBeInTheDocument();
    });

    it("handles testimonials with missing fields gracefully", () => {
      const incompleteTestimonials = [
        { quote: "Great app!", author: "Test User", role: "" },
        { quote: "", author: "Another User", role: "Student" },
      ];

      expect(() => {
        render(<TestimonialCarousel testimonials={incompleteTestimonials} />);
      }).not.toThrow();
    });
  });

  describe("responsive behavior", () => {
    it("maintains carousel structure for different screen sizes", () => {
      render(<TestimonialCarousel testimonials={mockTestimonials} />);

      // Should have carousel wrapper
      expect(screen.getByTestId("carousel")).toBeInTheDocument();

      // Should have carousel content container
      expect(screen.getByTestId("carousel-content")).toBeInTheDocument();
    });
  });
});
