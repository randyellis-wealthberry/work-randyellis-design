# Email System

Resend-based email system for transactional emails.

## Setup

1. **Get Resend API Key**
   - Sign up at https://resend.com
   - Create API key at https://resend.com/api-keys
   - Add to `.env.local`:
     ```bash
     RESEND_API_KEY=re_xxxxx
     RESEND_FROM="Randy Ellis <hello@randyellis.design>"
     ```

2. **Verify Domain** (Required for production)
   - Add domain at https://resend.com/domains
   - Add DNS records (see Resend dashboard)
   - Verify domain before sending

## Usage

### Send Welcome Email

```ts
import { sendWelcomeEmail } from "@/lib/email";

await sendWelcomeEmail({
  email: "user@example.com",
  name: "John Doe", // optional
});
```

### Send Contact Notification

```ts
import { sendContactNotification } from "@/lib/email";

await sendContactNotification({
  name: "John Doe",
  email: "john@example.com",
  message: "Hi, I'd like to work together!",
});
```

### Send Custom Email

```ts
import { sendEmail } from "@/lib/email";

await sendEmail({
  to: "user@example.com",
  subject: "Custom Email",
  text: "Plain text content",
  html: "<p>HTML content</p>",
  replyTo: "reply@example.com", // optional
});
```

## Current Integration

- **Newsletter Signup** → Loops (newsletter platform) + Resend (welcome email)
- **Contact Form** → Resend (notification to admin)

## Templates

Simple HTML templates in `lib/email/templates.ts`.

For complex templates, migrate to `@react-email/components` (see Waffle reference).

## Development

Resend works in development with API key. Emails sent to any address in dev mode.

## Production

**Must verify domain first** (randyellis.design on Resend).

Without verification, emails limited to verified sender addresses only.
