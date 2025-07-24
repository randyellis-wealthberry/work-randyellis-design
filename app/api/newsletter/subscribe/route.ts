import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    // Check for required environment variables
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const result = emailSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid email address" },
        { status: 400 },
      );
    }

    const { email } = result.data;

    // Send confirmation email via Resend
    try {
      const { error: emailError } = await resend.emails.send({
        from: "Randy Ellis Design <noreply@randyellis.design>",
        to: [email],
        subject: "Welcome to Business Strategy Prompts for Product Designers",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Welcome to Business Strategy Prompts!</h1>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for subscribing to our newsletter. You'll receive weekly insights that bridge design thinking with business strategy.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; font-size: 18px; margin: 0 0 10px 0;">What to expect:</h2>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li>Weekly strategic prompts for product designers</li>
                <li>Business strategy insights</li>
                <li>Tips to become a strategic partner in the boardroom</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              Randy Ellis<br>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://randyellis.design"}" style="color: #0066cc;">randyellis.design</a>
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              You can unsubscribe at any time by replying to this email.
            </p>
          </div>
        `,
      });

      if (emailError) {
        console.error("Resend email error:", emailError);
        return NextResponse.json(
          { error: "Failed to send confirmation email. Please try again." },
          { status: 500 },
        );
      }
    } catch (error) {
      console.error("Email sending error:", error);
      return NextResponse.json(
        { error: "Failed to send confirmation email. Please try again." },
        { status: 500 },
      );
    }

    // Trigger Zapier webhook (optional - don't fail if this fails)
    if (process.env.ZAPIER_WEBHOOK_URL) {
      try {
        await fetch(process.env.ZAPIER_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            timestamp: new Date().toISOString(),
            source: "newsletter-signup",
            metadata: {
              userAgent: request.headers.get("user-agent"),
              referer: request.headers.get("referer"),
            },
          }),
        });
      } catch (webhookError) {
        // Log the error but don't fail the request
        console.error("Zapier webhook error:", webhookError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed! Check your email for confirmation.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
