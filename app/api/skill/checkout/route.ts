import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { isPurchasable, resolveSku } from "@/lib/data/skill-catalog";
import { clientKey, rateLimit } from "@/lib/skill/rate-limit";
import { WEBSITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Starts a Stripe Checkout for one SKU and sends the buyer to Stripe's hosted
 * page.
 *
 * The buy buttons are plain HTML forms posting here, so checkout works with
 * scripts blocked and the JSON shape exists for anything that would rather
 * fetch. Sessions are created server-side from a price id rather than through
 * a Payment Link because the success URL, the cancel URL, and the SKU in the
 * metadata are then guaranteed on every sale; a Payment Link's redirect is a
 * dashboard setting that can be forgotten, and a buyer who lands on Stripe's
 * generic confirmation page has paid for a file they cannot reach.
 */
const RATE_MAX = 10;
const RATE_WINDOW_MS = 60 * 1000;

function baseUrl(request: NextRequest): string {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? WEBSITE_URL
    : request.nextUrl.origin;
}

async function readSku(request: NextRequest): Promise<string | null> {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as {
      sku?: unknown;
    } | null;
    return typeof body?.sku === "string" ? body.sku : null;
  }
  const form = await request.formData().catch(() => null);
  const sku = form?.get("sku");
  return typeof sku === "string" ? sku : null;
}

function wantsHtml(request: NextRequest): boolean {
  const accept = request.headers.get("accept") ?? "";
  const type = request.headers.get("content-type") ?? "";
  return accept.includes("text/html") && !type.includes("application/json");
}

function fail(
  request: NextRequest,
  status: number,
  message: string,
): NextResponse {
  if (wantsHtml(request)) {
    // A form post with nothing to redirect to: send the reader back to the
    // modules with the reason in the fragment-free query so the page can say
    // it in words. No JSON on a browser tab.
    const back = new URL("/skill", baseUrl(request));
    back.searchParams.set("checkout", "unavailable");
    back.hash = "modules";
    return NextResponse.redirect(back, 303);
  }
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const limit = rateLimit(
    `skill-checkout:${clientKey(request.headers)}`,
    RATE_MAX,
    RATE_WINDOW_MS,
  );
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Try again in a minute." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  const sku = await readSku(request);
  const entry = sku ? resolveSku(sku) : null;
  if (!entry) {
    return fail(request, 400, "Unknown module.");
  }

  const product = entry.kind === "bundle" ? entry.bundle : entry.module;
  if (!isPurchasable(product) || !product.stripePriceId) {
    return fail(request, 409, "Checkout for this module is not open yet.");
  }

  if (!isStripeConfigured()) {
    return fail(request, 503, "Checkout is not configured.");
  }

  const base = baseUrl(request);
  const success = new URL("/skill/success", base);
  success.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
  const cancel = new URL("/skill", base);
  cancel.hash = "modules";

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: product.stripePriceId, quantity: 1 }],
      // Stripe substitutes the id into the literal placeholder; encoding it
      // would hand the buyer a URL with the braces still in it.
      success_url: decodeURIComponent(success.toString()),
      cancel_url: cancel.toString(),
      metadata: { sku: product.id, site: "work.randyellis.design" },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    if (!session.url) {
      return fail(request, 502, "Stripe did not return a checkout URL.");
    }

    if (wantsHtml(request)) {
      return NextResponse.redirect(session.url, 303);
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[skill/checkout] session create failed", error);
    return fail(request, 502, "Could not start checkout.");
  }
}
