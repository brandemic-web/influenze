export interface Faq {
	question: string;
	answer: string;
	/** True where the design supplied no answer copy (see NOTES.md #1). */
	placeholder?: boolean;
}

// TODO: only the fraud-detection answer exists in the design. Every entry
// marked `placeholder: true` needs real copy before launch.
const PLACEHOLDER_ANSWER =
	"Answer copy pending — this question has no answer in the design file.";

export const FAQS: Faq[] = [
	{
		question: "What is Influenze.ai and who is it built for?",
		answer: PLACEHOLDER_ANSWER,
		placeholder: true,
	},
	{
		question: "How accurate is the fraud detection?",
		answer:
			"Our multi-model AI runs every creator through 12+ distinct fraud signals in real-time. This includes fake follower percentage, bot-driven engagement pods, comment quality and authenticity, suspicious follower growth spikes, audience demographic inconsistencies, and giveaway-inflated metrics.",
	},
	{
		question: "How fresh is the data — how often does it update?",
		answer: PLACEHOLDER_ANSWER,
		placeholder: true,
	},
	{
		question: "Can my whole team use it?",
		answer: PLACEHOLDER_ANSWER,
		placeholder: true,
	},
	{
		question: "How do I share reports with clients or stakeholders?",
		answer: PLACEHOLDER_ANSWER,
		placeholder: true,
	},
	{
		question: "Is there a free trial, and what's included?",
		answer: PLACEHOLDER_ANSWER,
		placeholder: true,
	},
];

export const FAQ_HEADING = "Questions we get asked a lot";
export const FAQ_SUBCOPY =
	"Still have questions? Our team is made up of real people who've worked in influencer marketing.";
