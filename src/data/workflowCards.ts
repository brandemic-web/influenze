/**
 * The five explainer cards that punctuate the hero workflow story.
 *
 * They do not interrupt the story — each one fades up as its beat ends and
 * plays over the beat that follows, which runs on underneath. See
 * `scripts/home-page/workflow/spotlight.ts`.
 *
 * Unlike the rest of the mockup these are **marketing artwork, not app UI**, so
 * Design is the source of truth for them — the opposite of the rule in
 * `components/app/APP-SPEC.md`.
 */

/**
 * A moment in the story, given as a beat and a place inside it.
 *
 * `at` is preferably one of that beat's own GSAP labels — the sturdiest anchor
 * there is, because it tracks the beat's real timing instead of a counted offset,
 * so retiming a beat carries its cards with it. `"start"` and `"end"` address the
 * beat's boundaries; no beat uses those as label names. `offset` is there for the
 * rare nudge, in seconds.
 *
 * Beats are numbered as in the list in `scripts/home-page/workflow/index.ts`. An
 * unresolvable mark drops the card rather than the story, the same way missing
 * markup drops a beat.
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
		title: "Vet & Get Insights",
		body: "Audience and Creator insights, content performance and growth metrics in real time.",
		// Waits for the profile to finish rising — see beat 3's `settled` — so the
		// card follows the panel rather than arriving with it. Runs until the media
		// kit has been scrolled, before the cursor reaches for add-to-list.
		show: { beat: 3, at: "settled", offset: 0.25 },
		hide: { beat: 4, at: "scrolled" },
	},
	{
		step: 3,
		title: "Outreach & Manage",
		body: "Save to campaign-specific lists, assign ownership, and import or export in bulk via CSVs.",
		// Beat 4 ends on the press, so beat 5 starting *is* add-to-list being
		// clicked. Runs until beat 7 crosses into the list's own screen.
		show: { beat: 5, at: "start" },
		hide: { beat: 7, at: "swap" },
	},
	{
		step: 4,
		title: "Compare Influencers",
		body: "Live performance and audience metrics along with side-by-side creator comparisons in one view.",
		// Arrives with the compare swap that the Compare press triggers and holds for
		// the whole read-down in beat 9, clearing as the cursor sets off for Back.
		show: { beat: 8, at: "end" },
		hide: { beat: 9, at: "toBack" },
	},
	{
		step: 5,
		title: "Share Lists",
		body: "Easily share information through view-access links for clients, brands, teams, or stakeholders.",
		show: { beat: 10, at: "end" },
		dwell: 4.5,
	},
];
