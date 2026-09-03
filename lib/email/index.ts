/**
 * Email utilities barrel export
 * Centralizes email sending logic for the application
 */

export { RESEND_FROM, sendEmail } from "./resend";
export { emailTemplates } from "./templates";

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
    to: "randy@wealthbrry.com", // Your email from CLAUDE.md
    subject: template.subject,
    text: template.text,
    html: template.html,
    replyTo: email,
  });
}
