/**
 * Builds the heading outline for a post's Portable Text body — walks h2/h3
 * blocks directly (no DOM, no regex over rendered HTML) and slugifies each
 * into an id, keyed by the block's own `_key` so lib/portable-text.ts can
 * inject the same id when it serializes that block to HTML.
 */
import type { PortableTextBlock } from "@portabletext/types";
import type { HeadingId } from "./portable-text";

export interface ArticleHeading {
	id: string;
	text: string;
	level: 2 | 3;
}

export interface ArticleOutline {
	headingIds: Map<string, HeadingId>;
	headings: ArticleHeading[];
}

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

function plainText(block: PortableTextBlock): string {
	return (block.children ?? [])
		.map((child) => ("text" in child && typeof child.text === "string" ? child.text : ""))
		.join("")
		.trim();
}

export function buildOutline(blocks: PortableTextBlock[]): ArticleOutline {
	const headingIds = new Map<string, HeadingId>();
	const headings: ArticleHeading[] = [];
	// Two headings can legitimately share text ("Why it matters"), and a
	// duplicate id would make the rail jump to the wrong one.
	const used = new Set<string>();

	for (const block of blocks) {
		if (block._type !== "block" || (block.style !== "h2" && block.style !== "h3")) continue;

		const text = plainText(block);
		if (!text) continue;

		const level = block.style === "h2" ? 2 : 3;
		let id = slugify(text);
		if (used.has(id)) {
			let n = 2;
			const base = id;
			while (used.has(id)) id = `${base}-${n++}`;
		}
		used.add(id);

		if (block._key) headingIds.set(block._key, { id, level });
		headings.push({ id, text, level });
	}

	return { headingIds, headings };
}
