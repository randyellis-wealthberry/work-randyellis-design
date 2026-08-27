import { jest } from "@jest/globals";

// Mock Vercel Analytics before the module under test imports it.
const mockTrack = jest.fn();
jest.mock("@vercel/analytics", () => ({
  track: mockTrack,
}));

const mockGtag = jest.fn();
Object.defineProperty(window, "gtag", {
  value: mockGtag,
  writable: true,
});

describe("trackEvent integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTrack.mockClear();
  });

  it("attaches page to a conversion event", () => {
    const { trackEvent } = require("../../lib/analytics");

    trackEvent("contact_intent", "professional_interest", "booking");

    expect(mockTrack).toHaveBeenCalledWith(
      "contact_intent",
      expect.objectContaining({ page: window.location.pathname }),
    );
  });

  it("does not attach page to a non-conversion event", () => {
    const { trackEvent } = require("../../lib/analytics");

    trackEvent("pwa_install_success", "pwa_engagement", "accepted");

    const [, props] = mockTrack.mock.calls[0];
    expect(props).not.toHaveProperty("page");
  });

  it("strips a nested property before it reaches Vercel", () => {
    const { trackEvent } = require("../../lib/analytics");

    trackEvent("some_event", "cat", undefined, undefined, {
      ok: "yes",
      // Deliberately invalid: the SDK would silently drop this in production.
      bad: { nested: true } as unknown as string,
    });

    const [, props] = mockTrack.mock.calls[0];
    expect(props).not.toHaveProperty("bad");
    expect(props).toHaveProperty("ok", "yes");
  });
});
