/**
 * Creates the Stripe products and prices for the Skill.md catalog, then
 * prints the price ids to paste into lib/data/skill-catalog.ts.
 *
 * Run once the amounts are set in the catalog:
 *
 *   npm run skill:stripe-sync
 *
 * Idempotent: a product is found by its `sku` metadata before one is created,
 * and a price is reused when one already exists at the same amount. Nothing
 * is deleted. Requires STRIPE_SECRET_KEY in .env.local.
 */
import Stripe from "stripe";
import {
  SKILL_BUNDLE,
  SKILL_MODULES,
  type SkillBundle,
  type SkillModule,
} from "../lib/data/skill-catalog";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY is not set. Add it to .env.local first.");
  process.exit(1);
}
const stripe = new Stripe(key);

async function findProduct(sku: string): Promise<Stripe.Product | null> {
  const result = await stripe.products.search({
    query: `metadata['sku']:'${sku}' AND metadata['site']:'work.randyellis.design'`,
    limit: 1,
  });
  return result.data[0] ?? null;
}

async function ensurePrice(
  product: Stripe.Product,
  amount: number,
): Promise<Stripe.Price> {
  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 100,
  });
  const existing = prices.data.find(
    (p) =>
      p.unit_amount === amount && p.currency === "usd" && p.type === "one_time",
  );
  if (existing) return existing;
  return stripe.prices.create({
    product: product.id,
    unit_amount: amount,
    currency: "usd",
  });
}

async function sync(entry: SkillModule | SkillBundle): Promise<string | null> {
  if (entry.price.amount === null) {
    console.log(`- ${entry.id}: no amount set, skipped`);
    return null;
  }
  const description =
    "summary" in entry ? entry.summary : "Every Skill.md module, one checkout.";
  const name =
    entry.id === "bundle"
      ? "Skill.md: all six modules"
      : `Skill.md: ${entry.name}`;

  let product = await findProduct(entry.id);
  if (!product) {
    product = await stripe.products.create({
      name,
      description,
      metadata: { sku: entry.id, site: "work.randyellis.design" },
      url: "https://work.randyellis.design/skill",
    });
    console.log(`+ created product ${product.id} for ${entry.id}`);
  } else {
    console.log(`= product ${product.id} for ${entry.id}`);
  }

  const price = await ensurePrice(product, entry.price.amount);
  console.log(
    `  price ${price.id} at $${(entry.price.amount / 100).toFixed(2)}`,
  );
  return price.id;
}

async function main() {
  const lines: string[] = [];
  for (const module of SKILL_MODULES) {
    const id = await sync(module);
    if (id) lines.push(`${module.id}: stripePriceId: "${id}"`);
  }
  const bundleId = await sync(SKILL_BUNDLE);
  if (bundleId) lines.push(`bundle: stripePriceId: "${bundleId}"`);

  console.log("\nPaste into lib/data/skill-catalog.ts:\n");
  for (const line of lines) console.log(`  ${line}`);
  console.log(
    "\nThen add the webhook: Developers → Webhooks → https://work.randyellis.design/api/skill/webhook, event checkout.session.completed, and set STRIPE_WEBHOOK_SECRET.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
