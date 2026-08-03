import gsap from "gsap";

/**
 * Beat 10 — share the list by email.
 *
 * Answers beat 9's press on the share control, and closes the story.
 *
 * Uses beat 5's swap-first shape, because screen 10 embeds `<ListDetails blurred />` the same way screen 6 embeds screen 5: neutralise the blur, hide the
 * card, and screen 10 renders what screen 8 renders — so the swap is invisible and
 * the modal can simply arrive.
 *
 * It must **not** animate like beat 5, though. That one is a dialog route with a
 * full-frame scrim; this is a `CenteredModalOverlay` **clipped to the host panel**,
 * with **blur only and no dim**, ramping `blur(0 → 12)` over **260ms linear** and
 * opacity-only on the card. There is no scrim element here at all — the blur lives
 * on the panel body, via `ListDetailShell`'s `blurred` prop.
 */

export interface ShareModalLayers {
	/** The list-detail layer being left. */
	from: HTMLElement;
	/** The share layer, which carries its own copy of the list beneath. */
	to: HTMLElement;
}

/** Every element the beat drives, or null if the share markup is not there. */
function collect({ to }: ShareModalLayers) {
	const el = {
		// The blur is on the backdrop copy's panel body, not on an overlay.
		panel: to.querySelector<HTMLElement>("[data-wf-panel-body]"),
		card: to.querySelector<HTMLElement>("[data-wf-share-card]"),
	};

	return Object.values(el).every(Boolean) ? (el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }) : null;
}

export function shareModal(layers: ShareModalLayers) {
	const el = collect(layers);
	if (!el) return null;

	// Read the authored blur before overriding it, so ListDetailShell keeps owning
	// the value, and give the tween two explicit `blur(Npx)` endpoints.
	const blurred = getComputedStyle(el.panel).filter;
	const CLEAR = "blur(0px)";

	const tl = gsap.timeline();

	// ── make the share layer indistinguishable from the list beneath ──────────
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
	})
		.set(el.panel, { filter: CLEAR })
		.set(el.card, { opacity: 0 })
		.call(() => {
			layers.from.removeAttribute("data-wf-active");
			layers.to.setAttribute("data-wf-active", "");
		});

	// ── the modal opens ──────────────────────────────────────────────────────
	// 260ms linear on the blur is the app's own ramp; the card only fades.
	tl.addLabel("open")
		.to(el.panel, { filter: blurred, duration: 0.26, ease: "none" }, "open")
		.to(el.card, { opacity: 1, duration: 0.3, ease: "power2.out" }, "open+=0.08");

	return tl;
}
