/**
 * Icon set for the hero product-workflow mockup, read from the app's own SVG
 * assets in src/assets/icons/workflow at build time.
 *
 * The mockup ships as markup rather than an exported image so GSAP can animate
 * its parts, which means the glyphs have to be inline SVG. Each one is the
 * app's asset verbatim — its own viewBox grid and stroke weight are kept, so
 * the mockup matches the product pixel for pixel — with only the hard-coded
 * colour swapped for `currentColor` so call sites can tint with Tailwind's
 * text-* utilities.
 *
 * When the product changes an icon: drop the app's SVG into
 * src/assets/icons/workflow and, if the file name changed, repoint its slot in
 * ICON_FILES. Nothing else needs touching.
 */

const ICON_DIR = "../assets/icons/workflow";

const RAW_SVGS = import.meta.glob<string>("../assets/icons/workflow/*.svg", {
	query: "?raw",
	import: "default",
	eager: true,
});

/**
 * Mockup slot → file name. Keys mirror the app's own asset names so the two
 * sets stay diffable, and this table is the single place to remap a slot.
 */
const ICON_FILES = {
	addToList: "add_to_list.svg",
	arrowDown: "arrow_down.svg",
	arrowIcon: "arrow_icon.svg",
	asterisk: "asterisk.svg",
	badge: "badge.svg",
	chartColumnIncreasing: "chart_column_increasing.svg",
	check: "check.svg",
	circleX: "circle_x.svg",
	coins: "coins.svg",
	cross: "cross.svg",
	dragDots: "drag_dots.svg",
	export: "export.svg",
	externalLink: "external_link.svg",
	eyeSmall: "eye_small.svg",
	female: "female.svg",
	galleryVertical: "gallery_vertical.svg",
	hourglass: "hourglass.svg",
	import: "import.svg",
	info: "info.svg",
	list: "list.svg",
	mail: "mail.svg",
	male: "male.svg",
	mapPin: "map_pin.svg",
	messageCircle: "message_circle.svg",
	phone: "phone.svg",
	redirect: "redirect.svg",
	removeFromList: "remove_from_list.svg",
	search: "search.svg",
	share: "share.svg",
	userRoundCheck: "user_round_check.svg",
	userRoundCog: "user_round_cog.svg",
	usersRound: "users_round.svg",
} as const;

export type WorkflowIconName = keyof typeof ICON_FILES;

export interface WorkflowIcon {
	/** The asset's own grid, e.g. "0 0 14 14". */
	viewBox: string;
	/** Stroke weight in that grid, when the asset's root element sets one. */
	strokeWidth?: number;
	/** Inner markup, recoloured to currentColor. */
	markup: string;
}

const escapeRe = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const attrOf = (attrs: string, name: string) =>
	attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

/**
 * Figma exports wrap the whole glyph in a clip path covering the full canvas,
 * which the viewBox already does. Dropping those keeps the markup free of ids,
 * so an icon used twice on the page can't emit duplicates.
 */
function stripNoopClips(inner: string, width: string, height: string): string {
	const stripped: string[] = [];

	let out = inner.replace(
		/<clipPath\s+id="([^"]+)"\s*>([\s\S]*?)<\/clipPath>/g,
		(whole, id: string, body: string) => {
			const rect = body.match(/<rect\b([^>]*?)\/?>/);
			if (!rect) return whole;
			const offset = /\b[xy]="(?!0")/.test(rect[1]);
			if (offset || attrOf(rect[1], "width") !== width || attrOf(rect[1], "height") !== height) {
				return whole;
			}
			stripped.push(id);
			return "";
		},
	);

	for (const id of stripped) {
		out = out.replace(new RegExp(`\\s*clip-path="url\\(#${escapeRe(id)}\\)"`, "g"), "");
	}

	return out.replace(/<defs>\s*<\/defs>/g, "");
}

/** Unwraps the single attribute-less <g> those clip paths leave behind. */
function unwrapBareGroup(inner: string): string {
	const bare = inner.trim().match(/^<g>([\s\S]*)<\/g>$/);
	return bare && !bare[1].includes("<g") ? bare[1] : inner;
}

/**
 * Ids that survive (a gradient, say) are prefixed with the slot name, so two
 * different icons on the page can't collide over Figma's generic export ids.
 */
function namespaceIds(inner: string, name: string): string {
	let out = inner;
	for (const [, id] of inner.matchAll(/\bid="([^"]+)"/g)) {
		out = out.replaceAll(`id="${id}"`, `id="wf-${name}-${id}"`);
		out = out.replaceAll(`url(#${id})`, `url(#wf-${name}-${id})`);
	}
	return out;
}

/** Hands colour control to the call site's text-* class. */
const recolour = (inner: string) =>
	inner
		.replace(/\bstroke="(?!none")[^"]*"/g, 'stroke="currentColor"')
		.replace(/\bfill="(?!none")[^"]*"/g, 'fill="currentColor"');

function loadIcon(name: string, file: string): WorkflowIcon {
	const raw = RAW_SVGS[`${ICON_DIR}/${file}`];
	if (raw === undefined) {
		throw new Error(`workflowIcons: slot "${name}" points at missing asset ${ICON_DIR}/${file}`);
	}

	const root = raw.replace(/<!--[\s\S]*?-->/g, "").match(/<svg\b([^>]*)>([\s\S]*)<\/svg>/);
	if (!root) throw new Error(`workflowIcons: ${file} has no <svg> root`);

	const [, attrs, body] = root;
	// drag_dots.svg is exported at width/height 800 on a 16 grid, so the
	// viewBox — not the intrinsic size — is what defines the coordinate space.
	const viewBox = attrOf(attrs, "viewBox");
	if (!viewBox) throw new Error(`workflowIcons: ${file} has no viewBox`);

	const [, , width, height] = viewBox.split(/\s+/);
	const rootStroke = attrOf(attrs, "stroke-width");

	const markup = namespaceIds(
		recolour(unwrapBareGroup(stripNoopClips(body, width, height))),
		name,
	)
		.replace(/>\s+</g, "><")
		.trim();

	return {
		viewBox,
		...(rootStroke ? { strokeWidth: Number(rootStroke) } : {}),
		markup,
	};
}

export const WORKFLOW_ICONS = Object.fromEntries(
	Object.entries(ICON_FILES).map(([name, file]) => [name, loadIcon(name, file)]),
) as Record<WorkflowIconName, WorkflowIcon>;

if (import.meta.env.DEV) {
	const mapped = new Set<string>(Object.values(ICON_FILES));
	const unmapped = Object.keys(RAW_SVGS)
		.map((path) => path.slice(ICON_DIR.length + 1))
		.filter((file) => !mapped.has(file));
	if (unmapped.length > 0) {
		console.warn(`[workflowIcons] not wired into ICON_FILES: ${unmapped.join(", ")}`);
	}
}
