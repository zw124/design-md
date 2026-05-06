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
            "We collect account information provided through Auth.js and Google OAuth, such as your user identifier, email address, and basic profile details.",
            "We collect submitted URLs, generated Markdown output, extracted color data, and service usage metadata needed to operate the product.",
          ],
        },
        {
          title: "2. Authentication",
          body: [
            "Authentication is handled by Auth.js with Google OAuth. Google may process login credentials, session data, device information, and security information according to its own privacy practices.",
            "DESIGN.MD stores an Auth.js account identifier so generated documents can be associated with your account.",
          ],
        },
        {
          title: "3. Payments",
          body: [
            "DESIGN.MD does not collect payment card details through the public website.",
            "The application does not include an active payment checkout or payment webhook flow.",
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
            "We use collected information to authenticate users, generate DESIGN.md documents, save generation history, debug issues, and improve product reliability.",
            "We do not sell personal information. We may share information with service providers only as needed to operate authentication, hosting, database, analytics, and AI functionality.",
          ],
        },
        {
          title: "7. Data Retention",
          body: [
            "We retain account and generation data for as long as needed to provide the service, comply with obligations, resolve disputes, and maintain business records.",
            "You may request deletion of account-associated application data through the support channel listed by the DESIGN.MD operator.",
          ],
        },
        {
          title: "8. Security",
          body: [
            "We use reasonable technical and organizational measures to protect application data, including provider-managed authentication and database access controls.",
            "No online service can guarantee absolute security. You are responsible for protecting your login credentials and restricting access to your account.",
          ],
        },
      ]}
    />
  )
}
