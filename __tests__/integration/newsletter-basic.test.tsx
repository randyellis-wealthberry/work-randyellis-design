/**
 * Basic Newsletter Component Tests
 * Simple tests to verify component functionality
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { FloatingInput } from "../../components/ui/input";

describe("Newsletter Basic Tests", () => {
  test("should render FloatingInput component", () => {
    render(<FloatingInput label="Test Label" type="email" />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");

    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
  });

  test("should show error message when provided", () => {
    render(<FloatingInput label="Email" type="email" error="Invalid email" />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();

    const errorMessage = screen.getByText("Invalid email");
    expect(errorMessage).toBeInTheDocument();
  });

  test("should handle disabled state", () => {
    render(<FloatingInput label="Email" type="email" disabled />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });
});
