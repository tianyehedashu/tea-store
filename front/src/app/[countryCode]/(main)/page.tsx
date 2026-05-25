import { Metadata } from "next"
import Image from "next/image"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import { CDN_VIDEO_ASSETS } from "@lib/constants/video-assets"
import CdnVideo from "@modules/common/components/cdn-video"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Single-Origin Teas",
  description:
    "Shop premium loose-leaf teas with origin stories, tasting notes, and precise brewing guidance for a better daily cup.",
}

const teaCopy = [
  {
    profile: "Fresh and clear",
    cue: "Green teas with spring brightness and a clean finish.",
  },
  {
    profile: "Soft and luminous",
    cue: "White teas for delicate aroma and gentle sweetness.",
  },
  {
    profile: "Layered and floral",
    cue: "Oolongs with texture, perfume, and long infusions.",
  },
  {
    profile: "Deep and warming",
    cue: "Black teas with malt, fruit, and a rounded body.",
  },
  {
    profile: "Earthy and patient",
    cue: "Pu-erh teas for grounded cups and slow sessions.",
  },
  {
    profile: "Naturally caffeine-free",
    cue: "Herbal infusions for evening rituals and easy comfort.",
  },
]

const processSteps = [
  {
    label: "Source",
    title: "Known gardens",
    body: "Origin pages connect each tea to place, harvest, and growing conditions.",
  },
  {
    label: "Taste",
    title: "Cup-first notes",
    body: "Flavor, aroma, texture, and finish are written for choosing, not guessing.",
  },
  {
    label: "Brew",
    title: "Repeatable results",
    body: "Temperature, ratio, and steep timing make the first session feel guided.",
  },
]

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)
  const categories = await listCategories()

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!region) {
    return null
  }

  const teaCategories =
    categories?.filter((cat) => cat.name.includes("Tea")) || []

  return (
    <main className="min-h-screen bg-[#fffaf2]">
      <Hero />

      <section className="border-b border-[#eadbc4] bg-[#fffaf2] py-14 small:py-20">
        <div className="content-container">
          <div className="mb-10 flex flex-col gap-4 small:flex-row small:items-end small:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="section-eyebrow">Tea varieties</p>
              <h2 className="font-display text-3xl leading-tight text-sage-900 small:text-5xl">
                Choose by the cup you want.
              </h2>
              <p className="text-base leading-7 text-sage-700">
                The store is organized around taste and brewing intent, so
                beginners and serious drinkers can move quickly.
              </p>
            </div>
            <LocalizedClientLink
              href="/store"
              className="brand-outline w-full justify-center xsmall:w-fit"
            >
              View all teas
            </LocalizedClientLink>
          </div>

          <div className="grid gap-4 small:grid-cols-2 large:grid-cols-3">
            {teaCategories.slice(0, 6).map((category, index) => {
              const copy = teaCopy[index] || {
                profile: "Curated character",
                cue: "Selected for clarity, balance, and repeat cups.",
              }

              return (
                <LocalizedClientLink
                  key={category.id}
                  href={`/categories/${category.handle}`}
                  className="brand-card group block p-6"
                >
                  <div className="flex h-full flex-col justify-between gap-8">
                    <div className="space-y-4">
                      <p className="section-eyebrow">{copy.profile}</p>
                      <h3 className="font-display text-2xl text-sage-900 group-hover:text-[#82471f]">
                        {category.name}
                      </h3>
                      <p className="text-sm leading-6 text-sage-700">
                        {copy.cue}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#a6602e]">
                      Explore category
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </LocalizedClientLink>
              )
            })}
          </div>
        </div>
      </section>

      {collections && collections.length > 0 && (
        <section className="bg-[#f5eddf] py-16 small:py-20">
          <div className="content-container">
            <div className="mb-12 max-w-3xl space-y-3">
              <p className="section-eyebrow">Featured collections</p>
              <h2 className="font-display text-3xl leading-tight text-sage-900 small:text-5xl">
                Start with teas that already have a point of view.
              </h2>
              <p className="text-base leading-7 text-sage-700">
                Seasonal edits, daily-drinker staples, and origin-led sets are
                grouped for fast discovery.
              </p>
            </div>
            <FeaturedProducts collections={collections} region={region} />
          </div>
        </section>
      )}

      <section className="bg-[#fffaf2] py-16 small:py-24">
        <div className="content-container grid gap-10 large:grid-cols-[0.92fr_1.08fr] large:items-center">
          <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-[#eadbc4] bg-sage-100 xsmall:min-h-[420px]">
            <Image
              src="/images/origins/longjing-hero.jpg"
              alt="Longjing tea garden and fresh leaves"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 48vw"
              quality={88}
            />
            <CdnVideo
              video={CDN_VIDEO_ASSETS.hotWaterTeaCup}
              className="absolute inset-0"
              videoClassName="absolute inset-0"
              autoPlay
              controls={false}
              loop
              muted
              preload="metadata"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111d16]/55 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-white/25 bg-[#111d16]/70 p-5 text-[#fffaf2] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d79b62]">
                Origin matters
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/85">
                Tea tastes better when the place, picking season, and brewing
                rhythm are not hidden behind the product photo.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="section-eyebrow">From garden to cup</p>
              <h2 className="font-display text-3xl leading-tight text-sage-900 small:text-5xl">
                A tea site should help you imagine the cup before you buy.
              </h2>
              <p className="text-base leading-7 text-sage-700">
                Zentee connects sourcing, sensory detail, and brewing steps
                across the store so product pages feel useful, not decorative.
              </p>
            </div>

            <div className="grid gap-3">
              {processSteps.map((step) => (
                <div
                  key={step.label}
                  className="grid gap-4 rounded-lg border border-[#eadbc4] bg-white p-5 small:grid-cols-[96px_1fr]"
                >
                  <p className="section-eyebrow">{step.label}</p>
                  <div>
                    <h3 className="text-base font-semibold text-sage-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-sage-700">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 xsmall:flex-row">
              <LocalizedClientLink
                href="/origins"
                className="brand-cta w-full xsmall:w-auto"
              >
                Browse origins
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/guides"
                className="brand-outline w-full xsmall:w-auto"
              >
                Read brew guides
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#203428] bg-[#111d16] py-16 text-[#fffaf2] small:py-20">
        <div className="content-container grid gap-10 large:grid-cols-[0.9fr_1.1fr] large:items-center">
          <div className="space-y-4">
            <p className="section-eyebrow text-[#d79b62]">
              The Zentee standard
            </p>
            <h2 className="font-display text-3xl leading-tight small:text-5xl">
              Less noise. More confidence in every product decision.
            </h2>
          </div>
          <div className="grid gap-4 small:grid-cols-3">
            {[
              "Origin context on every tea",
              "Brew parameters near the buy box",
              "Collections built for real shopping intent",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-5"
              >
                <p className="text-sm font-semibold leading-6 text-[#f4eadc]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf2] py-14 small:py-20">
        <div className="content-container flex flex-col gap-6 small:flex-row small:items-center small:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="section-eyebrow">Ready for the next cup</p>
            <h2 className="font-display text-3xl leading-tight text-sage-900 small:text-4xl">
              Build a tea shelf with better information from the start.
            </h2>
          </div>
          <LocalizedClientLink
            href="/store"
            className="brand-cta w-full xsmall:w-fit"
          >
            Shop the store
          </LocalizedClientLink>
        </div>
      </section>
    </main>
  )
}
