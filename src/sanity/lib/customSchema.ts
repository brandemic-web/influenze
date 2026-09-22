/**
 * Parses the raw JSON-LD text from a page's seo.customSchema field. The
 * Studio field validates it's a JSON array before publish, but a draft or a
 * stale cached response could still carry something malformed — falls back
 * to an empty array rather than breaking the page render.
 */
export function parseCustomSchema(raw?: string): Record<string, unknown>[] {
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
