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

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives the hero's product-workflow mockup as a narrative.
 *
 * The mockup is real markup rather than a screenshot, so the story is told by
 * animating it in place: a hand cursor opens menus, types and presses buttons.
 * One file per beat under beats/, played in the order they are listed in `beats`
 * below; the three things every beat needs are in utils/.
 *
 *   1. analyzeLookalike  step 1, in place: build a Lookalike search
 *   2. resultsList       step 3: run it, then open a creator
 *   3. creatorProfile    step 4: the profile, then reach for the Media Kit tab
 *   4. mediaKitTab       step 5: switch tab, scroll it, then reach for add-to-list
 *   5. addToListDialog   step 6: open the dialog over a blurred copy of step 5
 *   6. myLists           step 7: add to the list, close the dialog, cross to My Lists
 *   7. listDetail        step 8: open the list, tick two creators, press Compare
 *   8. compareMode       step 9: the compare mode swap
 *   9. leaveCompare      step 8: read it down, Back to the list, reach for share
 *  10. shareModal        step 10: the share modal, clipped to the panel
 *  11. restart           step 1: send it, close, and head home to loop again
 *
 * Steps are the layers WorkflowMockup renders, addressed by `data-wf-screen`.
 * They are not one-per-file on the markup side — several are the same app screen
 * in a different state — so a beat names the *layers* it moves between and never
 * assumes which component drew them.
 *
 * A beat returns null if the markup it expects is not there, and is skipped.
 *
 * Nothing in here is load-bearing for layout. Each step renders a correct,
 * readable frame on its own, so if this never runs the hero is simply static.
 */

function initWorkflow(mockup: HTMLElement) {
	if (mockup.dataset.wfReady === "true") return;
	mockup.dataset.wfReady = "true";

	const stage = mockup.querySelector<HTMLElement>(".wf-stage");
	const pointerEl = mockup.querySelector<HTMLElement>("[data-wf-pointer]");
	if (!stage || !pointerEl) return;

	// The layers the beats move between, by story step. Beat 1 builds the search
	// inside step 1 rather than cutting to a filled-in copy of it, which is why the
	// numbering skips 2.
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

	// Reduced motion gets a single static frame instead of the loop. Screen 3 is the
	// pick: the story returns to screen 1, so there is no "last frame" to settle on,
	// and an empty search says far less about the product than the results do.
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		screen.analyze.removeAttribute("data-wf-active");
		screen.results.setAttribute("data-wf-active", "");
		return;
	}

	const pointer = createPointer(stage, pointerEl);
	// The story ends where it began, so it loops. Every beat winds its own screen
	// back at the start, which is what makes a second pass identical to the first.
	const master = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.5 });

	// Beat 1 hands back its rail reset as well as its timeline, because beat 11
	// reveals screen 1 at the loop point and has to wind it back first.
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
	// Note where every beat lands before adding any card, because cards are timed
	// off these marks and inserting one first would move them.
	const beatStart: number[] = [];
	const beatEnd: number[] = [];
	for (const beat of beats) {
		beatStart.push(master.duration());
		if (beat) master.add(beat);
		beatEnd.push(master.duration());
	}

	/**
	 * A card's `StoryMark` in master time, or null if it cannot be resolved — a
	 * beat that was skipped for missing markup, or a label that has been renamed.
	 * A beat's labels are relative to its own timeline, so they shift by the time
	 * that beat was appended at.
	 */
	const markTime = ({ beat, at, offset = 0 }: StoryMark) => {
		const i = beat - 1;
		if (beatStart[i] === undefined) return null;
		if (at === "start") return beatStart[i] + offset;
		if (at === "end") return beatEnd[i] + offset;
		const label = beats[i]?.labels[at];
		return label === undefined ? null : beatStart[i] + label + offset;
	};

	// The cards play *over* the story rather than interrupting it: `master.add`
	// with an explicit time inserts there instead of appending, so a card fades up
	// at its mark while the story runs on underneath it. A card is skipped if its
	// markup is missing or its marks do not resolve, the same way a beat is.
	//
	// They live in the mockup's own card layer rather than in the stage, so this
	// queries from the mockup root — not from `document`, which would wire a second
	// mockup on the same page to this one's timeline.
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
}

export function initWorkflowTimeline() {
	document.querySelectorAll<HTMLElement>("[data-workflow]").forEach(initWorkflow);
}

initWorkflowTimeline();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initWorkflowTimeline);
