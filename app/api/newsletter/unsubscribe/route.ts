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

    // TODO: Also unsubscribe from Loops.so if needed
    // This would require implementing the Loops unsubscribe API call

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
