import { LegalPage } from "@/components/legal-page"

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      updated="May 6, 2026"
      intro="These Terms and Conditions govern access to and use of DESIGN.MD, including the website, AI-assisted generation features, authentication, and related services."
      sections={[
        {
          title: "1. Acceptance of Terms",
          body: [
            "By accessing or using DESIGN.MD, you agree to these Terms and Conditions. If you do not agree, do not use the service.",
            "You are responsible for ensuring that your use of DESIGN.MD complies with all laws, rules, and contractual obligations that apply to you.",
          ],
        },
        {
          title: "2. Service Description",
          body: [
            "DESIGN.MD generates design-system documentation from website URLs using automated extraction and AI-assisted analysis.",
            "Generated output may include Markdown documentation, verified color data, typography guidance, layout recommendations, and component guidance. Output is provided for informational and workflow support purposes.",
          ],
        },
        {
          title: "3. Accounts and Authentication",
          body: [
            "Authentication is provided through Clerk. You are responsible for maintaining the confidentiality of your account and for all activity under your account.",
            "You must provide accurate account information and may not use the service to impersonate another person or entity.",
          ],
        },
        {
          title: "4. Billing Status",
          body: [
            "DESIGN.MD is not currently accepting payments through the public website.",
            "Paid plan and checkout code may exist in the application for future use, but payment entry points are disabled unless they are explicitly re-enabled by the operator.",
          ],
        },
        {
          title: "5. User Responsibilities",
          body: [
            "You may only submit URLs and content that you are legally permitted to process.",
            "You may not use DESIGN.MD to abuse third-party websites, overload infrastructure, evade access controls, scrape prohibited content, or generate unlawful material.",
          ],
        },
        {
          title: "6. AI Output",
          body: [
            "AI-generated analysis may contain inaccuracies or incomplete recommendations. You are responsible for reviewing generated output before relying on it in production.",
            "DESIGN.MD attempts to separate verified source-backed colors from AI-generated guidance, but you should independently verify critical design and implementation decisions.",
          ],
        },
        {
          title: "7. Availability and Changes",
          body: [
            "The service may change, pause, or stop at any time. Features may be added, removed, or modified without prior notice.",
            "We may update these Terms and Conditions from time to time. Continued use after changes means you accept the updated terms.",
          ],
        },
        {
          title: "8. Limitation of Liability",
          body: [
            "DESIGN.MD is provided as is and as available. To the maximum extent permitted by law, we disclaim warranties and are not liable for indirect, incidental, special, consequential, or punitive damages.",
            "Nothing in these terms limits liability where such limitation is prohibited by law.",
          ],
        },
      ]}
    />
  )
}
