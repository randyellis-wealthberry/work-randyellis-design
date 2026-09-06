import { NextRequest, NextResponse } from "next/server";
import { checkBotId } from "botid/server";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // First, before any work and before touching configuration. A bot that
    // gets a 500 here learns whether RESEND_API_KEY is set; a bot that gets a
    // 403 learns nothing.
    const verification = await checkBotId();
    if (verification.isBot) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 },
      );
    }

    const result = emailSchema.safeParse(await request.json());
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid email address" },
        { status: 400 },
      );
    }
    const { email, firstName } = result.data;

    const { resend, sendWelcomeEmail } = await import("@/lib/email");
    const segmentId = process.env.RESEND_SEGMENT_ID;
    const { error } = await resend.contacts.create({
      email,
      firstName,
      unsubscribed: false,
      ...(segmentId && { segments: [{ id: segmentId }] }),
    });

    if (error) {
      // Resend contacts are one per email. Re-subscribing an existing (maybe
      // unsubscribed) reader is an update, not a failure.
      if (/already exists/i.test(error.message)) {
        const updated = await resend.contacts.update({
          email,
          unsubscribed: false,
          ...(firstName && { firstName }),
        });
        if (updated.error) {
          console.error("Resend contact update error:", updated.error);
          return NextResponse.json(
            { error: "Failed to subscribe. Please try again." },
            { status: 500 },
          );
        }
      } else {
        console.error("Resend contact create error:", error);
        return NextResponse.json(
          { error: "Failed to subscribe. Please try again." },
          { status: 500 },
        );
      }
    }

    // Welcome email is best effort. The subscription already succeeded.
    sendWelcomeEmail({ email, name: firstName }).catch((err) =>
      console.error("Resend welcome email error:", err),
    );

    // Trigger Zapier webhook (optional - don't fail if this fails)
    if (process.env.ZAPIER_WEBHOOK_URL) {
      try {
        await fetch(process.env.ZAPIER_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            firstName: firstName || "",
            timestamp: new Date().toISOString(),
            source: "newsletter-signup",
            metadata: {
              userAgent: request.headers.get("user-agent"),
              referer: request.headers.get("referer"),
            },
          }),
        });
      } catch (webhookError) {
        console.error("Zapier webhook error:", webhookError);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Successfully subscribed! You'll receive a confirmation email shortly.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
