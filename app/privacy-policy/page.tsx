import { LegalPage } from "@/components/legal-page"

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="May 6, 2026"
      intro="This Privacy Policy explains how DESIGN.MD collects, uses, and stores information when you use the website and generation service."
      sections={[
        {
          title: "1. Information We Collect",
          body: [
            "We collect account information provided through Clerk, such as your user identifier, email address, and basic profile details.",
            "We collect submitted URLs, generated Markdown output, extracted color data, billing status, and service usage metadata needed to operate the product.",
          ],
        },
        {
          title: "2. Authentication",
          body: [
            "Authentication is handled by Clerk. Clerk may process login credentials, session data, device information, and security information according to its own privacy practices.",
            "DESIGN.MD stores the Clerk user identifier so generated documents and subscription status can be associated with your account.",
          ],
        },
        {
          title: "3. Payments",
          body: [
            "Payments and checkout are handled by Lemon Squeezy. DESIGN.MD does not store full payment card numbers.",
            "We store billing-related identifiers, subscription tier, subscription status, customer identifiers, variant identifiers, and webhook payloads needed to keep account access accurate.",
          ],
        },
        {
          title: "4. Database and Hosting",
          body: [
            "Application data is stored in Neon Postgres. The application is designed for deployment on Vercel or another compatible hosting provider.",
            "Hosting providers may process logs, IP addresses, request metadata, and performance data as part of operating the service.",
          ],
        },
        {
          title: "5. AI and URL Processing",
          body: [
            "When you submit a URL, DESIGN.MD may fetch the target page, stylesheets, screenshot metadata, and palette information to generate documentation.",
            "AI prompts may include the submitted URL, page title, page description, and extracted design data. Do not submit confidential URLs or data unless you are permitted to process them with third-party AI providers.",
          ],
        },
        {
          title: "6. How We Use Information",
          body: [
            "We use collected information to authenticate users, generate DESIGN.md documents, save generation history, process subscriptions, enforce plan access, debug issues, and improve product reliability.",
            "We do not sell personal information. We may share information with service providers only as needed to operate authentication, hosting, database, billing, analytics, and AI functionality.",
          ],
        },
        {
          title: "7. Data Retention",
          body: [
            "We retain account, billing, webhook, and generation data for as long as needed to provide the service, comply with obligations, resolve disputes, and maintain business records.",
            "You may request deletion of account-associated application data through the support channel listed by the DESIGN.MD operator.",
          ],
        },
        {
          title: "8. Security",
          body: [
            "We use reasonable technical and organizational measures to protect application data, including provider-managed authentication, database access controls, and webhook signature verification.",
            "No online service can guarantee absolute security. You are responsible for protecting your login credentials and restricting access to your account.",
          ],
        },
      ]}
    />
  )
}
