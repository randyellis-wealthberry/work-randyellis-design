/**
 * What a founder asks before booking. Kept verbatim from the previous
 * homepage — these answer real objections.
 *
 * Single source for BOTH the visible "Questions founders ask" accordion and
 * the FAQPage JSON-LD (Phase 13 T-02): schema and page can't drift apart if
 * they read the same array. Do not fork this data into either call site.
 */
export const FAQS = [
  {
    id: "ai-design-approach",
    question: "What's your approach to AI in design?",
    answer:
      "I believe AI should enhance human creativity, not replace it. My work on the AI Design System Generator demonstrates how AI can accelerate the design process while maintaining design quality and accessibility. I focus on leveraging AI to automate repetitive tasks, generate intelligent suggestions, and help designers make more informed decisions based on data and user behavior patterns.",
  },
  {
    id: "design-development-bridge",
    question: "How do you bridge design and development?",
    answer:
      "With a background spanning both design leadership and hands-on development, I understand the challenges on both sides. I create design systems that are technically feasible, write production-ready React code, and ensure designs translate seamlessly to implementation. My approach involves early technical validation, component-driven design, and close collaboration between design and engineering teams throughout the product development lifecycle.",
  },
  {
    id: "scaling-products",
    question: "What's your experience with scaling products?",
    answer:
      "I've led products that have reached significant scale, including GrowIt, one of the fastest-growing gardening apps in the U.S., which at its peak reached over 240K active users and a 4.8★ App Store rating. My experience spans from early-stage product validation to scaling infrastructure and teams. I focus on building sustainable growth through excellent user experience, data-driven decision making, and scalable technical architecture that can handle rapid user growth.",
  },
  {
    id: "product-leadership",
    question: "How do you approach product leadership?",
    answer:
      "As Head of Product at Wealthberry Labs and former Head of Design at Nagarro, I've learned that great products emerge from balancing user needs, business goals, and technical constraints. I believe in empowering teams through clear vision, data-driven decisions, and fostering a culture of experimentation. Having mentored 2000+ designers, I'm passionate about developing talent and building cross-functional teams that deliver exceptional user experiences.",
  },
] as const;
