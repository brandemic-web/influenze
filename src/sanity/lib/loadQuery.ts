import { sanityClient } from "sanity:client";
import type { ClientPerspective, QueryParams } from "@sanity/client";

// Server-only — deliberately NOT a PUBLIC_ var. Only ever read here, in
// server-side Astro frontmatter, and never forwarded to the client.
const token = import.meta.env.SANITY_API_READ_TOKEN;

function parsePerspective(raw: string | undefined): ClientPerspective | undefined {
	if (!raw) return undefined;
	const decoded = decodeURIComponent(raw);
	if (decoded.startsWith("[")) {
		try {
			return JSON.parse(decoded) as ClientPerspective;
		} catch {
			return undefined;
		}
	}
	return decoded as ClientPerspective;
}

/**
 * Fetch wrapper that switches between the public CDN (published content) and
 * an authenticated draft-content read (visual editing). `perspectiveCookie`
 * is set by Sanity's own Presentation tool via /api/draft-mode/enable (see
 * src/lib/draft-mode.ts) — its presence is what flips this, not a flag we
 * maintain ourselves. Every page query should go through this rather than
 * calling sanityClient.fetch directly, so the Presentation preview shows
 * unpublished changes while normal visitors always get published content.
 */
/**
 * Published content is the same for every visitor, but each section component
 * asks for its page document independently — nine components request the full
 * homePage doc, so a single homepage render fanned out nine identical round
 * trips to Sanity before first byte. The promise is cached (not just its
 * result) so concurrent callers share one in-flight request.
 *
 * Drafts are never cached: Presentation must always show the latest edit, and
 * a draft response must never be reachable by a normal visitor.
 */
const PUBLISHED_TTL_MS = 15_000;
const publishedCache = new Map<string, { at: number; promise: Promise<unknown> }>();

export async function loadQuery<QueryResponse>({
	query,
	params,
	perspectiveCookie,
}: {
	query: string;
	params?: QueryParams;
	perspectiveCookie?: string;
}) {
	const draft = Boolean(perspectiveCookie);

	if (draft && !token) {
		throw new Error(
			"SANITY_API_READ_TOKEN is required for draft previews. Add a Viewer token to .env — see sanity.io/manage → API → Tokens.",
		);
	}

	const perspective: ClientPerspective = draft
		? (parsePerspective(perspectiveCookie) ?? "drafts")
		: "published";

	const fetchOnce = () =>
		sanityClient.fetch<QueryResponse>(query, params ?? {}, {
			filterResponse: false,
			perspective,
			resultSourceMap: draft ? "withKeyArraySelector" : false,
			stega: draft,
			...(draft ? { token } : {}),
			useCdn: !draft,
		});

	if (draft) {
		const { result, resultSourceMap } = await fetchOnce();
		return { data: result, sourceMap: resultSourceMap };
	}

	const key = `${query}::${JSON.stringify(params ?? {})}`;
	const hit = publishedCache.get(key);
	let promise = hit && Date.now() - hit.at < PUBLISHED_TTL_MS ? hit.promise : undefined;

	if (!promise) {
		// A rejected fetch must not be cached, or one Sanity blip would be
		// replayed to every visitor until the TTL expired.
		promise = fetchOnce().catch((error) => {
			publishedCache.delete(key);
			throw error;
		});
		publishedCache.set(key, { at: Date.now(), promise });
	}

	const { result, resultSourceMap } = (await promise) as Awaited<ReturnType<typeof fetchOnce>>;
	return { data: result, sourceMap: resultSourceMap };
}
