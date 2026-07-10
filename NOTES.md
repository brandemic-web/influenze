# Build Notes — things you should know

Running list of judgment calls, design inconsistencies found in Figma, and open questions.
Where unsure, the build follows the design as-is; nothing below was "fixed" silently.

## Content gaps (need copy/decision from you)

1. **FAQ answers missing** — the design has 6 FAQ questions but only ONE answer (for "How accurate is the fraud detection?"). The other 5 questions have no answer text anywhere in the file. `src/data/faqs.ts` has clearly-marked `TODO` placeholder answers that must be replaced before launch.
2. **Testimonials are placeholders** — all 3 cards are the same person ("James Smith, IPLIX") with the same quote and same photo. Built as designed; swap real testimonials in `src/data/testimonials.ts` when available.
3. **Resources nav dropdown** — "Resources ▾" in the header has no designed dropdown panel. Built as a simple dropdown listing the footer's Resources links (Product Demo, Blogs, FAQs, Contact Us), all pointing to `#`.
4. **CTA URLs** — Login/Sign Up/Get in Touch all point to the placeholder in `src/data/site.ts` (`SIGNUP_URL` / `LOGIN_URL` / `CONTACT_URL`). Swap when the app URLs exist.

## Design inconsistencies (left as designed)

5. **"400M+" vs "450M+" creators** — pricing plan rows say "Analyze 400M+ Creators" while both hero sections say "450M+ creators". Left exactly as designed.
6. **Use-case card copy duplicated** — ADVERTISING and E-COMMERCE cards have the *identical* description as PUBLIC RELATIONS ("Assists in creator discovery, ambassador shortlisting…"). Left as designed.
7. **StatsGrid duplicate value** — both "Fraud Detection accuracy" and "Historical data per creator" show "99.8%". The historical-data card's body copy mentions "24 months", so the 99.8% may be a copy-paste; left as designed.
8. **Pricing credit row typo** — "Per Media Media Kit Unlock" (doubled word) in the How-Credits-Work card. Left as designed.
9. **"Agnecy" typo** — appears only inside exported UI screenshot images (filter panel mock), not in any live text we render, so nothing to fix in code. A design-file fix + re-export would be needed to remove it from the images.
10. **Footer "Use Cases" column** — the Figma file contains text layers for a 4th footer column (Use Cases: Influencer Marketing, Talent Management, Public Relations, Advertising, E-Commerce) but the rendered design shows only 3 columns (Learn / Resources / Legal). Verifying against layer visibility during Phase 1; currently following the visible 3-column design, with the Use Cases data kept in `src/data/footer.ts` (easy to enable).

## Copy fixes applied (the only ones)

11. **Pricing hero subline** — Figma text is "Not just another data platform␣␣we verify, score…" (double space where a dash clearly went missing). Rendered as "Not just another data platform — we verify, score, and surface only what matters." Revert in `src/data/pricing.ts` if you want the literal Figma text.

## Technical decisions

12. **Two greens exist in the design** — brand mint `#3AFF98` (headings, borders, labels) and button green `#43EE95` (all pill buttons). Both are theme tokens (`brand-primary` / `button-primary`); not merged, since the design uses them consistently in different roles.
13. **Heading typography** — all big headings are Open Sauce Two **Regular** (not bold) with CSS `capitalize`. Data files store copy in sentence case exactly as in Figma; the capitalization is styling.
14. **Mock-UI text inside decorative cards** uses the Inter font in Figma. Those cards ship as exported images, so Inter is not self-hosted. If any mock-UI element must be rebuilt as live HTML later, it will fall back to Open Sauce Two.
15. **No animations** (per PLAN.md) — scrolling strips/marquees are static rows; GSAP/Swiper come later.
16. **Decorative vectors** (waves, CTA rails, glow ellipses, 3D bolt renders) not present in `src/assets` were downloaded from the Figma MCP asset endpoints during the build and committed under `src/assets/images/`.

## Found during the build

19. **Feature tabs (Home): only one tab state is designed.** The "Discover & Analyze" panel is fully designed; "My Lists" and "Share" have no designed panels or copy. Built as a working tab switcher where the left copy stays constant and the right visual swaps (`zamna_campaign_list.png` / `share_email_popup.png`). Needs designed content if the tabs should differ more.
20. **Feature blocks don't alternate.** The old plan said "alternating rows"; the current design has all 7 blocks with text left / visual right. Followed the design.
21. **`credit_summary_card.svg` is the complete credits visual** — chips, dashboard card AND the "Your Credits Stay With You" side card are baked into the one SVG, so that section is a single image (its text is outlined paths, not selectable/live).
22. **Scaffold bug fixed: Tailwind v4 token namespace.** `global.css` declared font sizes as `--font-size-*` (v3 naming); Tailwind v4 reads `--text-*`, so every `text-*` utility silently fell back to Tailwind defaults (128px h1s). Renamed to `--text-*`. The `--text-color-*` variables in the theme are still non-functional in v4 (kept as-is, unused).
23. **`mokobora_listing.png` is unused** — the Figma frame it was assumed to represent ("Frame 47934") turned out to be the creator filters panel, which has its own export.
24. **Radius scale gotcha**: the theme maps `rounded-lg` to 2rem and `rounded-3xl` to 8.75rem — much bigger than Tailwind defaults. Components use explicit arbitrary values (`rounded-[20px]` etc.) where the design specifies exact radii.
25. **Dev-server quirk**: after adding new `.astro` files, `astro dev` sometimes serves stale Tailwind CSS (new arbitrary classes missing) — restart `astro dev` if a fresh component renders unstyled.

## Figma file notes

17. The file/key changed from the planning file (`awUatUHjSJycuLMTotbJUU` → `wRKOHCAKIB0doxAmChMkM5`); PLAN.md references were updated. Node IDs from the old plan are obsolete.
18. Pages are flat frames (not sectioned), and many pricing-page text layers were renamed to generic labels ("Plan Name", "Feature Text"), so the build navigated by coordinates + rendered screenshots rather than the layer tree.
