# Credibility Copy — Verified Source-of-Truth (Phase 1 input)

Ready-to-use, **fact-checked** copy for the site. Every claim below is backed by
`Randy's Product Design Deck.pdf` (48pp, reviewed 2026-08-14). Do not add numbers
that aren't here without a verifiable source.

---

## 1. Awards — replace "6 Design Awards" with 4 NAMED awards

**Verified (deck slide 28, GrowIt! case study):**

| Award | Issuer | Category |
|-------|--------|----------|
| Silver Award Winner | The Davey Awards | Mobile Apps / Social |
| Silver Award Winner | The Davey Awards | Mobile Apps / Lifestyle |
| 3rd Place — Best User Interface App/Experience | Vega Digital Awards | — |
| 3rd Place — Best Lifestyle App | Vega Digital Awards | — |

**Separate credential (deck slide 2 — NOT a win):** Webby Awards **Judge**.
List as a credential, never counted among awards won.

### Site copy

**Short (counter/label):** `4 Design Awards` — or better, drop the bare counter and
show the named list below.

**Awards block (about page / GrowIt case study):**
> **Recognition — GrowIt!**
> - 🥈 Silver, The Davey Awards — Mobile Apps/Social
> - 🥈 Silver, The Davey Awards — Mobile Apps/Lifestyle
> - 🥉 3rd Place, Vega Digital Awards — Best User Interface App/Experience
> - 🥉 3rd Place, Vega Digital Awards — Best Lifestyle App
>
> *Randy has also served as a **Webby Awards Judge**.*

### Where to change in code
- `components/core/animated-number-basic.tsx:12-15` — "6 Design Awards" → 4 (or remove bare counter)
- `app/about/about-client.tsx:25-50` — "Career Impact" cards → "4 Design Awards"
- `components/seo/structured-data.tsx:178-182` — Person schema `award` array → the 4 named awards above (replace generic strings)
- `lib/data/projects.ts` (GrowIt entry) — add an `awards` array with the 4 above

---

## 2. Testimonials — replace reused/unverifiable names with REAL attributable quotes

The site currently reuses the same stakeholder names ("Sarah Chen", "Maria
Rodriguez", "David Thompson") across unrelated companies — reads as fabricated.
Replace with these **real, attributable** quotes from the deck (slides 46–47).
Confirm each person is OK being cited publicly first.

**Paul Grachen — VP/Director of Experience Design, Digitas / Leo Burnett**
> "Randy is a thoughtful and empathetic designer with the ability to teach complex
> concepts. He would play well in the leadership space, and if you need someone to
> partner with to build a practice for your agency or client, I would recommend
> taking a serious look at Randy."

**Donald Wu — Senior Graphic Designer, Hickory Farms**
> "Randy is a professional and helpful instructor who has the ability to teach a
> class with enthusiasm. He also possesses an in-depth knowledge of the field of
> user experience design... He is someone who leads by example and will always be
> considered as one of the best teachers that I've ever met."

### Where to change in code
- `lib/data/projects.ts` + `app/data.ts` — remove reused `stakeholderQuotes` fake names; seed a real testimonials source with the two above
- Consider a dedicated testimonials section/component rather than per-project quotes

---

## 3. Metrics reconciliation — pick ONE true number per claim

**GrowIt! users:** deck (slide 27) shows New Active Users **209K → 240K (+15%)**,
Photo Activity 120K → 320K (+164%), Engagement 2.3M → 3.4M ratings (+48%).
The site's "1M+ users" (and elsewhere "100K") is NOT backed by the deck. Use the
deck's real figures everywhere.

### Where to change in code
- `lib/data/projects.ts` (GrowIt metrics), `app/page.tsx:219` (FAQ), `components/seo/structured-data.tsx:220` — reconcile to a single verified number

---

## 4. Remove fabricated structured data (SEO liability)

In `components/seo/structured-data.tsx`:
- `aggregateRating` **4.9 / 15 reviews** → remove (no reviews exist behind it)
- `telephone: "+1-XXX-XXX-XXXX"` → remove or real number
- `google: "your-google-verification-code"` → remove placeholder

---

## 5. Hidden keyword SEO — delete, move value to visible copy

`components/seo/fractional-cdo-hidden-seo.tsx` (145 lines of `sr-only` keyword lists
naming competitor marketplaces + cities) reads as cloaking/gaming and risks a search
penalty. Remove the hidden block; surface the genuine "Fractional CDO" positioning in
**visible** hero/about copy instead (see Phase 2 / positioning).

---

*Source: Randy's Product Design Deck.pdf, reviewed 2026-08-14. All figures verifiable in-deck.*
