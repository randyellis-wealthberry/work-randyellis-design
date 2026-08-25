import { NextResponse } from "next/server";
import { emailStorage } from "@/lib/email-storage";
import { isAdminRequest, unauthorized } from "@/lib/security/admin-auth";

export async function GET(request: Request) {
  try {
    // Subscriber counts, growth and provider breakdown are business data, not
    // public metrics — the same gate the export endpoint has always had.
    if (!isAdminRequest(request)) return unauthorized();

    const stats = await emailStorage.getStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Stats retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve statistics" },
      { status: 500 },
    );
  }
}
