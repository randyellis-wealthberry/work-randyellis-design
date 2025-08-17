import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { emailStorage } from "@/lib/email-storage";

const unsubscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  reason: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = unsubscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid email address" },
        { status: 400 },
      );
    }

    const { email, reason } = result.data;

    // Update local storage
    const updated = await emailStorage.updateSubscriptionStatus(
      email,
      "unsubscribed",
      {
        unsubscribeReason: reason,
        unsubscribeDate: new Date().toISOString(),
      },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      );
    }

    // Unsubscribe from Loops.so if API key is available
    if (process.env.LOOPS_API_KEY) {
      try {
        const loopsResponse = await fetch("https://app.loops.so/api/v1/contacts/update", {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${process.env.LOOPS_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            subscribed: false,
          }),
        });

        if (!loopsResponse.ok) {
          console.warn("Failed to unsubscribe from Loops.so:", loopsResponse.statusText);
        }
      } catch (loopsError) {
        console.warn("Error unsubscribing from Loops.so:", loopsError);
        // Don't fail the entire operation if Loops unsubscribe fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from newsletter.",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
