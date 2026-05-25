import { BrewingGuideDTO } from "@lib/data/cms/types"
import type { BrewData } from "@lib/util/brew-data"
import ProductsByHandles from "@modules/common/components/products-by-handles"
import BrewTipsDisplay from "@modules/products/components/brew-tips-display"
import GuideSteps from "@modules/guides/components/guide-steps"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function GuideDetailTemplate({
  guide,
  countryCode,
}: {
  guide: BrewingGuideDTO
  countryCode: string
}) {
  const brew: BrewData = {
    waterTempC: guide.waterTempC,
    leafGramPer100ml: guide.leafGramPer100ml,
    brewTimes: guide.brewTimes,
    timePlan: guide.timePlan,
    tips: guide.tips,
  }

  const handles =
    guide.recommendedProducts?.map((p) => p.handle).filter(Boolean) ?? []

  return (
    <div className="min-h-screen bg-[#fffaf2]">
      <section className="hero-gradient border-b border-[#eadbc4]">
        <div className="content-container max-w-4xl py-12 small:py-16">
          <nav className="text-sm text-sage-600 mb-4 flex flex-wrap items-center gap-2">
            <LocalizedClientLink
              href="/guides"
              className="hover:text-[#82471f]"
            >
              Guides
            </LocalizedClientLink>
            <span aria-hidden>/</span>
            <span className="font-medium capitalize text-[#a6602e]">
              {guide.teaType}
            </span>
          </nav>
          <h1 className="break-words font-display text-4xl capitalize text-sage-900 xsmall:text-5xl small:text-6xl">
            How to brew {guide.teaType}
          </h1>
          <p className="mt-4 text-base leading-7 text-sage-700 xsmall:text-lg xsmall:leading-relaxed">
            A structured approach to water, leaf, and time — tuned for this tea
            type.
          </p>
        </div>
      </section>

      <article className="content-container py-12 max-w-3xl space-y-12">
        <BrewTipsDisplay
          brew={brew}
          title="At a glance"
          className="rounded-lg border border-[#eadbc4] bg-white p-6"
        />
        <GuideSteps guide={guide} />
        {handles.length > 0 ? (
          <ProductsByHandles
            handles={handles}
            countryCode={countryCode}
            title="Teas for this guide"
            subtitle="Recommended products that pair well with these parameters."
          />
        ) : null}
        <div className="flex flex-col gap-4 border-t border-[#eadbc4] pt-4 xsmall:flex-row xsmall:flex-wrap">
          <LocalizedClientLink
            href="/store"
            className="brand-cta w-full text-sm xsmall:w-auto"
          >
            Find {guide.teaType} teas
          </LocalizedClientLink>
        </div>
      </article>
    </div>
  )
}
