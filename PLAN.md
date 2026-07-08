# Influenze.ai Website — Phase-by-Phase Build Plan (Astro)

## Context

Build the complete Influenze.ai marketing website (creator discovery/analytics SaaS) from the Figma file [Influenze Web](https://www.figma.com/design/awUatUHjSJycuLMTotbJUU/Influenze-Web) (fileKey `awUatUHjSJycuLMTotbJUU`). The file contains **3 desktop page designs (1728px)**: Home (`1:3`), Features (`1:815`), Pricing (`1:1924`). No mobile designs exist.

The repo is a fresh Astro 7 + Tailwind v4 scaffold: brand tokens already defined in `src/styles/global.css` (dark `#010101` bg, mint `#3AFF98`, purple `#6838FF`, Open Sauce Two self-hosted in `public/fonts/`), Cloudflare Workers static deploy via `wrangler.jsonc`. Only the stock Welcome page exists — everything else is to be built.

**Confirmed decisions:**

- **Fully responsive** — build desktop-first per Figma, adapt tablet/mobile with inferred breakpoints in the same phase.
- **Only the 3 designed pages** are built; undesigned nav/footer links (Resources, Blogs, Terms…) are placeholder `#` links.
- **CTAs (Login/Sign Up)** point to a placeholder constant, swapped for the real app URL later.
- **No UI framework** — pure Astro components + vanilla `<script>` for interactivity (accordion, tabs, nav dropdown, mobile menu). Marquees via CSS keyframes.
- All Figma asset exports (images, screenshots, 3D bolt renders, logos, photos) will be provided.

## Code standards (apply in every phase)

- Astro components, PascalCase filenames; pages in kebab-case. Tailwind v4 utilities only — extend tokens in the `@theme` block of `src/styles/global.css`, no `tailwind.config.js`, avoid scoped `<style>` except for keyframes/complex effects.
- **Copy lives in data files** (`src/data/*.ts`, typed), not hardcoded in markup — sections render from arrays (nav links, FAQ items, pricing plans, feature blocks, use-case cards, stats, testimonials).
- Central `src/data/site.ts` for site name, placeholder CTA URLs, social links.
- Images through `astro:assets` `<Image />` from `src/assets/` (auto-optimized); only favicons/OG images in `public/`.
- Semantic HTML (`header/nav/main/section/footer`, one `h1` per page), alt text, keyboard-accessible interactive widgets, `prefers-reduced-motion` guard on marquees/animations.
- Interactivity: small inline `<script>` per component (Astro processes/bundles these), no global JS framework.
- Fix the design's copy typo "Agnecy" → "Agency".

## Target structure

```
src/
├── assets/            # Figma exports (organized in Phase 0)
├── components/
│   ├── common/        # Header, MobileMenu, Footer, CtaBand, Button, SectionHeading, UseCaseMarquee
│   ├── home/          # HomeHero, CreatorCollage, StatsGrid, TrustedBy, FeatureTabs, Testimonials, Faq
│   ├── features/      # FeaturesHero, CreatorShowcase, FeatureBlock
│   └── pricing/       # PricingHero, PricingCards, CustomPlanStrip, CreditsExplainer
├── data/              # site.ts, nav.ts, useCases.ts, stats.ts, faqs.ts, testimonials.ts, featureBlocks.ts, pricing.ts
├── layouts/Layout.astro
├── pages/             # index.astro, features.astro, pricing.astro, 404.astro
└── styles/global.css
```

---

## Phase 0 — Foundation & assets

1. Delete `src/components/Welcome.astro` + stock `src/assets/*.svg`; blank `index.astro` shell.
2. Upgrade `src/layouts/Layout.astro`: props for `title`/`description`, canonical + OG/Twitter meta, font preloads, dark `bg-background-primary` body (base styles already in `global.css`).
3. Extend `global.css` `@theme`: purple gradient stops, card/surface colors seen in design (lavender testimonial card, glassy dark cards), container width (~1512px content on 1728 canvas), marquee keyframes.
4. **Asset intake**: create `src/assets/{brand,home,features,pricing,creators,logos}/` and an `ASSETS.md` manifest listing every required export with its Figma node ID (see reference table below) for exporting against it. Raster app screenshots (e.g. `1:1507`, `1:1506`) are exported as images, never rebuilt.
5. Scaffold all `src/data/*.ts` files with typed content extracted from Figma copy.
6. Build `Button.astro` (mint pill primary, outline/ghost variants) and `SectionHeading.astro` (two-line headings with mint/white alternating emphasis — the pattern every section uses).

## Phase 1 — Shared shell (used by all 3 pages)

1. `Header.astro` (`1:775`): logo, nav (Features, Pricing, Resources ▾ placeholder dropdown, Linkin Bio + "DotMe" badge), "Login / Sign Up" pill. Sticky, rounded dark bar.
2. `MobileMenu.astro`: hamburger + slide-down panel (inferred — no mobile design).
3. `Footer.astro` (`1:500`): 3D bolt render, link columns (Learn / Resources / Legal / Use Cases), giant "influenze.ai" watermark wordmark over purple gradient.
4. `CtaBand.astro` (`1:464`): "Ready to get influenzed?" + Sign Up button, decorative rails, floating creator photo chips + follower-count badges. Prop for button label ("Sign Up" / "Sign Up NOW").
5. `UseCaseMarquee.astro` (`1:705`): the 5 "Who is it for?" cards (Influencer Marketing, Talent Management, PR, Advertising, E-commerce) as a CSS marquee — shared by Home and Features.
6. Wire into `Layout.astro`; verify on a stub page at desktop + mobile widths.

## Phase 2 — Home page (`1:3`, 9 sections)

Build top-to-bottom in `src/components/home/`, assemble in `index.astro`:

1. **HomeHero** (`1:41`): H1 "Find and analyze the right creators…", subcopy with highlighted "450M+ creators", dashboard mockup image (`1:657`) with floating "Search & Discover" callout card, purple gradient hero bg.
2. **CreatorCollage** (`1:45`): "Find & Analyze The Right Creators" heading over wave background, floating creator photo bubbles, 3D bolt, toast chips ("Added to Nykaa List"…).
3. **UseCaseMarquee** (reuse from Phase 1) with "Who is it for?" heading.
4. **StatsGrid** (`1:731`): 4 glassy stat cards (99.8% fraud detection, 50M+ profiles, 3hr+ saved, 99.8% historical data) over wave vector.
5. **TrustedBy** (`1:565`): partner logo row.
6. **FeatureTabs** (`1:60`): "Features that you get hooked to" — 3 tabs (Discover & Analyze / My Lists / Share) switching showcase panels; vanilla JS tab switcher.
7. **Testimonials** (`1:32`): 3 staggered lavender cards + "Real audiences. Real results." marquee band.
8. **Faq** (`1:429`): "Questions we get asked a lot" — accordion (native `<details>` styled, or button+JS), 6 items.
9. Assemble with CtaBand + Footer; responsive pass on every section.

## Phase 3 — Features page (`1:815`)

1. **FeaturesHero** (`1:820`): "A product that caters to you" + full-bleed creator photo card marquee (`1:826`, overflows viewport).
2. **CreatorShowcase** (`1:824`): "The fastest way to discover and evaluate the right creators" + creator result-card image.
3. Reuse **UseCaseMarquee**.
4. **FeatureBlock** component + `featureBlocks.ts` data — 7 alternating rows under "The platform that actually does the work": Targeted Discovery, Analytics & Media Kit, Contact Unlocks, Comparisons, Shortlists, Easy Sharing, Reusable Pools. Each: title, copy, screenshot asset.
5. Assemble `features.astro` with shared shell; responsive pass.

## Phase 4 — Pricing page (`1:1924`)

1. **PricingHero** (`1:2061`): "Built for teams that demand accuracy" over wave bg.
2. **PricingCards** from `pricing.ts`: Starter ₹6,000 / Growth ₹10,000 (highlighted, purple glow + 3D star) / Accelerate ₹20,000, each with users, 8 feature rows, credits, add-on note, Sign Up button.
3. **CustomPlanStrip** (`1:2304`): "Looking for More Flexibility?" + Get in Touch.
4. **CreditsExplainer** (`1:2244`): "How credits work" — credits dashboard card, cost chips (5/50/5 credits), "Your Credits Stay With You" side card, 3D bolt.
5. Assemble `pricing.astro`; responsive pass.

## Phase 5 — Polish, SEO & QA

1. `404.astro` on-brand page (wrangler is configured for `404-page` handling).
2. Cross-page pass: hover/focus states, consistent section spacing, `prefers-reduced-motion`, keyboard nav through menu/tabs/accordion.
3. SEO: per-page titles/descriptions, OG image, `@astrojs/sitemap` + `robots.txt`, set `site` in `astro.config.mjs`.
4. Performance: verify image formats/sizes from `astro:assets`, font preload, no layout shift in hero.
5. Final visual comparison against Figma at 1728px, plus 1280 / 768 / 390px checks.

## Phase 6 — Deploy

`npm run build` → fix any build errors → `wrangler deploy` (existing `deploy` script) → verify live URL.

---

## Figma node reference (for per-section design context / exports)

| Page | Frame | Key section nodes |
|---|---|---|
| Home | `1:3` | Header `1:775`, hero `1:41` + mockup `1:657`, collage `1:45`, use-cases `1:705`, stats `1:731`, logos `1:565`, tabs `1:60`, testimonials `1:32`, FAQ `1:429`, CTA `1:464`, footer `1:500` |
| Features | `1:815` | Hero `1:820` + marquee `1:826`, showcase `1:824`, use-cases `1:949`, 7 blocks `1:1232`/`1:1235`/`1:1334`/`1:1500`/`1:1331`/`1:1508`/`1:1542`, CTA+footer `1:1545` |
| Pricing | `1:1924` | Hero `1:2061`, plans `1:2064`/`1:2112`/`1:2157`, custom strip `1:2304`, credits `1:2244`, CTA `1:1947`, footer `1:1983` |

During implementation, fetch per-section visuals with the Figma MCP (`get_screenshot` / `get_design_context` with fileKey `awUatUHjSJycuLMTotbJUU` + node ID).

## Verification (each phase)

1. `astro dev --background` (per CLAUDE.md), then check `astro dev logs` for errors.
2. Screenshot/browse the built section at 1728px and compare against the Figma section screenshot; check 768px and 390px for the responsive adaptation.
3. `npm run build` must pass clean before a phase is considered done.
