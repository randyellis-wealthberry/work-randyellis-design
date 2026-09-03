import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  isSkillSku,
  modulesForSku,
  skuForStripePrice,
  type SkillModuleId,
} from "@/lib/data/skill-catalog";

/**
 * What one Checkout Session entitles a buyer to, resolved from Stripe.
 *
 * Two sources are consulted and unioned. The `sku` written into the session's
 * metadata at creation is the intended one; the line items' price ids are the
 * fallback for a session created outside this site (a Payment Link, a manual
 * invoice) that still sells a catalog price. Either alone would be enough on a
 * good day; both together mean a buyer never lands on an empty download page
 * because of how the sale was rung up.
 */
export type Purchase = {
  sessionId: string;
  email: string | null;
  modules: SkillModuleId[];
  paid: boolean;
};

export function modulesFromSession(
  session: Pick<Stripe.Checkout.Session, "metadata" | "line_items">,
): SkillModuleId[] {
  const ids = new Set<SkillModuleId>();

  const metaSku = session.metadata?.sku;
  if (metaSku && isSkillSku(metaSku)) {
    for (const id of modulesForSku(metaSku)) ids.add(id);
  }

  for (const item of session.line_items?.data ?? []) {
    const priceId =
      typeof item.price === "string" ? item.price : (item.price?.id ?? null);
    if (!priceId) continue;
    const sku = skuForStripePrice(priceId);
    if (!sku) continue;
    for (const id of modulesForSku(sku)) ids.add(id);
  }

  return [...ids];
}

export async function retrievePurchase(sessionId: string): Promise<Purchase> {
  const session = await getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });
  return {
    sessionId: session.id,
    email: session.customer_details?.email ?? null,
    modules: modulesFromSession(session),
    paid: session.payment_status === "paid",
  };
}

/** The URL a buyer follows to fetch one module with a signed grant. */
export function downloadUrl(
  baseUrl: string,
  token: string,
  moduleId: SkillModuleId,
): string {
  const url = new URL("/api/skill/download", baseUrl);
  url.searchParams.set("t", token);
  url.searchParams.set("skill", moduleId);
  return url.toString();
}

/** The durable link: the success page for this session. */
export function downloadPageUrl(baseUrl: string, sessionId: string): string {
  const url = new URL("/skill/success", baseUrl);
  url.searchParams.set("session_id", sessionId);
  return url.toString();
}
