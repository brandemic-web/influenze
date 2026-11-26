import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { HOP, hopAndClick, registerPanelDemo } from "./creators-ai-demo";

gsap.registerPlugin(SplitText);

/**
 * The scripted demos for each CreatorsAI tab panel. See `creators-ai-demo.ts`
 * for the harness they all plug into.
 */

/**
 * The app's tier-row colours — `lavender69`, `lavender15` and `lavender14` in
 * influenze/lib/common/colors.dart, same as the `wf-` tokens the markup uses.
 * They are literals here because GSAP tweens computed colours, not var() names.
 */
/** Tier row fill once the Mega Influencer option is selected. */
const ROW_ACTIVE = "#322b45";
/** Selection indicator fill / unselected border colour. */
const CHECK_FILL = "#865fff";
const CHECK_BORDER = "#615381";
/** Seconds between characters while "typing". */
const TYPE_SPEED = 0.055;
/** Distance (px) cards travel up from on a reveal. */
const RISE = 40;

/** Where the pointer parks before a demo starts, in stage coordinates. */
const CURSOR_HOME = { x: 560, y: 620 };

/**
 * Affinity list swap (s). Fade only, and on the list as a whole rather than the
 * rows — a per-row `y` tween puts a transform on text that is already sitting
 * inside the fractionally scaled stage, which reads as a jitter at the smaller
 * breakpoints.
 */
const LIST_FADE_OUT = 0.22;
const LIST_FADE_IN = 0.32;

/** Fraction of the Compare card's scrollable height the demo travels. */
const SCROLL_REVEAL = 0.85;
/**
 * How long that travel takes (s). Raised from 2.2 when the growth charts and the
 * pricing card went into the column: the range grew from a few hundred pixels to
 * ~1500, and since the fraction is measured on play, the same duration turned the
 * reveal into a whip. The card's aperture is only 580 at `zoom: 0.65`, so content
 * crossing it reads faster here than the same speed does in the hero.
 */
const SCROLL_DURATION = 4;

/** Upload button fill while disabled / live — lavender18 and lavender25. */
const UPLOAD_OFF = "#6d638f";
const UPLOAD_ON = "#653ee1";
/** Drop zone edge — whiteA10 at rest, green8 while a file hovers over it. */
const DROP_IDLE = "rgba(255,255,255,0.1)";
const DROP_HOVER = "#3aff98";
/** Where the CSV starts, relative to its resting spot over the drop zone: a little up and right. */
const FILE_START = { x: 130, y: -110 };

/* ── Import (alternative pages) ─────────────────────────────────────────────
 * The import dialog lands, the pointer drags a CSV into the drop zone, the file
 * is read ("48 entries found"), then Upload is clicked and the snackbar confirms.
 */
registerPanelDemo("import", (ctx) => {
	const { panel } = ctx;
	const item = panel.querySelector<HTMLElement>("[data-panel-item]");
	const cursor = panel.querySelector<HTMLElement>("[data-demo-cursor]");
	const ring = panel.querySelector<HTMLElement>("[data-demo-cursor-ring]");
	const drop = panel.querySelector<HTMLElement>("[data-import-drop]");
	const file = panel.querySelector<HTMLElement>("[data-import-file]");
	const found = panel.querySelector<HTMLElement>("[data-import-found]");
	const hint = panel.querySelector<HTMLElement>("[data-import-hint]");
	const name = panel.querySelector<HTMLElement>("[data-import-name]");
	const upload = panel.querySelector<HTMLElement>("[data-import-upload]");
	const label = panel.querySelector<HTMLElement>("[data-import-upload-label]");
	const spinner = panel.querySelector<HTMLElement>("[data-import-spinner]");
	const snackbar = panel.querySelector<HTMLElement>("[data-import-snackbar]");

	if (!item || !cursor || !ring || !drop || !file || !found || !hint || !name
		|| !upload || !label || !spinner || !snackbar) return;

	if (ctx.reducedMotion) {
		gsap.set(cursor, { autoAlpha: 0 });
		return;
	}

	const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } })
		// ── t=0 · empty dialog, file off to the side, Upload disabled ────────
		.set(item, { y: RISE, autoAlpha: 0 })
		.set(cursor, { autoAlpha: 0, scale: 1, x: CURSOR_HOME.x, y: CURSOR_HOME.y })
		.set(ring, { autoAlpha: 0, scale: 0.3 })
		.set(file, { x: FILE_START.x, y: FILE_START.y, autoAlpha: 0, scale: 1 })
		.set(drop, { borderColor: DROP_IDLE })
		.set(found, { autoAlpha: 0, scale: 0.6 })
		.set(hint, { autoAlpha: 1 })
		.set(name, { autoAlpha: 0 })
		.set(upload, { backgroundColor: UPLOAD_OFF })
		.set(label, { autoAlpha: 1 })
		.set(spinner, { autoAlpha: 0, rotation: 0 })
		.set(snackbar, { autoAlpha: 0, y: 12 })

		// ── 1 · the dialog lands ─────────────────────────────────────────────
		.to(item, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.1)

		// ── 2 · the file arrives mid-drag, pointer on it, into the drop zone ──
		.set(cursor, { x: () => ctx.point(file).x, y: () => ctx.point(file).y }, ">-0.1")
		.to([file, cursor], { autoAlpha: 1, duration: 0.15 }, "<")
		.to(cursor, {
			x: () => ctx.point(drop).x,
			y: () => ctx.point(drop).y,
			duration: 1,
			ease: "power2.inOut",
		}, "<")
		.to(file, { x: 0, y: 0, duration: 1, ease: "power2.inOut" }, "<")
		.to(drop, { borderColor: DROP_HOVER, duration: 0.25 }, "<0.6")

		// ── 3 · drop: the file is read and Upload goes live ──────────────────
		.to(file, { autoAlpha: 0, scale: 0.7, duration: 0.3, ease: "power2.in" }, ">0.15")
		.to(drop, { borderColor: DROP_IDLE, duration: 0.3 }, "<")
		.to(hint, { autoAlpha: 0, duration: 0.2 }, "<")
		.to(name, { autoAlpha: 1, duration: 0.3 }, ">")
		.to(found, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2.5)" }, "<")
		.to(upload, { backgroundColor: UPLOAD_ON, duration: 0.3 }, "<0.1");

	// ── 4 · pointer clicks Upload; a short spin, then the snackbar ──────────
	hopAndClick(tl, ctx, cursor, ring, upload, ">0.2");

	return tl
		.to(label, { autoAlpha: 0, duration: 0.15 }, ">-0.1")
		.to(spinner, { autoAlpha: 1, duration: 0.15 }, "<")
		.to(spinner, { rotation: 720, duration: 0.9, ease: "none" }, "<")
		.to(spinner, { autoAlpha: 0, duration: 0.15 }, ">-0.1")
		.to(label, { autoAlpha: 1, duration: 0.2 }, "<")
		.to(snackbar, { autoAlpha: 1, y: 0, duration: 0.45 }, "<")
		.to(cursor, { autoAlpha: 0, duration: 0.35 }, ">0.3");
});

/* ── Panel 1 · Search Globally ──────────────────────────────────────────────
 * A pointer walks the UI: the three cards land, the Mega Account tier is
 * ticked open, then the lookalike handle and creator location are typed in and
 * a region pill drops into the list.
 */
registerPanelDemo("search", (ctx) => {
	const { panel } = ctx;
	const cursor = panel.querySelector<HTMLElement>("[data-demo-cursor]");
	const ring = panel.querySelector<HTMLElement>("[data-demo-cursor-ring]");
	const cards = gsap.utils.toArray<HTMLElement>("[data-search-card]", panel);
	const row = panel.querySelector<HTMLElement>("[data-metrics-row]");
	const check = panel.querySelector<HTMLElement>("[data-metrics-check]");
	const dot = panel.querySelector<HTMLElement>("[data-metrics-dot]");
	const expand = panel.querySelector<HTMLElement>("[data-metrics-expand]");
	const slider = panel.querySelector<HTMLElement>("[data-metrics-slider]");
	const knob = panel.querySelector<HTMLElement>("[data-metrics-knob]");
	const handleField = panel.querySelector<HTMLElement>('[data-search-field="handle"]');
	const regionField = panel.querySelector<HTMLElement>('[data-search-field="region"]');
	const pill = panel.querySelector<HTMLElement>("[data-search-pill]");

	// The typed fields' inner text/caret nodes are resolved up front so they can
	// be checked in the same guard — `SplitText(null)` throws and would take the
	// whole panel script down with it.
	const handleText = handleField?.querySelector<HTMLElement>("[data-search-text]");
	const handleCaret = handleField?.querySelector<HTMLElement>("[data-search-caret]");
	const handleHint = handleField?.querySelector<HTMLElement>("[data-search-hint]");
	const regionText = regionField?.querySelector<HTMLElement>("[data-search-text]");
	const regionCaret = regionField?.querySelector<HTMLElement>("[data-search-caret]");

	if (!cursor || !ring || !row || !check || !dot || !expand || !slider || !knob
		|| !handleField || !handleText || !handleCaret || !handleHint
		|| !regionField || !regionText || !regionCaret
		|| !pill || cards.length < 3) return;

	// Reduced motion: leave the settled markup alone, just drop the pointer.
	if (ctx.reducedMotion) {
		gsap.set(cursor, { autoAlpha: 0 });
		return;
	}

	const handleChars = new SplitText(handleText, { type: "chars" }).chars;
	const regionChars = new SplitText(regionText, { type: "chars" }).chars;

	const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

	tl
		// ── t=0 · rewind every piece to its "before the demo" state ──────────
		.set(cards, { y: RISE, autoAlpha: 0 })
		.set(cursor, { autoAlpha: 0, scale: 1, x: CURSOR_HOME.x, y: CURSOR_HOME.y })
		.set(ring, { autoAlpha: 0, scale: 0.3 })
		.set(row, { backgroundColor: "rgba(50,43,69,0)" })
		.set(check, { backgroundColor: "rgba(134,95,255,0)", borderColor: CHECK_BORDER })
		.set(dot, { autoAlpha: 0, scale: 0 })
		.set(expand, { height: 0, autoAlpha: 0 })
		.set(slider, { scaleX: 0, transformOrigin: "right center" })
		.set(knob, { autoAlpha: 0, x: 200 })
		.set([...handleChars, ...regionChars], { display: "none", opacity: 0 })
		.set(handleHint, { display: "block" })
		.set([handleCaret, regionCaret], { autoAlpha: 0 })
		.set(pill, { display: "none" })

		// ── 1 · the three cards land, staggered ──────────────────────────────
		.to(cards, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.2 }, 0.1)

		// ── 2 · pointer travels to the Mega Influencer checkbox and clicks ───
		.to(cursor, { autoAlpha: 1, duration: 0.25 }, ">-0.15");

	hopAndClick(tl, ctx, cursor, ring, check, "<");

	tl
		// selection takes hold: box fills, row lights up, slider block unfolds
		// (the app fills and borders the indicator in the same lavender15)
		.to(check, { backgroundColor: CHECK_FILL, borderColor: CHECK_FILL, duration: 0.25 }, "<0.05")
		.to(dot, { autoAlpha: 1, scale: 1, duration: 0.28, ease: "back.out(3)" }, "<0.05")
		.to(row, { backgroundColor: ROW_ACTIVE, duration: 0.35 }, "<")
		.to(expand, { height: "auto", autoAlpha: 1, duration: 0.5 }, "<")
		.to(slider, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, ">-0.3")
		.to(knob, { autoAlpha: 1, x: 0, duration: 0.7, ease: "power2.inOut" }, "<")

		// ── 3 · pointer moves to the lookalike search bar and types ──────────
		.to(cursor, {
			x: () => ctx.point(handleField).x,
			y: () => ctx.point(handleField).y,
			duration: HOP,
			ease: "power3.inOut",
		}, ">0.2")
		.set(handleHint, { display: "none" })
		.set(handleCaret, { autoAlpha: 1 })
		.to(handleChars, {
			display: "inline-block",
			opacity: 1,
			duration: 0.01,
			stagger: TYPE_SPEED,
		})
		.to(handleCaret, { autoAlpha: 0, duration: 0.01, repeat: 3, yoyo: true, repeatDelay: 0.25 }, ">0.15")

		// ── 4 · same again on creator location: type "India" ─────────────────
		.to(cursor, {
			x: () => ctx.point(regionField).x,
			y: () => ctx.point(regionField).y,
			duration: HOP,
			ease: "power3.inOut",
		}, ">-0.4")
		.set(handleCaret, { autoAlpha: 0 })
		.set(regionCaret, { autoAlpha: 1 })
		.to(regionChars, {
			display: "inline-block",
			opacity: 1,
			duration: 0.01,
			stagger: TYPE_SPEED * 1.6,
		})

		// ── 5 · the green India pill joins the list ──────────────────────────
		.set(regionCaret, { autoAlpha: 0 }, ">0.3")
		.set(pill, { display: "inline-flex" })
		.fromTo(pill,
			{ scale: 0.6, autoAlpha: 0, y: 8 },
			{ scale: 1, autoAlpha: 1, y: 0, duration: 0.45, ease: "back.out(2)" })
		.to(cursor, { autoAlpha: 0, duration: 0.35 }, ">0.35");

	return tl;
});

/* ── Panel 2 · Know The Audience ─────────────────────────────────────────────
 * The three cards stagger up, then the pointer clicks the Interests toggle on
 * the Audience Affinities card and the top-five list swaps over.
 */
registerPanelDemo("audience", (ctx) => {
	const { panel } = ctx;
	const items = gsap.utils.toArray<HTMLElement>("[data-panel-item]", panel);
	const cursor = panel.querySelector<HTMLElement>("[data-demo-cursor]");
	const ring = panel.querySelector<HTMLElement>("[data-demo-cursor-ring]");
	const interestsTab = panel.querySelector<HTMLElement>('[data-affinity-tab="interests"]');
	const brandsTab = panel.querySelector<HTMLElement>('[data-affinity-tab="brands"]');
	const interestsList = panel.querySelector<HTMLElement>('[data-affinity-list="interests"]');
	const brandsList = panel.querySelector<HTMLElement>('[data-affinity-list="brands"]');

	if (!items.length || !cursor || !ring
		|| !interestsTab || !brandsTab || !interestsList || !brandsList) return;

	if (ctx.reducedMotion) {
		gsap.set(cursor, { autoAlpha: 0 });
		return;
	}

	const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } })
		// ── t=0 · cards down, pointer parked, affinities back on Brand Affinities ──
		.set(items, { y: RISE, autoAlpha: 0 })
		.set(cursor, { autoAlpha: 0, scale: 1, x: CURSOR_HOME.x, y: CURSOR_HOME.y })
		.set(ring, { autoAlpha: 0, scale: 0.3 })
		.set(interestsList, { autoAlpha: 0 })
		.set(brandsList, { autoAlpha: 1 })
		.set(interestsTab, { attr: { "data-affinity-on": "false" } })
		.set(brandsTab, { attr: { "data-affinity-on": "true" } })

		// ── 1 · the three cards land, staggered ──────────────────────────────
		.to(items, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.18 }, 0.1)

		// ── 2 · pointer travels to the Interests toggle and clicks ───────────
		.to(cursor, { autoAlpha: 1, duration: 0.25 }, ">-0.15");

	hopAndClick(tl, ctx, cursor, ring, interestsTab, "<");

	return tl
		// ── 3 · the toggle flips and the top five swap over ──────────────────
		.set(interestsTab, { attr: { "data-affinity-on": "true" } }, ">-0.1")
		.set(brandsTab, { attr: { "data-affinity-on": "false" } }, "<")
		.to(brandsList, { autoAlpha: 0, duration: LIST_FADE_OUT, ease: "power2.in" }, "<")
		.fromTo(interestsList,
			{ autoAlpha: 0 },
			{ autoAlpha: 1, duration: LIST_FADE_IN })
		.to(cursor, { autoAlpha: 0, duration: 0.35 }, ">0.3");
});

/* ── Panel 3 · Choose The Right Creators ────────────────────────────────────
 * The pieces stagger up in DOM order, then the Compare card scrolls its own
 * body down to show that there's more below the fold. 
 */
registerPanelDemo("choose", ({ panel, reducedMotion }) => {
	const items = gsap.utils.toArray<HTMLElement>("[data-panel-item]", panel);
	const scroller = panel.querySelector<HTMLElement>("[data-compare-scroll]");
	if (!items.length || reducedMotion) return;

	const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } })
		.set(items, { y: RISE, autoAlpha: 0 })
		.to(items, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.18 }, 0.1);

	if (!scroller) return tl;

	return tl
		.set(scroller, { scrollTop: 0 }, 0)
		// Measured on play, so a re-run picks up whatever the card's content is now.
		.to(scroller, {
			scrollTop: () => (scroller.scrollHeight - scroller.clientHeight) * SCROLL_REVEAL,
			duration: SCROLL_DURATION,
			ease: "power1.inOut",
		}, ">0.4");
});

/* ── Panel 4 · Scale Campaigns Confidently ──────────────────────────────────
 * The creator card lands, the pointer clicks Enquire, and the contact list
 * wipes open from a clip path collapsed against its top edge.
 */
registerPanelDemo("enquire", (ctx) => {
	const { panel } = ctx;
	const item = panel.querySelector<HTMLElement>("[data-panel-item]");
	const cursor = panel.querySelector<HTMLElement>("[data-demo-cursor]");
	const ring = panel.querySelector<HTMLElement>("[data-demo-cursor-ring]");
	const enquire = panel.querySelector<HTMLElement>("[data-analyzed-enquire]");
	const popover = panel.querySelector<HTMLElement>("[data-analyzed-popover]");

	if (!item || !cursor || !ring || !enquire || !popover) return;

	if (ctx.reducedMotion) {
		gsap.set(cursor, { autoAlpha: 0 });
		return;
	}

	const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } })
		// ── t=0 · card down, pointer parked, contact list clipped shut ───────
		.set(item, { y: RISE, autoAlpha: 0 })
		.set(cursor, { autoAlpha: 0, scale: 1, x: CURSOR_HOME.x, y: CURSOR_HOME.y })
		.set(ring, { autoAlpha: 0, scale: 0.3 })
		.set(popover, { clipPath: "inset(0% 0% 100% 0%)", autoAlpha: 0 })

		// ── 1 · the card appears ─────────────────────────────────────────────
		.to(item, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.1)

		// ── 2 · pointer travels to Enquire and clicks ────────────────────────
		.to(cursor, { autoAlpha: 1, duration: 0.25 }, ">-0.1");

	hopAndClick(tl, ctx, cursor, ring, enquire, "<");

	return tl
		// ── 3 · contact list wipes open downward ─────────────────────────────
		.set(popover, { autoAlpha: 1 }, ">-0.25")
		.to(popover, {
			clipPath: "inset(0% 0% 0% 0%)",
			duration: 0.7,
			ease: "power3.inOut",
		}, "<")
		.to(cursor, { autoAlpha: 0, duration: 0.35 }, ">0.3");
});
