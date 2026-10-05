import seo from "./objects/seo";
import comparisonCell from "./objects/comparisonCell";
import trustedByBox from "./objects/trustedByBox";
import trustedBySpacing from "./objects/trustedBySpacing";
import customScripts from "./objects/customScripts";
import blogCta from "./objects/blogCta";
import blogFaq from "./objects/blogFaq";
import siteSettings from "./documents/siteSettings";
import homePage from "./documents/homePage";
import pricingPage from "./documents/pricingPage";
import featuresPage from "./documents/featuresPage";
import blogIndex from "./documents/blogIndex";
import redirect from "./documents/redirect";
import blogPost from "./documents/blogPost";
import blogCategory from "./documents/blogCategory";
import blogAuthor from "./documents/blogAuthor";

export const schemaTypes = [
	// objects
	seo,
	comparisonCell,
	trustedByBox,
	trustedBySpacing,
	customScripts,
	blogCta,
	blogFaq,
	// singleton documents
	siteSettings,
	homePage,
	pricingPage,
	featuresPage,
	blogIndex,
	// non-singleton documents
	redirect,
	blogPost,
	blogCategory,
	blogAuthor,
];
