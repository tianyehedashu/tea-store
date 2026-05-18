import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Zentee - Tea with a Zen State of Mind",
  description:
    "Sip the Calm. Discover mindful tea experiences that bring eastern tranquility and wellness to your daily ritual. Premium organic teas for meditation and inner peace.",
}

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
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Tea Categories - Cultural Journey */}
      <section className="py-20 bg-gradient-to-b from-white to-sage-25">
        <div className="content-container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-6">
              <div className="inline-flex items-center gap-2 text-sage-500 text-sm tracking-wider uppercase">
                <div className="w-8 h-px bg-sage-300"></div>
                <span>Tea Varieties</span>
                <div className="w-8 h-px bg-sage-300"></div>
              </div>
              <h2 className="font-display text-3xl small:text-4xl font-light text-sage-900 tracking-tight">
                Six Paths to Inner Peace
              </h2>
              <p className="text-lg text-sage-600 font-light max-w-2xl mx-auto leading-relaxed">
                Each tea tradition offers a unique pathway to mindfulness,
                inviting you to discover tranquility through the ancient art of
                tea ceremony.
              </p>
            </div>

            <div className="grid small:grid-cols-2 large:grid-cols-3 gap-8">
              {teaCategories.slice(0, 6).map((category, index) => {
                const teaSymbols = ["🌱", "☁️", "🌿", "🔥", "🍂", "🌸"]
                const philosophies = [
                  "Freshness & Vitality",
                  "Purity & Simplicity",
                  "Balance & Complexity",
                  "Warmth & Comfort",
                  "Depth & Wisdom",
                  "Grace & Fragrance",
                ]

                return (
                  <LocalizedClientLink
                    key={category.id}
                    href={`/categories/${category.handle}`}
                    className="group"
                  >
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-sage-200/50 p-8 hover:border-sage-300/70 transition-all duration-500 group-hover:shadow-lg">
                      <div className="text-center space-y-6">
                        <div className="relative mx-auto w-16 h-16">
                          <div className="absolute inset-0 bg-gradient-to-br from-sage-100 to-brand-100 rounded-full opacity-60 group-hover:opacity-80 transition-opacity"></div>
                          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="text-sage-700 text-lg font-light">
                              {teaSymbols[index] || "🍃"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-lg font-medium text-sage-900 group-hover:text-brand-700 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-sage-600 font-light leading-relaxed">
                            {philosophies[index] || "Traditional essence"}
                          </p>
                          <div className="pt-2">
                            <span className="inline-flex items-center gap-1 text-xs text-sage-500 group-hover:text-sage-700 transition-colors">
                              Discover Path
                              <svg
                                className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </LocalizedClientLink>
                )
              })}
            </div>

            {/* Cultural note */}
            <div className="text-center mt-16 pt-8 border-t border-sage-200/50">
              <p className="text-sm text-sage-500 italic font-light max-w-xl mx-auto leading-relaxed">
                Traditional tea wisdom recognizes six main categories, each
                embodying unique craftsmanship and cultural heritage, reflecting
                different philosophies of mindful living.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {collections && collections.length > 0 && (
        <section className="py-16 bg-sage-50">
          <div className="content-container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl small:text-4xl font-bold text-sage-900 mb-4">
                Featured Collections
              </h2>
              <p className="text-lg text-sage-600 max-w-2xl mx-auto">
                Handpicked selections of our finest teas, perfect for
                discovering new favorites
              </p>
            </div>
            <FeaturedProducts collections={collections} region={region} />
          </div>
        </section>
      )}

      {/* Tea Philosophy Section */}
      <section className="py-24 bg-gradient-to-b from-white to-sage-25">
        <div className="content-container">
          <div className="max-w-4xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16 space-y-6">
              <div className="inline-flex items-center gap-2 text-sage-500 text-sm tracking-wider uppercase">
                <div className="w-8 h-px bg-sage-300"></div>
                <span>Tea Philosophy</span>
                <div className="w-8 h-px bg-sage-300"></div>
              </div>
              <h2 className="font-display text-3xl small:text-4xl font-light text-sage-900 tracking-tight">
                Zen and Tea as One
              </h2>
              <p className="text-lg text-sage-600 font-light max-w-2xl mx-auto leading-relaxed">
                In the harmony of tea and meditation, find your center. Each
                mindful sip becomes a gateway to inner stillness and profound
                awareness.
              </p>
            </div>

            {/* Three pillars of tea philosophy */}
            <div className="grid small:grid-cols-3 gap-12 mb-20">
              <div className="text-center space-y-6">
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-sage-100 to-sage-200 rounded-full"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <span className="text-sage-700 text-2xl font-light">
                      🧘
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-sage-900">
                    Serenity
                  </h3>
                  <p className="text-sm text-sage-600 font-light leading-relaxed">
                    In stillness, we find clarity. Each tea ceremony begins with
                    quieting the mind and opening the heart to the present
                    moment.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-6">
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <span className="text-brand-700 text-2xl font-light">
                      ☯️
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-sage-900">Harmony</h3>
                  <p className="text-sm text-sage-600 font-light leading-relaxed">
                    True tea exists in the balance between water and leaf, heat
                    and time, tradition and innovation, solitude and community.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-6">
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-cream-100 to-cream-200 rounded-full"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <span className="text-cream-700 text-2xl font-light">
                      🙏
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-sage-900">
                    Reverence
                  </h3>
                  <p className="text-sm text-sage-600 font-light leading-relaxed">
                    Respect for the leaf, the water, the vessel, and the hands
                    that prepared them. Tea teaches us gratitude for simple
                    gifts.
                  </p>
                </div>
              </div>
            </div>

            {/* Story narrative */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sage-200/50 p-12 shadow-sm">
              <div className="grid small:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-light text-sage-900 tracking-wide">
                      From Mountain to Cup
                    </h3>
                    <p className="text-sage-700 font-light leading-relaxed">
                      In tranquil mountains, each tea leaf awaits its meeting
                      with your soul. From ancient temples to modern living
                      spaces, tea's wisdom transcends time, bringing presence
                      and awareness to your daily ritual.
                    </p>
                    <p className="text-sage-600 font-light leading-relaxed text-sm">
                      Our carefully curated selection honors traditional
                      cultivation methods while embracing the mindful practices
                      that make each cup a moment of meditation.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <LocalizedClientLink
                      href="/origins"
                      className="inline-flex items-center gap-2 text-sage-700 hover:text-sage-900 transition-colors font-medium text-sm"
                    >
                      Discover Origins
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </LocalizedClientLink>
                  </div>
                </div>

                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-sage-50 to-brand-50 rounded-xl border border-sage-200/50 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sage-200 to-brand-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-sage-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sage-600 text-sm font-light">
                          Traditional Wisdom
                        </p>
                        <p className="text-xs text-sage-500">
                          Ancient Tea Craftsmanship
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Subtle floating elements */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-brand-200 rounded-full opacity-60"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-sage-200 rounded-full opacity-40"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tea Circle Invitation */}
      <section className="py-20 bg-gradient-to-b from-sage-50 to-white">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            {/* Zen circle visual */}
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 border-2 border-sage-300 rounded-full opacity-30"></div>
              <div className="absolute inset-4 border border-brand-300 rounded-full opacity-50"></div>
              <div className="absolute inset-8 bg-gradient-to-br from-sage-100 to-brand-100 rounded-full flex items-center justify-center">
                <span className="text-sage-700 text-xl font-light">🍃</span>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl small:text-3xl font-light text-sage-900 tracking-wide">
                Join Our Zen Tea Community
              </h2>
              <p className="text-sage-600 font-light leading-relaxed max-w-lg mx-auto">
                Embrace mindful living with seasonal tea wisdom, meditation
                practices, and gentle reminders to pause and breathe in life's
                simple pleasures.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sage-200/50 p-8 shadow-sm space-y-4">
                <p className="text-sm text-sage-600 font-light leading-relaxed">
                  Explore brewing guides and origin stories while we prepare a
                  quiet newsletter for tea lovers.
                </p>
                <div className="flex flex-col small:flex-row gap-3 justify-center">
                  <LocalizedClientLink
                    href="/guides"
                    className="brand-cta text-sm justify-center"
                  >
                    Read brewing guides
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/store"
                    className="brand-outline text-sm justify-center"
                  >
                    Shop teas
                  </LocalizedClientLink>
                </div>
              </div>
            </div>

            {/* Subtle closing thought */}
            <div className="pt-8">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-sage-300 to-transparent mx-auto mb-4"></div>
              <p className="text-sm text-sage-500 italic font-light">
                "When you drink tea, you taste liquid meditation"
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
