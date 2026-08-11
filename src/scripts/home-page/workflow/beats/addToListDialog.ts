import gsap from "gsap";

/**
 * Beat 5 — the add-to-list dialog opens. Swap-first, unlike every other beat:
 * screen 6 embeds a copy of screen 5 as its blurred backdrop, so with the blur off,
 * the scrim clear and the card hidden the two layers are identical and the swap is
 * invisible. The backdrop is a fresh render, so beat 4's media-kit scroll has to be
 * carried across by hand. The cursor does not move — a dialog opening doesn't move it.
 */

export interface AddToListLayers {
	/** The media-kit layer being left. */
	from: HTMLElement;
	/** The dialog layer, which carries its own copy of the layer beneath. */
	to: HTMLElement;
}

/** Every element the beat drives, or null if the dialog markup is not there. */
function collect({ from, to }: AddToListLayers) {
	const el = {
		fromMediaKit: from.querySelector<HTMLElement>("[data-wf-mediakit-scroll]"),
		backdrop: to.querySelector<HTMLElement>("[data-wf-modal-backdrop]"),
		backdropMediaKit: to.querySelector<HTMLElement>("[data-wf-mediakit-scroll]"),
		scrim: to.querySelector<HTMLElement>("[data-wf-modal-scrim]"),
		card: to.querySelector<HTMLElement>("[data-wf-modal-card]"),
	};

	return Object.values(el).every(Boolean) ? (el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }) : null;
}

export function addToListDialog(layers: AddToListLayers) {
	const el = collect(layers);
	if (!el) return null;

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
		.set(el.card, { opacity: 0 })
		// Read live rather than at build time: beat 4 has to have scrolled it first.
		.call(() => {
			gsap.set(el.backdropMediaKit, { y: gsap.getProperty(el.fromMediaKit, "y") as number });
		})
		.call(() => {
			layers.from.removeAttribute("data-wf-active");
			layers.to.setAttribute("data-wf-active", "");
		});

	// ── the dialog opens ─────────────────────────────────────────────────────
	// The card fades without scaling. Its centring is a percentage translate, and
	// GSAP would fold that into pixels to add a scale, which then goes stale on
	// resize — and the app's sibling modal (screen 10) is opacity-only anyway.
	tl.addLabel("open")
		.to(el.backdrop, { filter: blurred, duration: 0.26, ease: "none" }, "open")
		.to(el.scrim, { opacity: 1, duration: 0.26 }, "open")
		.to(el.card, { opacity: 1, duration: 0.32 }, "open+=0.08");

	return tl;
}
