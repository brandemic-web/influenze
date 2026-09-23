/**
 * The small amount of Portable Text handling the blog needs, kept in one place
 * so the renderer stays declarative and the contents rail can read the same
 * headings the body will emit.
 *
 * Deliberately not a dependency: the body uses four styles, two list types, two
 * decorators and one annotation, and hand-rolling that is less code than wiring
 * a serializer library up to Astro components — which matters because the CTA
 * block has to render as the real BlogCta.astro, not as a serialized string.
 */

export interface PortableSpan {
	_type: "span";
	_key?: string;
	text?: string;
	marks?: string[];
}

export interface PortableMarkDef {
	_key: string;
	_type: string;
	href?: string;
	newTab?: boolean;
}

export interface PortableTextBlock {
	_type: "block";
	_key?: string;
	style?: string;
	listItem?: "bullet" | "number";
	level?: number;
	children?: PortableSpan[];
	markDefs?: PortableMarkDef[];
}

export interface PortableCtaBlock {
	_type: "blogCta";
	_key?: string;
	heading?: string;
	body?: string;
	label?: string;
	href?: string;
	newTab?: boolean;
}

export interface PortableImageBlock {
	_type: "image";
	_key?: string;
	url?: string;
	alt?: string;
	caption?: string;
	dimensions?: { width?: number; height?: number };
}

export type PortableBlock =
	| PortableTextBlock
	| PortableCtaBlock
	| PortableImageBlock
	| { _type: string; _key?: string };

export const isTextBlock = (block: PortableBlock): block is PortableTextBlock =>
	block._type === "block";

/** Runs of consecutive list items become one list; everything else stands alone. */
export type PortableGroup =
	| { kind: "list"; key: string; ordered: boolean; items: PortableTextBlock[] }
	| { kind: "block"; key: string; block: PortableBlock };

export function groupBlocks(blocks: PortableBlock[]): PortableGroup[] {
	const groups: PortableGroup[] = [];

	for (const [i, block] of blocks.entries()) {
		const key = block._key ?? `b-${i}`;
		const listItem = isTextBlock(block) ? block.listItem : undefined;

		if (!listItem) {
			groups.push({ kind: "block", key, block });
			continue;
		}

		const ordered = listItem === "number";
		const open = groups.at(-1);
		// Only merge into a list of the same kind, so a bulleted list directly
		// under a numbered one stays two lists rather than one mixed-up one.
		if (open?.kind === "list" && open.ordered === ordered) {
			open.items.push(block as PortableTextBlock);
		} else {
			groups.push({ kind: "list", key, ordered, items: [block as PortableTextBlock] });
		}
	}

	return groups;
}

const escapeHtml = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

/** Plain text of a block — for heading ids, read time and anything non-visual. */
export function blockText(block: PortableBlock): string {
	if (!isTextBlock(block)) return "";
	return (block.children ?? []).map((span) => span.text ?? "").join("");
}

/**
 * A block's inline content as HTML: bold, italic and links, nothing else. The
 * text is escaped first, so what an author typed can never become markup — only
 * the tags this function adds are real.
 */
export function inlineHtml(block: PortableTextBlock): string {
	const markDefs = block.markDefs ?? [];

	return (block.children ?? [])
		.map((span) => {
			let html = escapeHtml(span.text ?? "");

			for (const mark of span.marks ?? []) {
				if (mark === "strong") {
					html = `<strong>${html}</strong>`;
					continue;
				}
				if (mark === "em") {
					html = `<em>${html}</em>`;
					continue;
				}

				// Anything else is an annotation, looked up by key.
				const def = markDefs.find((candidate) => candidate._key === mark);
				if (def?._type === "link" && def.href) {
					// `noopener` keeps the opened page from reaching back through window.opener.
					const target = def.newTab ? ' target="_blank" rel="noopener noreferrer"' : "";
					html = `<a href="${escapeHtml(def.href)}"${target}>${html}</a>`;
				}
			}

			return html;
		})
		.join("");
}

/** Lowercase, hyphenated, ASCII — the anchor a contents-rail link targets. */
export function slugifyHeading(text: string): string {
	return (
		text
			.toLowerCase()
			.normalize("NFKD")
			.replace(/[^\p{Letter}\p{Number}]+/gu, "-")
			.replace(/^-+|-+$/g, "")
			.slice(0, 60) || "section"
	);
}

/**
 * The H2s, in order, with the ids the renderer will put on them. Both the rail
 * and the body call this, so an anchor can never point at a heading that is not
 * there. Duplicate headings get a numeric suffix rather than a duplicate id.
 */
export function headingSections(blocks: PortableBlock[]): { id: string; text: string }[] {
	const seen = new Map<string, number>();

	return blocks
		.filter((block): block is PortableTextBlock => isTextBlock(block) && block.style === "h2")
		.map((block) => {
			const text = blockText(block);
			const base = slugifyHeading(text);
			const count = seen.get(base) ?? 0;
			seen.set(base, count + 1);
			return { id: count ? `${base}-${count + 1}` : base, text };
		});
}

/** Rough read time, for posts where nobody filled the field in. */
export function estimateReadMinutes(blocks: PortableBlock[]): number {
	const words = blocks.reduce(
		(total, block) => total + blockText(block).split(/\s+/).filter(Boolean).length,
		0,
	);
	return Math.max(1, Math.round(words / 200));
}
