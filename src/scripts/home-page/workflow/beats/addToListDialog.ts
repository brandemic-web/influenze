import gsap from "gsap";
import type { Pointer } from "../utils/pointer";

/**
 * The add-to dialog opening. Swap-first, unlike every other beat: the dialog layer
 * embeds a copy of the layer beneath as its blurred backdrop, so with the blur off,
 * the scrim clear and the card hidden the two layers are identical and the swap is
 * invisible.
 *
 * The story plays this twice — once over the results for the free shortlist save,
 * once over the shortlist for the paid promote — so the beat knows nothing about
 * which tab it is opening. The backdrop copy is a fresh render, so anything an
 * earlier beat changed on the live layer has to be authored into it: see Analyze's
 * `selected`, which is why no state is carried across here by hand.
 */

export interface AddToListLayers {
	/** The layer being left, which the dialog carries a copy of. */
	from: HTMLElement;
	/** The dialog layer. */
	to: HTMLElement;
}

export interface AddToListOptions {
	/**
	 * What the cursor presses to open it, inside `from`. Omitted where the previous
	 * beat has already pressed the control — a dialog opening does not move a cursor
	 * that is already on the button that opened it.
	 */
	trigger?: string;
}

/** Every element the beat drives, or null if the dialog markup is not there. */
function collect({ to }: AddToListLayers) {
	const el = {
		backdrop: to.querySelector<HTMLElement>("[data-wf-modal-backdrop]"),
		scrim: to.querySelector<HTMLElement>("[data-wf-modal-scrim]"),
		card: to.querySelector<HTMLElement>("[data-wf-modal-card]"),
	};

	return Object.values(el).every(Boolean) ? (el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }) : null;
}

export function addToListDialog(layers: AddToListLayers, pointer: Pointer, options: AddToListOptions = {}) {
	const el = collect(layers);
	if (!el) return null;

	const trigger = options.trigger ? layers.from.querySelector<HTMLElement>(options.trigger) : null;
	if (options.trigger && !trigger) return null;

	// Read the authored blur before overriding it, so CenteredModalOverlay keeps
	// owning it. Both tween ends are then explicit `blur(Npx)` — the only shape GSAP
	// interpolates dependably.
	const blurred = getComputedStyle(el.backdrop).filter;
	const CLEAR = "blur(0px)";

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// ── make the dialog layer indistinguishable from the one beneath ─────────
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
	})
		.set(el.backdrop, { filter: CLEAR })
		.set(el.scrim, { opacity: 0 })
		.set(el.card, { opacity: 0 });

	// Pressed on the layer we are leaving, while it is still the visible one.
	if (trigger) tl.add(pointer.moveTo(trigger, { duration: 0.6 }), "+=0.15").add(pointer.press(), ">-0.05");

	tl.call(() => {
		layers.from.removeAttribute("data-wf-active");
		layers.to.setAttribute("data-wf-active", "");
	});

	// ── the dialog opens ─────────────────────────────────────────────────────
	// The card fades without scaling. Its centring is a percentage translate, and
	// GSAP would fold that into pixels to add a scale, which then goes stale on
	// resize — and the app's sibling share modal is opacity-only anyway.
	tl.addLabel("open")
		.to(el.backdrop, { filter: blurred, duration: 0.26, ease: "none" }, "open")
		.to(el.scrim, { opacity: 1, duration: 0.26 }, "open")
		.to(el.card, { opacity: 1, duration: 0.32 }, "open+=0.08");

	return tl;
}
