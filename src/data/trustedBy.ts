import type { ImageMetadata } from "astro";
import hammerhead from "../assets/images/home_page/trusted_by/hammerhead_logo.svg";
import brandemic from "../assets/images/home_page/trusted_by/brandemic_logo.svg";
import hyper from "../assets/images/home_page/trusted_by/hyper_logo.svg";
import owled from "../assets/images/home_page/trusted_by/owled_logo.svg";
import iplixMedia from "../assets/images/home_page/trusted_by/iplix_media_logo.svg";
import circuit from "../assets/images/home_page/trusted_by/circuit_logo.png";
import contraband from "../assets/images/home_page/trusted_by/contraband_logo.svg";
import lovetc from "../assets/images/home_page/trusted_by/lovetc_logo.svg";
import glenwalk from "../assets/images/home_page/trusted_by/the_glenwalk_logo.svg";

/** Per-side spacing in design px; omitted sides are 0. */
export interface TrustedByBox {
	top?: number;
	right?: number;
	bottom?: number;
	left?: number;
}

export interface TrustedByLogo {
	src: ImageMetadata;
	alt: string;
	/** Intrinsic pixels — the width/height attributes that reserve layout space. */
	w?: number;
	h?: number;
	/**
	 * Rendered box, in design px. Every logo shares TRUSTED_BY_MOBILE_BOX on
	 * mobile and TRUSTED_BY_DESKTOP_BOX above `lg`; these override per logo.
	 * Values divide by 16 into rem, so the desktop row scales with the grid.
	 */
	mobile?: { width?: number; height?: number };
	desktop?: { width?: number; height?: number };
	/** Nudges for artwork whose own whitespace sits it wrong in the row. Above `lg`
	 * only — the mobile ticker keeps every logo in one uniform box. */
	padding?: TrustedByBox;
	margin?: TrustedByBox;
}

export const TRUSTED_BY_HEADING = "Trusted By";

export const TRUSTED_BY_MOBILE_BOX = { width: 100, height: 32 };
export const TRUSTED_BY_DESKTOP_BOX = { width: 256, height: 68 };

export const TRUSTED_BY_LOGOS: TrustedByLogo[] = [
	{ src: brandemic, alt: "Brandemic", w: 191, h: 42, padding: { left: 32 } },
	{ src: hyper, alt: "Hyper", w: 97, h: 56, desktop: { width: 96, height: 56 } },
	{
		src: iplixMedia,
		alt: "Iplix Media",
		w: 86,
		h: 53,
		// 86×53 is the artwork's own size, so it renders undistorted.
		desktop: { width: 86, height: 53 },
	},
	{ src: circuit, alt: "Circuit", mobile: { width: 88, height: 20 }, desktop: { width: 160, height: 36 } },
	{ src: owled, alt: "Owled", w: 93, h: 64, desktop: { width: 76, height: 52 } },
	{ src: hammerhead, alt: "Hammerhead Global", w: 245, h: 68 },
	// Boxes follow each artwork's own ratio (240×22, 892×291, 212×48), so none is squeezed.
	{
		src: contraband,
		alt: "Contraband",
		w: 240,
		h: 22,
		mobile: { width: 100, height: 9 },
		desktop: { width: 210, height: 19 },
	},
	{
		src: lovetc,
		alt: "LoveTC",
		w: 892,
		h: 291,
		mobile: { width: 74, height: 24 },
		desktop: { width: 147, height: 48 },
	},
	{
		src: glenwalk,
		alt: "The Glenwalk",
		w: 212,
		h: 48,
		mobile: { width: 100, height: 23 },
		desktop: { width: 190, height: 43 },
	},
];
