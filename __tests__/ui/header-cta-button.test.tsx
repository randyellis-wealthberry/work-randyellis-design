import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { HeaderCtaButton } from "@/components/ui/header-cta-button";
import { trackContactIntent } from "@/lib/analytics";
import { DIAGNOSTIC_PATH } from "@/lib/constants";

jest.mock("@/lib/analytics", () => ({
  trackContactIntent: jest.fn(),
}));

describe("HeaderCtaButton", () => {
  beforeEach(() => jest.clearAllMocks());

  it("is a real link to the diagnostic labelled Hire AI Randy", () => {
    render(<HeaderCtaButton />);
    const link = screen.getByRole("link", { name: "Hire AI Randy" });
    expect(link).toHaveAttribute("href", DIAGNOSTIC_PATH);
    expect(link).toHaveClass("group/btn");
    // A navigation target is an anchor, never a button.
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not carry Cal.com embed attributes", () => {
    render(<HeaderCtaButton />);
    const link = screen.getByTestId("header-cta-button");
    expect(link).not.toHaveAttribute("data-cal-namespace");
    expect(link).not.toHaveAttribute("data-cal-link");
  });

  it("tracks a diagnostic contact intent from the header surface on click", () => {
    render(<HeaderCtaButton />);
    fireEvent.click(screen.getByTestId("header-cta-button"));
    expect(trackContactIntent).toHaveBeenCalledWith(
      "diagnostic",
      DIAGNOSTIC_PATH,
      "header_cta",
    );
  });

  it("passes className through to the link", () => {
    render(<HeaderCtaButton className="ml-auto" />);
    expect(screen.getByTestId("header-cta-button")).toHaveClass("ml-auto");
  });
});
