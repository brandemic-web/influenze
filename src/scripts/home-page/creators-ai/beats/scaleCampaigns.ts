import gsap from "gsap";
import { CARDS_DOWN, landCards } from "../utils/cards";
import type { DemoContext } from "../utils/demo";

/**
 * Beat 4 — Scale Campaigns Confidently.
 *
 * The analysed-creator card lands, the cursor clicks Enquire, and the contact
 * list wipes open from a clip path collapsed against its own top edge.
 *
 * A clip path rather than a height tween: the popover is absolutely positioned
 * over the card, so there is no layout to animate — and clipping leaves the list
 * laid out at full size the whole way, which keeps its rows from reflowing as it
 * opens.
 */
function collect(panel: HTMLElement) {
	const q = <T extends HTMLElement>(selector: string) => panel.querySelector<T>(selector);

	const el = {
		item: q("[data-panel-item]"),
		enquire: q("[data-analyzed-enquire]"),
		popover: q("[data-analyzed-popover]"),
	};

	type Found = { [K in keyof typeof el]: NonNullable<(typeof el)[K]> };
	if (!Object.values(el).every(Boolean)) return null;

	return el as Found;
}

export function scaleCampaigns({ panel, pointer }: DemoContext) {
	const el = collect(panel);
	if (!el || !pointer) return;

	return (
		gsap
			.timeline({ paused: true, defaults: { ease: "power2.out" } })
			// ── t=0 · card down, cursor parked, contact list clipped shut ────────────
			.set(el.item, CARDS_DOWN)
			.set(pointer.el, pointer.homeVars())
			.set(pointer.ring, pointer.ringVars())
			.set(el.popover, { clipPath: "inset(0% 0% 100% 0%)", autoAlpha: 0 })

			// ── 1 · the card appears ─────────────────────────────────────────────────
			// One card, so no stagger to give it.
			.add(landCards(el.item, 0), 0.1)

			// ── 2 · cursor travels to Enquire and clicks ─────────────────────────────
			.add(pointer.fadeIn(), ">-0.1")
			.add(pointer.click(el.enquire), "<")

			// ── 3 · the contact list wipes open downward ─────────────────────────────
			.set(el.popover, { autoAlpha: 1 }, ">-0.25")
			.to(el.popover, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.inOut" }, "<")
			.add(pointer.fadeOut(), ">0.3")
	);
}
