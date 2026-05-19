import { OriginDTO } from "@lib/data/cms/types"
import ProductsByHandles from "@modules/common/components/products-by-handles"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import OriginHero from "@modules/origins/components/origin-hero"
import OriginTerroirGrid from "@modules/origins/components/origin-terroir-grid"

export default function OriginDetailTemplate({
  origin,
  countryCode,
}: {
  origin: OriginDTO
  countryCode: string
}) {
  const handles = origin.products?.map((p) => p.handle) ?? []

  return (
    <div className="min-h-screen bg-cream-50/40">
      <OriginHero origin={origin} />

      <article className="content-container py-12 small:py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {origin.description ? (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-sage-900">
                About this origin
              </h2>
              <p className="text-sage-700 leading-relaxed text-base">
                {origin.description}
              </p>
            </section>
          ) : null}

          <OriginTerroirGrid origin={origin} />

          {origin.teaStyles?.length ? (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-sage-900">
                Tea styles
              </h2>
              <ul className="space-y-2 text-sage-700">
                {origin.teaStyles.map((style) => (
                  <li key={style} className="flex gap-2">
                    <span className="text-brand-500" aria-hidden>
                      ?
                    </span>
                    <span>{style}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {origin.flavorProfile?.length ? (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-sage-900">
                Flavor profile
              </h2>
              <div className="flex flex-wrap gap-2">
                {origin.flavorProfile.map((note) => (
                  <span key={note} className="brand-badge capitalize text-sm">
                    {note}
                  </span>
                ))}
              </div>
              <p className="text-sage-700 leading-relaxed">
                Teas from this origin often express these notes in the cup. Use
                them as a guide when choosing your next loose-leaf selection.
              </p>
            </section>
          ) : null}

          {origin.highlights?.length ? (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-sage-900">
                Why it matters
              </h2>
              <ul className="space-y-3">
                {origin.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sage-700 leading-relaxed"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {origin.history ? (
            <section className="space-y-4 rounded-2xl border border-sage-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-sage-900">
                History & culture
              </h2>
              <p className="text-sage-700 leading-relaxed">{origin.history}</p>
            </section>
          ) : null}
        </div>

        {handles.length > 0 ? (
          <div className="mt-16 border-t border-sage-200 pt-12">
            <ProductsByHandles
              handles={handles}
              countryCode={countryCode}
              title="Teas from this origin"
              subtitle="Representative picks linked to this growing region."
            />
          </div>
        ) : null}

        <div className="mx-auto max-w-3xl flex flex-wrap gap-4 pt-12 mt-12 border-t border-sage-200">
          <LocalizedClientLink href="/store" className="brand-cta text-sm">
            Shop all teas
          </LocalizedClientLink>
          <LocalizedClientLink href="/guides" className="brand-outline text-sm">
            Brewing guides
          </LocalizedClientLink>
        </div>
      </article>
    </div>
  )
}
