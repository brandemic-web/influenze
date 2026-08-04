/**
 * Glyph metadata for `Icon.astro`. Kept in a `.ts` file so the `IconName` type
 * can be imported by other components — Astro files only export a component.
 */

export type IconName =
	| "close"
	| "chevron-down"
	| "search"
	| "arrow-down"
	| "info"
	| "mail"
	| "phone"
	| "audience"
	| "creator";

/** Each glyph is drawn on its own grid; the component reads the box from here. */
export const ICON_VIEW_BOX: Record<IconName, string> = {
	close: "0 0 16 16",
	"chevron-down": "0 0 16 16",
	search: "0 0 16 16",
	"arrow-down": "0 0 16 16",
	info: "0 0 16 16",
	mail: "0 0 25 25",
	phone: "0 0 25 25",
	audience: "0 0 14 14",
	creator: "0 0 14 14",
};

/**
 * Default stroke weight per glyph, in viewBox units. Call sites override it via
 * the `strokeWidth` prop where the design uses a heavier or lighter line.
 */
export const ICON_STROKE: Record<IconName, number> = {
	close: 1.4,
	"chevron-down": 1.4,
	search: 1.4,
	"arrow-down": 1.4,
	info: 1.2,
	mail: 1.62116,
	phone: 1.62116,
	audience: 1,
	creator: 1,
};
