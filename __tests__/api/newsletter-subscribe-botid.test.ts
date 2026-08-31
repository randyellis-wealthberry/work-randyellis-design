/**
 * @jest-environment node
 */

/**
 * BotID protection on the newsletter signup endpoint.
 *
 * Runs in the node environment, not the project-default jsdom: route
 * handlers return NextResponse, which needs the static `Response.json()`
 * that jsdom does not provide. This is why no other suite in this repo
 * imports a route handler directly.
 *
 * This is the site's only public, unauthenticated, write-causing form, which
 * makes it the one genuine abuse target among the five POST routes. The other
 * four are deliberately left unprotected: csp-report receives automated browser
 * reports rather than human gestures, newsletter/export is already Bearer-auth'd
 * and called by scripts that carry no client token, cdn/optimize has no callers
 * at all, and unsubscribe must stay reachable so a false positive can never
 * block a legally required opt-out.
 */

const mockCheckBotId = jest.fn();
jest.mock("botid/server", () => ({
  checkBotId: mockCheckBotId,
}));

const mockUpdateContact = jest.fn().mockResolvedValue({ success: true });
jest.mock("loops", () => ({
  LoopsClient: jest.fn().mockImplementation(() => ({
    updateContact: mockUpdateContact,
  })),
}));

jest.mock("@/lib/email-storage", () => ({
  emailStorage: {
    addSubscription: jest.fn().mockResolvedValue(undefined),
  },
}));

const subscribeRequest = () =>
  new Request("http://localhost/api/newsletter/subscribe", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "reader@example.com" }),
  });

describe("POST /api/newsletter/subscribe — BotID", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.LOOPS_API_KEY = "test-key";
  });

  it("rejects a request BotID classifies as a bot", async () => {
    mockCheckBotId.mockResolvedValue({ isBot: true });
    const { POST } = require("@/app/api/newsletter/subscribe/route");

    const response = await POST(subscribeRequest());

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Access denied" });
  });

  it("never reaches the mailing-list provider when a bot is rejected", async () => {
    mockCheckBotId.mockResolvedValue({ isBot: true });
    const { POST } = require("@/app/api/newsletter/subscribe/route");

    await POST(subscribeRequest());

    expect(mockUpdateContact).not.toHaveBeenCalled();
  });

  it("lets a human through to the normal subscribe path", async () => {
    mockCheckBotId.mockResolvedValue({ isBot: false });
    const { POST } = require("@/app/api/newsletter/subscribe/route");

    const response = await POST(subscribeRequest());

    expect(response.status).not.toBe(403);
    expect(mockCheckBotId).toHaveBeenCalled();
  });

  it("checks for a bot before reading server configuration", async () => {
    // A bot must not be able to probe whether LOOPS_API_KEY is set by
    // observing a 500 instead of a 403.
    delete process.env.LOOPS_API_KEY;
    mockCheckBotId.mockResolvedValue({ isBot: true });
    const { POST } = require("@/app/api/newsletter/subscribe/route");

    const response = await POST(subscribeRequest());

    expect(response.status).toBe(403);
  });
});
