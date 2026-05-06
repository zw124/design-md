import { LegalPage } from "@/components/legal-page"

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="May 6, 2026"
      intro="This Refund Policy explains the current payment status for DESIGN.MD."
      sections={[
        {
          title: "1. Current Payment Status",
          body: [
            "DESIGN.MD does not accept payments through the public website.",
            "There are no public paid plans, checkout pages, or subscription charges.",
          ],
        },
        {
          title: "2. Refund Window",
          body: [
            "Because DESIGN.MD does not currently collect payments, there are no DESIGN.MD subscription charges to refund.",
            "If you believe you were charged in error by a third-party service, contact that service provider or your payment method provider directly.",
          ],
        },
        {
          title: "3. Renewal Charges",
          body: [
            "DESIGN.MD does not currently operate subscription renewals.",
            "No cancellation is required for DESIGN.MD billing because there is no active billing flow.",
          ],
        },
        {
          title: "4. Abuse and Excessive Use",
          body: [
            "Access to DESIGN.MD may still be limited or revoked if there is evidence of abuse, prohibited use, automated overload, or violation of the Terms and Conditions.",
            "These access decisions are separate from refunds because DESIGN.MD does not currently process payments.",
          ],
        },
        {
          title: "5. How to Request a Refund",
          body: [
            "For account or data questions, contact the DESIGN.MD operator through the support channel listed in your deployment or repository.",
            "Do not send payment card information or sensitive financial information through support requests.",
          ],
        },
        {
          title: "6. Processing Time",
          body: [
            "DESIGN.MD does not process refunds because it does not currently process payments.",
            "Account or generated document deletion requests are handled separately from payment questions.",
          ],
        },
      ]}
    />
  )
}
