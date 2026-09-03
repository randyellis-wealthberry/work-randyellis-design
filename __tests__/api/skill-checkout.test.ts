/**
 * @jest-environment node
 *
 * The checkout route: a form post or a JSON post naming a SKU, answered with
 * a redirect to Stripe or a plain reason why not.
 */
import { NextRequest } from "next/server";

const sessionsCreate = jest.fn();

jest.mock("@/lib/stripe", () => ({
  isStripeConfigured: jest.fn(() => true),
  getStripe: () => ({ checkout: { sessions: { create: sessionsCreate } } }),
}));

jest.mock("@/lib/data/skill-catalog", () => {
  const actual = jest.requireActual("@/lib/data/skill-catalog");
  // One priced module so the happy path exists; everything else stays as the
  // shipped catalog (unpriced), which is the state the page launches in.
  const modules = actual.SKILL_MODULES.map((m: { id: string }) =>
    m.id === "researcher"
      ? { ...m, price: { amount: 4900, currency: "usd" }, stripePriceId: "price_res" }
      : m,
  );
  return {
    ...actual,
    SKILL_MODULES: modules,
    resolveSku: (sku: string) => {
      if (sku === "bundle") return { kind: "bundle", bundle: actual.SKILL_BUNDLE };
      const module = modules.find((m: { id: string }) => m.id === sku);
      return module ? { kind: "module", module } : null;
    },
  };
});

import { POST } from "@/app/api/skill/checkout/route";
import { isStripeConfigured } from "@/lib/stripe";
import { resetRateLimits } from "@/lib/skill/rate-limit";

function formPost(sku: string, accept = "text/html") {
  const body = new URLSearchParams({ sku });
  return new NextRequest("http://localhost:3000/api/skill/checkout", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      accept,
      "x-forwarded-for": "203.0.113.7",
    },
    body,
  });
}

function jsonPost(sku: string) {
  return new NextRequest("http://localhost:3000/api/skill/checkout", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "x-forwarded-for": "203.0.113.8",
    },
    body: JSON.stringify({ sku }),
  });
}

beforeEach(() => {
  sessionsCreate.mockReset();
  resetRateLimits();
  (isStripeConfigured as jest.Mock).mockReturnValue(true);
});

describe("POST /api/skill/checkout", () => {
  it("creates a session for a priced SKU and redirects a form post to Stripe", async () => {
    sessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.com/c/pay/cs_1" });
    const response = await POST(formPost("researcher"));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://checkout.stripe.com/c/pay/cs_1",
    );
    const args = sessionsCreate.mock.calls[0][0];
    expect(args.mode).toBe("payment");
    expect(args.line_items).toEqual([{ price: "price_res", quantity: 1 }]);
    expect(args.metadata).toEqual({ sku: "researcher", site: "work.randyellis.design" });
    // The placeholder must reach Stripe unencoded or the substitution fails.
    expect(args.success_url).toBe(
      "http://localhost:3000/skill/success?session_id={CHECKOUT_SESSION_ID}",
    );
    expect(args.cancel_url).toBe("http://localhost:3000/skill#modules");
  });

  it("answers a JSON post with the checkout URL", async () => {
    sessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.com/c/pay/cs_2" });
    const response = await POST(jsonPost("researcher"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      url: "https://checkout.stripe.com/c/pay/cs_2",
    });
  });

  it("sends an unpriced module back to the page with a reason, and charges nothing", async () => {
    const response = await POST(formPost("diagram"));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/skill?checkout=unavailable#modules",
    );
    expect(sessionsCreate).not.toHaveBeenCalled();
  });

  it("rejects an unknown SKU as JSON when asked for JSON", async () => {
    const response = await POST(jsonPost("everything"));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Unknown module." });
  });

  it("reports 503 when Stripe is not configured", async () => {
    (isStripeConfigured as jest.Mock).mockReturnValue(false);
    const response = await POST(jsonPost("researcher"));
    expect(response.status).toBe(503);
  });

  it("rate-limits a client that hammers it", async () => {
    sessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.com/x" });
    let last: Response | null = null;
    for (let i = 0; i < 11; i++) {
      last = await POST(jsonPost("researcher"));
    }
    expect(last?.status).toBe(429);
    expect(last?.headers.get("retry-after")).toBeTruthy();
  });
});
