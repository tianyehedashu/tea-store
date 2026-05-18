import { Metadata } from "next"
import PageHero from "@modules/common/components/page-hero"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "About Zentee",
  description:
    "Our story: craft tea, mountain origins, and mindful rituals for tea lovers worldwide.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="Our Story"
        title="Tea as ritual, origin as truth"
        description="Zentee brings premium loose-leaf teas from mountain gardens to your cup — with the brewing context serious drinkers expect."
      >
        <LocalizedClientLink href="/store" className="brand-cta text-sm">
          Shop teas
        </LocalizedClientLink>
        <LocalizedClientLink href="/origins" className="brand-outline text-sm">
          Explore origins
        </LocalizedClientLink>
      </PageHero>

      <article className="content-container py-12 max-w-3xl space-y-8 text-sage-700 leading-relaxed">
        <p>
          We partner directly with growers who honor craft, purity, and the land
          that shapes each harvest. Every product carries origin context,
          brewing guidance, and the details that matter — temperature, leaf
          ratio, and steeping rhythm included.
        </p>
        <p>
          Whether you are exploring green tea clarity, oolong complexity, or the
          depth of pu-erh, we help you brew with confidence.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <LocalizedClientLink href="/guides" className="brand-outline text-sm">
            Brewing guides
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/help"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Help & FAQ
          </LocalizedClientLink>
        </div>
      </article>
    </div>
  )
}
