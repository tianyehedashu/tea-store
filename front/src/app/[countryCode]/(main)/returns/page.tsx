import { Metadata } from "next"
import StaticPage from "@modules/common/components/static-page"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "Return policy for unopened Zentee tea products.",
}

const sections = [
  {
    heading: "Eligible returns",
    paragraphs: [
      "Unopened products in original packaging may be returned within 14 days of delivery for a refund or exchange, subject to inspection.",
      "Opened loose-leaf tea cannot be resold for food safety reasons and is not eligible for return unless damaged in transit.",
    ],
  },
  {
    heading: "How to start a return",
    paragraphs: [
      "Email support@zentee.com with your order number and reason for return. We will provide return instructions and a shipping label when applicable.",
      "Refunds are issued to the original payment method after we receive and inspect the package.",
    ],
  },
  {
    heading: "Damaged or incorrect orders",
    paragraphs: [
      "If your order arrives damaged or incorrect, contact us within 48 hours with photos. We will replace or refund at no extra cost.",
    ],
  },
]

export default function ReturnsPage() {
  return (
    <>
      <StaticPage
        eyebrow="Support"
        title="Returns & Refunds"
        description="We want you to enjoy every cup. If something is not right, we will make it fair."
        sections={sections}
      />
      <div className="content-container pb-16 max-w-3xl -mt-4">
        <p className="text-sage-600">
          More questions? Visit our{" "}
          <LocalizedClientLink
            href="/help"
            className="text-brand-600 hover:underline"
          >
            Help & FAQ
          </LocalizedClientLink>
          .
        </p>
      </div>
    </>
  )
}
