import divoLogo from "../assets/images/common/logos_and_icons/divo_logo.png";
import hammerheadLogo from "../assets/images/home_page/trusted_by/hammerhead_logo.svg";
import hyperLogo from "../assets/images/home_page/trusted_by/hyper_logo.svg";

export const CUSTOMER_TESTIMONIALS = {
	heading: "Teams already use Influenze *to find creators faster.*",
	testimonials: [
		{
			company: "Hyper",
			logo: hyperLogo,
			monochromeLogo: false,
			statement: "Scout creators beyond India with one discovery tool.",
			quote: "We'd tried a few discovery tools before Influenze. It's the one we kept, mostly because the data goes well beyond India, so we can scout creators for any market.",
		},
		{
			company: "Hammerhead Global",
			logo: hammerheadLogo,
			monochromeLogo: false,
			statement: "Vet creators faster with pricing and audience quality.",
			quote: "Working out what a creator should cost used to be guesswork. Influenze shows us pricing and audience quality together, which makes vetting much quicker.",
		},
		{
			company: "Divo",
			logo: divoLogo,
			monochromeLogo: true,
			statement: "Go from a campaign brief to a creator shortlist.",
			quote: "Influenze makes finding influencers easy. We go from a brief to a shortlist without the usual digging.",
		},
	],
};
