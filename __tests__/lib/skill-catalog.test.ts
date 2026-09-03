import {
  SKILL_BUNDLE,
  SKILL_MODULES,
  SKILL_MODULE_IDS,
  formatSkillPrice,
  isPurchasable,
  modulesForSku,
  resolveSku,
  skuForStripePrice,
} from "@/lib/data/skill-catalog";

describe("skill catalog", () => {
  it("lists six modules with unique ids matching the id list", () => {
    expect(SKILL_MODULES).toHaveLength(6);
    const ids = SKILL_MODULES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...SKILL_MODULE_IDS]);
    expect(SKILL_BUNDLE.includes).toEqual([...SKILL_MODULE_IDS]);
  });

  it("gives every module the public face the page needs", () => {
    for (const module of SKILL_MODULES) {
      expect(module.name.length).toBeGreaterThan(0);
      expect(module.role.length).toBeGreaterThan(0);
      expect(module.tagline.length).toBeLessThanOrEqual(120);
      expect(module.summary.length).toBeLessThanOrEqual(340);
      expect(module.produces.length).toBeGreaterThanOrEqual(3);
      expect(module.useWhen.length).toBeGreaterThan(0);
      expect(module.preview.split("\n").length).toBeGreaterThan(10);
      expect(module.sample.length).toBeGreaterThan(0);
    }
  });

  it("keeps previews honest about the boundary with the free file", () => {
    // The preview is a taste, never the module: no review checklist, no
    // procedure, and none of the module's own frontmatter leaks out.
    for (const module of SKILL_MODULES) {
      expect(module.preview).not.toContain("## Procedure");
      expect(module.preview).not.toContain("## Review checklist");
      expect(module.preview).not.toMatch(/^---\nname:/);
    }
  });

  it("uses only figures from published work in the samples", () => {
    // A spot check on the numbers that drift most easily: organization size
    // never stands in for team size, and validation numbers say so.
    const all = SKILL_MODULES.map((m) => m.sample + m.preview).join("\n");
    expect(all).not.toMatch(/18,000\+? designers/);
    expect(all).not.toMatch(/led 18,000/i);
  });

  it("starts unpriced, so nothing is purchasable until the numbers are set", () => {
    for (const entry of [...SKILL_MODULES, SKILL_BUNDLE]) {
      expect(entry.price.amount).toBeNull();
      expect(entry.stripePriceId).toBeNull();
      expect(isPurchasable(entry)).toBe(false);
    }
  });

  it("treats a price without a Stripe id, or the reverse, as not purchasable", () => {
    const base = SKILL_MODULES[0];
    expect(
      isPurchasable({ ...base, price: { amount: 4900, currency: "usd" } }),
    ).toBe(false);
    expect(isPurchasable({ ...base, stripePriceId: "price_x" })).toBe(false);
    expect(
      isPurchasable({
        ...base,
        price: { amount: 4900, currency: "usd" },
        stripePriceId: "price_x",
      }),
    ).toBe(true);
  });

  it("resolves SKUs to a module or the bundle and rejects the rest", () => {
    expect(resolveSku("researcher")).toMatchObject({ kind: "module" });
    expect(resolveSku("bundle")).toMatchObject({ kind: "bundle" });
    expect(resolveSku("everything")).toBeNull();
    expect(modulesForSku("diagram")).toEqual(["diagram"]);
    expect(modulesForSku("bundle")).toEqual([...SKILL_MODULE_IDS]);
  });

  it("maps no Stripe price to a SKU until ids are set", () => {
    expect(skuForStripePrice("price_nothing")).toBeNull();
  });

  it("formats whole-dollar prices without cents and null as null", () => {
    expect(formatSkillPrice({ amount: 4900, currency: "usd" })).toBe("$49");
    expect(formatSkillPrice({ amount: 4950, currency: "usd" })).toBe("$49.50");
    expect(formatSkillPrice({ amount: null, currency: "usd" })).toBeNull();
  });
});
