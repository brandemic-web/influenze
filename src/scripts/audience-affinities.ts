import gsap from "gsap";

/**
 * Makes the Audience Affinities toggle real: once the scripted demo has clicked
 * across to Interests, the visitor can keep switching the two lists themselves.
 *
 * The beat in `home-page/creators-ai/beats/knowAudience.ts` drives the same properties
 * (`aria-pressed` on the tabs, `autoAlpha` on the lists) so the two paths can
 * hand the card back and forth without fighting over state.
 */

/**
 * Swap timings (s). Deliberately opacity-only, and applied to each list as a
 * whole: tweening `y` on the individual rows puts a transform on text that sits
 * inside the fractionally scaled collage stage, which reads as a jitter at the
 * smaller breakpoints. Mirrored by the demo timeline.
 */
const FADE_OUT = 0.22;
const FADE_IN = 0.32;

function selectAffinity(root: HTMLElement, key: string) {
	const tabs = gsap.utils.toArray<HTMLElement>("[data-affinity-tab]", root);
	const lists = gsap.utils.toArray<HTMLElement>("[data-affinity-list]", root);
	const next = lists.find((list) => list.dataset.affinityList === key);
	if (!next || next.dataset.affinitySelected === "true") return;

	for (const tab of tabs) {
		tab.setAttribute("aria-pressed", String(tab.dataset.affinityTab === key));
	}

	const outgoing = lists.filter((list) => list !== next);

	for (const list of lists) list.dataset.affinitySelected = String(list === next);

	gsap
		.timeline({ defaults: { overwrite: true } })
		.to(outgoing, { autoAlpha: 0, duration: FADE_OUT, ease: "power2.in" }, 0)
		.fromTo(next,
			{ autoAlpha: 0 },
			{ autoAlpha: 1, duration: FADE_IN, ease: "power2.out" },
			FADE_OUT);
}

function initAudienceAffinities() {
	for (const root of document.querySelectorAll<HTMLElement>("[data-affinity-ui]")) {
		if (root.dataset.affinityReady === "true") continue;
		root.dataset.affinityReady = "true";

		// Seeded from the markup so the first user click knows what is already
		// shown. Skipped where the demo timeline has already claimed the card.
		for (const list of root.querySelectorAll<HTMLElement>("[data-affinity-list]")) {
			if (!list.dataset.affinitySelected) {
				list.dataset.affinitySelected = String(!list.classList.contains("invisible"));
			}
		}

		for (const tab of root.querySelectorAll<HTMLElement>("[data-affinity-tab]")) {
			const key = tab.dataset.affinityTab;
			if (key) tab.addEventListener("click", () => selectAffinity(root, key));
		}
	}
}

initAudienceAffinities();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initAudienceAffinities);
