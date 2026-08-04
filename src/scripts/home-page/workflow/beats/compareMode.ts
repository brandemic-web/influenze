import gsap from "gsap";

/**
 * Beat 8 — compare the two creators.
 *
 * Answers beat 7's press on Compare. In the app this is not a route at all but a
 * mode swap inside the same list-detail panel — an `AnimatedSwitcher` running a
 * 450ms shared-axis transition — so the panel surface, card and nav all stay put
 * and only the column inside changes: the toolbar and column header collapse away,
 * the title becomes a centred "Compare", the share control hides, and the rows
 * become side-by-side stat columns.
 *
 * All of that lives inside `[data-wf-panel-body]`, so the swap is one fade through
 * an empty panel, split to the app's 450ms. It is opacity-only: that column is
 * centred with a percentage translate, and GSAP would fold it into pixels to add a
 * slide, which then goes stale on resize. So the duration is faithful even though
 * the shared axis is not.
 *
 * The cursor does not move — it pressed Compare in beat 7, and a mode swap does
 * not move the mouse.
 */

export interface CompareModeLayers {
	/** The list-detail layer being left. */
	from: HTMLElement;
	/** The compare layer. */
	to: HTMLElement;
}

/** Every element the beat drives, or null if the panel markup is not there. */
function collect({ from, to }: CompareModeLayers) {
	const el = {
		fromBody: from.querySelector<HTMLElement>("[data-wf-panel-body]"),
		toBody: to.querySelector<HTMLElement>("[data-wf-panel-body]"),
	};

	return Object.values(el).every(Boolean) ? (el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }) : null;
}

export function compareMode(layers: CompareModeLayers) {
	const el = collect(layers);
	if (!el) return null;

	// The app's shared-axis switch is 450ms end to end; split across the two halves.
	const OUT = 0.22;
	const IN = 0.23;

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// Put the layers back the way beat 7 leaves them, so the beat is self-contained.
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
	});

	tl.to(el.fromBody, { opacity: 0, duration: OUT, ease: "power2.in" })
		.call(() => {
			layers.from.removeAttribute("data-wf-active");
			layers.to.setAttribute("data-wf-active", "");
		})
		// Leave the layer we came from as we found it, so a replay starts clean.
		.set(el.fromBody, { opacity: 1 })
		.from(el.toBody, { opacity: 0, duration: IN, immediateRender: false });

	return tl;
}
