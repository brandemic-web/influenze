/**
 * Read time is derived, never stored — an authored number drifts the moment
 * anyone edits the body, and the article page already has the body in hand.
 */
import type { PortableTextBlock } from "@portabletext/types";

/** Average adult silent-reading speed for prose. */
const WORDS_PER_MINUTE = 225;

function minutesFor(wordCount: number): number {
	// A very short post must never read "0 min read".
	return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Read time for a Portable Text body — skips non-prose blocks. */
export function readingMinutesFromBlocks(blocks: PortableTextBlock[]): number {
	const words = blocks
		.filter((block) => block._type === "block")
		.flatMap((block) =>
			(block.children ?? []).map((child) => ("text" in child && typeof child.text === "string" ? child.text : "")),
		)
		.join(" ");

	return minutesFor(countWords(words));
}
