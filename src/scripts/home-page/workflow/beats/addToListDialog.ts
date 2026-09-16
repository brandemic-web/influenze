import gsap from "gsap";

/**
 * The add-to dialog opening. Swap-first, unlike every other beat: the dialog layer
 * embeds a copy of the layer beneath as its blurred backdrop, so with the blur off,
 * the scrim clear and the card hidden the two layers are identical and the swap is
 * invisible.
 *
 * The story plays this twice — over the results for the free shortlist save, and
 * over the creator's own panel for the promote into a list — so the beat knows
 * nothing about which tab it is opening. Both times the previous beat has already
 * pressed the control, and a dialog opening does not move the mouse.
 *
 * The backdrop copy is a fresh render, so anything an earlier beat changed on the
 * live layer has to reach it somehow. Authored state is preferred (see Analyze's
 * `selected`); the one thing that cannot be authored is a scroll position, so the
 * media kit's is carried across by hand when both sides have one.
 */

export interface AddToListLayers {
	/** The layer being left, which the dialog carries a copy of. */
	from: HTMLElement;
	/** The dialog layer. */
	to: HTMLElement;
}

/** Every element the beat drives, or null if the dialog markup is not there. */
function collect({ from, to }: AddToListLayers) {
	const el = {
		backdrop: to.querySelector<HTMLElement>("[data-wf-modal-backdrop]"),
		scrim: to.querySelector<HTMLElement>("[data-wf-modal-scrim]"),
		card: to.querySelector<HTMLElement>("[data-wf-modal-card]"),
	};
	if (!Object.values(el).every(Boolean)) return null;

	// Only the promote has a media kit behind it; the shortlist save has none.
	const fromMediaKit = from.querySelector<HTMLElement>("[data-wf-mediakit-scroll]");
	const toMediaKit = to.querySelector<HTMLElement>("[data-wf-mediakit-scroll]");

	return {
		...(el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }),
		mediaKit: fromMediaKit && toMediaKit ? { from: fromMediaKit, to: toMediaKit } : null,
	};
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
		.set(el.card, { opacity: 0 });

	// Read live, not at build time: the media-kit beat has to have scrolled first.
	if (el.mediaKit) {
		const kit = el.mediaKit;
		tl.call(() => {
			gsap.set(kit.to, { y: gsap.getProperty(kit.from, "y") as number });
		});
	}

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
