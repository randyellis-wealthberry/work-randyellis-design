#!/usr/bin/env tsx
/**
 * Test Resend Email Configuration
 *
 * Usage:
 *   npm run test:resend
 *
 * Or directly:
 *   tsx scripts/test-resend.ts
 *
 * Requires:
 *   - RESEND_API_KEY in .env.local
 *   - Domain verified on Resend (for production)
 */

import { sendEmail, sendWelcomeEmail } from "../lib/email";

async function testResend() {
  console.log("🧪 Testing Resend Email Configuration...\n");

  // Check env vars
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY not found in environment");
    console.log(
      "\n💡 Add to .env.local:\n   RESEND_API_KEY=re_your_key_here\n",
    );
    process.exit(1);
  }

  const fromEmail =
    process.env.RESEND_FROM || "Randy Ellis <hello@randyellis.design>";
  console.log(`📧 From: ${fromEmail}`);
  console.log(`🔑 API Key: ${process.env.RESEND_API_KEY.substring(0, 10)}...\n`);

  // Test email address (your email from CLAUDE.md)
  const testEmail = "randy@wealthbrry.com";

  try {
    // Test 1: Simple text email
    console.log("Test 1: Sending simple text email...");
    const result1 = await sendEmail({
      to: testEmail,
      subject: "Resend Test - Simple Email",
      text: "This is a test email from your portfolio site. If you receive this, Resend is configured correctly!",
    });

    if (result1.success) {
      console.log(`✅ Simple email sent! ID: ${result1.data?.id}\n`);
    } else {
      console.error("❌ Simple email failed:", result1.error);
      return;
    }

    // Test 2: HTML email with template
    console.log("Test 2: Sending HTML email...");
    const result2 = await sendEmail({
      to: testEmail,
      subject: "Resend Test - HTML Email",
      text: "This is the plain text version.",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2563eb;">Resend Test - HTML Email</h2>
  <p>This is a test HTML email with formatting:</p>
  <ul>
    <li><strong>Bold text</strong></li>
    <li><em>Italic text</em></li>
    <li><a href="https://work.randyellis.design" style="color: #2563eb;">Link to portfolio</a></li>
  </ul>
  <p style="color: #666; font-size: 14px;">If you see this formatted correctly, HTML emails are working!</p>
</body>
</html>
      `,
    });

    if (result2.success) {
      console.log(`✅ HTML email sent! ID: ${result2.data?.id}\n`);
    } else {
      console.error("❌ HTML email failed:", result2.error);
      return;
    }

    // Test 3: Welcome email template
    console.log("Test 3: Sending welcome email template...");
    const result3 = await sendWelcomeEmail({
      email: testEmail,
      name: "Randy",
    });

    if (result3.success) {
      console.log(`✅ Welcome email sent! ID: ${result3.data?.id}\n`);
    } else {
      console.error("❌ Welcome email failed:", result3.error);
      return;
    }

    console.log("✨ All tests passed!");
    console.log(
      `\n📬 Check ${testEmail} for 3 test emails from Resend.\n`,
    );
  } catch (error) {
    console.error("💥 Test failed with error:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  testResend().catch((error) => {
    console.error("💥 Unhandled error:", error);
    process.exit(1);
  });
}

export { testResend };
