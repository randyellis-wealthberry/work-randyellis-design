import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterSignup } from "@/components/ui/newsletter-signup";

// Mock fetch
global.fetch = jest.fn();

// Mock analytics
jest.mock("@/lib/analytics", () => ({
  trackNewsletterAttempt: jest.fn(),
}));

describe("NewsletterSignup", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders newsletter signup form", () => {
    render(<NewsletterSignup />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /subscribe/i }),
    ).toBeInTheDocument();
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();

    // Mock fetch to not be called for invalid emails
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockImplementation(() => {
      throw new Error("Should not be called for invalid email");
    });

    render(<NewsletterSignup />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /subscribe/i });

    // Type an invalid email format (no @ symbol)
    await user.type(emailInput, "notanemail");

    // Submit the form - this should trigger validation BEFORE calling fetch
    await user.click(submitButton);

    // Wait for validation error to appear (should happen before fetch is called)
    await waitFor(
      () => {
        expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Verify fetch was never called
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("shows validation error for empty email", async () => {
    const user = userEvent.setup();

    // Mock fetch to not be called for empty email
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockImplementation(() => {
      throw new Error("Should not be called for empty email");
    });

    render(<NewsletterSignup />);

    const submitButton = screen.getByRole("button", { name: /subscribe/i });

    // Submit form without entering email
    await user.click(submitButton);

    // Wait for validation error to appear
    await waitFor(
      () => {
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Verify fetch was never called
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("submits form with valid email", async () => {
    const user = userEvent.setup();
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<NewsletterSignup />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /subscribe/i });

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    expect(mockFetch).toHaveBeenCalledWith("/api/newsletter/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "test@example.com" }),
    });
  });

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<NewsletterSignup />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /subscribe/i });

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    expect(screen.getByText(/subscribing/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("shows success message after successful submission", async () => {
    const user = userEvent.setup();
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<NewsletterSignup />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /subscribe/i });

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/successfully subscribed/i)).toBeInTheDocument();
    });
  });

  it("shows error message on API failure", async () => {
    const user = userEvent.setup();
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Server error" }),
    } as Response);

    render(<NewsletterSignup />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /subscribe/i });

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });

  it("shows rate limiting message on 429 response", async () => {
    const user = userEvent.setup();
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({
        error: "Too many requests",
        message: "Please wait a moment before trying again.",
        retryAfter: 60,
      }),
    } as Response);

    render(<NewsletterSignup />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /subscribe/i });

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/please wait a moment before trying again/i),
      ).toBeInTheDocument();
    });

    // Check that the error message has the orange styling for rate limiting
    const errorDiv = screen
      .getByText(/please wait a moment before trying again/i)
      .closest("div");
    expect(errorDiv).toHaveClass("bg-orange-100");
  });

  it("has proper accessibility attributes", () => {
    render(<NewsletterSignup />);

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("required");
    expect(emailInput).toHaveAttribute("aria-describedby");
  });

  it("clears form after successful submission", async () => {
    const user = userEvent.setup();
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<NewsletterSignup />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /subscribe/i });

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(emailInput.value).toBe("");
    });
  });
});
