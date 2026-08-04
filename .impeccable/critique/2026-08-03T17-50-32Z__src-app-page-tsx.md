---
target: homepage
total_score: 16
p0_count: 3
p1_count: 2
timestamp: 2026-08-03T17-50-32Z
slug: src-app-page-tsx
---
# Design Critique — Inmortal Gaming Homepage

**Method: dual-agent (A: ses_0374369aeffeHH7wppbadwnWV1 · B: ses_0374349d8ffeWxBYC1X6pUNoUG)**

## Design Health Score — 16/40 (Poor)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | Cart badge hardcodes "3"; toolbar claims "Displaying 12 records" with 3 products; pagination shows 3 pages; filters change nothing; add-to-cart button is dead |
| 2 | Match System / Real World | 1 | Spanish `lang="es"` store shows English product surface; ¤ ambiguous currency; "Envío gratis" on digital gift cards; two catalogs (`/catalogo` route vs `#catalogo` anchor) |
| 3 | User Control and Freedom | 2 | No way to clear/reset filters; no search; applied filters are invisible and irreversible; dead nested cart button |
| 4 | Consistency and Standards | 1 | Language split (ES/EN); two hero blocks each with an h1; card radii/borders differ between ProductCard, OfferCard, Filters, LandingHero; "In Stock" vs "Disponible" never resolved |
| 5 | Error Prevention | 2 | Add-to-cart performs no action; stale filters with no "applied" indicator; no guards before irreversible-feeling actions; fake counts prime users to misjudge scope |
| 6 | Recognition Rather Than Recall | 2 | No active-filter summary or results feedback; user must recall which categories are checked; status pills in `Filters.tsx` look toggleable but are static spans |
| 7 | Flexibility and Efficiency | 2 | No search field on a 2000-item-intent marketplace; only sort works; keyboard path to "Ingresar" is absent on mobile |
| 8 | Aesthetic and Minimalist Design | 2 | Five neon accents on one page, a second full hero, dead fake data, decorative chevron duplicating CTAs, emoji — noisy, not minimal |
| 9 | Error Recovery | 1 | Zero empty/loading/error states; dead links (`#category`, `#item`, `#network`) with no fallback; WhatsApp flow unexplained |
| 10 | Help and Documentation | 2 | Only help is a FAQ link pointing to `#item`; first-timers never learn the WhatsApp purchase process |
| **Total** | | **16/40** | **Poor — core experience needs an overhaul** |

## Anti-Patterns Verdict

**Start here.** Does this look AI-generated? **Yes.**

**LLM assessment**: The craft is real (hand-rolled glitch, waveform, node canvas, reduced-motion respect), but the grammar is a template. The left-neon side-stripe is a legitimate DESIGN.md signature — but it's applied to every box on the page (`ProductCard`, `Filters`, `CatalogToolbar`, `LandingHero`, `.neon-card`). A signature worn by everything is a pattern, and pattern reads as generated. The register tells stack up: a 🎮 emoji in the hero kicker; tiny uppercase tracked mono eyebrows in seven places (hero `MARKETPLACE DIGITAL`, `NEURAL LINK ACTIVE`, `FILTERS`, `CATEGORY`, `STATUS`, footer columns, `SORT BY`); JetBrains Mono as lazy "technical" costume on `Displaying 12 records` and pagination digits; and a waveform equalizer in a hero with no audio content — the fake equalizer is a top-tier AI tell. A well-executed cyberpunk starter kit, not a brand.

**Deterministic scan**: Detector exited 2 with one verified warning — `bounce-easing` (`animate-bounce` on the scroll chevron, HeroSection.tsx:73). Important caveat: the detector materially under-reports against raw TSX (rules needing computed style/DOM like `hero-eyebrow-chip` and `repeated-section-kickers` didn't fire), and manual grep confirms the kicker system is the biggest slop signal: 11 uppercase-tracked labels across HeroSection, Footer, Filters, ProductCard, Navbar; 2 `backdrop-blur` glass surfaces (Navbar, Footer); 1 emoji. The detector result is a floor, not a ceiling. No gradient text, no side-stripes beyond the brand signature, z-index scale is clean.

**Visual overlays**: Not available — no browser automation tool is exposed in this session, so no user-visible overlay was injected. This critique is source-based; a live browser pass (e.g. `/impeccable live`) would confirm rendering-level issues.

## Overall Impression

A genuinely hand-crafted cyberpunk aesthetic — the glitch headline moment is strong — wrapped around a storefront whose data is fabricated, whose language splits in two, and whose checkout story is never told. The single biggest opportunity: make the page honest (real counts, working filters, one language) and use the neon to sell trust, not noise. This is a real-money marketplace; the most expensive problem on the page isn't visual, it's that nothing the user is told can be believed.

## What's Working

1. **Hand-crafted motion with reduced-motion respect.** The glitch, waveform, and node network are all custom, and both CSS (`@media prefers-reduced-motion`) and JS (`matchMedia` in NodeBackground) honor the preference. Rare, deliberate, correct.
2. **Coherent typographic system.** Space Grotesk / Inter / JetBrains Mono via `next/font`, distinct roles per DESIGN.md, no font-swap jank. The pairing genuinely fits the brief.
3. **The glitch headline moment.** Restrained 100ms glitch on the hero h1 — cyan on deep black at display scale is the strongest composition on the page, and the logo glitch on hover rewards interaction.

## Priority Issues

1. **[P0] The page fabricates its own data — the store is lying in plain sight.** `PRODUCTS` has 3 items; `CatalogToolbar` renders "Displaying 12 records"; `CatalogPagination` hardcodes `PAGES=[1,2,3]`; the cart badge hardcodes "3"; `Filters.tsx` toggles state but the grid never re-filters. **Why it matters**: every count, page, and filter contradicts reality — the strongest possible signal that the site is unfinished or untrustworthy, fatal on a real-money marketplace. **Fix**: drive counts/pagination from the real array; wire filter state to filter `PRODUCTS`; render a genuine empty state; remove the hardcoded badge until a cart exists. **Suggested command**: `/impeccable harden`
2. **[P0] Two h1s, two heroes, two languages, two catalogs.** `HeroSection` h1 + `LandingHero` h1 on one page; Spanish hero followed by a second English hero with a third CTA; `#catalogo` anchor coexists with `/catalogo` route; nav "Ingresar" uses `btn-neon` while everything else is `btn-neon-primary`/`btn-neon`. **Why it matters**: the visitor cannot tell what the page is, what language it speaks, or which action to take — hierarchy collapse. **Fix**: one h1; delete `LandingHero` or demote it into the Catalog section header; pick one catalog destination; translate every visible string to `es`. **Suggested command**: `/impeccable distill`
3. **[P0] `text-muted` #555577 fails WCAG AA on every background.** Computed: 2.63:1 on `bg-surface`, 2.77:1 on `bg-primary`, ~2.46:1 on the out-of-stock badge surface. Used on footer copy (11–12px), filter group labels, "Sort by" label, and the Out-of-Stock badge. **Why it matters**: the most trust-coded text (stock status) and secondary navigation are illegible to a large share of users. **Fix**: raise muted to ~#8a8ab0 (≥4.5:1) for text roles; keep a true-disabled shade only for disabled controls. **Suggested command**: `/impeccable colorize`
4. **[P1] The `NodeBackground` canvas is `position:fixed` and paints over every later section.** It stacks above the static Catalog/Offers/Footer backgrounds; node dots float over product cards while scrolling. Full-viewport animation with no `aria-hidden`. **Why it matters**: a subtle artifact that pollutes the catalog surface live. **Fix**: make it `absolute` inside the hero (`overflow-hidden` already exists), add `aria-hidden="true"`, pause `requestAnimationFrame` when the tab is hidden. **Suggested command**: `/impeccable audit`
5. **[P1] Dead interactive elements.** `ProductCard` nests a `<button>` inside the `<a>` (invalid interactive nesting); its onClick only `preventDefault()`s — zero feedback. Login is `hidden sm:inline-flex` and absent from the mobile menu — mobile users cannot log in at all. The scroll chevron (`animate-bounce`) ignores `prefers-reduced-motion`. **Why it matters**: dead controls and motion-against-preference are the highest-user-cost bugs for the least code. **Fix**: make the whole card a single Link and drop the inner button (or make it a real add-to-cart with feedback); include "Ingresar" in the mobile menu; wrap `animate-bounce` in `motion-safe:`. **Suggested command**: `/impeccable audit`

## Persona Red Flags

**Alex (Power User)**: Toggling "Software (Games)" in `Filters.tsx` changes nothing (state updates, grid doesn't); clicking page 2 shows the same 3 products; the toolbar promises 12 records. Sort is the only functional control, and it sorts a grid that renders identically. No search, no platform/duration filters — the market's core browsing affordances don't exist.

**Jordan (First-Timer)**: Reads Spanish but the catalog speaks English ("In Stock", "Filters", "Displaying 12 records") — assumes the site isn't built for him. The ¤ before prices tells him nothing about what he'll pay. Checkout is WhatsApp, and the page never explains the flow or any protection — the only reassurance is "seguro" in the hero and a footer promise he'll never scroll to. "Envío gratis en Gift Cards" makes him doubt the catalog is even digital.

**Sam (Accessibility)**: `text-muted` at 2.6–2.8:1 on small text (footer 11–12px, filter labels); no skip-to-content link and no visible focus indicator on product-card links (only `group-hover`); English `aria-label`s inside a Spanish page; animated node canvas exposed to screen readers with no `aria-hidden`; `animate-bounce` ignores reduced motion.

## Minor Observations

- `border-neon-primary/31` in `LandingHero` — arbitrary 31 where the system uses /30; hand-typed value.
- The idle glitch is disabled — the 100ms-every-4s cycle from DESIGN.md is commented out; the signature only glitches on hover, so the "always alive" promise reads as still.
- Dead CSS: `.neon-card`, `.particle-grid`, `@keyframes pulse-glow` are defined and never used.
- `gap-0.75` and `mb-13` rely on Tailwind v4 dynamic spacing; inconsistent with the 4px-unit scale in DESIGN.md.
- Three width systems: hero `max-w-4xl` centered, Catalog edge-to-edge in `main px-10`, Offers `max-w-7xl` — no shared container rhythm.
- `ProductCard` uses an inset black shadow instead of the DESIGN.md signature glow — spec and code disagree on the brand's own signature.
- Two `<h4>`s in `Filters.tsx` share the same class string — copy-pasted, not systemized.
- `WAVEFORM_HEIGHTS` comment admits the equalizer exists to avoid hydration mismatch — the wrong reason.

## Questions to Consider

- If the record count, page numbers, cart badge, and filters are all fabricated, is this a design or a screenshot with scroll? What does "Displaying 12 records" over 3 products say to the first customer who counts?
- The page opens with a Spanish hero, then an English hero, then a catalog, then offers — three competing first actions. What is the single thing a first-time visitor should do in the first 5 seconds?
- The store sells "bienes digitales" but the catalog shows physical cyberware with "Envío gratis" — is this a digital-goods marketplace or a hardware store?
- The node canvas is `position:fixed` over the whole page — the hero's "background" is actually the page's permanent foreground layer. If the team doesn't notice, what else are they not noticing?
