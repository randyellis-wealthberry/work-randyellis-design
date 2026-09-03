import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  AntiMetalButton,
  AntiMetalLink,
} from "@/components/ui/anti-metal-button";

describe("AntiMetalButton", () => {
  it("renders the default label when nothing is passed", () => {
    render(<AntiMetalButton />);
    expect(
      screen.getByRole("button", { name: "Book a demo" }),
    ).toBeInTheDocument();
  });

  it("prefers `label` over children", () => {
    render(<AntiMetalButton label="Book a call">Ignored</AntiMetalButton>);
    expect(
      screen.getByRole("button", { name: "Book a call" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Ignored")).not.toBeInTheDocument();
  });

  it("falls back to children when no label is given", () => {
    render(<AntiMetalButton>Say hi</AntiMetalButton>);
    expect(screen.getByRole("button", { name: "Say hi" })).toBeInTheDocument();
  });

  it("forwards refs and native button props", () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = jest.fn();
    render(
      <AntiMetalButton
        ref={ref}
        type="button"
        onClick={onClick}
        className="ml-auto"
        data-testid="amb"
      />,
    );

    const button = screen.getByTestId("amb");
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("ml-auto");
    expect(button).toHaveClass("group/btn");

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders five animated chevrons hidden from assistive tech", () => {
    const { container } = render(<AntiMetalButton />);
    const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(svgs).toHaveLength(5);
    expect(container.querySelectorAll(".bd-dot")).toHaveLength(50);
  });

  it("applies a custom dot colour to every chevron", () => {
    const { container } = render(<AntiMetalButton dotColor="#123456" />);
    container.querySelectorAll("g").forEach((g) => {
      expect(g).toHaveAttribute("fill", "#123456");
    });
  });
});

describe("AntiMetalLink", () => {
  it("renders an anchor with the same shell and the given label", () => {
    render(<AntiMetalLink href="/hire-ai-randy" label="Hire AI Randy" />);
    const link = screen.getByRole("link", { name: "Hire AI Randy" });
    expect(link).toHaveAttribute("href", "/hire-ai-randy");
    expect(link).toHaveClass("group/btn");
  });

  it("forwards refs and anchor props", () => {
    const ref = React.createRef<HTMLAnchorElement>();
    const onClick = jest.fn();
    render(
      <AntiMetalLink
        ref={ref}
        href="/x"
        className="ml-auto"
        data-testid="aml"
        onClick={(event) => {
          event.preventDefault();
          onClick();
        }}
      >
        Go
      </AntiMetalLink>,
    );
    const link = screen.getByTestId("aml");
    expect(ref.current).toBe(link);
    expect(link).toHaveClass("ml-auto");
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders the five chevrons the button renders", () => {
    const { container } = render(<AntiMetalLink href="/x">Go</AntiMetalLink>);
    expect(container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(
      5,
    );
  });
});
