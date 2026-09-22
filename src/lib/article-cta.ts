/**
 * Splits a post's Portable Text body into alternating prose/cta segments —
 * a post opts into the reusable CTA by adding an articleCta block anywhere
 * in its body, any number of times, each with its own optional copy.
 */
import type { PortableTextBlock } from "@portabletext/types";
import { renderProseToHtml, type HeadingId } from "./portable-text";

interface ArticleCtaBlock extends PortableTextBlock {
	heading?: string;
	subcopy?: string;
	buttonLabel?: string;
	buttonHref?: string;
}

export type BodySegment =
	| { type: "prose"; html: string }
	| { type: "cta"; heading?: string; subcopy?: string; buttonLabel?: string; buttonHref?: string };

export function splitBody(blocks: PortableTextBlock[], headingIds: Map<string, HeadingId>): BodySegment[] {
	const segments: BodySegment[] = [];
	let prose: PortableTextBlock[] = [];

	const flushProse = () => {
		if (prose.length === 0) return;
		segments.push({ type: "prose", html: renderProseToHtml(prose, headingIds) });
		prose = [];
	};

	for (const block of blocks) {
		if (block._type === "articleCta") {
			flushProse();
			const cta = block as ArticleCtaBlock;
			segments.push({
				type: "cta",
				heading: cta.heading,
				subcopy: cta.subcopy,
				buttonLabel: cta.buttonLabel,
				buttonHref: cta.buttonHref,
			});
			continue;
		}
		prose.push(block);
	}
	flushProse();

	return segments;
}
