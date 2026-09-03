import {
  downloadPageUrl,
  downloadUrl,
  modulesFromSession,
} from "@/lib/skill/purchase";
import { SKILL_MODULE_IDS } from "@/lib/data/skill-catalog";

describe("modulesFromSession", () => {
  it("reads the SKU written into the session metadata", () => {
    expect(
      modulesFromSession({ metadata: { sku: "researcher" }, line_items: null }),
    ).toEqual(["researcher"]);
  });

  it("expands the bundle SKU to every module", () => {
    expect(
      modulesFromSession({ metadata: { sku: "bundle" }, line_items: null }),
    ).toEqual([...SKILL_MODULE_IDS]);
  });

  it("ignores a SKU that is not in the catalog", () => {
    expect(
      modulesFromSession({ metadata: { sku: "free-lunch" }, line_items: null }),
    ).toEqual([]);
  });

  it("falls back to line-item prices and unions both sources without duplicates", () => {
    // No Stripe ids are set in the catalog yet, so a price id resolves to
    // nothing; the metadata still carries the sale.
    const result = modulesFromSession({
      metadata: { sku: "diagram" },
      line_items: {
        object: "list",
        data: [
          {
            price: { id: "price_unknown" },
          } as never,
        ],
        has_more: false,
        url: "",
      },
    });
    expect(result).toEqual(["diagram"]);
  });
});

describe("urls", () => {
  it("builds a download URL that carries the grant and the module", () => {
    const url = new URL(
      downloadUrl("https://work.randyellis.design", "tok.sig", "researcher"),
    );
    expect(url.pathname).toBe("/api/skill/download");
    expect(url.searchParams.get("t")).toBe("tok.sig");
    expect(url.searchParams.get("skill")).toBe("researcher");
  });

  it("builds the durable success-page URL for a session", () => {
    expect(downloadPageUrl("https://work.randyellis.design", "cs_123")).toBe(
      "https://work.randyellis.design/skill/success?session_id=cs_123",
    );
  });
});
