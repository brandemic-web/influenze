import gsap from "gsap";

/**
 * GSAP horizontalLoop helper (official GSAP utility).
 * Builds a seamless, infinitely-looping timeline over a set of elements,
 * wrapping each item to the other end as it scrolls off. Playing forward
 * moves the items right-to-left.
 * https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop
 */
export function horizontalLoop(items: HTMLElement[], config: Record<string, any> = {}) {
	items = gsap.utils.toArray(items) as HTMLElement[];
	const tl = gsap.timeline({
		repeat: config.repeat,
		paused: config.paused,
		defaults: { ease: "none" },
		onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
	});
	const length = items.length;
	const startX = items[0].offsetLeft;
	const times: number[] = [];
	const widths: number[] = [];
	const xPercents: number[] = [];
	const pixelsPerSecond = (config.speed || 1) * 100;
	const snap = config.snap === false ? (v: number) => v : gsap.utils.snap(config.snap || 1);

	gsap.set(items, {
		xPercent: (i: number, el: Element) => {
			const w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string));
			xPercents[i] = snap(
				(parseFloat(gsap.getProperty(el, "x", "px") as string) / w) * 100 +
					(gsap.getProperty(el, "xPercent") as number)
			);
			return xPercents[i];
		},
	});
	gsap.set(items, { x: 0 });

	const totalWidth =
		items[length - 1].offsetLeft +
		(xPercents[length - 1] / 100) * widths[length - 1] -
		startX +
		items[length - 1].offsetWidth * (gsap.getProperty(items[length - 1], "scaleX") as number) +
		(parseFloat(config.paddingRight) || 0);

	for (let i = 0; i < length; i++) {
		const item = items[i];
		const curX = (xPercents[i] / 100) * widths[i];
		const distanceToStart = item.offsetLeft + curX - startX;
		const distanceToLoop = distanceToStart + widths[i] * (gsap.getProperty(item, "scaleX") as number);
		tl.to(
			item,
			{
				xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
				duration: distanceToLoop / pixelsPerSecond,
			},
			0
		).fromTo(
			item,
			{ xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
			{
				xPercent: xPercents[i],
				duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
				immediateRender: false,
			},
			distanceToLoop / pixelsPerSecond
		);
		times[i] = distanceToStart / pixelsPerSecond;
	}

	return tl;
}
