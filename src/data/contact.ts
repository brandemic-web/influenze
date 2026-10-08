import { COMPANY_ADDRESS, COMPANY_NAME, GRIEVANCE_ROWS, LEGAL_CONTACT_EMAIL } from "./legal";
import type { LegalDoc } from "./legal";

/**
 * Contact Us, required by the payment gateway alongside the policies. Every
 * detail is the one the Terms and Privacy Policy already publish, read from
 * legal.ts. The phone number stays in the grievance block — it is the officer's
 * own mobile, not a support line.
 */
export const CONTACT: LegalDoc = {
	eyebrow: "Contact",
	title: "Contact Us",
	description: `How to reach the team behind influenze.ai — email, registered office and grievance officer of ${COMPANY_NAME}.`,
	preamble: [
		`influenze.ai is owned and operated by ${COMPANY_NAME}. For questions about your account, billing or the Platform, write to ${LEGAL_CONTACT_EMAIL}.`,
	],
	sections: [
		{
			id: "email",
			title: "Email",
			unnumbered: true,
			contact: [
				{ label: "Email", value: LEGAL_CONTACT_EMAIL, href: `mailto:${LEGAL_CONTACT_EMAIL}` },
			],
		},
		{
			id: "registered-office",
			title: "Registered Office",
			unnumbered: true,
			contact: [
				{ label: "Company", value: COMPANY_NAME },
				{ label: "Address", value: COMPANY_ADDRESS },
			],
		},
		{
			id: "grievance-officer",
			title: "Grievance Officer",
			unnumbered: true,
			intro: [
				"For complaints or grievances under the Terms of Service or the Privacy Policy, write to the designated officer below.",
			],
			contact: GRIEVANCE_ROWS,
		},
	],
};
