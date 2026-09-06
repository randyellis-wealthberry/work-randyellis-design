import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn(
    "[Resend] RESEND_API_KEY not configured. Email sending will fail.",
  );
}

/**
 * Resend client instance
 * Docs: https://resend.com/docs/send-with-nodejs
 */
export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Default sender email for transactional emails
 * Format: "Name <email@domain.com>"
 */
export const RESEND_FROM =
  process.env.RESEND_FROM || "Randy Ellis <hello@randyellis.design>";

/**
 * Send a simple text email via Resend
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
  from = RESEND_FROM,
  replyTo,
  attachments,
}: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer }[];
}) {
  try {
    const emailData: Record<string, unknown> = {
      from,
      to,
      subject,
    };

    if (text) emailData.text = text;
    if (html) emailData.html = html;
    if (replyTo) emailData.replyTo = replyTo;
    if (attachments) emailData.attachments = attachments;

    const { data, error } = await resend.emails.send(
      emailData as unknown as Parameters<typeof resend.emails.send>[0],
    );

    if (error) {
      console.error("[Resend] Email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("[Resend] Email send exception:", err);
    return { success: false, error: err };
  }
}
