/**
 * PLACEHOLDER POSTS — Phase A only. Shape mirrors the future Sanity `post`
 * document, so Phase B swaps the source. This file is DELETED once Sanity
 * lands, not kept as a fallback. Cover art and avatars are not final.
 */
import type { ImageMetadata } from "astro";
import { readingMinutesFromHtml } from "../lib/reading-time";

import aevyt from "../assets/images/workflow/profile_images/aevytvdaily.jpg";
import bengaluru from "../assets/images/workflow/profile_images/boredinbengaluru.jpg";
import daniel from "../assets/images/workflow/profile_images/danieljsamuel_.jpg";
import hyperfit from "../assets/images/workflow/profile_images/hyperfitx.avif";
import kawal from "../assets/images/workflow/profile_images/kawalofficial.avif";
import nikhil from "../assets/images/workflow/profile_images/nikhilchinapa.avif";
import saloni from "../assets/images/workflow/profile_images/salonipatelofficiall.avif";
import street from "../assets/images/workflow/profile_images/street.comic.jpg";
import harsh from "../assets/images/workflow/profile_images/harsh.webp";
import gaelyn from "../assets/images/workflow/profile_images/vjgaelyn.avif";

export interface BlogAuthor {
	name: string;
	role: string;
	avatar: ImageMetadata;
}

export interface BlogPost {
	slug: string;
	title: string;
	excerpt: string;
	cover: ImageMetadata;
	coverAlt: string;
	/** First category doubles as the card's pill label. */
	categories: string[];
	/** ISO 8601 — the article page renders it through <time datetime>. */
	publishedAt: string;
	author: BlogAuthor;
	/** Drives the index's lead slot. Exactly one post should carry it. */
	featured?: boolean;
	/** HTML for the static pass; becomes Portable Text in Phase B. */
	body: string;
}

const AUTHORS = {
	priya: { name: "Priya Nair", role: "Head of Creator Strategy", avatar: saloni },
	arjun: { name: "Arjun Mehta", role: "Product Lead", avatar: daniel },
	tara: { name: "Tara Sequeira", role: "Data Science", avatar: gaelyn },
	rohan: { name: "Rohan Kulkarni", role: "Growth", avatar: harsh },
} satisfies Record<string, BlogAuthor>;

/** Every category used below, in the order the filter renders them. */
export const BLOG_CATEGORIES = [
	"Creator Discovery",
	"Measurement",
	"Campaigns",
	"Product",
] as const;

export const BLOG_HERO = {
	heading: { lead: "Notes on finding", accent: " the right creators" },
	subcopy:
		"Research, benchmarks and product notes from the team building creator intelligence for 450M+ profiles.",
};

interface PostSeed extends Omit<BlogPost, "categories"> {
	categories: (typeof BLOG_CATEGORIES)[number][];
}

const SEEDS: PostSeed[] = [
	{
		slug: "follower-count-is-not-a-media-plan",
		title: "Follower count is not a media plan",
		excerpt:
			"Reach tells you how many people a creator could theoretically touch. It says almost nothing about whether the right ones will act. Here is what to grade instead.",
		cover: nikhil,
		coverAlt: "",
		categories: ["Creator Discovery", "Measurement"],
		publishedAt: "2026-08-28",
		author: AUTHORS.priya,
		featured: true,
		// Exercises every element the body supports, for rich-text review.
		body: `
<p>Every brief we see still opens with a follower range. It is the easiest number to get and the least useful one to plan against, because it describes the size of an audience without describing its behaviour, its location, or whether it is <em>real</em>.</p>
<p>A creator with 80,000 engaged followers in one metro will consistently outperform one with 400,000 scattered across markets you do not ship to. The second creator costs four times more.</p>
<h2>What reach actually hides</h2>
<p>Three things sit underneath a follower number, and all three move independently of it.</p>
<div class="table-wrap">
<table>
<thead><tr><th>Signal</th><th>What it hides</th></tr></thead>
<tbody>
<tr><td><strong>Audience overlap</strong></td><td>Run five creators from the same niche and you may be buying the same 60,000 people five times.</td></tr>
<tr><td><strong>Authenticity</strong></td><td>Purchased followers do not disappear from a profile; they just stop engaging. The count stays flattering.</td></tr>
<tr><td><strong>Geography</strong></td><td>A national campaign does not care about a follower in a market with no distribution.</td></tr>
</tbody>
</table>
</div>
<h2>A grading order that holds up</h2>
<p>We have landed on evaluating in this sequence, because each step is cheap and removes the most candidates.</p>
<h3>The four signals, in order</h3>
<div class="table-wrap">
<table>
<thead><tr><th>#</th><th>Signal</th></tr></thead>
<tbody>
<tr><td>1</td><td>Audience location and language against your actual footprint.</td></tr>
<tr><td>2</td><td>Authenticity signals — follower growth shape, comment quality, engagement distribution across recent posts.</td></tr>
<tr><td>3</td><td>Engagement rate relative to the creator's own tier, not a global average.</td></tr>
<tr><td>4</td><td>Content fit, judged by a human on the last twenty posts.</td></tr>
</tbody>
</table>
</div>
<h3>Scoring it</h3>
<p>Overlap is applied afterwards as a penalty against the shortlist rather than as a fifth signal here, because it is a property of the set, not of the creator. The point of discovery is not to find the biggest creators — it is to spend the shortlist slot on someone the rest of the shortlist does not already cover.</p>
<figure><img src="/og-card.jpg" alt="" /><figcaption>Unique reach flattens fast once a shortlist stays inside one niche.</figcaption></figure>
<h2>Where this leaves follower count</h2>
<p>It is still a useful bucket for budgeting and for setting expectations on volume. It is a filter, not a ranking. Treat it as the width of the funnel and let the four signals decide who comes through it. There is more on this in <a href="/blog/audience-overlap-the-cost-nobody-budgets-for">the overlap piece</a>.</p>
<p>None of this requires new tooling — it requires refusing to rank on the one number that is easiest to read.</p>
`,
	},
	{
		slug: "reading-an-engagement-rate-honestly",
		title: "How to read an engagement rate honestly",
		excerpt:
			"The same 2.4% can be excellent or a red flag depending on tier, format and where the engagement is concentrated. A short guide to the context the number needs.",
		cover: hyperfit,
		coverAlt: "",
		categories: ["Measurement"],
		publishedAt: "2026-08-14",
		author: AUTHORS.tara,
		body: `
<p>Engagement rate is the most quoted number in creator marketing and the most context-dependent. Quoted bare, it is close to meaningless.</p>
<h2>Tier changes the baseline</h2>
<p>Engagement falls as audience grows — reliably, across every platform we measure. A 2% rate is unremarkable for a creator with 20,000 followers and genuinely strong for one with 2 million. Comparing the two directly rewards the smaller account for being smaller.</p>
<div class="table-wrap">
<table>
<thead><tr><th>Follower tier</th><th>Typical engagement rate</th></tr></thead>
<tbody>
<tr><td>Under 20K</td><td>4–8%</td></tr>
<tr><td>20K–200K</td><td>2–4%</td></tr>
<tr><td>200K–1M</td><td>1–2%</td></tr>
<tr><td>1M+</td><td>Under 1%</td></tr>
</tbody>
</table>
</div>
<p>Always compare a creator against their own tier. An absolute threshold in a brief filters on size while appearing to filter on quality.</p>
<h2>Format changes the denominator</h2>
<p>Short-form video is served well beyond a creator's followers, so engagement calculated over follower count understates it. Static posts skew the other way. A feed that has shifted to Reels over the last quarter will show a rate break that is a distribution change, not a performance change.</p>
<h2>Distribution matters more than the average</h2>
<p>Two creators can average 3%. One is steady across twenty posts; the other has eighteen posts at 1% and two that went wide. The averages match, the reliability does not — and a campaign buys the median post, not the outlier.</p>
<p>Look at the spread before the mean. It is the difference between a creator you can forecast and one you are gambling on.</p>
`,
	},
	{
		slug: "audience-overlap-the-cost-nobody-budgets-for",
		title: "Audience overlap: the cost nobody budgets for",
		excerpt:
			"Shortlists get built creator by creator, so nobody checks how much of the same audience they are buying twice. On a five-creator campaign it is routinely a third of the spend.",
		cover: bengaluru,
		coverAlt: "",
		categories: ["Campaigns", "Creator Discovery"],
		publishedAt: "2026-07-30",
		author: AUTHORS.priya,
		body: `
<p>Shortlists are assembled one creator at a time. Each is evaluated on their own merits, approved on their own merits, and the set is never evaluated as a set. That is where the waste hides.</p>
<h2>Why niche discovery makes it worse</h2>
<p>The better your targeting, the tighter the creator pool, and the more their audiences intersect. Doing discovery well actively increases overlap risk. Five well-chosen creators in a single vertical can share a substantial share of the same followers.</p>
<h2>Overlap is not always waste</h2>
<p>Repetition drives recall, and a considered purchase often needs several exposures. The problem is unintentional overlap — paying five times for frequency you did not plan and cannot report on.</p>
<div class="table-wrap">
<table>
<thead><tr><th>Overlap</th><th>What it is</th></tr></thead>
<tbody>
<tr><td>Deliberate</td><td>A frequency strategy, planned on purpose.</td></tr>
<tr><td>Accidental</td><td>Duplicate reach billed as incremental, discovered too late to reprice.</td></tr>
</tbody>
</table>
</div>
<h2>Checking it before you sign</h2>
<p>Measure the shortlist as a whole and look at unique reach rather than the sum of follower counts. If adding a creator barely moves unique reach, they are not adding audience — they are adding frequency, and should be priced that way.</p>
`,
	},
	{
		slug: "what-we-changed-in-creator-search",
		title: "What we changed in creator search",
		excerpt:
			"Filters that returned technically-correct, practically-useless results were the top complaint. Here is what we rebuilt and why relevance now beats recall.",
		cover: kawal,
		coverAlt: "",
		categories: ["Product"],
		publishedAt: "2026-07-11",
		author: AUTHORS.arjun,
		body: `
<p>The most common piece of feedback on search was not that it missed creators. It was that it returned too many, ordered in a way that buried the useful ones.</p>
<h2>Recall was the wrong target</h2>
<p>Search was optimised to return everything matching a filter set. Technically complete, practically unusable — nobody evaluates 4,000 profiles. The first twenty results are the product; the rest is reassurance.</p>
<h2>Three changes</h2>
<div class="table-wrap">
<table>
<thead><tr><th>Change</th><th>What it does</th></tr></thead>
<tbody>
<tr><td><strong>Ranking on fit, not size</strong></td><td>Results order by how well audience composition matches the filters, rather than by follower count.</td></tr>
<tr><td><strong>Overlap surfaced inline</strong></td><td>Adding a creator to a shortlist now shows how much audience they share with everyone already on it.</td></tr>
<tr><td><strong>Authenticity as a first-class filter</strong></td><td>Previously buried in the profile, now available before you spend time reviewing.</td></tr>
</tbody>
</table>
</div>
<p>The measurable outcome we cared about was time from first search to a saved shortlist. Ranking changes moved it more than any filter we could have added.</p>
`,
	},
	{
		slug: "briefing-creators-without-flattening-them",
		title: "Briefing creators without flattening them",
		excerpt:
			"The tighter the brief, the worse the content tends to perform. What to specify, what to leave open, and why the difference decides your results.",
		cover: street,
		coverAlt: "",
		categories: ["Campaigns"],
		publishedAt: "2026-06-24",
		author: AUTHORS.rohan,
		body: `
<p>You are buying a creator because their audience trusts how they talk. A brief that scripts them removes the thing you paid for.</p>
<h2>Specify constraints, not execution</h2>
<p>Briefs work when they define the edges and leave the middle alone. Non-negotiables are usually few: legal lines, the claim you cannot make, the disclosure requirement, the deadline, the link.</p>
<p>Everything else — structure, hook, tone, pacing, joke, format — is what the creator is better at than you are.</p>
<h2>The tell</h2>
<p>If a brief could be handed to any creator in the category and produce roughly the same asset, it is too tight. Their audience will notice before your dashboard does. <strong>Approve the boundaries, then approve the creator — do not approve the sentences.</strong></p>
<h2>One thing worth over-specifying</h2>
<p>Be exact about what you will measure and when. Creators are pragmatic about performance targets; they resist prescription about craft. Being precise on outcomes buys you room to be loose on execution.</p>
`,
	},
	{
		slug: "spotting-purchased-followers",
		title: "Spotting purchased followers in ninety seconds",
		excerpt:
			"Bought audiences do not vanish from a profile — they just go quiet. Four signals that separate an inflated account from a genuinely growing one.",
		cover: aevyt,
		coverAlt: "",
		categories: ["Creator Discovery"],
		publishedAt: "2026-06-05",
		author: AUTHORS.tara,
		body: `
<p>Purchased followers are less common than they were and harder to see, because the obvious tells have been priced out. The remaining signals are structural.</p>
<h2>Growth shape</h2>
<p>Organic growth is lumpy but continuous. Purchased growth arrives as steps — flat, then a vertical jump, then flat again. One step can be a post going wide; a staircase cannot.</p>
<h2>Engagement that does not scale with the jump</h2>
<p>If followers rose 40% and average likes did not move, the new followers are not watching. This is the single most reliable signal available from public data.</p>
<h2>Comment texture</h2>
<p>Look at who comments, not how many. Generic single-emoji comments from accounts with no posts are cheap to buy. Replies that reference the actual content are not.</p>
<h2>Audience geography against content language</h2>
<p>A creator posting in one language with the bulk of their audience in unrelated markets is worth a second look. Sometimes it is a genuine diaspora audience. Often it is the cheapest place to buy followers.</p>
<p>None of these are conclusive alone. Three of four pointing the same way is enough to pass.</p>
`,
	},
	{
		slug: "why-we-rebuilt-contact-unlocks",
		title: "Why we rebuilt contact unlocks",
		excerpt:
			"Paying to reveal an email that then bounces is the worst possible spend. We changed how contacts are verified, and what happens when we get it wrong.",
		cover: daniel,
		coverAlt: "",
		categories: ["Product"],
		publishedAt: "2026-05-19",
		author: AUTHORS.arjun,
		body: `
<p>Contact unlocks were the feature that generated the most support tickets per use. The complaint was consistent and fair: a credit spent on an address that no longer worked.</p>
<h2>The old model</h2>
<p>Contacts were surfaced as found and charged on reveal. Freshness was invisible, so a two-year-old address looked identical to one verified last week.</p>
<h2>What changed</h2>
<div class="table-wrap">
<table>
<thead><tr><th>Change</th><th>Why it matters</th></tr></thead>
<tbody>
<tr><td>Deliverability checked at reveal time</td><td>Not at collection time, when the address was last true.</td></tr>
<tr><td>Every contact carries a last-verified date</td><td>Freshness is visible instead of assumed.</td></tr>
<tr><td>A failed unlock is not charged</td><td>The cost of a stale record moves onto us.</td></tr>
</tbody>
</table>
</div>
<p>The third point is the one that mattered. It moved the cost of a stale record onto us, which is the only arrangement that keeps the incentive to maintain the data pointing the right way.</p>
<p>Unlock volume fell slightly. Repeat usage rose, and the ticket category effectively disappeared.</p>
`,
	},
];

export const BLOG_POSTS: BlogPost[] = SEEDS.map((seed) => ({ ...seed }));

/** Newest first, with the featured post pulled to the front. */
export const BLOG_POSTS_SORTED: BlogPost[] = [...BLOG_POSTS].sort(
	(a, b) =>
		Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
		Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
);

export const postBySlug = (slug: string): BlogPost | undefined =>
	BLOG_POSTS.find((post) => post.slug === slug);

/** Derived here so a card and its article can never disagree. */
export const readMinutes = (post: BlogPost): number => readingMinutesFromHtml(post.body);

/** Up to three other posts sharing a category, newest first. */
export function relatedPosts(post: BlogPost, limit = 3): BlogPost[] {
	return BLOG_POSTS_SORTED.filter(
		(other) =>
			other.slug !== post.slug && other.categories.some((c) => post.categories.includes(c)),
	).slice(0, limit);
}
