/**
 * The Rankings snapshot: the backend's refresh job writes one JSON file
 * with every public list page (the hubs are built here from those pages), and the build reads it once from
 * RANKINGS_SNAPSHOT_URL, the backend's public snapshot route (any
 * http(s) URL works, e.g. a local server while developing). No URL, or a
 * failed fetch, builds no ranking pages rather than failing the whole
 * deploy: these pages are noindex for now and must never block the site.
 * Plain fetch only: the Cloudflare adapter prerenders in a runtime with no
 * file system.
 */
import { RANKINGS_HUBS } from "../data/rankings";

export interface RankedCreator {
	handle: string;
	external_id: string | null;
	name: string | null;
	url: string | null;
	/** The platform's own photo link; expires within days on Instagram. */
	image_url: string | null;
	/** Our copy of the photo in the public website bucket; null when the copy failed. */
	photo_url: string | null;
	is_verified: boolean;
	followers: number | null;
	/** Percentage, e.g. 1.87. */
	engagement_rate: number | null;
	average_likes: number | null;
	average_views: number | null;
	tier: "nano" | "micro" | "mid_tier" | "macro" | "mega";
	location: { city: string | null; state: string | null; country: string | null } | null;
	language: string | null;
	rank: number | null;
}

export interface RankingPageStats {
	total_results: number | null;
	found: number;
	kept: number;
	average_engagement: number | null;
	tier_split: Record<string, number>;
}

export interface RankingPage {
	path: string;
	url: string;
	hub: string;
	kind: "top" | "tier" | "category" | "city" | "language";
	plat: "IG" | "YT";
	keyword: string;
	title: string;
	meta: string;
	heading: string;
	refreshed_at: string;
	/** The admin's Publishing setting: built at all. Missing (older snapshots) means yes. */
	published?: boolean;
	/** Open to Google. Missing means no, so nothing is indexed by accident. */
	indexed?: boolean;
	passed: boolean;
	fail_reason: string | null;
	stats: RankingPageStats;
	creators: RankedCreator[];
}

export interface RankingsSnapshot {
	version: number;
	refresh_id: string;
	refreshed_at: string;
	pages: RankingPage[];
}

/** A hub page: its copy from data/rankings.ts and the published pages under it. */
export type RankingHub = (typeof RANKINGS_HUBS)[number] & {
	/** The published list pages under the hub, in path order. */
	pages: RankingPage[];
	/** Open to Google once any page it lists is. */
	indexed: boolean;
};

const EMPTY: RankingsSnapshot = { version: 0, refresh_id: "", refreshed_at: "", pages: [] };

let cached: Promise<RankingsSnapshot> | undefined;

async function load(): Promise<RankingsSnapshot> {
	const source = process.env.RANKINGS_SNAPSHOT_URL ?? (import.meta.env.RANKINGS_SNAPSHOT_URL as string | undefined);
	if (!source) {
		console.warn("[rankings] RANKINGS_SNAPSHOT_URL is not set; building no ranking pages");
		return EMPTY;
	}
	try {
		const res = await fetch(source);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const snapshot = (await res.json()) as RankingsSnapshot;
		if (!Array.isArray(snapshot.pages)) throw new Error("not a snapshot");
		// Unpublished pages stay in the snapshot (keeping their creators) but are not built.
		snapshot.pages = snapshot.pages.filter((page) => page.published !== false);
		snapshot.pages.sort((a, b) => a.path.localeCompare(b.path));
		console.log(`[rankings] snapshot ${snapshot.refresh_id}: ${snapshot.pages.length} pages`);
		return snapshot;
	} catch (err) {
		console.warn(`[rankings] could not read ${source}: ${err}; building no ranking pages`);
		return EMPTY;
	}
}

export function getSnapshot(): Promise<RankingsSnapshot> {
	cached ??= load();
	return cached;
}

/** The hubs that have at least one published page; an empty hub is not built. */
export async function getHubs(): Promise<RankingHub[]> {
	const { pages } = await getSnapshot();
	return RANKINGS_HUBS.map((hub) => {
		const listed = pages.filter((page) => page.path.startsWith(`${hub.path}/`));
		return { ...hub, pages: listed, indexed: listed.some((page) => page.indexed) };
	}).filter((hub) => hub.pages.length > 0);
}

/** /in/<hub>/<page>/ → the hub and page slugs, from a stored path like in/youtubers/tamil. */
export function splitPath(path: string): { country: string; hub: string; page: string } {
	const [country = "", hub = "", page = ""] = path.split("/");
	return { country, hub, page };
}
