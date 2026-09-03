import { Resend } from "resend";

let client: Resend | null = null;

/**
 * Resend client, built on first use. Importing this module must never throw:
 * route modules are imported at build time for page-data collection, where
 * runtime secrets are absent, and `new Resend(undefined)` throws.
 */
function getResendClient(): Resend {
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

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
}: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Resend] RESEND_API_KEY not configured. Email not sent.");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const emailData: Record<string, unknown> = {
      from,
      to,
      subject,
    };

    if (text) emailData.text = text;
    if (html) emailData.html = html;
    if (replyTo) emailData.replyTo = replyTo;

    const { data, error } = await getResendClient().emails.send(
      emailData as unknown as Parameters<Resend["emails"]["send"]>[0],
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
