import "server-only";
import Stripe from "stripe";

/**
 * The Stripe client, created on first use.
 *
 * Not at module load: `next build` evaluates route modules without the
 * production environment, and a constructor that throws on a missing key
 * would fail the build for every deploy that has not set one yet. The
 * routes call `isStripeConfigured()` first and answer 503 with a plain
 * sentence when it is false, so a misconfiguration reads as "checkout is not
 * open" rather than as a stack trace.
 */
let client: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    client = new Stripe(key, {
      appInfo: {
        name: "work.randyellis.design",
        url: "https://work.randyellis.design/skill",
      },
    });
  }
  return client;
}

/** Test seam: drop the cached client so a test can swap the env. */
export function resetStripeClient(): void {
  client = null;
}
