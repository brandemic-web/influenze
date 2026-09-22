/**
 * Parses seo.customSchema into a full JSON-LD document (see Layout.astro's
 * structuredDataOverride). Returns undefined on missing/invalid input, which
 * falls back to the auto-generated structured data.
 */
export function parseStructuredDataOverride(raw?: string): Record<string, unknown> | undefined {
	if (!raw) return undefined;
	try {
		const parsed = JSON.parse(raw);
		return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? parsed : undefined;
	} catch {
		return undefined;
	}
}
