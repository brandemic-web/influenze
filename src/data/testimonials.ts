export interface Testimonial {
	name: string;
	company: string;
	quote: string;
}

/** All five are the same placeholder testimonial, as designed. Swap for real quotes. */
export const TESTIMONIALS: Testimonial[] = Array.from({ length: 5 }, () => ({
	name: "James Smith",
	company: "IPLIX",
	quote:
		"Influenze has completely transformed how we source creators for campaigns. What used to take days of research now takes just a few clicks.",
}));

export const TESTIMONIALS_HEADING = "What are they saying about us?";
export const TESTIMONIALS_BAND = "Real audiences. Real results.";
