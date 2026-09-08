/**
 * PLACEHOLDER POSTS — Phase A only. Shape mirrors the future Sanity `post`
 * document, so Phase B swaps the source. This file is DELETED once Sanity
 * lands, not kept as a fallback. Cover art and avatars are not final.
 */
import type { ImageMetadata } from "astro";
import { readingMinutesFromHtml } from "../lib/reading-time";

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
		categories: ["Creator Discovery"],
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
<p>It is still a useful bucket for budgeting and for setting expectations on volume. It is a filter, not a ranking. Treat it as the width of the funnel and let the four signals decide who comes through it.</p>
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
