/**
 * The Top creators snapshot: the backend's refresh job writes one JSON file
 * with every public creator page, and the build reads it once from
 * TOP_CREATORS_SNAPSHOT_URL, the backend's public snapshot route (any
 * http(s) URL works, e.g. a local server while developing). No URL, or a
 * failed fetch, builds no Top creators pages rather than failing the whole
 * deploy: these pages are noindex for now and must never block the site.
 * Plain fetch only: the Cloudflare adapter prerenders in a runtime with no
 * file system.
 */

export interface TopCreator {
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

export interface TopCreatorsPageStats {
	total_results: number | null;
	found: number;
	kept: number;
	average_engagement: number | null;
	tier_split: Record<string, number>;
}

export interface TopCreatorsPage {
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
	stats: TopCreatorsPageStats;
	creators: TopCreator[];
}

export interface TopCreatorsHub {
	path: string;
	url: string;
	hub: string;
	plat: "IG" | "YT" | null;
	keyword: string;
	title: string;
	meta: string;
	heading: string;
	/** Paths of the published list pages, in path order. */
	pages: string[];
	/** Open to Google: true once any page it lists is. */
	indexed?: boolean;
}

export interface TopCreatorsSnapshot {
	version: number;
	refresh_id: string;
	refreshed_at: string;
	hubs: TopCreatorsHub[];
	pages: TopCreatorsPage[];
}

const EMPTY: TopCreatorsSnapshot = { version: 0, refresh_id: "", refreshed_at: "", hubs: [], pages: [] };

let cached: Promise<TopCreatorsSnapshot> | undefined;

async function load(): Promise<TopCreatorsSnapshot> {
	const source = process.env.TOP_CREATORS_SNAPSHOT_URL ?? (import.meta.env.TOP_CREATORS_SNAPSHOT_URL as string | undefined);
	if (!source) {
		console.warn("[top-creators] TOP_CREATORS_SNAPSHOT_URL is not set; building no Top creators pages");
		return EMPTY;
	}
	try {
		const res = await fetch(source);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const snapshot = (await res.json()) as TopCreatorsSnapshot;
		if (!Array.isArray(snapshot.pages) || !Array.isArray(snapshot.hubs)) throw new Error("not a snapshot");
		// Unpublished pages stay in the snapshot (keeping their creators) but are not built.
		snapshot.pages = snapshot.pages.filter((page) => page.published !== false);
		console.log(`[top-creators] snapshot ${snapshot.refresh_id}: ${snapshot.pages.length} pages, ${snapshot.hubs.length} hubs`);
		return snapshot;
	} catch (err) {
		console.warn(`[top-creators] could not read ${source}: ${err}; building no Top creators pages`);
		return EMPTY;
	}
}

export function getSnapshot(): Promise<TopCreatorsSnapshot> {
	cached ??= load();
	return cached;
}

/** /in/<hub>/<page>/ → the hub and page slugs, from a stored path like in/youtubers/tamil. */
export function splitPath(path: string): { country: string; hub: string; page: string } {
	const [country = "", hub = "", page = ""] = path.split("/");
	return { country, hub, page };
}
