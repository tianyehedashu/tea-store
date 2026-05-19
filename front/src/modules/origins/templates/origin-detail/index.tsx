import Image from "next/image"
import { OriginDTO } from "@lib/data/cms/types"
import { resolveSanityImageUrl } from "@lib/util/sanity-image-url"
import ProductsByHandles from "@modules/common/components/products-by-handles"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import OriginTerroirGrid from "@modules/origins/components/origin-terroir-grid"

export default function OriginDetailTemplate({
  origin,
  countryCode,
}: {
  origin: OriginDTO
  countryCode: string
}) {
  const imageUrl = resolveSanityImageUrl(origin.heroImage, 1200)
  const location = [origin.mountain, origin.region, origin.country]
    .filter(Boolean)
    .join(" · ")
  const handles = origin.products?.map((p) => p.handle) ?? []

  return (
    <div className="min-h-screen bg-white">
      <section className="relative">
        <div className="relative h-64 small:h-80 bg-gradient-to-br from-sage-100 to-brand-50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={origin.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-sage-900/70 via-sage-900/20 to-transparent" />
        </div>
        <div className="content-container relative -mt-20 pb-8">
          <nav className="text-sm text-white/90 mb-4 flex flex-wrap items-center gap-2">
            <LocalizedClientLink href="/origins" className="hover:text-white">
              Origins
            </LocalizedClientLink>
            <span aria-hidden>/</span>
            <span className="text-white font-medium">{origin.title}</span>
          </nav>
          <h1 className="font-display text-4xl small:text-5xl font-bold text-white max-w-3xl">
            {origin.title}
          </h1>
          {location ? (
            <p className="mt-3 text-lg text-white/90">{location}</p>
          ) : null}
          {origin.summary ? (
            <p className="mt-4 text-base text-white/85 max-w-2xl leading-relaxed">
              {origin.summary}
            </p>
          ) : null}
        </div>
      </section>

      <article className="content-container py-12 space-y-12 max-w-4xl">
        {origin.description ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-sage-900">About this origin</h2>
            <p className="text-sage-700 leading-relaxed text-base">
              {origin.description}
            </p>
          </section>
        ) : null}

        <OriginTerroirGrid origin={origin} />

        {origin.teaStyles?.length ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-sage-900">Tea styles</h2>
            <ul className="list-disc list-inside space-y-2 text-sage-700">
              {origin.teaStyles.map((style) => (
                <li key={style}>{style}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {origin.flavorProfile?.length ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-sage-900">Flavor profile</h2>
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
            <h2 className="text-xl font-semibold text-sage-900">Why it matters</h2>
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
          <section className="space-y-4 rounded-2xl border border-sage-200 bg-cream-50/80 p-6">
            <h2 className="text-xl font-semibold text-sage-900">History & culture</h2>
            <p className="text-sage-700 leading-relaxed">{origin.history}</p>
          </section>
        ) : null}

        {handles.length > 0 ? (
          <ProductsByHandles
            handles={handles}
            countryCode={countryCode}
            title="Teas from this origin"
            subtitle="Representative picks linked to this growing region."
          />
        ) : null}

        <div className="flex flex-wrap gap-4 pt-4 border-t border-sage-200">
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
