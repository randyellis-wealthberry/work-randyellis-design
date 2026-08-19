/**
 * Email templates for transactional emails
 * Simple HTML templates - can migrate to @react-email/components later
 */

export const emailTemplates = {
  /**
   * Welcome email for new newsletter subscribers
   */
  welcomeNewsletter: ({ name, email }: { name?: string; email: string }) => ({
    subject: "Welcome to Randy's Newsletter",
    text: `Hi${name ? ` ${name}` : ""},

Thanks for subscribing to my newsletter! You'll receive weekly insights on design strategy, AI product design, and fractional leadership.

You can unsubscribe at any time using the link in each email.

Best,
Randy Ellis
Fractional Chief Design Officer & AI Product Designer

---
Email: ${email}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2563eb; margin-bottom: 20px;">Welcome to Randy's Newsletter</h2>

  <p>Hi${name ? ` ${name}` : ""},</p>

  <p>Thanks for subscribing to my newsletter! You'll receive weekly insights on design strategy, AI product design, and fractional leadership.</p>

  <p style="color: #666; font-size: 14px;">You can unsubscribe at any time using the link in each email.</p>

  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
    <p style="margin: 0; font-weight: 600;">Randy Ellis</p>
    <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Fractional Chief Design Officer & AI Product Designer</p>
  </div>

  <div style="margin-top: 20px; padding: 10px; background: #f3f4f6; border-radius: 4px; font-size: 12px; color: #6b7280;">
    <p style="margin: 0;">Email: ${email}</p>
  </div>
</body>
</html>
`,
  }),

  /**
   * Contact form notification
   */
  contactFormNotification: ({
    name,
    email,
    message,
  }: {
    name: string;
    email: string;
    message: string;
  }) => ({
    subject: `[Portfolio Contact] New message from ${name}`,
    text: `New contact form submission:

From: ${name} (${email})

Message:
${message}

---
Sent from work.randyellis.design contact form`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2563eb; margin-bottom: 20px;">New Contact Form Submission</h2>

  <div style="background: #f3f4f6; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
    <p style="margin: 0; font-weight: 600;">From:</p>
    <p style="margin: 5px 0 0;">${name} (<a href="mailto:${email}">${email}</a>)</p>
  </div>

  <div style="background: #fff; border: 1px solid #e5e7eb; padding: 15px; border-radius: 4px;">
    <p style="margin: 0 0 10px; font-weight: 600; color: #666;">Message:</p>
    <p style="margin: 0; white-space: pre-wrap;">${message}</p>
  </div>

  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
    <p style="margin: 0;">Sent from work.randyellis.design contact form</p>
  </div>
</body>
</html>
`,
  }),
} as const;
