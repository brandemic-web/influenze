import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { addToListDialog } from "./beats/addToListDialog";
import { analyzeLookalike } from "./beats/analyzeLookalike";
import { compareMode } from "./beats/compareMode";
import { creatorProfile } from "./beats/creatorProfile";
import { leaveCompare } from "./beats/leaveCompare";
import { listDetail } from "./beats/listDetail";
import { mediaKitTab } from "./beats/mediaKitTab";
import { myLists } from "./beats/myLists";
import { shareModal } from "./beats/shareModal";
import { createPointer } from "./utils/pointer";
import { restart } from "./beats/restart";
import { resultsList } from "./beats/resultsList";
import { holdForSpan, spotlight } from "./utils/spotlight";
import { WORKFLOW_CARDS, type StoryMark } from "../../../data/workflowCards";
import { LANDSCAPE_CLOSE, LANDSCAPE_OPEN } from "../../landscape-viewer";

gsap.registerPlugin(ScrollTrigger);

/**
 * Composes the hero mockup's eleven beats into one looping timeline. A beat
 * returns null when its markup is missing and is skipped; nothing here is
 * load-bearing for layout, so a failure leaves the hero static.
 *
 * Beat order, cast and per-beat reasoning: components/app/APP-SPEC.md.
 */

function initWorkflow(mockup: HTMLElement) {
	if (mockup.dataset.wfReady === "true") return;
	mockup.dataset.wfReady = "true";

	const stage = mockup.querySelector<HTMLElement>(".wf-stage");
	const pointerEl = mockup.querySelector<HTMLElement>("[data-wf-pointer]");
	if (!stage || !pointerEl) return;

	// The layers beats move between, by story step. 2 is skipped: beat 1 builds the
	// search inside step 1 rather than cutting to a filled-in copy of it.
	const layer = (step: number) => mockup.querySelector<HTMLElement>(`[data-wf-screen="${step}"]`);
	const found = {
		analyze: layer(1),
		results: layer(3),
		profile: layer(4),
		kit: layer(5),
		dialog: layer(6),
		lists: layer(7),
		list: layer(8),
		compare: layer(9),
		share: layer(10),
	};
	if (!Object.values(found).every(Boolean)) return;
	const screen = found as { [K in keyof typeof found]: HTMLElement };

	// Reduced motion gets one static frame. Screen 3 (results) says more about the
	// product than screen 1's empty search, and the loop has no natural last frame.
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		screen.analyze.removeAttribute("data-wf-active");
		screen.results.setAttribute("data-wf-active", "");
		return;
	}

	const pointer = createPointer(stage, pointerEl);
	// The story ends where it began, so it loops. Every beat winds its own screen
	// back as it plays — that is what makes a second pass identical to the first.
	const master = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.5 });

	// Beat 1 hands back its rail reset too: beat 11 reveals screen 1 at the loop
	// point and has to wind it back before it comes into view.
	const analyze = analyzeLookalike(screen.analyze, pointer);

	const beats = [
		analyze?.timeline,
		resultsList({ from: screen.analyze, to: screen.results }, pointer),
		creatorProfile({ from: screen.results, to: screen.profile }, pointer),
		mediaKitTab({ from: screen.profile, to: screen.kit }, pointer),
		addToListDialog({ from: screen.kit, to: screen.dialog }),
		myLists({ from: screen.dialog, to: screen.lists }, pointer),
		listDetail({ from: screen.lists, to: screen.list }, pointer),
		compareMode({ from: screen.list, to: screen.compare }),
		leaveCompare({ from: screen.compare, to: screen.list }, pointer),
		shareModal({ from: screen.list, to: screen.share }),
		restart({ from: screen.share, to: screen.analyze, reset: analyze?.reset }, pointer),
	];
	// Record where each beat lands before adding any card — cards are timed off
	// these marks, so inserting one first would move them.
	const beatStart: number[] = [];
	const beatEnd: number[] = [];
	for (const beat of beats) {
		beatStart.push(master.duration());
		if (beat) master.add(beat);
		beatEnd.push(master.duration());
	}

	/**
	 * A `StoryMark` in master time, or null if unresolvable (skipped beat, renamed
	 * label). Beat labels are timeline-relative, so they shift by the append time.
	 */
	const markTime = ({ beat, at, offset = 0 }: StoryMark) => {
		const i = beat - 1;
		if (beatStart[i] === undefined) return null;
		if (at === "start") return beatStart[i] + offset;
		if (at === "end") return beatEnd[i] + offset;
		const label = beats[i]?.labels[at];
		return label === undefined ? null : beatStart[i] + label + offset;
	};

	// Cards play *over* the story: `master.add` with an explicit time inserts rather
	// than appends, so a card fades up at its mark while the story runs underneath.
	// Queried from the mockup root, not `document` — a second mockup on the page
	// must not get wired into this timeline.
	for (const card of WORKFLOW_CARDS) {
		const el = mockup.querySelector<HTMLElement>(`[data-wf-card="${card.step}"]`);
		const show = markTime(card.show);
		if (!el || show === null) continue;

		if (card.hide === undefined) {
			master.add(spotlight(el, card.dwell), show);
			continue;
		}
		const hide = markTime(card.hide);
		if (hide !== null) master.add(spotlight(el, holdForSpan(hide - show)), show);
	}

	// Hold until the mockup is actually on screen, then play once.
	ScrollTrigger.create({
		trigger: mockup,
		start: "top 50%",
		once: true,
		onEnter: () => master.play(),
	});

	// Entering/leaving landscape is a mode change, so replay from the top rather
	// than resume the loop at a completely different size.
	//
	// The active layer must be set by hand: screen swaps are `tl.call()` callbacks,
	// which don't fire on a backwards seek. Beat 1 works in place and never claims
	// screen 1 — beat 11 normally hands it over — so without this the old screen
	// stays frozen until the story reaches its first swap. Inner state needs nothing;
	// each beat resets what it touches as the story arrives.
	const restartStory = () => {
		for (const layer of Object.values(screen)) layer.removeAttribute("data-wf-active");
		screen.analyze.setAttribute("data-wf-active", "");
		master.restart();
	};

	mockup.addEventListener(LANDSCAPE_OPEN, restartStory);
	mockup.addEventListener(LANDSCAPE_CLOSE, restartStory);
}

export function initWorkflowTimeline() {
	document.querySelectorAll<HTMLElement>("[data-workflow]").forEach(initWorkflow);
}

initWorkflowTimeline();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initWorkflowTimeline);
