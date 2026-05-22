import { Metadata } from "next"
import StaticPage from "@modules/common/components/static-page"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Zentee collects, uses, and protects your personal information.",
}

const sections = [
  {
    heading: "Information we collect",
    paragraphs: [
      "When you place an order or create an account, we collect contact details, shipping addresses, and payment-related information processed securely by our payment partners.",
      "We also collect technical data such as browser type and pages visited to improve site performance and security.",
    ],
  },
  {
    heading: "How we use your data",
    paragraphs: [
      "We use your information to fulfill orders, provide customer support, prevent fraud, and send transactional emails such as order confirmations.",
      "With your consent, we may send occasional product or brewing tips. You can unsubscribe at any time.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "Depending on your region, you may request access, correction, or deletion of personal data by contacting support@zentee.com.",
      "We do not sell your personal information to third parties.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="Last updated for the Zentee international tea store. We keep your data minimal and purposeful."
      sections={sections}
    />
  )
}
