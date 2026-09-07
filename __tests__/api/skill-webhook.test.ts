/**
 * @jest-environment node
 *
 * The webhook: Stripe says a checkout completed, the buyer gets an email
 * with their download links. Every non-signature failure answers 200 so
 * Stripe does not retry a problem retrying cannot fix.
 */
import { NextRequest } from "next/server";

const constructEvent = jest.fn();
const sessionsRetrieve = jest.fn();
const sendEmail = jest.fn();

jest.mock("@/lib/stripe", () => ({
  isStripeConfigured: () => Boolean(process.env.STRIPE_SECRET_KEY),
  getStripe: () => ({
    webhooks: { constructEvent },
    checkout: { sessions: { retrieve: sessionsRetrieve } },
  }),
}));

jest.mock("@/lib/email/resend", () => ({
  sendEmail: (...args: unknown[]) => sendEmail(...args),
}));

import { POST } from "@/app/api/skill/webhook/route";

function post(body: string, signature: string | null = "t=1,v1=abc") {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (signature) headers["stripe-signature"] = signature;
  return new NextRequest("http://localhost:3000/api/skill/webhook", {
    method: "POST",
    headers,
    body,
  });
}

function completedEvent(overrides: Record<string, unknown> = {}) {
  return {
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_paid",
        payment_status: "paid",
        metadata: { sku: "researcher", site: "work.randyellis.design" },
        ...overrides,
      },
    },
  };
}

beforeEach(() => {
  process.env.STRIPE_SECRET_KEY = "sk_test";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  process.env.SKILL_DOWNLOAD_SECRET = "download-secret";
  process.env.RESEND_API_KEY = "re_test";
  constructEvent.mockReset();
  sessionsRetrieve.mockReset();
  sendEmail.mockReset();
  sendEmail.mockResolvedValue({ success: true });
});

afterAll(() => {
  delete process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_WEBHOOK_SECRET;
  delete process.env.SKILL_DOWNLOAD_SECRET;
  delete process.env.RESEND_API_KEY;
});

describe("POST /api/skill/webhook", () => {
  it("emails the buyer their files for a paid session", async () => {
    constructEvent.mockReturnValue(completedEvent());
    sessionsRetrieve.mockResolvedValue({
      id: "cs_paid",
      payment_status: "paid",
      customer_details: { email: "buyer@example.com" },
      metadata: { sku: "researcher", site: "work.randyellis.design" },
      line_items: { data: [] },
    });

    const response = await POST(post("{}"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, delivered: true });

    expect(constructEvent).toHaveBeenCalledWith("{}", "t=1,v1=abc", "whsec_test");
    expect(sendEmail).toHaveBeenCalledTimes(1);
    const mail = sendEmail.mock.calls[0][0];
    expect(mail.to).toBe("buyer@example.com");
    expect(mail.subject).toBe("Your Skill.md module: Researcher");
    expect(mail.text).toContain("/api/skill/download?t=");
    expect(mail.text).toContain("skill=researcher");
    expect(mail.text).toContain("/skill/success?session_id=cs_paid");
    expect(mail.html).toContain("Download SKILL.md");
  });

  it("rejects a bad signature with 400", async () => {
    constructEvent.mockImplementation(() => {
      throw new Error("No signatures found matching the expected signature");
    });
    const response = await POST(post("{}"));
    expect(response.status).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rejects a missing signature with 400", async () => {
    const response = await POST(post("{}", null));
    expect(response.status).toBe(400);
  });

  it("ignores events that are not a completed checkout", async () => {
    constructEvent.mockReturnValue({ type: "payment_intent.created", data: { object: {} } });
    const response = await POST(post("{}"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, ignored: "payment_intent.created" });
    expect(sessionsRetrieve).not.toHaveBeenCalled();
  });

  it("ignores a checkout rung up by another site on the same account", async () => {
    constructEvent.mockReturnValue(
      completedEvent({ metadata: { sku: "researcher", site: "elsewhere" } }),
    );
    const response = await POST(post("{}"));
    expect(await response.json()).toEqual({ received: true, ignored: "other site" });
  });

  it("does not deliver an unpaid session", async () => {
    constructEvent.mockReturnValue(completedEvent({ payment_status: "unpaid" }));
    const response = await POST(post("{}"));
    expect(await response.json()).toEqual({ received: true, ignored: "unpaid" });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("answers 200 without an email when Resend is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    constructEvent.mockReturnValue(completedEvent());
    sessionsRetrieve.mockResolvedValue({
      id: "cs_paid",
      payment_status: "paid",
      customer_details: { email: "buyer@example.com" },
      metadata: { sku: "researcher", site: "work.randyellis.design" },
      line_items: { data: [] },
    });
    const response = await POST(post("{}"));
    expect(await response.json()).toEqual({ received: true, delivered: false });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("answers 503 when the webhook secret is missing", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const response = await POST(post("{}"));
    expect(response.status).toBe(503);
  });
});
