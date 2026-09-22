import seo from "./objects/seo";
import comparisonCell from "./objects/comparisonCell";
import trustedByBox from "./objects/trustedByBox";
import trustedBySpacing from "./objects/trustedBySpacing";
import customScripts from "./objects/customScripts";
import siteSettings from "./documents/siteSettings";
import homePage from "./documents/homePage";
import pricingPage from "./documents/pricingPage";
import featuresPage from "./documents/featuresPage";
import redirect from "./documents/redirect";

export const schemaTypes = [
	// objects
	seo,
	comparisonCell,
	trustedByBox,
	trustedBySpacing,
	customScripts,
	// singleton documents
	siteSettings,
	homePage,
	pricingPage,
	featuresPage,
	// non-singleton documents
	redirect,
];
