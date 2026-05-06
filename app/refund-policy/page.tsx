import { LegalPage } from "@/components/legal-page"

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="May 6, 2026"
      intro="This Refund Policy explains the current payment status for DESIGN.MD and how refund requests will be handled if paid subscriptions are enabled later."
      sections={[
        {
          title: "1. Current Payment Status",
          body: [
            "DESIGN.MD is not currently accepting payments through the public website.",
            "Checkout and payment integration code may be present for future use, but payment entry points are disabled unless explicitly re-enabled by the operator.",
          ],
        },
        {
          title: "2. Refund Window",
          body: [
            "If paid subscriptions are enabled later, you may request a refund within 7 days of the initial subscription purchase if you are not satisfied with the service.",
            "Refunds are not guaranteed after the 7-day window, but requests may be reviewed case by case for duplicate charges, technical billing errors, or other exceptional circumstances.",
          ],
        },
        {
          title: "3. Renewal Charges",
          body: [
            "Subscription renewals are generally non-refundable once a new billing period begins.",
            "You are responsible for cancelling before the next renewal date if you do not want to continue the subscription.",
          ],
        },
        {
          title: "4. Abuse and Excessive Use",
          body: [
            "Refund requests may be denied if there is evidence of abuse, prohibited use, excessive consumption of paid features, chargeback fraud, or violation of the Terms and Conditions.",
            "Access to paid features may be revoked when a refund is issued.",
          ],
        },
        {
          title: "5. How to Request a Refund",
          body: [
            "To request a refund, contact the DESIGN.MD operator through the support channel listed in your deployment or repository and include the account email, Lemon Squeezy order information, purchase date, and reason for the request.",
            "If Lemon Squeezy payments are enabled later, some refunds may need to be processed directly through Lemon Squeezy depending on merchant-of-record and payment processing requirements.",
          ],
        },
        {
          title: "6. Processing Time",
          body: [
            "Approved refunds are usually initiated promptly, but the time for funds to appear depends on Lemon Squeezy, the payment method, and your bank or card issuer.",
            "Refunding a subscription does not automatically delete your account or generated documents unless you separately request deletion.",
          ],
        },
      ]}
    />
  )
}
