/**
 * Read time is derived, never stored — an authored number drifts the moment
 * anyone edits the body, and the article page already has the body in hand.
 */

/** Average adult silent-reading speed for prose. */
const WORDS_PER_MINUTE = 225;

function minutesFor(wordCount: number): number {
	// A very short post must never read "0 min read".
	return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Read time for a body held as an HTML string. Tags are stripped rather than
 * parsed — no DOM exists here (this runs in the Cloudflare worker), and a tag
 * name counted as a word would only ever shift the estimate by seconds.
 */
export function readingMinutesFromHtml(html: string): number {
	return minutesFor(countWords(html.replace(/<[^>]+>/g, " ")));
}
