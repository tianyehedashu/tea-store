import { Metadata } from "next"
import StaticPage from "@modules/common/components/static-page"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the Zentee online store.",
}

const sections = [
  {
    heading: "Using our store",
    paragraphs: [
      "By browsing or purchasing from Zentee, you agree to these terms and our policies on shipping, returns, and privacy.",
      "Product descriptions, brewing guidance, and origin content are provided for information. Natural variation in harvests may affect flavor.",
    ],
  },
  {
    heading: "Orders and payment",
    paragraphs: [
      "Prices are shown in your checkout currency where available. We reserve the right to cancel orders affected by pricing errors or stock limitations.",
      "Payment is processed by certified payment providers. Zentee does not store full card numbers on our servers.",
    ],
  },
  {
    heading: "Limitation of liability",
    paragraphs: [
      "To the extent permitted by law, Zentee is not liable for indirect damages arising from use of our products or website.",
      "For questions about these terms, contact support@zentee.com.",
    ],
  },
]

export default function TermsPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Terms of Service"
      description="Please read these terms before placing an order on Zentee."
      sections={sections}
    />
  )
}
