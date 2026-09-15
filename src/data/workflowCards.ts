/**
 * The explainer cards that punctuate the hero workflow story. Each fades up as its
 * beat ends and plays over the beat that follows — see `workflow/utils/spotlight.ts`.
 *
 * Unlike the rest of the mockup these are **marketing artwork, not app UI**, so Design
 * is the source of truth — the opposite of APP-SPEC.md's rule.
 */

/**
 * A moment in the story: a beat, and a place inside it. Prefer one of that beat's own
 * GSAP labels — it tracks real timing, so retiming a beat carries its cards along.
 * `"start"`/`"end"` address the boundaries and `offset` nudges in seconds. An
 * unresolvable mark drops the card, not the story.
 */
export interface StoryMark {
	beat: number;
	at: "start" | "end" | (string & {});
	offset?: number;
}

interface CardContent {
	/** The numeral the card shows, and its order in the story. */
	step: number;
	title: string;
	body: string;
	/** When it fades up. */
	show: StoryMark;
}

/**
 * A card either runs to a second mark — for anything that should track a stretch
 * of the story — or holds for a fixed spell after it arrives.
 */
export type WorkflowCard =
	| (CardContent & { hide: StoryMark; dwell?: never })
	| (CardContent & { hide?: never; dwell: number });

export const WORKFLOW_CARDS: WorkflowCard[] = [
	{
		step: 1,
		title: "Search & Discover",
		body: "AI-powered filters across 450M+ profiles to find creators matching your objectives.",
		// Up for the whole of beat 1: in as the cursor leaves its parking spot for
		// the Parameters dropdown, out once Apply & Search has been pressed.
		show: { beat: 1, at: "open" },
		hide: { beat: 1, at: "end" },
	},
	{
		step: 2,
		title: "Shortlist for Free",
		body: "Park anyone worth a second look in a shortlist. Nothing is charged until you open a profile.",
		// Held back until the dialog is open, where the app states the same thing in
		// its own words ("Free quick save…") — the card and the banner then make the
		// point together. Runs until the saved shortlist opens.
		show: { beat: 4, at: "open" },
		hide: { beat: 6, at: "settled" },
	},
	{
		step: 3,
		title: "Vet & Get Insights",
		body: "Audience and Creator insights, content performance and growth metrics in real time.",
		// Waits for the profile to finish rising — see beat 7's `settled` — so the
		// card follows the panel rather than arriving with it. Runs until the media
		// kit has been scrolled, before the cursor reaches for Back.
		show: { beat: 7, at: "settled", offset: 0.25 },
		hide: { beat: 8, at: "scrolled" },
	},
	{
		step: 4,
		title: "Outreach & Manage",
		body: "Promote the ones you want into campaign lists, assign ownership, and import or export in bulk via CSVs.",
		// Beat 9 ends on the unlock showing, so beat 10 starting *is* the promote
		// being pressed. Runs until beat 12 crosses into the list's own screen.
		show: { beat: 10, at: "start" },
		hide: { beat: 12, at: "swap" },
	},
	{
		step: 5,
		title: "Compare Influencers",
		body: "Live performance and audience metrics along with side-by-side creator comparisons in one view.",
		// Arrives with the compare swap that the Compare press triggers and holds for
		// the whole read-down in beat 14, clearing as the cursor sets off for Back.
		show: { beat: 13, at: "end" },
		hide: { beat: 14, at: "toBack" },
	},
	{
		step: 6,
		title: "Share Lists",
		body: "Easily share information through view-access links for clients, brands, teams, or stakeholders.",
		show: { beat: 15, at: "end" },
		dwell: 4.5,
	},
];
