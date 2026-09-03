import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { HeaderBookingButton } from "@/components/ui/header-booking-button";
import { trackContactIntent } from "@/lib/analytics";
import { BOOKING_URL } from "@/lib/constants";

const calUi = jest.fn();
jest.mock("@calcom/embed-react", () => ({
  getCalApi: jest.fn(() => Promise.resolve(calUi)),
}));

jest.mock("@/lib/analytics", () => ({
  trackContactIntent: jest.fn(),
}));

describe("HeaderBookingButton", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the AntiMetalButton with the site's booking label", () => {
    render(<HeaderBookingButton />);
    const button = screen.getByRole("button", {
      name: "Book a 30-minute call",
    });
    expect(button).toHaveTextContent("Book a call");
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("group/btn");
  });

  it("carries the Cal.com embed attributes used by the homepage hero", () => {
    render(<HeaderBookingButton />);
    const button = screen.getByTestId("header-booking-button");
    expect(button).toHaveAttribute("data-cal-namespace", "30min");
    expect(button).toHaveAttribute("data-cal-link", "randyellis/30min");
    expect(button).toHaveAttribute(
      "data-cal-config",
      '{"layout":"month_view"}',
    );
  });

  it("tracks a booking contact intent from the header surface on click", () => {
    render(<HeaderBookingButton />);
    fireEvent.click(screen.getByTestId("header-booking-button"));
    expect(trackContactIntent).toHaveBeenCalledWith(
      "booking",
      BOOKING_URL,
      "header_cta",
    );
  });

  it("passes className through to the button", () => {
    render(<HeaderBookingButton className="ml-auto" />);
    expect(screen.getByTestId("header-booking-button")).toHaveClass("ml-auto");
  });
});
