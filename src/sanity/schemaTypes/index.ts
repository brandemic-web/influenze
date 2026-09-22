import seo from "./objects/seo";
import comparisonCell from "./objects/comparisonCell";
import trustedByBox from "./objects/trustedByBox";
import trustedBySpacing from "./objects/trustedBySpacing";
import linkItem from "./objects/linkItem";
import navItem from "./objects/navItem";
import footerColumn from "./objects/footerColumn";
import articleImage from "./objects/articleImage";
import articleCta from "./objects/articleCta";
import customScripts from "./objects/customScripts";
import siteSettings from "./documents/siteSettings";
import homePage from "./documents/homePage";
import pricingPage from "./documents/pricingPage";
import featuresPage from "./documents/featuresPage";
import category from "./documents/category";
import author from "./documents/author";
import post from "./documents/post";
import redirect from "./documents/redirect";

export const schemaTypes = [
	// objects
	seo,
	comparisonCell,
	trustedByBox,
	trustedBySpacing,
	linkItem,
	navItem,
	footerColumn,
	articleImage,
	articleCta,
	customScripts,
	// singleton documents
	siteSettings,
	homePage,
	pricingPage,
	featuresPage,
	// blog documents
	category,
	author,
	post,
	// non-singleton documents
	redirect,
];
