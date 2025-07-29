import { NextResponse } from "next/server";
import { emailStorage } from "@/lib/email-storage";

export async function GET() {
  try {
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
