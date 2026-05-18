import { Metadata } from "next"
import PageHero from "@modules/common/components/page-hero"
import FaqAccordion, { FaqItem } from "@modules/common/components/faq-accordion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Help & FAQ",
  description:
    "Shipping, orders, brewing, and account help for Zentee customers.",
}

const faqs: FaqItem[] = [
  {
    question: "Where do you ship?",
    answer:
      "We ship across Europe and North America. Shipping options and rates are shown at checkout based on your delivery address.",
  },
  {
    question: "How should I store loose-leaf tea?",
    answer:
      "Keep tea in an airtight container, away from light, heat, and strong odors. Most greens and oolongs are best enjoyed within 12 months.",
  },
  {
    question: "How do I find brewing instructions?",
    answer:
      "Each product page includes Quick Brew tips. For deeper guidance, visit our Brewing Guides section or open a guide matched to your tea type.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes. Once your order ships, you will receive tracking details by email. You can also view order status in your account.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Unopened products in original condition may be returned within 14 days of delivery. See our Returns page for full details.",
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="Support"
        title="Help & FAQ"
        description="Quick answers about shipping, brewing, and orders. Need more help? Sign in to your account or email support@zentee.com."
      />

      <section className="content-container py-12 max-w-3xl space-y-10">
        <FaqAccordion items={faqs} />

        <div className="rounded-2xl border border-sage-200 bg-sage-50/50 p-8 space-y-4">
          <h2 className="text-lg font-semibold text-sage-900">
            Still need help?
          </h2>
          <p className="text-sage-700 leading-relaxed">
            <LocalizedClientLink
              href="/account"
              className="text-brand-600 hover:underline"
            >
              Sign in to your account
            </LocalizedClientLink>{" "}
            for order history, or email{" "}
            <a
              href="mailto:support@zentee.com"
              className="text-brand-600 hover:underline"
            >
              support@zentee.com
            </a>
            . Returns are covered on our{" "}
            <LocalizedClientLink
              href="/returns"
              className="text-brand-600 hover:underline"
            >
              Returns & Refunds
            </LocalizedClientLink>{" "}
            page.
          </p>
        </div>
      </section>
    </div>
  )
}
