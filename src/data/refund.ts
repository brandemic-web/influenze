import { LEGAL_CONTACT_EMAIL, LEGAL_UPDATED } from "./legal";
import type { LegalClause, LegalDoc } from "./legal";
import { TERMS } from "./terms";

/**
 * Cancellation and Refund Policy, required by the payment gateway. It holds no
 * wording of its own beyond the preamble and contact line: every clause is read
 * out of the Terms' payment section, so the two pages cannot drift apart.
 */
const PAYMENT_ID = "payment-facility-and-credits";
const payment = TERMS.sections.find((section) => section.id === PAYMENT_ID);
if (!payment?.clauses) throw new Error(`refund.ts: Terms section "${PAYMENT_ID}" is missing`);

// The number the section renders with on /terms, counted the way LegalDocument does.
const paymentNumber = TERMS.sections.filter((section) => !section.unnumbered).indexOf(payment) + 1;

/** Fails the build if counsel rewords a clause, rather than quoting stale text. */
function clause(opening: string): LegalClause {
	const found = payment!.clauses!.find((c) => c.text.startsWith(opening));
	if (!found) throw new Error(`refund.ts: no Terms clause starts "${opening}"`);
	return found;
}

export const REFUND: LegalDoc = {
	eyebrow: "Legal",
	title: "Cancellation and Refund Policy",
	description:
		"How refunds, Credits and subscription fees work on influenze.ai, as set out in the Terms of Service.",
	updated: LEGAL_UPDATED,
	preamble: [
		`The provisions below are reproduced from section ${paymentNumber} (${payment.title}) of the Terms of Service, which govern your use of the Platform in full.`,
	],
	sections: [
		{
			id: "refunds",
			title: "Refunds",
			clauses: [
				clause("All payments made are non-refundable."),
				clause("If a User has subscribed through the Apple App Store"),
			],
		},
		{
			id: "credits",
			title: "Credits",
			clauses: [
				clause("The Credits may be utilized"),
				clause("The Credits shall remain valid"),
			],
		},
		{
			id: "fee-changes",
			title: "Changes to Fees",
			clauses: [clause("The Company reserves the right to modify the subscription fees")],
		},
		{
			id: "contact",
			title: "Questions About a Payment",
			intro: [`Write to us at ${LEGAL_CONTACT_EMAIL}.`],
		},
	],
};
