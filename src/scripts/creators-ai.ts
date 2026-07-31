/**
 * The contract shared between the CreatorsAI markup, its tab controller and its
 * panel demos. Element ids used to be written out as template literals in three
 * places; anything that has to agree across those files belongs here.
 *
 * Import-safe from Astro frontmatter — no DOM access at module scope.
 */

export const tabId = (index: number) => `creators-ai-tab-${index}`;
export const panelId = (index: number) => `creators-ai-panel-${index}`;

/** Fired on a panel element each time its tab is selected. */
export const PANEL_ENTER = "creators-ai:panel-enter";

/**
 * Fired on a panel element when its demo timeline reaches the end. The tab
 * controller times its auto-advance off this, so each slide gets exactly as long
 * as its own animation needs rather than a guessed interval.
 */
export const PANEL_DONE = "creators-ai:panel-done";
