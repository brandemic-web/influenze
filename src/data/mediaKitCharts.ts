/**
 * The media kit's chart scales, ported from the app.
 *
 * Both charts derive everything they draw from their raw numbers — the app does
 * the same, and doing it here too means an axis label can never disagree with
 * the line or bar sitting next to it. Only the series themselves are authored,
 * in `data/workflowMockup.ts`.
 *
 * Sources: `GrowthChartWidget` + `CustomLineChart`'s `LineChartPainter`
 * (`common/widgets/custom_line_chart.dart`) for the growth charts, and
 * `PricingCard`'s `_PostTypeChart` + `_niceMax` (`media_kit/detail/pricing_card.dart`)
 * for the price chart.
 *
 * Geometry comes out as **percentages**, because the mockup's charts are flex
 * boxes whose width is only known at layout time: the media kit tab and a
 * compare column are different widths, and the whole canvas then rescales with
 * the viewport. Percentages are the one form that survives all of that.
 */

/**
 * Dart `intl`'s `NumberFormat.compact()` — three significant digits, which is
 * what the growth charts and the stat tiles use: 190373 → "190K",
 * 9010 → "9.01K", 24899 → "24.9K".
 */
export const compactCount = (value: number): string =>
	new Intl.NumberFormat("en-US", { notation: "compact", maximumSignificantDigits: 3 }).format(value);

/**
 * The app's own `formatCompactNumber` (`utils/format/format_helpers.dart`) —
 * one decimal, trailing `.0` dropped: 1400 → "1.4K", 2000 → "2K", 965 → "965".
 * Deliberately *not* `compactCount`: the price chart is the one place the app
 * formats with its own helper rather than `intl`, so 1205 reads "1.2K" here and
 * "1.21K" there.
 */
export function compactMoney(value: number): string {
	for (const [unit, suffix] of [
		[1_000_000, "M"],
		[1_000, "K"],
	] as const) {
		if (value >= unit) {
			const scaled = value / unit;
			return `${Number.isInteger(scaled) ? scaled : scaled.toFixed(1)}${suffix}`;
		}
	}
	return value.toFixed(0);
}

/** One month of a growth series, as the media kit payload carries it. */
export interface GrowthPoint {
	/** Lowercase in the data, cased by the chart — the app title-cases or upper-cases it. */
	readonly month: string;
	readonly value: number;
}

/** A gridline: how far down the plot it sits, and the value it stands for. */
export interface Gridline {
	/** Percentage from the top of the plot. */
	readonly at: number;
	readonly label: string;
}

export interface GrowthScale {
	/** Gridlines and y-axis labels, in the app's order (bottom value first). */
	readonly gridlines: readonly Gridline[];
	/** One entry per month: percentage across the plot, and down it. */
	readonly points: readonly { readonly x: number; readonly y: number }[];
	/** The line, as path data in the 0–100 grid the plot's SVG is drawn on. */
	readonly line: string;
}

/**
 * The scale `GrowthChartWidget` computes: pad the series by a tenth of its own
 * range at each end, then cut that into `divisions` evenly spaced rows. The
 * padding is what keeps the line clear of the plot's edges, so the top and
 * bottom gridlines are never touched by it.
 */
export function growthScale(history: readonly GrowthPoint[], divisions: number): GrowthScale {
	const values = history.map((point) => point.value);
	const low = Math.min(...values);
	const high = Math.max(...values);

	const range = high - low;
	const padding = range === 0 ? Math.max(1, Math.round(Math.abs(high) * 0.1)) : Math.round(range * 0.1);
	const min = low - padding;
	const max = high + padding;

	const gridlines = Array.from({ length: divisions }, (_, i) => {
		const value = min + Math.round(((max - min) * i) / (divisions - 1));
		return { at: 100 - ((value - min) / (max - min)) * 100, label: compactCount(value) };
	});

	const points = values.map((value, i) => ({
		x: round(values.length === 1 ? 50 : (i / (values.length - 1)) * 100),
		y: round(100 - ((value - min) / (max - min)) * 100),
	}));

	return {
		gridlines,
		points,
		line: `M${points.map((point) => `${point.x} ${point.y}`).join("L")}`,
	};
}

/** One post type's price range, as `PriceBar` in `utils/mkit/mkit_pricing.dart`. */
export interface PriceBar {
	readonly label: string;
	readonly min: number;
	readonly max: number;
}

export interface PriceScale {
	/** `$563 - $1.4K` — `EstimatedPriceRange.label`, across every bar. */
	readonly headline: string;
	/** Five dashed rows: the axis top, then down to the baseline. */
	readonly gridlines: readonly Gridline[];
	readonly bars: readonly {
		readonly label: string;
		/** `$965–$1.4K`, the caption under the label. En dash, as in the app. */
		readonly range: string;
		/** Percentage across the plot, at the bar's centre. */
		readonly at: number;
		/** The floating bar itself, as percentages of the plot's height. */
		readonly bottom: number;
		readonly height: number;
	}[];
}

/**
 * Rounds an axis maximum up to a "nice" value so the gridlines land on clean
 * numbers — the app's `_niceMax`, e.g. 1400 → 2000, 80992 → 100000.
 */
function niceMax(value: number): number {
	if (value <= 0) return 100;
	const magnitude = 10 ** Math.floor(Math.log10(value));
	const normalized = value / magnitude;
	const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10;
	return nice * magnitude;
}

/**
 * The price chart's scale. Four gridline intervals from zero to a nice maximum,
 * and one floating bar per post type, laid out the way `BarChartAlignment.spaceAround`
 * does it: equal slots with a half-slot of air at each end of the plot.
 */
export function priceScale(bars: readonly PriceBar[], symbol: string): PriceScale {
	const top = niceMax(Math.max(...bars.map((bar) => bar.max)));
	const money = (value: number) => `${symbol}${compactMoney(value)}`;

	return {
		headline: `${money(Math.min(...bars.map((bar) => bar.min)))} - ${money(Math.max(...bars.map((bar) => bar.max)))}`,
		gridlines: Array.from({ length: 5 }, (_, i) => {
			const value = (top * i) / 4;
			return { at: 100 - (value / top) * 100, label: compactMoney(value) };
		}),
		bars: bars.map((bar, i) => ({
			label: bar.label,
			range: `${money(bar.min)}–${money(bar.max)}`,
			at: ((i + 0.5) / bars.length) * 100,
			bottom: (bar.min / top) * 100,
			height: ((bar.max - bar.min) / top) * 100,
		})),
	};
}

/** Two decimals is plenty for percentage geometry, and keeps the markup readable. */
const round = (value: number) => Number(value.toFixed(2));
