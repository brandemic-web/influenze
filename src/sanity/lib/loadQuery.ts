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

	const { result, resultSourceMap } = await sanityClient.fetch<QueryResponse>(
		query,
		params ?? {},
		{
			filterResponse: false,
			perspective,
			resultSourceMap: draft ? "withKeyArraySelector" : false,
			stega: draft,
			...(draft ? { token } : {}),
			useCdn: !draft,
		},
	);

	return { data: result, sourceMap: resultSourceMap };
}
