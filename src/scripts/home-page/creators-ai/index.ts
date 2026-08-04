import { panelId } from "../../creators-ai";
import { chooseCreators } from "./beats/chooseCreators";
import { knowAudience } from "./beats/knowAudience";
import { scaleCampaigns } from "./beats/scaleCampaigns";
import { searchGlobally } from "./beats/searchGlobally";
import { registerPanelDemo, type BeatBuilder } from "./utils/demo";

/**
 * Drives the "world's creators, found with AI" section's visuals as four short
 * scripted demos, one per feature.
 *
 * Each panel is real UI-element markup rather than a screenshot, so its story is
 * told by animating it in place: a cursor ticks boxes, types into fields and
 * presses buttons. One file per beat under beats/, in the order the tabs list
 * them; the pieces every beat needs are in utils/.
 *
 *   1. searchGlobally   Search Globally: build a lookalike search on the filters
 *   2. knowAudience     Know The Audience: swap the affinities card to Interests
 *   3. chooseCreators   Choose The Right Creators: scroll the Compare card open
 *   4. scaleCampaigns   Scale Campaigns Confidently: Enquire, and the contacts wipe in
 *
 * Panels are the layers CreatorsAI.astro renders, addressed by the ids in
 * `scripts/creators-ai` — the same contract the tab controller uses, so the two
 * cannot drift. A beat names the *hooks* it moves and never assumes which
 * component drew them; one whose markup is missing returns nothing and is
 * skipped, leaving its panel on the settled frame it renders without JS.
 *
 * Unlike the hero's workflow mockup, these beats are not composed into one master
 * timeline: the visitor picks a panel, so each is paused and independent, and
 * `scripts/creators-ai-tabs` paces its auto-advance off whichever one is playing
 * (see `PANEL_DONE`). Only the first plays on scroll — the rest play when their
 * tab is selected.
 *
 * Nothing in here is load-bearing for layout. Each panel renders a correct,
 * readable frame on its own, so if this never runs the section is simply static.
 */

const beats: { build: BeatBuilder; autoPlay?: boolean }[] = [
	{ build: searchGlobally, autoPlay: true },
	{ build: knowAudience },
	{ build: chooseCreators },
	{ build: scaleCampaigns },
];

/**
 * Release the hold CreatorsAI.astro puts on the stage while the beats arm.
 *
 * Every beat renders its opening frame synchronously as it registers, so by the
 * time this runs the stage is showing the start of the story rather than the
 * settled markup — which is the whole point of the hold. Unconditional: a beat
 * that skipped itself for missing markup still needs its panel back on screen.
 */
function disarm() {
	for (const el of document.querySelectorAll<HTMLElement>("[data-creators-arming]")) {
		delete el.dataset.creatorsArming;
	}
}

// Registration happens once: `registerPanelDemo` installs its own
// `astro:page-load` hook per panel, so calling this again would stack duplicates.
beats.forEach(({ build, autoPlay }, i) => {
	registerPanelDemo(panelId(i), build, { autoPlay });
});
disarm();

// Added after those per-panel hooks, so on a client-side swap the beats re-arm
// first and this releases the fresh markup's hold second.
document.addEventListener("astro:page-load", disarm);
