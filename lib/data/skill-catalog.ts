/**
 * The à la carte modules: what each one is, what it produces, and what it
 * costs. One source for the /skill page, the checkout route, the success page,
 * and the receipt email, so a name or a price cannot differ between them.
 *
 * Previews and samples are the public face of a paid file: enough to judge
 * the module by, never enough to run it. The files themselves live in a
 * private repository (see lib/skill/pro-files.ts).
 *
 * Prices are in cents and start as null. A null price renders through the
 * site's Placeholder Marking Rule ("to confirm") and disables checkout for
 * that SKU, so the page can ship before the numbers are set without ever
 * showing a number that is not real. Stripe price ids are public identifiers,
 * not secrets, and belong here beside the price they name.
 */

export const SKILL_MODULE_IDS = [
  "researcher",
  "product-strategy",
  "visual-strategy",
  "five-advisors",
  "all-bets-are-off",
  "diagram",
] as const;

export type SkillModuleId = (typeof SKILL_MODULE_IDS)[number];

export type SkillPrice = {
  /** Amount in USD cents, or null while the number is still to be confirmed. */
  amount: number | null;
  currency: "usd";
};

export type SkillModule = {
  id: SkillModuleId;
  name: string;
  /** The role line under the name, e.g. "The research lens". */
  role: string;
  tagline: string;
  summary: string;
  produces: readonly string[];
  useWhen: string;
  /** What the sample shows, used as the sample's caption. */
  sampleTitle: string;
  /** Markdown. The module's signature output, filled in. */
  sample: string;
  /** Markdown. The public preview: promise, one principle, what it produces. */
  preview: string;
  price: SkillPrice;
  /** Stripe Price id (price_...) once the product exists in Stripe. */
  stripePriceId: string | null;
};

export const SKILL_MODULES: readonly SkillModule[] = [
  {
    id: "researcher",
    name: "Researcher",
    role: "The research lens",
    tagline:
      "Makes an agent plan and synthesize research so every finding carries its sample, setting, and the decision it forces.",
    summary:
      "Sessions go where the product is actually used. A design argument gets both candidates built and tested instead of settled in a review. The synthesis keeps validation apart from what shipped and ends in the decision the team now has to make, with what each option costs.",
    produces: [
      "Research plan tied to one decision and one intent metric",
      "Discussion guide or task protocol with pre-committed success criteria",
      "Findings memo written as decisions, with a claim-boundary table",
    ],
    useWhen:
      "Use when a design argument is about to be settled in a review, a prototype is about to be tested, or a number needs evidence.",
    sampleTitle: "A finding written as the decision it forces",
    sample: `### 1. Referral discovery held up; the thinned-out tracking was the weakest part of the prototype.
Evidence: 94% approval and 91.7% task completion across n=127 unmoderated and n=15 moderated; the tracking tasks carried the lowest completion in the set.
Decision this forces: restore tracking depth before launch, or ship referral discovery first and accept a weaker tracking story.
- Restoring tracking costs the ten-day scope that protected the referral bet.
- Shipping referral first costs the feature incumbents are judged on at launch.
Recommendation: ship referral first. The weak tracking result was the tradeoff chosen going in, not a surprise.

### What this does not show
| Figure | Bucket | Moves buckets when |
| --- | --- | --- |
| 94% approval | Validation | The product ships and the figure is measured on real use |
| 4.8/5 mobile usability | Validation | Same |`,
    preview: `Researcher plans, runs, and synthesizes product research so that a finding can be checked by someone who was not in the room. Sessions go where the product is actually used. When a team is split on two designs, both get built and tested instead of argued about. Every finding carries its sample and its setting, and the synthesis ends in the decision the team now has to make, with what each option costs.

It does not make the strategy call a finding forces, and it does not harden a single decision. Those are separate modules.

### Test both, do not argue

When a team is split on two designs, the productive move is rarely to win the argument. It is to build both and put them in front of people.

> Built and tested both editing models with real students rather than settling the question in a design review. The sessions settled a design argument that opinion would have run indefinitely. Students chose speed and simplicity every time they were offered control instead. — sports video app

The alternative, at its strongest: pick one on judgment and spend the time building it properly. That is faster and it produces a more finished thing to test.

The cost of testing both is prototype effort spent on a design that will be thrown away. Accept it when the argument is real, meaning a competent person holds each side. A comparison also gives you something a single-design test cannot: a preference ratio. Recruiters preferred a chat interface to a form 11:1 in a comparison of twelve; a test of the chat interface alone could only have said "they liked it."

**What it produces**

- A research plan tied to one decision and one intent metric
- A discussion guide or task protocol with success criteria committed before the first session
- Session logs that record the conditions observed, not just the task result
- A synthesis table that keeps frequency and severity apart
- A findings memo written as decisions, each with the price of every option
- A claim-boundary section naming which bucket every figure belongs to`,
    price: { amount: null, currency: "usd" },
    stripePriceId: null,
  },
  {
    id: "product-strategy",
    name: "Product Strategy",
    role: "The bet, priced and killable",
    tagline:
      "Makes an agent name the bet, price it, judge it on the honest metric, and write the kill criterion first.",
    summary:
      "Turns a product direction into bets that can be defended, cut, and killed. Each bet gets its alternative at its strongest, the cost actually paid, the metric that maps to intent, and a kill criterion with a date. Ends with the one page a CFO reads.",
    produces: [
      "Bet ledger with alternative, cost, metric, and kill criterion",
      "Ranked cut list with the cost of each cut",
      "One-page strategy in the order the business reads it",
    ],
    useWhen:
      "Deciding what to build first, choosing MVP against v1, prioritizing a roadmap, or making the case for design to a CFO.",
    sampleTitle: "A bet ledger and its cut list",
    sample: `| Bet | Alternative at its strongest | Cost | Metric that maps to intent | Kill criterion |
| --- | --- | --- | --- | --- |
| Referral discovery across a job seeker's extended network, mobile first | Application tracking to parity: the feature users arrive expecting and the one incumbents are judged on | Tracking depth thinned; the first test's weakest part will be tracking, and testers will say so | Share of testers who find a referral path unaided; target 4 in 5 | If fewer than 3 in 5 find a path unaided in the first moderated round, the network is not the product |
| Organization and team sharing in v1 | Single-user MVP: ships three weeks sooner, textbook lean | Three weeks of timeline and real over-engineering risk if customers are individuals | Share of first ten paying accounts that are teams | If 7 of the first 10 paying accounts are single users, sharing was premature |

| Rank | What is cut or thinned | What it protects | What it will cost in the first review |
| --- | --- | --- | --- |
| 1 | Application tracking reduced to a list with status | Ten working days on referral discovery | Testers will name tracking as the weakest part, and they will be right |
| 2 | Editable system prompt removed | A hardened, compliance-safe default | A vocal minority will ask for it; usage says they will not use it |`,
    preview: `Product Strategy turns a direction into bets that can be defended, cut, and killed. Every bet is named as an action, paired with the alternative at its strongest, and priced in the cost actually paid. It is judged on the metric that maps to intent rather than the biggest number, and it carries a kill criterion with a threshold and a date, written before the result is in.

What comes back is a ledger a founder can read to a board, not a list of features.

### Cut to protect the bet, and name what you thinned

Every product has one thing it is actually betting on and several things people arrive expecting. Scope goes to the bet. The expected things get thinned, and the thinning is stated in the strategy so nobody is surprised when it shows up in testing.

> Thinned out application-tracking depth to keep the referral-network feature within a ten-working-day scope. Tracking is the feature users arrive expecting, and the one incumbents are judged on. The weakest part of the prototype in testing was, predictably, the thinned-out tracking. Exactly the tradeoff chosen going in. The referral-discovery concept, the actual bet, held up with real job seekers. — career intelligence prototype

The alternative, at its strongest: build the expected feature to parity first, because that is what the market compares you on. It is genuinely better for a first impression against incumbents.

Its cost is that the bet never gets tested, because the parity work consumes the runway that was supposed to test it.

A cut list that names what was thinned, and what that will cost in the first review, is the difference between a strategy and a wish.

**What it produces**

- A bet ledger: bet, alternative at its strongest, cost, metric that maps to intent, kill criterion
- A ranked cut list, with the sentence users will say about each cut
- A sequencing decision that names the retrofit it avoids
- A one-page strategy in the order a CFO reads it: cost, return, failure signal, date

It hands research off to Researcher and whole-project scrutiny to All Bets Are Off.`,
    price: { amount: null, currency: "usd" },
    stripePriceId: null,
  },
  {
    id: "visual-strategy",
    name: "Visual Strategy",
    role: "The visual direction lens",
    tagline:
      "Makes an agent decide how a product should look from the claim it has to prove, then write the system down.",
    summary:
      "Start from what the reader has to believe, carry a metaphor literally or leave it out, use one neutral family with weight instead of hue, and cut the system's surface from usage rather than taste. The deliverable is a document a team can enforce, not a moodboard a team can like.",
    produces: [
      "Visual direction brief with the claim and what it costs",
      "Token ledger with a job and a never for every token",
      "DESIGN.md-style system document with named rules and an owner",
    ],
    useWhen:
      "Start a product's visual direction, set a palette and type ladder, cut a design system's API, or fix a screen that looks off.",
    sampleTitle: "Token ledger for a one-family system",
    sample: `| Token | Value | Job | What it must never be used for |
| --- | --- | --- | --- |
| Ink | #18181b | The assertion: headlines, confirmed values, the primary button's fill | Body copy, captions, anything subordinate |
| Quiet | #71717a | The subordinate voice: labels, the "problem" column, unconfirmed values | The answer side of a paired comparison |
| Prose | #52525b | Running body copy and lead paragraphs | Headlines or figures |
| Hairline | #e4e4e7 | Separating peers: rows, columns, table rules | Opening a section, which takes full Ink contrast |
| Edge | #d4d4d8 | Secondary-button strokes, resting link underlines, input borders | Separating content |
| Wash | #f4f4f5 | Hover grounds and the tinted ground a contained figure sits on | Grouping content into cards |
| Live Amber | #d97706 | The badge on a product a reader can open today, and nothing else | A highlight, a callout, an accent, a second status |`,
    preview: `Visual Strategy makes an agent decide how a product should look the way Randy decides it: start from the claim the surface has to make the reader believe, carry a metaphor literally or leave it out, use one neutral family with weight instead of hue, and write the system down once, where it would drift first. The deliverable is a document a team can enforce, not a moodboard a team can like.

### Carry the metaphor literally or leave it out

A metaphor that lives only in the name and the hero illustration is decoration, and decoration is the first thing cut when the roadmap tightens. A metaphor that is carried literally changes what components exist.

> An assay office is where a goldsmith brings raw, unproven metal to be tested and stamped with certified purity. The metaphor runs down to the engraved index dial, the hallmark stamp, and the unstamped raw plate the landing page opens on. — Pixelbox, a portfolio-licensing instrument

The test is concrete: name three components the metaphor changes, and one thing it forbids. If it changes only the hero, it is a name. If it forbids nothing, it is not constraining anything.

Claim boundary: Pixelbox has not shipped. The metaphor is validated as a design direction, not as a product that people used.

The alternative at its strongest is the light-touch metaphor: a name, a tone of voice, a single illustration. It is cheap, flexible, and easy to drop when the product pivots. Its cost is that it never earns the reader's belief, because nothing in the interface depends on it being true.

The cost of the literal metaphor is that every component has to earn its place inside it, and a metaphor that turns out to be wrong is wrong everywhere at once. Pick it knowing that.

That is one of eight principles in the module. The others cover the claim the surface makes, one family with weight instead of hue, a line before a box before a shadow, a fixed ladder of voices, tokens with a "never", cutting a system's surface from usage, and writing it down where it would drift first.

**What it produces:** a visual direction brief with the claim and what it costs; a token ledger with a job and a "never" for every token; a named-rules list; a DESIGN.md-style system document with an owner; a Before/After/Why table when auditing an existing surface.`,
    price: { amount: null, currency: "usd" },
    stripePriceId: null,
  },
  {
    id: "five-advisors",
    name: "The Five Advisors",
    role: "The room that has to disagree",
    tagline:
      "Five named advisors read one decision, object on the record, and leave you with one call and its cost.",
    summary:
      "The Founder, The Engineer, The Skeptical User, The Operator, and The Trust Officer each have one mandate, one question, and one known bias. At least three must object before the call is made. The dissent stays in the record, and the call names who it overrules and what it costs.",
    produces: [
      "A five-row verdict table with each advisor's objection and what would change their mind",
      "One recommended call with its cost, the advisor it overrules, and the condition under which it reverses",
      "The sentence the team would rather delete, written so it can be checked later",
    ],
    useWhen:
      "Run it before committing to a design decision, before a review or board conversation, or when a team agreed too fast.",
    sampleTitle: "Verdicts on progressive disclosure over two modes",
    sample: `| Advisor | Verdict | The objection they will not drop | What would change their mind |
| --- | --- | --- | --- |
| The Founder | Accept with condition | "Progressive" is undesigned scope hiding inside an adjective. Who decides when a control surfaces? | A one-page disclosure rule with an owner, before build starts. |
| The Engineer | Accept with condition | Disclosure state is a second state machine every future feature has to respect, forever. Two modes would have been a flag. | The rule expressed as one check the codebase can enforce. |
| The Skeptical User | Object | Experienced gardeners will not find features they already know exist, and they will say so in reviews. | A visible way to open everything on day one without self-classifying. |
| The Operator | Accept | Measure novice first-run completion, not total sessions, or nobody will know whether this worked. | Nothing further; the objection is the condition. |
| The Trust Officer | Accept | Nothing on this decision. Asks that the disclosure rule be stated to users so nobody is silently gated. | Nothing further. |

**Recommended call.** Ship one surface with progressive disclosure.

**What it costs.** Experienced users earn their way to depth they already know they want, and the complaint will be real. The Skeptical User is overruled because the alternative forces a self-classification choice on first run that novices routinely get wrong.`,
    preview: `Five named advisors read one decision and are required to disagree before the team is allowed to agree: The Founder, The Engineer, The Skeptical User, The Operator, and The Trust Officer. Each has one mandate, one question they always ask, one thing they refuse to accept, and one known bias the other four are allowed to point at.

The module keeps the disagreement on the record and closes with a single call, its cost, the advisor it overrules, and the condition under which it reverses. Five verdicts are never a vote.

### Agreement reached quickly is a preference wearing a consensus

Most rooms converge on the first defensible-sounding option because disagreeing costs social capital and the meeting has an end time. Nobody in the room is paid to be the objection, so the objection stays unspoken and shows up later as a support ticket, a rewrite, or a number that cannot be explained.

The five advisors exist to spend that social capital on the team's behalf. A decision that survives five hostile readings is a decision. A decision that survives a nodding room is a default with a date on it.

The cost is time. A five-lens pass on a decision that was going to be fine takes half an hour the team did not want to spend. The module accepts that price because the alternative, finding the objection after the build, is paid in weeks.

### An advisor must say what would change their mind

An objection with no condition attached is a veto, and a veto is not a review. Every row carries what would change that advisor's mind: a piece of evidence, a change to scope, a written rule, a named owner. If the advisor cannot name one, the objection is a preference and gets marked as one.

The single exception is The Trust Officer when a legal or regulatory floor is at stake. That row may say "Nothing short of the floor being met," and it is the only place in the room where that answer is accepted.

**What it produces.** A five-row verdict table with each advisor's objection and what would change their mind; one recommended call with its cost, the advisor it overrules, and the condition under which it reverses; the sentence the team would rather delete, written so it can be checked later.`,
    price: { amount: null, currency: "usd" },
    stripePriceId: null,
  },
  {
    id: "all-bets-are-off",
    name: "All Bets Are Off",
    role: "The scrutiny pass",
    tagline:
      "Audits a whole project until every decision names its cost and every gap has an owner.",
    summary:
      "Assumes every decision is a preference until it names its cost, and every number is unowned until its bucket is named. Reads the brief, roadmap, deck, or draft and returns a gap register ranked by what would kill the project, with a kill line and the sentence the team would rather delete.",
    produces: [
      "A ranked gap register with a kill line and an owner per row",
      "The sentence the team would rather delete",
      "A next-step line per top-tier gap naming the module or person that closes it",
    ],
    useWhen:
      "Run it before a launch, a funding conversation, a board deck, a case-study publish, or a roadmap commit.",
    sampleTitle: "A gap register for a design-system relaunch deck",
    sample: `| # | Gap | Kind | What it would cost if true | Evidence that settles it | Owner |
| --- | --- | --- | --- | --- | --- |
| 1 | "Adoption up 3x" in the deck refers to the forced migration off the old library, not to anything this team has shipped | Claim | The headline number is someone else's; the first person who knows that stops believing the rest | The source of the 3x figure and the period it covers | Nobody |
| 2 | The delivery gate assumes authority over teams that do not report to the platform lead | Authority | Compliance theatre; the gate gets bypassed and the library gets blamed | A list of which teams the gate can actually block | Platform lead |
| 3 | The lower layer of the two-layer API has no documentation planned before Q2 | Adoption | Developers hit the edge of a default and ask instead of dropping a layer | A documentation plan for the primitives, dated before the first migration | Design-system lead |
| 4 | The clean-sheet rebuild names control as its reason and names no cost | Decision | Relearning every primitive, paid by every developer forever, was never weighed against a fork | The cost of the rebuild stated against the cost of a fork | Design-system lead |
| 5 | Accessibility is measured by the automated audit alone | Evidence | Passing conformance and shipping something a disabled user cannot use | A test plan with users with disabilities, or the explicit decision not to run one | Nobody |

**Kill line.** Gaps 1 to 3 would end the project as stated. Below that, they make it smaller.

**The sentence you would rather delete.** The adoption number in the deck belongs to a migration this team did not run, and the plan to earn its own number relies on a gate it cannot enforce.`,
    preview: `All Bets Are Off audits a whole project before anyone is allowed to call it decided. It assumes every decision is a preference until it names its cost, and every number is unowned until its bucket is named. It reads the brief, the roadmap, the deck, or the case-study draft, inventories every decision, claim, assumption, dependency, and constraint, and returns a ranked gap register ordered by what would kill the project, with a kill line, an owner for every row, and the one sentence the team would rather delete. It does not soften, and it does not fix what it finds; it hands each gap to the module or the person who can.

The tone is deliberate. Users will ask for a gentler pass, and the answer is no: the gentler pass already exists in the free core skill, which applies the same framework at a pace a team can learn from. This module is for the moment when the learning is over and something is about to be treated as decided.

### Rank by what kills, not by what is loud

A review that lists thirty findings of equal weight has produced a to-do list, not an audit. The team will fix the easy ones and call it done.

Every gap is ranked by what it would cost if it turned out to be true, in a fixed order:

1. It makes the product untrue, unsafe, or unlawful. A claim that cannot be supported. A system asserting a single confident answer on a mistake the user cannot afford. Data the system was never allowed to see.
2. It makes adoption impossible. A new API where a familiar one would do. A mandate with no authority behind it. A two-layer system with no documentation for the lower layer.
3. It makes the number unreportable. A metric that only moves with traffic. A validation result with no path to a shipped one. Accessibility measured by an automated audit alone.
4. It costs time or money the team can actually pay.

The register draws a kill line: gaps above it would end the project as stated; gaps below it would make it smaller. The alternative is to rank by effort, or by who is shouting. The cost of ranking by kill is that the most expensive gap is usually the one the team least wants to look at, and it is now at the top of the page.

**What it produces:** a ranked gap register with a kill line and an owner per row, the sentence the team would rather delete, and a next-step line per top-tier gap naming the module or person that closes it.`,
    price: { amount: null, currency: "usd" },
    stripePriceId: null,
  },
  {
    id: "diagram",
    name: "Diagram",
    role: "The figure lens",
    tagline:
      "Makes an agent draw the figure a sentence needs, in hairlines and weight, and refuse the ones a table beats.",
    summary:
      "Seven product-design figure types as self-contained HTML with inline SVG, in one zinc family with hairlines instead of boxes and weight instead of hue. It routes a claim to a type, cuts it to a nine-element budget, and ships light and dark from one ramp.",
    produces: [
      "A self-contained HTML figure with inline SVG, static, no external requests",
      "A caption that names the claim bucket and the source of every number",
      "A Before/After/Why review table for a figure someone else drew",
    ],
    useWhen:
      "Draw a figure for a case study, decision record, research readout, or design-system document once the argument exists.",
    sampleTitle: "The router: what you are showing, and what to draw",
    sample: `| If you are showing | Draw | Budget |
| --- | --- | --- |
| Who does what at each stage, and what the customer never sees | Service blueprint | 6 stages |
| What a person does across an experience and how it feels, from research | Journey with sentiment | 7 stages |
| Two roles sharing one object, and every point where work crosses between them | Role-handoff seam | 2 roles, 8 handoffs |
| One decision: the alternative at its strongest, the cost, the outcome | Decision fork | 1 decision |
| What the system may see, what it asserts, how the user confirms, how it got there | AI trust boundary and derivation | 9 nodes |
| Defaults over primitives over foundation, and who stands on which layer | Design-system layers and adoption | 5 layers |
| The state being replaced beside what replaces it | Before/after ledger | 6 rows |
| A bar, line, or scatter of many points | Not this module; a charting tool with these tokens | |
| Something a three-column table already says | The table | |`,
    preview: `Diagram draws the figure once the argument exists. It takes the sentence a
figure has to argue for, routes it to one of seven product-design types, cuts
it to a nine-element budget, and produces a single self-contained HTML file
with inline SVG in Randy Ellis's ledger language: one family of grays,
hairlines instead of boxes, weight instead of hue, no shadows, tabular figures,
and light and dark as a true inversion. It does not decide what the figure
should say; that belongs to the module that owns the work.

### Weight carries the argument

In any figure that pairs two things, the quiet tone states the condition and
the ink tone at medium weight states the answer. In a decision fork, the
alternative sits in quiet and the decision sits in ink. In a before/after
ledger, the left column is quiet and the right is ink. Keep both at one weight
and the argument disappears; the figure becomes a list.

The alternative is neutrality: every element at the same weight so the figure
reads as a map rather than a case.

The cost is that the figure takes a side and cannot pretend otherwise. When
neutrality is the point, as in a current-state landscape drawn before any
decision has been made, everything sits in the prose tone and the figure
argues nothing on its own. The caption then says so, in one line, rather than
letting the reader hunt for an emphasis that was never placed.

**What it produces:** a self-contained HTML figure with inline SVG in one of
seven types (service blueprint, journey with sentiment, role-handoff seam,
decision fork, AI trust boundary and derivation, design-system layers and
adoption, before/after ledger), a one-line caption naming the claim bucket, a
project token file written once, and a Before/After/Why review table for any
figure someone else drew.`,
    price: { amount: null, currency: "usd" },
    stripePriceId: null,
  },
];

export type SkillBundle = {
  id: "bundle";
  name: string;
  summary: string;
  price: SkillPrice;
  stripePriceId: string | null;
  /** Every module id, in catalog order. */
  includes: readonly SkillModuleId[];
};

export const SKILL_BUNDLE: SkillBundle = {
  id: "bundle",
  name: "All six",
  summary:
    "Every module, one checkout. The bundle is priced below the six bought separately; the discount is stated on the page once the numbers are set.",
  price: { amount: null, currency: "usd" },
  stripePriceId: null,
  includes: SKILL_MODULE_IDS,
};

export type SkillSku = SkillModuleId | "bundle";

export const SKILL_SKUS: readonly SkillSku[] = [...SKILL_MODULE_IDS, "bundle"];

export function isSkillSku(value: string): value is SkillSku {
  return (SKILL_SKUS as readonly string[]).includes(value);
}

export function isSkillModuleId(value: string): value is SkillModuleId {
  return (SKILL_MODULE_IDS as readonly string[]).includes(value);
}

export function findSkillModule(id: string): SkillModule | undefined {
  return SKILL_MODULES.find((m) => m.id === id);
}

/** The catalog entry a SKU resolves to: one module, or the bundle. */
export function resolveSku(
  sku: string,
):
  | { kind: "module"; module: SkillModule }
  | { kind: "bundle"; bundle: SkillBundle }
  | null {
  if (sku === "bundle") return { kind: "bundle", bundle: SKILL_BUNDLE };
  const found = findSkillModule(sku);
  return found ? { kind: "module", module: found } : null;
}

/** Which module files a purchased SKU entitles the buyer to. */
export function modulesForSku(sku: SkillSku): readonly SkillModuleId[] {
  return sku === "bundle" ? SKILL_BUNDLE.includes : [sku];
}

/**
 * Maps a Stripe Price id back to the SKU it sells. The success page and the
 * webhook both need this to turn a paid session into files.
 */
export function skuForStripePrice(priceId: string): SkillSku | null {
  if (SKILL_BUNDLE.stripePriceId === priceId) return "bundle";
  const found = SKILL_MODULES.find((m) => m.stripePriceId === priceId);
  return found ? found.id : null;
}

/** "$49" for 4900; whole dollars only, which is how the modules are priced. */
export function formatSkillPrice(price: SkillPrice): string | null {
  if (price.amount === null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency.toUpperCase(),
    maximumFractionDigits: price.amount % 100 === 0 ? 0 : 2,
  }).format(price.amount / 100);
}

/** True once a SKU can actually be bought: priced, and known to Stripe. */
export function isPurchasable(entry: SkillModule | SkillBundle): boolean {
  return entry.price.amount !== null && entry.stripePriceId !== null;
}
