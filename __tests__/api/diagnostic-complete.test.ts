/**
 * @jest-environment node
 */

/**
 * The email gate behind the diagnostic verdict. Node environment for the
 * same reason as the newsletter BotID suite: route handlers need the static
 * Response.json() that jsdom lacks.
 */

import { writeFileSync } from "node:fs";
import { DIMENSIONS } from "@/lib/data/diagnostic";

const mockCheckBotId = jest.fn();
jest.mock("botid/server", () => ({ checkBotId: mockCheckBotId }));

const mockUpsertContact = jest.fn();
const mockSendEmail = jest.fn();
jest.mock("@/lib/email", () => ({
  upsertContact: mockUpsertContact,
  sendEmail: mockSendEmail,
  OWNER_EMAIL: "owner@example.com",
}));

const fullAnswers = Object.fromEntries(
  DIMENSIONS.flatMap((d, i) => d.questions.map((q, j) => [q.id, (i + j) % 4])),
);

const post = async (body: unknown) => {
  const { POST } = await import("@/app/api/diagnostic/complete/route");
  return POST(
    new Request("http://localhost/api/diagnostic/complete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  ) as Promise<Response>;
};

describe("POST /api/diagnostic/complete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RESEND_API_KEY = "test-key";
    mockCheckBotId.mockResolvedValue({ isBot: false });
    mockUpsertContact.mockResolvedValue({ error: null });
    mockSendEmail.mockResolvedValue({ success: true });
  });

  it("rejects bots before anything else", async () => {
    mockCheckBotId.mockResolvedValue({ isBot: true });
    delete process.env.RESEND_API_KEY;
    const response = await post({ email: "a@b.co", answers: fullAnswers });
    expect(response.status).toBe(403);
    expect(mockUpsertContact).not.toHaveBeenCalled();
  });

  it("rejects an incomplete diagnostic without storing or sending", async () => {
    const { [DIMENSIONS[0].questions[0].id]: _dropped, ...partial } =
      fullAnswers;
    const response = await post({ email: "a@b.co", answers: partial });
    expect(response.status).toBe(400);
    expect(mockUpsertContact).not.toHaveBeenCalled();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("rejects a bad email", async () => {
    const response = await post({ email: "nope", answers: fullAnswers });
    expect(response.status).toBe(400);
    expect(mockUpsertContact).not.toHaveBeenCalled();
  });

  it("stores the contact and emails the owner a PDF report", async () => {
    const response = await post({
      email: "founder@example.com",
      firstName: "Sam",
      answers: fullAnswers,
    });
    expect(response.status).toBe(200);
    expect(mockUpsertContact).toHaveBeenCalledWith({
      email: "founder@example.com",
      firstName: "Sam",
    });
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    const call = mockSendEmail.mock.calls[0][0];
    expect(call.to).toBe("owner@example.com");
    expect(call.replyTo).toBe("founder@example.com");
    expect(call.subject).toMatch(/founder@example\.com/);
    const pdf: Buffer = call.attachments[0].content;
    expect(call.attachments[0].filename).toMatch(/\.pdf$/);
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(2000);
    if (process.env.DIAGNOSTIC_PDF_OUT) {
      writeFileSync(process.env.DIAGNOSTIC_PDF_OUT, pdf);
    }
  });

  it("still unlocks the verdict when the report email fails", async () => {
    mockSendEmail.mockResolvedValue({ success: false, error: "boom" });
    const response = await post({ email: "a@b.co", answers: fullAnswers });
    expect(response.status).toBe(200);
  });

  it("fails closed when the contact cannot be stored", async () => {
    mockUpsertContact.mockResolvedValue({ error: { message: "down" } });
    const response = await post({ email: "a@b.co", answers: fullAnswers });
    expect(response.status).toBe(500);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});
