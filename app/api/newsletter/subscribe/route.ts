import { NextRequest, NextResponse } from "next/server";
import { LoopsClient } from "loops";
import { z } from "zod";

const loops = new LoopsClient(process.env.LOOPS_API_KEY as string);

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check for required environment variables
    if (!process.env.LOOPS_API_KEY) {
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

    const { email, firstName } = result.data;

    // Add contact to Loops.so
    try {
      const resp = await loops.updateContact(email, {
        firstName: firstName || "",
        source: "Website newsletter signup",
        subscribed: true,
        // Add any custom properties you want to track
        signupSource: "Newsletter form",
        signupDate: new Date().toISOString(),
        userAgent: request.headers.get("user-agent") || "",
        referer: request.headers.get("referer") || "",
      });

      if (!resp.success) {
        console.error("Loops API error:", resp);
        return NextResponse.json(
          { error: "Failed to subscribe. Please try again." },
          { status: 400 },
        );
      }

      console.log(
        `Successfully added contact to Loops: ${email} (ID: ${resp.id})`,
      );
    } catch (error) {
      console.error("Loops subscription error:", error);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
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
        // Log the error but don't fail the request
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
