import gsap from "gsap";

/** Small helpers shared by the workflow beats. */

/**
 * Read one of the mockup's `wf-` colour tokens.
 *
 * Beats animate *to* values the components already own, so none of them restate a
 * hex. This is the lookup for the ones that live in `styles/app-tokens.css`.
 */
export function token(name: string) {
	return getComputedStyle(document.documentElement).getPropertyValue(`--color-wf-${name}`).trim();
}

/**
 * Trade one inline hook for another.
 *
 * These pairs are mutually exclusive — one placeholder and one value, or one label
 * and its replacement — so the outgoing one has to leave the flow before the
 * incoming one enters it. A crossfade would make the row briefly hold both and
 * jump wider.
 */
export function swapInline(from: HTMLElement, to: HTMLElement) {
	return gsap
		.timeline()
		.to(from, { opacity: 0, duration: 0.14 })
		.set(from, { display: "none" })
		.set(to, { display: "inline", opacity: 0 })
		.to(to, { opacity: 1, duration: 0.2 });
}
