/**
 * Email utilities barrel export
 * Centralizes email sending logic for the application
 */

export { RESEND_FROM, getResendClient, sendEmail } from "./resend";
export { emailTemplates } from "./templates";

/** Where site notifications land (contact form, diagnostic reports). */
export const OWNER_EMAIL = "randy@wealthbrry.com";

/**
 * Add an address to the Resend contact list, or re-activate it if it is
 * already there. Resend keeps one contact per email, so a returning or
 * previously unsubscribed reader is an update, not an error.
 */
export async function upsertContact({
  email,
  firstName,
}: {
  email: string;
  firstName?: string;
}): Promise<{ error: { message: string } | null }> {
  const resend = (await import("./resend")).getResendClient();
  const segmentId = process.env.RESEND_SEGMENT_ID;
  const created = await resend.contacts.create({
    email,
    firstName,
    unsubscribed: false,
    ...(segmentId && { segments: [{ id: segmentId }] }),
  });
  if (!created.error) return { error: null };
  if (!/already exists/i.test(created.error.message)) {
    return { error: created.error };
  }
  const updated = await resend.contacts.update({
    email,
    unsubscribed: false,
    ...(firstName && { firstName }),
  });
  return { error: updated.error ?? null };
}

/**
 * Send welcome email to new newsletter subscriber
 */
export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string;
  name?: string;
}) {
  // Only send if Resend is configured
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "[Email] RESEND_API_KEY not configured, skipping welcome email",
    );
    return { success: false, error: "Email service not configured" };
  }

  const { sendEmail } = await import("./resend");
  const { emailTemplates } = await import("./templates");

  const template = emailTemplates.welcomeNewsletter({ name, email });

  return sendEmail({
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
}

/**
 * Send contact form notification
 */
export async function sendContactNotification({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "[Email] RESEND_API_KEY not configured, skipping contact notification",
    );
    return { success: false, error: "Email service not configured" };
  }

  const { sendEmail } = await import("./resend");
  const { emailTemplates } = await import("./templates");

  const template = emailTemplates.contactFormNotification({
    name,
    email,
    message,
  });

  return sendEmail({
    to: OWNER_EMAIL,
    subject: template.subject,
    text: template.text,
    html: template.html,
    replyTo: email,
  });
}
