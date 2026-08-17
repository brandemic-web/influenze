import gsap from "gsap";

/**
 * Beat 8 — compare mode. Not a route in the app but a mode swap inside the same
 * panel, so only `[data-wf-panel-body]` changes: one fade through an empty panel,
 * split to the app's 450ms. Opacity-only — the column is centred with a percentage
 * translate that GSAP would fold into pixels to add a slide, going stale on resize.
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

	// Wind the layers back first, so the beat is replayable from anywhere.
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
