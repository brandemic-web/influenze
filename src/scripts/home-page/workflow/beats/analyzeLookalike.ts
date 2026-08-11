import gsap from "gsap";
import { CREDITS, RAIL_TIER_SCROLL } from "../../../../data/workflowMockup";
import { typeText } from "../../../gsap/typeText";
import { setCredits, spendCredits } from "../utils/credits";
import { swapInline, token } from "../utils/dom";
import type { Pointer } from "../utils/pointer";

/**
 * Beat 1 — builds a Lookalike search in place inside screen 1: open Parameters,
 * pick Lookalike, type a handle, add a location, scroll the rail, pick the Macro
 * tier, press Apply & Search. Ends at `RAIL_TIER_SCROLL`, where screens 3-5 are
 * authored, so beat 2 can swap layers without the rail moving.
 *
 * Driven entirely through AnalyzeFilterSidebar's `data-wf-*` hooks. See APP-SPEC.md.
 */

/** The root font-size is fluid, so rem has to be resolved at runtime. */
const rootFontSize = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

/**
 * Grow a clip wrapper from nothing to its natural height. The wrapper is bare, so
 * padding and margins never animate alongside; layout is handed back to CSS after.
 */
function expand(wrapper: HTMLElement, duration = 0.34) {
	return gsap
		.timeline()
		.set(wrapper, { display: "block", overflow: "hidden", height: 0 })
		.to(wrapper, { height: "auto", duration, ease: "power2.out" })
		.call(() => {
			wrapper.style.removeProperty("height");
			wrapper.style.removeProperty("overflow");
		});
}

/** Fold a clip wrapper away again and take it out of flow. */
function collapse(wrapper: HTMLElement, duration = 0.28) {
	return gsap
		.timeline()
		.set(wrapper, { overflow: "hidden", height: () => wrapper.offsetHeight })
		.to(wrapper, { height: 0, duration, ease: "power2.in" })
		.set(wrapper, { display: "none" });
}

/** Every element the beat drives, or null if the rail isn't the one we expect. */
function collect(screen: HTMLElement) {
	const q = <T extends HTMLElement>(selector: string) => screen.querySelector<T>(selector);
	// Both fields hold a caret, so those two are scoped to their own field.
	const handleField = q("[data-wf-handle-field]");
	const locationField = q("[data-wf-location-field]");

	const el = {
		navAnalyze: q('[data-wf-nav="analyze"]'),
		rail: q("[data-wf-rail]"),
		railScroll: q("[data-wf-rail-scroll]"),
		tier: q("[data-wf-tier]"),
		tierDot: q("[data-wf-tier-dot]"),
		tierPip: q("[data-wf-tier-pip]"),
		tierRange: q("[data-wf-tier-range]"),
		tierBody: q("[data-wf-tier-body]"),
		benchmark: q("[data-wf-benchmark]"),
		allRanges: q("[data-wf-all-ranges]"),
		slider: q("[data-wf-slider]"),
		thumb: q("[data-wf-slider-thumb]"),
		trigger: q("[data-wf-param-trigger]"),
		label: q("[data-wf-param-label]"),
		chevron: q("[data-wf-param-chevron]"),
		sheet: q("[data-wf-param-sheet]"),
		option: q("[data-wf-param-target]"),
		panel: q("[data-wf-param-panel]"),
		handleField,
		handleHint: q("[data-wf-handle-hint]"),
		handleValue: q("[data-wf-handle-value]"),
		handleCaret: handleField?.querySelector<HTMLElement>("[data-wf-caret]") ?? null,
		locationField,
		locationInput: q("[data-wf-location-input]"),
		locationCaret: locationField?.querySelector<HTMLElement>("[data-wf-caret]") ?? null,
		locationChips: q("[data-wf-location-chips]"),
		locationChip: q("[data-wf-location-chip]"),
		sortFollowers: q('[data-wf-sort="followers"]'),
		sortLookalike: q('[data-wf-sort="lookalike"]'),
		sortReset: q('[data-wf-reset="sort"]'),
		locationReset: q('[data-wf-reset="location"]'),
		apply: q("[data-wf-apply]"),
	};

	type Found = { [K in keyof typeof el]: NonNullable<(typeof el)[K]> };
	if (!Object.values(el).every(Boolean)) return null;

	const captions = gsap.utils.toArray<HTMLElement>(screen.querySelectorAll("[data-wf-slider-caption]"));
	if (captions.length < 2) return null;

	return { ...(el as Found), captions };
}

export function analyzeLookalike(screen: HTMLElement, pointer: Pointer) {
	const el = collect(screen);
	if (!el) return null;

	// Read the authored strings and colours off the markup up front: the component
	// stays the single source, and a replay can't pick up this beat's own output.
	const emptyLabel = el.label.textContent ?? "";
	const pickedLabel = el.option.textContent?.trim() ?? "";
	const handle = el.handleValue.textContent?.trim() ?? "";
	const place = el.locationChip.textContent?.trim() ?? "";
	const locationHint = el.locationInput.textContent ?? "";
	const dimmedLabel = getComputedStyle(el.label).color;

	// The slider publishes its own snap offsets and resting stop. Nothing drags it,
	// so this only repaints that one stop when the loop comes round.
	const stops = (el.slider.dataset.wfSliderStops ?? "").split(",").map(Number);
	const restAt = stops[Number(el.slider.dataset.wfSliderStop ?? 0)] ?? 0;
	const captionOn = token("text-quiet");
	const captionOff = token("text-muted");

	/** Place the handle and light the captions from the thumb rightward. */
	const paintSlider = (at: number) => {
		el.slider.style.setProperty("--wf-slider-at", String(at / 100));
		el.captions.forEach((caption, i) => {
			caption.style.color = at <= (stops[i + 1] ?? Infinity) ? captionOn : captionOff;
		});
	};

	/**
	 * Put the rail back to an untouched filter panel. A no-op on the first pass, but
	 * beat 11 calls it *before* revealing screen 1 so the loop arrives home clean.
	 */
	const reset = () => {
		gsap.set([el.sheet, el.panel, el.tierBody], { display: "none" });
		gsap.set(el.trigger, { backgroundColor: token("select") });
		gsap.set(el.chevron, { rotation: 0 });
		gsap.set(el.label, { opacity: 1, color: dimmedLabel });
		gsap.set(el.option, { backgroundColor: "transparent" });
		gsap.set([el.handleCaret, el.locationCaret], { display: "none" });
		gsap.set(el.handleHint, { display: "inline", opacity: 1 });
		gsap.set(el.handleValue, { display: "none" });
		gsap.set(el.locationChips, { display: "none" });
		gsap.set(el.sortFollowers, { display: "inline", opacity: 1 });
		gsap.set(el.sortLookalike, { display: "none" });
		gsap.set([el.sortReset, el.locationReset], { opacity: 0 });
		gsap.set(el.apply, { scale: 1 });
		gsap.set(el.railScroll, { y: 0 });
		gsap.set(el.tier, { backgroundColor: "transparent" });
		gsap.set(el.tierDot, { borderColor: token("control-border"), backgroundColor: "transparent" });
		gsap.set(el.tierPip, { display: "none", opacity: 0 });
		gsap.set(el.tierRange, { color: token("text-value") });
		// The tier reads out its own minimum; "all ranges" shares that grid cell and
		// is never shown, since nothing drags the handle.
		gsap.set(el.benchmark, { opacity: 1 });
		gsap.set(el.allRanges, { opacity: 0 });
		el.label.textContent = emptyLabel;
		el.locationInput.textContent = locationHint;
		paintSlider(restAt);
		setCredits(screen, CREDITS.start);
	};

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// ── the rail as the visitor first finds it ───────────────────────────────
	// The cursor starts parked where beat 11 leaves it, so the loop seam has no jump.
	// `fadeIn` only does anything on the first pass, while CSS still hides the cursor.
	tl.call(reset)
		.set(pointer.el, pointer.aimVars(el.navAnalyze))
		.add(pointer.fadeIn(), "+=0.25");

	// ── open the Parameters dropdown ─────────────────────────────────────────
	tl.addLabel("open")
		.add(pointer.moveTo(el.trigger), "open")
		.add(pointer.press(), "open+=0.7")
		.to(el.trigger, { backgroundColor: token("select-open"), duration: 0.2 }, "open+=0.8")
		.to(el.chevron, { rotation: 180, duration: 0.3 }, "open+=0.8")
		.add(expand(el.sheet), "open+=0.8");

	// ── pick Lookalike ───────────────────────────────────────────────────────
	tl.addLabel("pick", "open+=1.3")
		.add(pointer.moveTo(el.option, { duration: 0.5 }), "pick")
		.add(pointer.press(), "pick+=0.5")
		.to(el.option, { backgroundColor: token("select-active"), duration: 0.16 }, "pick+=0.58");

	// The sheet folds away, the trigger takes the label, and the Lookalike body
	// opens in its place. Sorting follows the parameter, the way the app does it.
	tl.addLabel("chosen", "pick+=0.8")
		.add(collapse(el.sheet), "chosen")
		.to(el.chevron, { rotation: 0, duration: 0.3 }, "chosen")
		.to(el.trigger, { backgroundColor: token("select"), duration: 0.25 }, "chosen")
		.to(
			el.label,
			{
				opacity: 0,
				duration: 0.12,
				onComplete: () => {
					el.label.textContent = pickedLabel;
					gsap.set(el.label, { color: token("text") });
				},
			},
			"chosen"
		)
		.to(el.label, { opacity: 1, duration: 0.18 }, "chosen+=0.12")
		.add(expand(el.panel), "chosen+=0.22")
		.add(swapInline(el.sortFollowers, el.sortLookalike), "chosen+=0.32")
		.to(el.sortReset, { opacity: 1, duration: 0.3 }, "chosen+=0.42");

	// ── type the handle ──────────────────────────────────────────────────────
	tl.addLabel("handle", "chosen+=0.85")
		.add(pointer.moveTo(el.handleField, { at: { x: 0.14 }, duration: 0.55 }), "handle")
		.add(pointer.press(), "handle+=0.55")
		.call(
			() => {
				gsap.set(el.handleHint, { display: "none" });
				el.handleValue.textContent = "";
				gsap.set(el.handleValue, { display: "inline", opacity: 1 });
				gsap.set(el.handleCaret, { display: "block" });
			},
			undefined,
			"handle+=0.74"
		)
		.add(typeText(el.handleValue, handle), "handle+=0.82")
		.call(() => gsap.set(el.handleCaret, { display: "none" }), undefined, "+=0.2");

	// ── add India as a location ──────────────────────────────────────────────
	tl.addLabel("place", "+=0.3")
		.add(pointer.moveTo(el.locationField, { at: { x: 0.14 }, duration: 0.55 }), "place")
		.add(pointer.press(), "place+=0.55")
		.call(
			() => {
				el.locationInput.textContent = "";
				gsap.set(el.locationCaret, { display: "block" });
			},
			undefined,
			"place+=0.74"
		)
		.add(typeText(el.locationInput, place), "place+=0.82");

	// The pick lands as a chip below the field, and the field goes back to its
	// placeholder — the app never leaves the chosen location in the input.
	tl.call(
		() => {
			gsap.set(el.locationCaret, { display: "none" });
			el.locationInput.textContent = locationHint;
			gsap.set(el.locationChips, { display: "block" });
		},
		undefined,
		"+=0.28"
	)
		.fromTo(
			el.locationChip,
			{ scale: 0.6, opacity: 0 },
			{ scale: 1, opacity: 1, duration: 0.34, ease: "back.out(2)", immediateRender: false }
		)
		.to(el.locationReset, { opacity: 1, duration: 0.3 }, "<");

	// ── scroll down to the follower metrics ──────────────────────────────────
	// Wheel-style: the cursor parks and the rail moves under it. Lands on
	// RAIL_TIER_SCROLL, where screens 3-5 are authored, so it never moves again.
	tl.addLabel("scroll", "+=0.4")
		.add(pointer.moveTo(el.rail, { at: { x: 0.55, y: 0.45 }, duration: 0.5 }), "scroll")
		.to(
			el.railScroll,
			{ y: () => -RAIL_TIER_SCROLL * rootFontSize(), duration: 1.1, ease: "power2.inOut" },
			"scroll+=0.4"
		);

	// ── pick the Macro tier ──────────────────────────────────────────────────
	tl.addLabel("tier", "+=0.3")
		.add(pointer.moveTo(el.tier, { at: { x: 0.35 }, duration: 0.5 }), "tier")
		.add(pointer.press(), "tier+=0.5")
		// The row turns on and expands in place, as the app does it.
		.to(el.tier, { backgroundColor: token("chip-row-on"), duration: 0.25 }, "tier+=0.6")
		.to(
			el.tierDot,
			{ borderColor: token("violet-bright"), backgroundColor: token("violet-bright"), duration: 0.25 },
			"tier+=0.6"
		)
		.to(el.tierRange, { color: token("text"), duration: 0.25 }, "tier+=0.6")
		.set(el.tierPip, { display: "block" }, "tier+=0.66")
		.to(el.tierPip, { opacity: 1, duration: 0.2 }, "tier+=0.66")
		.add(expand(el.tierBody, 0.4), "tier+=0.62");

	// The engagement handle stays where the tier opens it — the tier's own average
	// cut, which is the filter the results are shown for.

	// ── run the search ───────────────────────────────────────────────────────
	tl.addLabel("apply", "+=0.45")
		.add(pointer.moveTo(el.apply, { duration: 0.65 }), "apply")
		.add(pointer.press(), "apply+=0.65")
		.to(el.apply, { scale: 0.95, duration: 0.1 }, "apply+=0.7")
		.to(el.apply, { scale: 1, duration: 0.2 })
		.call(spendCredits(screen, CREDITS.start, CREDITS.afterSearch), undefined, "apply+=0.8");

	// Hands back its reset as well as its timeline — beat 11 needs it at the loop.
	return { timeline: tl, reset };
}
