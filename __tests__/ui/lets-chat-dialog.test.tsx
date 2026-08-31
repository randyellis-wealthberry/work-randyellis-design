import { render, screen, fireEvent } from "@testing-library/react";
import { LetsChatButton } from "@/components/ui/lets-chat-dialog";
import { ZINLEY_EMBED_URL, ZINLEY_URL } from "@/lib/constants";

jest.mock("@/lib/analytics", () => ({
  trackContactIntent: jest.fn(),
}));

// Radix Dialog relies on these in jsdom
beforeAll(() => {
  Element.prototype.hasPointerCapture = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
});

function openDialog() {
  render(<LetsChatButton>Let&apos;s chat</LetsChatButton>);
  fireEvent.click(screen.getByRole("button", { name: /let's chat/i }));
  return screen.getByRole("dialog");
}

describe("LetsChatButton", () => {
  it("renders the trigger and no dialog until clicked", () => {
    render(<LetsChatButton>Let&apos;s chat</LetsChatButton>);
    expect(
      screen.getByRole("button", { name: /let's chat/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens a disclosure dialog explaining the virtual assistant", () => {
    const dialog = openDialog();
    expect(dialog).toHaveTextContent(/virtual assistant/i);
    expect(dialog).toHaveTextContent(/schedule a meeting/i);
    expect(dialog).toHaveTextContent(/projects/i);
  });

  it("does not load the Zinley embed until the visitor proceeds", () => {
    const dialog = openDialog();
    expect(dialog.querySelector("iframe")).toBeNull();
    const cta = screen.getByRole("button", { name: /proceed to call/i });
    // Cell phone icon rendered inside the CTA
    expect(cta.querySelector("svg")).not.toBeNull();
  });

  it("swaps to the Zinley embed after 'Proceed to call'", () => {
    const dialog = openDialog();
    fireEvent.click(screen.getByRole("button", { name: /proceed to call/i }));

    const iframe = dialog.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe).toHaveAttribute("src", ZINLEY_EMBED_URL);
    expect(iframe).toHaveAttribute("title", expect.stringMatching(/zinley/i));

    // Disclosure CTA is gone; fallback link to the hosted card remains
    expect(
      screen.queryByRole("button", { name: /proceed to call/i }),
    ).not.toBeInTheDocument();
    const fallback = screen.getByRole("link", { name: /zinley\.com/i });
    expect(fallback).toHaveAttribute("href", ZINLEY_URL);
    expect(fallback).toHaveAttribute("target", "_blank");
    expect(fallback).toHaveAttribute(
      "rel",
      expect.stringContaining("noopener"),
    );
  });

  it("tracks contact intent on open and on proceed", () => {
    const { trackContactIntent } = jest.requireMock("@/lib/analytics");
    openDialog();
    expect(trackContactIntent).toHaveBeenCalledWith(
      "virtual_assistant_open",
      ZINLEY_URL,
      "chat_dialog",
    );

    fireEvent.click(screen.getByRole("button", { name: /proceed to call/i }));
    expect(trackContactIntent).toHaveBeenCalledWith(
      "virtual_assistant_call",
      ZINLEY_EMBED_URL,
      "chat_dialog",
    );
  });

  it("closes when 'Not now' is clicked and resets to the disclosure on reopen", () => {
    openDialog();
    fireEvent.click(screen.getByRole("button", { name: /proceed to call/i }));
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /let's chat/i }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.querySelector("iframe")).toBeNull();
    expect(
      screen.getByRole("button", { name: /proceed to call/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /not now/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
