import gsap from "gsap";
import { CARDS_DOWN, landCards } from "../utils/cards";
import type { DemoContext } from "../utils/demo";

/**
 * Beat 2 — Know The Audience.
 *
 * The three cards stagger up, then the cursor clicks the Brand Affinities toggle
 * on the Audience Affinities card and the top-five list swaps over.
 *
 * Interests first, brands second: the interest list is the broader read on an
 * audience, and the brands it already follows is the sharper follow-up — so the
 * swap answers the question the first list raises.
 *
 * The toggle stays live for the visitor afterwards: `scripts/audience-affinities.ts`
 * drives the same properties this does — `aria-pressed` on the tabs, `autoAlpha`
 * on the lists — so the scripted and hand-driven paths can hand the card back and
 * forth without fighting over state. Which is also why the rewind below restates
 * the attributes as well as the opacity.
 */

/**
 * List swap (s). Fade only, and on each list as a whole rather than its rows — a
 * per-row `y` tween puts a transform on text that is already sitting inside the
 * fractionally scaled stage, which reads as a jitter at the smaller breakpoints.
 * Mirrors the same pair in `scripts/audience-affinities.ts`.
 */
const LIST_FADE_OUT = 0.22;
const LIST_FADE_IN = 0.32;

function collect(panel: HTMLElement) {
	const q = <T extends HTMLElement>(selector: string) => panel.querySelector<T>(selector);

	const el = {
		interestsTab: q('[data-affinity-tab="interests"]'),
		brandsTab: q('[data-affinity-tab="brands"]'),
		interestsList: q('[data-affinity-list="interests"]'),
		brandsList: q('[data-affinity-list="brands"]'),
	};

	type Found = { [K in keyof typeof el]: NonNullable<(typeof el)[K]> };
	if (!Object.values(el).every(Boolean)) return null;

	const items = gsap.utils.toArray<HTMLElement>("[data-panel-item]", panel);
	if (!items.length) return null;

	return { ...(el as Found), items };
}

export function knowAudience({ panel, pointer }: DemoContext) {
	const el = collect(panel);
	if (!el || !pointer) return;

	return (
		gsap
			.timeline({ paused: true, defaults: { ease: "power2.out" } })
			// ── t=0 · cards down, cursor parked, affinities back on Interests ────────
			.set(el.items, CARDS_DOWN)
			.set(pointer.el, pointer.homeVars())
			.set(pointer.ring, pointer.ringVars())
			.set(el.brandsList, { autoAlpha: 0, attr: { "data-affinity-selected": "false" } })
			.set(el.interestsList, { autoAlpha: 1, attr: { "data-affinity-selected": "true" } })
			.set(el.brandsTab, { attr: { "aria-pressed": "false" } })
			.set(el.interestsTab, { attr: { "aria-pressed": "true" } })

			// ── 1 · the three cards land, staggered ──────────────────────────────────
			.add(landCards(el.items), 0.1)

			// ── 2 · cursor travels to the Brand Affinities toggle and clicks ─────────
			.add(pointer.fadeIn(), ">-0.15")
			.add(pointer.click(el.brandsTab), "<")

			// ── 3 · the toggle flips and the top five swap over ──────────────────────
			.set(el.brandsTab, { attr: { "aria-pressed": "true" } }, ">-0.1")
			.set(el.interestsTab, { attr: { "aria-pressed": "false" } }, "<")
			.set(el.brandsList, { attr: { "data-affinity-selected": "true" } }, "<")
			.set(el.interestsList, { attr: { "data-affinity-selected": "false" } }, "<")
			.to(el.interestsList, { autoAlpha: 0, duration: LIST_FADE_OUT, ease: "power2.in" }, "<")
			.fromTo(el.brandsList, { autoAlpha: 0 }, { autoAlpha: 1, duration: LIST_FADE_IN })
			.add(pointer.fadeOut(), ">0.3")
	);
}
