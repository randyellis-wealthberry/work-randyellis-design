import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const unsubscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const result = unsubscribeSchema.safeParse(await request.json());
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid email address" },
        { status: 400 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 },
      );
    }

    const resend = (await import("@/lib/email")).getResendClient();
    const { error } = await resend.contacts.update({
      email: result.data.email,
      unsubscribed: true,
    });

    if (error) {
      if (error.name === "not_found") {
        return NextResponse.json(
          { error: "Subscription not found" },
          { status: 404 },
        );
      }
      console.error("Resend unsubscribe error:", error);
      return NextResponse.json(
        { error: "Failed to unsubscribe. Please try again." },
        { status: 500 },
      );
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
