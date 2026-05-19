import Image from "next/image"
import { OriginDTO } from "@lib/data/cms/types"
import { resolveSanityImageUrl } from "@lib/util/sanity-image-url"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function OriginCard({ origin }: { origin: OriginDTO }) {
  const imageUrl = resolveSanityImageUrl(origin.heroImage, 600)
  const location = [origin.mountain, origin.region, origin.country]
    .filter(Boolean)
    .join(" · ")

  return (
    <LocalizedClientLink
      href={`/origins/${origin.slug}`}
      className="brand-card group block h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sage-100 to-brand-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={origin.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-sage-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 20l6-8 4 5 4-6 6 9M3 20h18"
              />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-sage-900/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-xl font-semibold text-white">{origin.title}</h2>
          {location ? (
            <p className="text-sm text-white/90 mt-1">{location}</p>
          ) : null}
        </div>
      </div>
      <div className="p-5 space-y-3">
        {origin.summary ? (
          <p className="text-sm text-sage-600 leading-relaxed line-clamp-3">
            {origin.summary}
          </p>
        ) : null}
        {origin.flavorProfile?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {origin.flavorProfile.slice(0, 4).map((note) => (
              <span key={note} className="brand-badge capitalize">
                {note}
              </span>
            ))}
          </div>
        ) : null}
        <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:text-brand-700">
          View origin
          <svg
            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
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
    </LocalizedClientLink>
  )
}
