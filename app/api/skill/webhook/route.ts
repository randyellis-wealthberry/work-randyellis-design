import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import {
  retrievePurchase,
  downloadUrl,
  downloadPageUrl,
} from "@/lib/skill/purchase";
import { signDownloadGrant } from "@/lib/skill/download-token";
import { buildReceiptEmail } from "@/lib/skill/receipt-email";
import { sendEmail } from "@/lib/email/resend";
import { WEBSITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Stripe → receipt email.
 *
 * The success page already delivers the files the moment payment clears, so
 * this is the second copy: the email a buyer finds a month later when they
 * set up a new machine. It is not on the critical path of a sale, which is
 * why every failure here answers 200 after logging. Stripe retries a
 * non-2xx for days, and a retry storm for a missing Resend key helps nobody.
 * The one 400 is a bad signature, which is a request that should not have
 * been accepted at all.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!isStripeConfigured() || !secret) {
    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  const raw = await request.text();
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, signature, secret);
  } catch (error) {
    console.warn("[skill/webhook] signature rejected", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.metadata?.site !== "work.randyellis.design") {
    // A shared Stripe account may ring up other things. Not ours to deliver.
    return NextResponse.json({ received: true, ignored: "other site" });
  }
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true, ignored: "unpaid" });
  }

  try {
    const purchase = await retrievePurchase(session.id);
    if (purchase.modules.length === 0) {
      console.warn("[skill/webhook] paid session with no catalog modules", {
        session: session.id,
      });
      return NextResponse.json({ received: true, delivered: false });
    }
    if (!purchase.email) {
      console.warn("[skill/webhook] paid session with no email", {
        session: session.id,
      });
      return NextResponse.json({ received: true, delivered: false });
    }

    const token = signDownloadGrant({
      sid: purchase.sessionId,
      skills: purchase.modules,
    });
    const receipt = buildReceiptEmail({
      downloadPageUrl: downloadPageUrl(WEBSITE_URL, purchase.sessionId),
      files: purchase.modules.map((id) => ({
        id,
        url: downloadUrl(WEBSITE_URL, token, id),
      })),
      installPath: ".claude/skills/",
    });

    if (!process.env.RESEND_API_KEY) {
      console.warn("[skill/webhook] RESEND_API_KEY not set; receipt not sent", {
        session: session.id,
      });
      return NextResponse.json({ received: true, delivered: false });
    }

    const result = await sendEmail({
      to: purchase.email,
      subject: receipt.subject,
      text: receipt.text,
      html: receipt.html,
      replyTo: "randy@wealthbrry.com",
    });
    return NextResponse.json({ received: true, delivered: result.success });
  } catch (error) {
    console.error("[skill/webhook] delivery failed", error);
    return NextResponse.json({ received: true, delivered: false });
  }
}
