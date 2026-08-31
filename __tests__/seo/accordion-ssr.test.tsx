/**
 * Phase 13 (T-01/T-02): collapsed accordion content must exist in the markup.
 *
 * AI crawlers don't run JS. The core accordion previously unmounted collapsed
 * children (`{isExpanded && …}`), which removed the homepage FAQ answers and
 * the blog archive's per-post links from the server HTML. These tests pin the
 * mounted-but-collapsed contract, and that the FAQPage JSON-LD mirrors the
 * same FAQS array the accordion renders.
 */
import { render, screen } from "@testing-library/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/core/accordion";
import { BlogArchiveAccordion } from "@/components/blog/blog-archive-accordion";
import { getBlogArticles } from "@/lib/utils/blog-data";
import { FAQS } from "@/lib/data/faqs";
import { buildFaqPageSchema } from "@/lib/seo/json-ld";

describe("core accordion keeps collapsed content mounted (T-01)", () => {
  it("renders collapsed item content in the DOM, hidden from the a11y tree", () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="one">
          <AccordionTrigger>Question one</AccordionTrigger>
          <AccordionContent>
            <p>Collapsed answer text that crawlers must see</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    // No item is expanded (no defaultValue) — content must still be in DOM…
    expect(container.textContent).toContain(
      "Collapsed answer text that crawlers must see",
    );
    // …but hidden from assistive tech until expanded.
    const region = container.querySelector('[aria-hidden="true"]');
    expect(region).not.toBeNull();
    expect(region?.textContent).toContain("Collapsed answer text");
  });

  it("marks expanded content visible when defaultValue matches", () => {
    const { container } = render(
      <Accordion defaultValue="one">
        <AccordionItem value="one">
          <AccordionTrigger>Question one</AccordionTrigger>
          <AccordionContent>
            <p>Expanded answer</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});

describe("blog archive ships crawlable post links (T-01)", () => {
  it("renders an anchor to every article even with all items collapsed", () => {
    render(<BlogArchiveAccordion />);
    for (const article of getBlogArticles()) {
      const links = Array.from(
        document.querySelectorAll(`a[href="/blog/${article.slug}"]`),
      );
      expect(links.length).toBeGreaterThan(0);
    }
  });
});

describe("FAQPage JSON-LD mirrors the visible FAQ data (T-02)", () => {
  it("emits one Question per FAQ with matching text", () => {
    const schema = buildFaqPageSchema(FAQS);
    expect(schema["@type"]).toBe("FAQPage");
    const questions = schema.mainEntity as Array<{
      "@type": string;
      name: string;
      acceptedAnswer: { "@type": string; text: string };
    }>;
    expect(questions).toHaveLength(FAQS.length);
    FAQS.forEach((faq, i) => {
      expect(questions[i].name).toBe(faq.question);
      expect(questions[i].acceptedAnswer.text).toBe(faq.answer);
    });
  });

  it("is mounted on the homepage from the same FAQS constant", () => {
    // Structural pin: app/page.tsx must import both the FAQS data module and
    // the schema builder — a second hand-typed copy is the failure mode.
    const fs = require("fs");
    const source = fs.readFileSync("app/page.tsx", "utf8");
    expect(source).toMatch(/from "@\/lib\/data\/faqs"/);
    expect(source).toMatch(/buildFaqPageSchema\(FAQS\)/);
  });
});
