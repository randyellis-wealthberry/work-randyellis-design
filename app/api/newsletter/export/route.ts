import { NextRequest, NextResponse } from "next/server";
import { emailStorage } from "@/lib/email-storage";

export async function GET(request: NextRequest) {
  try {
    // Basic API key protection (in production, use proper authentication)
    const authHeader = request.headers.get("authorization");
    const expectedAuth = process.env.ADMIN_API_KEY;

    if (!expectedAuth || authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await emailStorage.exportData();

    return NextResponse.json({
      success: true,
      data,
      exportedAt: new Date().toISOString(),
      totalRecords: data.length,
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Basic API key protection
    const authHeader = request.headers.get("authorization");
    const expectedAuth = process.env.ADMIN_API_KEY;

    if (!expectedAuth || authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const subscription = await emailStorage.getSubscription(email);

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error("Individual export error:", error);
    return NextResponse.json(
      { error: "Failed to export individual data" },
      { status: 500 },
    );
  }
}
