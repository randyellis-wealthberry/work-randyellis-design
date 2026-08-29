import type { Metadata } from "next";
import HomeClient from "@/app/home-client";
import { JsonLd } from "@/components/seo/json-ld";
import { buildFaqPageSchema } from "@/lib/seo/json-ld";
import { FAQS } from "@/lib/data/faqs";

// Server wrapper per the repo's page.tsx → *-client.tsx convention (Phase 13
// T-09). The homepage was a "use client" page and could not export metadata —
// it rode entirely on the root-layout defaults. Values below intentionally
// match those defaults (no live-behavior change); this is the tuning point.
export const metadata: Metadata = {
  title: { absolute: "Randy Ellis | Head of Product & Fractional CDO" },
  description:
    "Head of Product & Fractional Chief Design Officer helping startups ship design-led AI products. 500M+ users impacted, $500M+ product value delivered.",
};

export default function Home() {
  return (
    <>
      {/* FAQPage schema mirrors the visible "Questions founders ask"
          accordion — both read the same FAQS array (T-02). */}
      <JsonLd id="faqpage-jsonld" data={buildFaqPageSchema(FAQS)} />
      <HomeClient />
    </>
  );
}
