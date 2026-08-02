/**
 * The noun the hero headline cycles through — "Find The Right ___".
 *
 * The first entry is what the static markup renders, so it is also what shows
 * with JavaScript off, at reduced motion, and on first paint before the rotation
 * starts. `Creators` leads for that reason: it keeps the hero's opening frame the
 * one the design was signed off with.
 *
 * Rendered uppercase by the headline, so casing here is for reading, not display.
 */
export const HERO_WORDS = [
	"Creators",
	"Artists",
	"Influencers",
	"Celebrities",
	"Food bloggers",
	"Tech Reviewers",
	"Streamers",
	"Collaborators",
	"Musicians",
];
