import { GRIEVANCE_ROWS, LEGAL_CONTACT_EMAIL, LEGAL_UPDATED } from "./legal";
import type { LegalDoc } from "./legal";

/**
 * Privacy Policy, transcribed verbatim from the counsel-issued draft dated
 * 18 August 2026. Clause order and wording are the lawyers' — only the blanks
 * left in that draft are filled here, from the constants in ./legal.ts.
 */
export const PRIVACY: LegalDoc = {
	eyebrow: "Legal",
	title: "Privacy Policy",
	description:
		"How Dotme Technologies Private Limited collects, uses, shares and protects information in connection with influenze.ai.",
	updated: LEGAL_UPDATED,
	preamble: [
		"Welcome to influenze.ai along with its associated sub-domains, sites, applications, platforms, services, features, application programming interfaces (APIs) and tools (as applicable) (collectively “Platform”), owned by Dotme Technologies Private Limited, a company incorporated under the Companies Act, 2013 and having its registered office address at 1612, Ground floor, 7th Cross, 19th Main Road, 1st Sector, HSR Layout, Bengaluru, Karnataka – 560102 (“Company”). The Company is, inter alia, engaged in the business of providing a discovery, influencer intelligence and analytics platform that enables brands, agencies, talent managers and other businesses to discover, analyse, and evaluate creators and influencers across various social media platforms.",
		"The Company is committed to respecting your online privacy and recognizes your need for appropriate protection and management of any information you share with the Company on the Platform. This privacy policy (“Policy”) explains how the Company will collect, use, share and process Information (defined below) in relation to the services provided on the Platform, including Information obtained directly from you, and/or through your use of the Platform.",
		"This Policy shall be deemed to be incorporated into the terms of use of the Platform (“Terms”) and shall be read in addition to the Terms. In the event of any conflict between this Policy and the Terms, the interpretation placed by the Company shall be final and binding on you.",
		"By accepting this Policy through an affirmative action, you provide free, specific, informed, unconditional and unambiguous consent to the Company and understand and agree to the collection, use, sharing and processing of Personal Information (defined below). If you provide the Company with Personal Information about someone else, you confirm that: (a) such Personal Information is accurate and up-to-date; (b) such person is aware that you have provided their Personal Information; and (c) they consent to both, the disclosure and the use/processing of their Personal Information in accordance with this Policy. This Policy applies to all the current and former visitors, users, subscribers and others who access this Platform as well as individuals who interact with customer support, respond to surveys, or engage in any business dealings with the Company. For avoidance of doubt, this Policy also applies, to the extent applicable, to information relating to creators, influencers or other individuals whose publicly available information is accessed, analysed or displayed through the Platform in accordance with applicable law and the terms governing the relevant third-party platforms.",
	],
	sections: [
		{
			id: "scope",
			title: "Scope",
			clauses: [
				{ text: "This Policy is an electronic record in the form of an electronic contract and does not require any physical, electronic or digital signature." },
				{ text: "By agreeing or accessing or using the Platform, giving the Company your Information or otherwise clicking to accept this Policy, if and when prompted on the Platform, you undertake that you have the capacity to enter into a legally binding contract under this Policy, which constitutes a legally binding document between you and the Company under the applicable law. The Company will collect and process your Personal Information and third-party data carefully, only for the purposes described in this Policy and only to the extent necessary as defined herein and within the scope of the applicable legal regulations. This Policy seeks to ensure that any Personal Information or third-party information handled by the Company is managed in a way that is ethical, compliant and adheres to best industry practices." },
				{ text: "Please read the terms and conditions of this Policy carefully, before accepting the same and/or accessing or using this Platform. By accessing or using the Platform including its services or otherwise clicking to accept this Policy, if and when prompted on the Platform, you agree to the terms of this Policy. If you are accepting this Policy on behalf of another person or company or other legal entity, you represent and warrant that you have full authority to bind such person, company or legal entity to these terms. If you are accepting this Policy on behalf of a child or a person with disability, you represent and warrant that you are a parent or legal guardian of such a child or a person with disability, as the case may be." },
			],
		},
		{
			id: "consent",
			title: "Consent",
			intro: [
				"By performing the affirmative action, as deemed fit by the Company, you freely, unconditionally, unambiguously and expressly consent to the Company’s specified use and disclosure of your Personal Information, including SPDI (defined below) and third-party information in accordance with this Policy. If you do not agree with the terms of this Policy, please do not accept this Policy or use the Platform.",
			],
		},
		{
			id: "types-of-information",
			title: "Types of Information",
			clauses: [
				{ text: "Personal Information: Personal Information means any information that may be used to identify an individual, including, but not limited to, the first and last names, address, telephone number, date of birth, age, gender, e-mail address, occupation, social media handles, or any other contact information, financial information including bank account details, credit/debit card details or such other payment information (as the case may be) or any publicly available data such as information from public social media profiles, blogs, websites, images, videos, playlists, posts, audience statistics, engagement metrics, creator analytics and usage statistics available on any of the social media platforms or other publicly accessible sources, sexual orientation, passwords, and physical information (“Personal Information”). The Company limits the collection of Personal Information to that which is necessary for its intended purpose." },
				{ text: "Business Information: Business Information means any information that may be used to identify an individual’s business, including but not limited to the name and address of the entity, brand name of the entity, date of incorporation, e-mail address of the entity, contact information of the registered office, company identification number (CIN), GST Number, AADHAAR verified signature, authorised signatory, financial information including bank account details and cancelled cheque, PAN details, names of the directors and such other information (“Business Information”)." },
				{ text: "Non-Personal Information: Non-personal information means information that does not specifically identify an individual or business, but includes information from you, such as your browser type, the URL of the previous platforms you visited, your Internet Service Provider (ISP), operating system and your Internet Protocol (IP) address. The Company may gather any non-personal information regarding how many people visit the Platform, the pages they visit, their IP address, and the type of browser they used while visiting the Platform, versions, time zone settings and locations, operating systems, applications installed on your device, device ID, device manufacturer and type, device, connection information, screen resolution, usage statistics, default communication applications, other technology on the devices you use to access the Platform, and/or services availed by a user and aggregated or anonymised analytics generated through the use of the Platform. Such information shall also include all such Personal Information collected and stored by the Company that undergoes the process of de-identification and is no more identifiable to you or any natural person (“Non-Personal Information”). The Company may also collect Non-Personal Information that you voluntarily provide, such as information included in response to a questionnaire or a survey conducted by the Company." },
				{ text: "Usage Information: Usage Information includes without limitation all data and information collected automatically through the Platform (or through the third-party analytics service providers), by use and access of the Platform in the nature of system administrative data, statistical and demographical data, and operational information and data generated by or characterizing use of the Platform including without limitation Non-Personal Information, cookies, Platform traffic, time spent on the Platform, number of visits to the Platform and other similar information and behaviour indicating the mode and manner of use of the Platform ( “Usage Information”)." },
				{ text: "Personal Information, Business Information, Non-Personal Information and Usage Information hereinafter shall be collectively referred to as “Information”." },
			],
		},
		{
			id: "purpose-of-processing-of-personal-information",
			title: "Purpose of Processing of Personal Information",
			clauses: [
				{ text: "The Company may request to collect Information from you when you: (a) register on the Platform in accordance with the procedure set forth in the Terms; (b) use the Platform for any of the services being offered thereon (including, when you report a problem with the Platform and/or the services); (c) voluntarily participate in campaigns conducted by the Company on the Platform or respond to questionnaires published by the Company on the Platform (if any); (d) voluntarily complete a customer survey or provide feedback on any of our message boards or via e-mail in relation to the services provided on the Platform or submit comments on the Platform; (e) connect, link or otherwise authorise the Platform to access your account(s) on third-party platforms or services, where applicable; and (f) when you carry out transactions on the Platform." },
				{ text: "You hereby acknowledge and agree that all Information is provided by you to the Company voluntarily and the Information provided by you is not subject to any undue influence." },
				{ text: "The Company may use cookies to monitor the Platform usage in accordance with paragraph 11 of this Policy including, without limitation, to provide useful features to simplify your experience when you return to the Platform, like remembering your login id, Information and to deliver relevant content based on your preferences, usage patterns and location." },
				{ text: "The Company may also collect Non-Personal Information or Usage Information based on your browsing activity and in relation to your use or access to the Platform like your browser type, your Internet Protocol (IP) address, your operating system, your prior search results etc., which may or may not be publicly accessible, including aggregated or anonymised usage analytics generated through your use of the Platform." },
				{ text: "Information collected by the Company from a particular browser or device may be used with another computer or device that is linked to the browser or device on which such information was collected." },
				{ text: "You may use the Platform without providing the Company any Information about yourself. However, you may not be able to access certain services of the Platforms in case you choose to do so." },
			],
		},
		{
			id: "purpose-and-use-of-information",
			title: "Purpose and Use of Information",
			clauses: [
				{ text: "The Company uses the Information you provide only to: (a) manage your account (including, maintenance of records of payments and other transactions that take place under your account on the Platform); (b) fulfil your requests for the services offered on the Platform; (c) provide you with information about the services available on the Platform and offer you other services that the Company believes may be of interest to you; (d) resolve any glitches on the Platform including addressing any technical problems; (e) improve the services and content on the Platform and your experience of navigating through the Platform and carrying out transactions on the Platform; (f) provide, operate, maintain and enhance the features and functionalities of the Platform, including creator discovery, analytics and related services; and (g) manage the Company’s relationship with you." },
				{ text: "The Company may use your Non-Personal Information or Usage Information for internal business purposes, such as data analysis, research, developing new services, enhancing and improving existing services and identifying usage trends." },
				{ text: "Subject to and in accordance with applicable laws, the Company has the right to use your Information for the purpose of conducting promotional/marketing related activities on the Platform. For conducting such promotional/marketing activities on the Platform, the Company may make a request to you, using your Personal Information for making posters/banners to promote the services of the Company." },
				{ text: "When you send an email message or otherwise contact the Company through the Platform, the Company may use the Information provided by you to respond to your communication by way of messages on the Platform, Short Message Service (SMS), email or any other communication channels. The Company may also archive such Information and/or use it for future communications with you to inform you regarding updates, newsletters, offers, new services and promotions." },
			],
		},
		{
			id: "information-sharing",
			title: "Information Sharing",
			intro: [
				"The Company maintains your Information in electronic form on its servers, devices and on the equipment of the Company’s employees. The Information is made accessible to employees, agents or partners and third-parties only on a need-to-know basis.",
			],
		},
		{
			id: "third-party-service-providers",
			title: "Third-Party Service Providers",
			clauses: [
				{ text: "The Company may engage third-party vendors and/or contractors to perform certain support services for the Company, including, without limitation, software maintenance services, advertising and marketing services, web hosting services, analytics services, artificial intelligence and machine learning services, application programming interface (API) services, and such other related services which are required by the Company to provide its services efficiently. These third-parties may have limited access to Information. If they do, this limited access is provided so that they may perform these tasks for the Company and they are not authorized by the Company to otherwise use or disclose Information, except to the extent required by law." },
				{ text: "The Platform may contain links and interactive functionality interacting with the websites, platforms or services of third-parties. The Company is not responsible for and has no liability for the functionality, actions, inactions, privacy settings, privacy policies, terms, or content of any such websites, platforms or services. Before enabling any sharing functions or connecting your account with any third-party platform or service to communicate with any such websites or otherwise visiting any such websites, the Company strongly recommends that you review and understand the terms and conditions, privacy policies, settings, and information-sharing functions of each such third-party websites, platform or service." },
			],
		},
		{
			id: "control-over-your-personal-information",
			title: "Control Over Your Personal Information",
			clauses: [
				{ text: `You may at any time submit a request to access information regarding the processing of your Personal Information by submitting a written request to the Company at ${LEGAL_CONTACT_EMAIL}. Upon receipt of such request, the Company shall provide a summary of the relevant processing activities including identities of the third-parties with whom such Personal Information is shared.` },
				{ text: `You have the right to withdraw your consent at any point. You can withdraw your consent in writing through an email at ${LEGAL_CONTACT_EMAIL} requesting the same. If you at any time wish to rectify, access, update or erase your Personal Information, you may write to the Company as per paragraph 9 of this Policy.` },
				{ text: "Once you withdraw your consent to share the Personal Information collected by the Company for the purpose specified herein, the Company shall immediately cease to fulfil the purposes for which the said Personal Information was sought and the Company may restrict you from using the Services on the Platform and/or the Platform itself." },
			],
		},
		{
			id: "rectification-correction-erasure-updation-of-personal-information",
			title: "Rectification / Correction / Erasure / Updation of Personal Information",
			clauses: [
				{ text: "You shall have the right to review your Personal Information submitted by you on the Platform and to modify, correct, erase, complete, update or delete any Personal Information, provided by you directly on the Platform. You hereby understand that any such modification, correction, completion, updation, erasure, or deletion may affect your ability to use the Platform. Further, it may affect the Company’s ability to provide its services to you." },
				{ text: "The Company reserves the right to verify and authenticate your information in order to ensure accurate delivery of services. Access to or correction, erasure, updation or deletion of your Personal Information may be denied or limited by the Company if it would violate another person’s rights and/or is not otherwise permitted by applicable law." },
				{ text: `If you need to update, erase or correct your Personal Information that the Company may have collected to offer you personalized services and offers, you may send updates, request for erasure and corrections to the Company at ${LEGAL_CONTACT_EMAIL} citing the reason for such rectification or erasure of Personal Information. The Company will take all reasonable efforts to incorporate the changes within a reasonable period of time.` },
			],
		},
		{
			id: "term-of-storage-of-personal-information",
			title: "Term of Storage of Personal Information",
			clauses: [
				{ text: "The Company shall store your Personal Information at least for such period as may be required and permitted by law or for a period necessary to satisfy the purpose for which the Personal Information has been collected. These periods vary depending on the nature of the Information and your interactions with the Company. Upon expiry of such period, the Company may delete, anonymise or de-identify such Personal Information, unless its retention is required under applicable law." },
				{ text: "The Company may store Non-Personal Information and Usage Information received from you till such time it requires, provided such storage and retention is in accordance with applicable law." },
				{ text: "You agree that you will not submit any false information or any illegal or damaging content to the Platform." },
				{ text: "The Company reserves the right to terminate access to or the ability to interact with the Platform in response to any concerns the Company may have about false, illegal, or damaging content, or for any other reason, in its sole discretion." },
			],
		},
		{
			id: "cookies",
			title: "Cookies",
			clauses: [
				{ text: "To enhance your experience with the Platform, many of the web pages use \"cookies” and pixel tags and clear gifts on certain pages of the Platform or other tracking technologies to distinguish you from other users of the services and to remember your preferences on the Platform. This helps the Company to provide you with a good experience when you use the services on the Platform and also allows the Company to improve such services. Cookies are text files the Company places in your mobile phone, tablet or other devices to store your preferences. Cookies, by themselves, do not tell the Company your e-mail address or other personally identifiable information unless you choose to provide this information to the Company by, for example, registering on the Platform. They are designed to hold a marginal amount of data specific to a particular user and Platform and can be accessed either by the web server or the user device. However, once you choose to furnish the Platform with personally identifiable information, this information may be linked to the data stored in the cookie. The Company may also use cookies and similar tracking technologies to analyse Platform traffic, remember user preferences, improve the functionality and performance of the Platform, and enhance your overall user experience on the Platform. For example, the Company may use cookies to personalize your experience on the Platform (e.g., to recognize you by name when you return to the Platform), save your password in password-protected areas, and enable you to use services on the Platform. The Company may also use cookies to offer you products, programs, or services. Cookies may be placed on the Platform by third-parties as well, the use of which the Company does not control." },
				{ text: "Session cookies are automatically deleted from your hard drive once a session ends, and most cookies are session cookies. If your browser permits, you may decline the cookies, however, if you decline the cookies, you may be unable to use certain features on the Platform and you may be required to re-enter your password frequently. You may opt to leave the cookie turned on." },
			],
		},
		{
			id: "right-to-nominate",
			title: "Right to Nominate",
			clauses: [
				{ text: "You have the right to nominate any individual who shall exercise rights on your behalf in the event of your death or any incapacity." },
				{ text: `You may submit such request of nomination in writing at ${LEGAL_CONTACT_EMAIL} and specify such reasons for nomination.` },
			],
		},
		{
			id: "disclosure-to-acquirers",
			title: "Disclosure to Acquirers",
			intro: [
				"The Company may disclose and/or transfer Information to an investor, acquirer, assignee or other successor entity in connection with a sale, merger, or reorganization of all or substantially all of the Company’s equity, business or assets.",
			],
		},
		{
			id: "protection-of-information",
			title: "Protection of Information",
			clauses: [
				{ text: "The Company considers the confidentiality and security of your information to be of utmost importance. It therefore uses industry standards, and physical, technical and administrative security measures to keep Information confidential and secure and the Company will not share your Information with third-parties, except as otherwise provided in this Policy. Please be advised that, however, while the Company strives to protect Information and privacy, the Company cannot guarantee or warrant its absolute security when Information is transmitted over the internet into the Platform. The Company will periodically evaluate this necessity considering your privacy and our relation while keeping the applicable legislation in mind." },
				{ text: "For any loss or theft of Information, due to unauthorized access to your device through which you use the Platform or other reasons solely attributable to you, the Company shall not be held liable or responsible under any circumstance whatsoever. Further, the Company shall not be responsible for any breach of security or for any actions of any third-parties or events that are beyond the Company’s reasonable control including but not limited to acts of government, computer hacking, unauthorised access to computer data and storage device, computer crashes, breach of security and encryption, poor quality of Internet service or telephone service of the user, etc." },
			],
		},
		{
			id: "minor-and-usage-on-behalf-of-another-person",
			title: "Minor & Usage on Behalf of Another Person",
			intro: [
				"The Company does not intend to attract anyone under the relevant age of consent or person with disability to enter into binding legal contracts under the applicable law. The Company does not intentionally or knowingly collect Personal Information through the Platform from anyone under that age or person with disability. The Company encourages parents and guardians to be involved in the online activities of minor and person with disability to ensure that no Personal Information is collected from a minor and person with disability without their prior consent. If you are using the Platform on behalf of someone else, including but not limited to, on behalf of your minor child/children/employer or person with disability, you represent and warrant that you are authorised by such person to accept this Policy on their behalf and to consent on behalf of such person to the Company’s use of such person’s Personal Information as described in this Policy. If you are accepting this Policy on behalf of a child or person with disability, you represent and warrant that you are a parent or legal guardian of such a child or person with disability, as the case may be.",
			],
		},
		{
			id: "limitation-of-liability",
			title: "Limitation of Liability",
			clauses: [
				{ text: "The Company shall not be liable to you for any loss of profit, production, anticipated savings, goodwill or business opportunities or any type of direct or indirect, incidental, economic, compensatory, punitive, exemplary or consequential losses arising out of performance or non-performance of its obligations under this Policy." },
				{ text: "The Company is not responsible for any actions or inactions of any third parties that receive your Information or any third-party platforms, service providers or integrations that you choose to access, connect with or use through the Platform." },
				{ text: "Notwithstanding anything contained in this Policy or elsewhere, the Company shall not be held responsible for any loss, damage or misuse of your Information, if such loss, damage or misuse is attributable to a Force Majeure Event. “Force Majeure Event” shall mean any event that is beyond the reasonable control of the Company and shall include, without limitation, sabotage, fire, flood, explosion, acts of God, civil commotion, strikes, lockouts or industrial action of any kind, riots, insurrection, war, acts of government, computer hacking, civil disturbances, unauthorised access to computer data and storage device, computer crashes, breach of security and encryption, pandemic or national/state lockdown due to any reason and any other similar events not within the control of the Company and which the Company is not able to overcome." },
			],
		},
		{
			id: "opt-out",
			title: "Opt-Out",
			intro: [
				"Once you register as a user on the Platform, and/or use and access the Platform, you may receive communications, including but not limited to emails, Short Message Service (SMS), phone calls and other electronic communications from the Company on the registered mobile number and e-mails on your registered e-mail address (as applicable). These messages, e-mails, calls and communications could relate to your registration, transactions that you carry out through the Platform and promotions that are undertaken by the Company and other digital communications. You have the option to 'opt-out' of all Company’s newsletters and other general email marketing and promotional communications from the Company by way of links provided at the bottom of the mailers or by contacting the customer service team of the Company. It is hereby clarified that in the event of such opt-out, communications pertaining to transactions and services shall continue. The Company respects your privacy and in the event that you choose to not receive such mailers, the Company shall take all adequate steps to remove you from such lists. However, you will not be able to opt-out of receiving administrative messages, customer service responses or other transactional communications.",
			],
		},
		{
			id: "governing-law-and-dispute-resolution",
			title: "Governing Law and Dispute Resolution",
			clauses: [
				{ text: "In the event of any Personal Information breach or violation of any of your rights and obligations under this Policy by the Company, you shall have the right to make a complaint to the Data Protection Board to investigate the alleged violation." },
				{ text: "This Policy shall be governed by and interpreted and construed in accordance with the laws of India. The place of jurisdiction shall exclusively be in Bengaluru. In the event of any dispute arising out of this Policy the same shall be settled by a binding arbitration conducted by a sole arbitrator, appointed jointly by both parties and governed by the Arbitration and Conciliation Act, 1996 as amended from time to time. The venue and seat of arbitration shall be Bengaluru." },
			],
		},
		{
			id: "grievance-redressal-mechanism",
			title: "Grievance Redressal Mechanism",
			intro: [
				"For registering your concerns, complaint or grievances, please write to the below mentioned designated officer of the Company at the below-mentioned email address in relation to any violation of this Policy or the applicable laws. The designated officer shall redress the concerns, complaint or grievances in accordance with the applicable laws.",
			],
			contact: GRIEVANCE_ROWS,
		},
		{
			id: "contact-details",
			title: "Contact Details",
			intro: [
				`If you have any questions or concerns about this Policy, you may contact the Company at ${LEGAL_CONTACT_EMAIL}.`,
			],
		},
	],
};
