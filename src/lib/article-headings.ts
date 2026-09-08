/**
 * Pulls the heading outline out of an article body and gives every heading
 * an `id` to anchor to. Derived at render time so the rail can never drift
 * from the body. Regex, not a parser — no DOM in the Cloudflare worker.
 */

export interface ArticleHeading {
	id: string;
	text: string;
	/** h2 is a top-level section; h3 indents under it in the rail. */
	level: 2 | 3;
}

export interface ArticleOutline {
	/** The body with an `id` on every h2/h3 that lacked one. */
	html: string;
	headings: ArticleHeading[];
}

const HEADING = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi;
const EXISTING_ID = /\bid\s*=\s*["']([^"']+)["']/i;

function slugify(text: string): string {
	return (
		text
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.trim()
			.replace(/\s+/g, "-")
			.slice(0, 60) || "section"
	);
}

/** Heading text with any inline markup (links, <code>, <em>) stripped out. */
function plainText(inner: string): string {
	return inner
		.replace(/<[^>]+>/g, "")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&#39;|&apos;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&nbsp;/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export function buildOutline(html: string): ArticleOutline {
	const headings: ArticleHeading[] = [];
	// Two posts can legitimately share a heading ("Why it matters"), and a
	// duplicate id would make the rail jump to the wrong one.
	const used = new Set<string>();

	const out = html.replace(HEADING, (match, rawLevel: string, attrs: string, inner: string) => {
		const text = plainText(inner);
		if (!text) return match;

		const level = Number(rawLevel) as 2 | 3;
		const existing = EXISTING_ID.exec(attrs)?.[1];

		let id = existing ?? slugify(text);
		if (!existing) {
			let n = 2;
			const base = id;
			while (used.has(id)) id = `${base}-${n++}`;
		}
		used.add(id);

		headings.push({ id, text, level });

		// Leave an authored id alone; otherwise add one, keeping other attributes.
		return existing
			? match
			: `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
	});

	return { html: out, headings };
}
