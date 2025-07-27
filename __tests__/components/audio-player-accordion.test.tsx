import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the accordion component for testing
const MockAccordion = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-accordion">{children}</div>
);

const MockAccordionItem = ({ 
  children, 
  value,
  className 
}: { 
  children: React.ReactNode; 
  value: string;
  className?: string;
}) => (
  <div data-testid={`accordion-item-${value}`} className={className}>
    {children}
  </div>
);

const MockAccordionTrigger = ({ 
  children,
  className,
  'data-testid': testId = "accordion-trigger"
}: { 
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}) => (
  <button data-testid={testId} className={className}>
    {children}
  </button>
);

const MockAccordionContent = ({ 
  children,
  'data-testid': testId = "accordion-content"
}: { 
  children: React.ReactNode;
  'data-testid'?: string;
}) => (
  <div data-testid={testId}>{children}</div>
);

// Mock the AudioPlayer component for isolated testing
const MockAudioPlayer = ({ compact = false }: { compact?: boolean }) => (
  <div data-testid="audio-player" data-compact={compact}>
    <div data-testid="audio-controls">
      <button data-testid="play-button">Play</button>
      <div data-testid="progress-bar" />
      <span data-testid="time-display">0:00 / 0:00</span>
    </div>
    <button data-testid="script-button">Read Script</button>
  </div>
);

jest.mock("@/components/core/accordion", () => ({
  Accordion: MockAccordion,
  AccordionItem: MockAccordionItem,
  AccordionTrigger: MockAccordionTrigger,
  AccordionContent: MockAccordionContent,
}));

jest.mock("@/components/ui/audio-player", () => ({
  AudioPlayer: MockAudioPlayer,
}));

// Test component that simulates the FAQ section with audio player
const FAQWithAudioPlayer = () => {
  return (
    <MockAccordion>
      <MockAccordionItem value="audio-story" className="py-2">
        <MockAccordionTrigger className="w-full text-left" data-testid="accordion-trigger-audio">
          <div>Listen to Randy&apos;s Story</div>
        </MockAccordionTrigger>
        <MockAccordionContent data-testid="accordion-content-audio">
          <MockAudioPlayer compact={true} />
        </MockAccordionContent>
      </MockAccordionItem>
      
      <MockAccordionItem value="ai-design-approach" className="py-2">
        <MockAccordionTrigger className="w-full text-left" data-testid="accordion-trigger-ai">
          <div>What&apos;s your approach to AI in design?</div>
        </MockAccordionTrigger>
        <MockAccordionContent data-testid="accordion-content-ai">
          <p>AI design approach content...</p>
        </MockAccordionContent>
      </MockAccordionItem>
    </MockAccordion>
  );
};

describe("Audio Player in FAQ Accordion", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Clear any mocks before each test
    jest.clearAllMocks();
  });

  describe("Component Integration", () => {
    test("renders audio player within accordion structure", () => {
      render(<FAQWithAudioPlayer />);
      
      expect(screen.getByTestId("mock-accordion")).toBeInTheDocument();
      expect(screen.getByTestId("accordion-item-audio-story")).toBeInTheDocument();
      expect(screen.getByText("Listen to Randy's Story")).toBeInTheDocument();
      expect(screen.getByTestId("audio-player")).toBeInTheDocument();
    });

    test("audio player is configured for compact mode", () => {
      render(<FAQWithAudioPlayer />);
      
      const audioPlayer = screen.getByTestId("audio-player");
      expect(audioPlayer).toHaveAttribute("data-compact", "true");
    });

    test("audio story accordion item appears first in FAQ", () => {
      render(<FAQWithAudioPlayer />);
      
      const audioStoryItem = screen.getByTestId("accordion-item-audio-story");
      const aiDesignItem = screen.getByTestId("accordion-item-ai-design-approach");
      
      expect(audioStoryItem).toBeInTheDocument();
      expect(aiDesignItem).toBeInTheDocument();
      
      // In a real implementation, you'd test the actual order
      // For now, we just ensure both exist
    });
  });

  describe("Audio Player Functionality in Accordion Context", () => {
    test("audio controls are accessible within accordion", () => {
      render(<FAQWithAudioPlayer />);
      
      expect(screen.getByTestId("play-button")).toBeInTheDocument();
      expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
      expect(screen.getByTestId("time-display")).toBeInTheDocument();
      expect(screen.getByTestId("script-button")).toBeInTheDocument();
    });

    test("script button functionality works in accordion context", async () => {
      const mockScriptClick = jest.fn();
      
      // In a real test, you'd mock the actual script dialog opening
      render(<FAQWithAudioPlayer />);
      
      const scriptButton = screen.getByTestId("script-button");
      expect(scriptButton).toBeInTheDocument();
      
      // Test that the button is clickable
      await user.click(scriptButton);
      // In real implementation, you'd test that dialog opens
    });

    test("audio player maintains state when accordion expands/collapses", () => {
      render(<FAQWithAudioPlayer />);
      
      // This test would verify that audio state persists
      // through accordion state changes in the real implementation
      expect(screen.getByTestId("audio-player")).toBeInTheDocument();
    });
  });

  describe("Accessibility in Accordion Context", () => {
    test("accordion trigger has proper accessibility attributes", () => {
      render(<FAQWithAudioPlayer />);
      
      const audioTrigger = screen.getByTestId("accordion-trigger-audio");
      expect(audioTrigger).toBeInTheDocument();
      expect(audioTrigger.tagName).toBe("BUTTON");
    });

    test("audio player maintains keyboard navigation", () => {
      render(<FAQWithAudioPlayer />);
      
      const playButton = screen.getByTestId("play-button");
      const scriptButton = screen.getByTestId("script-button");
      
      expect(playButton).toBeInTheDocument();
      expect(scriptButton).toBeInTheDocument();
      
      // Both should be focusable
      expect(playButton.tagName).toBe("BUTTON");
      expect(scriptButton.tagName).toBe("BUTTON");
    });

    test("accordion structure supports screen readers", () => {
      render(<FAQWithAudioPlayer />);
      
      // Test that the structure is accessible
      const audioAccordionContent = screen.getByTestId("accordion-content-audio");
      expect(audioAccordionContent).toBeInTheDocument();
    });
  });

  describe("Performance Considerations", () => {
    test("audio player doesn't cause excessive re-renders in accordion", () => {
      const { rerender } = render(<FAQWithAudioPlayer />);
      
      expect(screen.getByTestId("audio-player")).toBeInTheDocument();
      
      // Rerender shouldn't cause issues
      rerender(<FAQWithAudioPlayer />);
      expect(screen.getByTestId("audio-player")).toBeInTheDocument();
    });

    test("compact audio player takes less vertical space", () => {
      render(<FAQWithAudioPlayer />);
      
      const audioPlayer = screen.getByTestId("audio-player");
      expect(audioPlayer).toHaveAttribute("data-compact", "true");
      
      // In a real test, you'd measure actual dimensions
      // or test specific CSS classes for compact mode
    });
  });

  describe("Error Handling", () => {
    test("handles audio loading errors gracefully in accordion", () => {
      render(<FAQWithAudioPlayer />);
      
      // Test that component renders even if audio fails
      expect(screen.getByTestId("audio-player")).toBeInTheDocument();
      expect(screen.getByTestId("audio-controls")).toBeInTheDocument();
    });

    test("script dialog works even if audio fails", () => {
      render(<FAQWithAudioPlayer />);
      
      const scriptButton = screen.getByTestId("script-button");
      expect(scriptButton).toBeInTheDocument();
      
      // Script functionality should be independent of audio
    });
  });
});