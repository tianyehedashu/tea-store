import { BrewingGuideDTO } from "@lib/data/cms/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function GuideCard({ guide }: { guide: BrewingGuideDTO }) {
  return (
    <LocalizedClientLink
      href={`/guides/${guide.slug}`}
      className="brand-card group block h-full p-6 space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold text-sage-900 group-hover:text-brand-600 transition-colors capitalize">
          {guide.teaType}
        </h2>
        {typeof guide.waterTempC === "number" ? (
          <span className="brand-badge shrink-0">{guide.waterTempC}°C</span>
        ) : null}
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        {guide.vessel ? (
          <div>
            <dt className="text-sage-500">Vessel</dt>
            <dd className="font-medium text-sage-900 capitalize">
              {guide.vessel}
            </dd>
          </div>
        ) : null}
        {typeof guide.leafGramPer100ml === "number" ? (
          <div>
            <dt className="text-sage-500">Leaf ratio</dt>
            <dd className="font-medium text-sage-900">
              {guide.leafGramPer100ml}g / 100ml
            </dd>
          </div>
        ) : null}
        {typeof guide.brewTimes === "number" ? (
          <div className="col-span-2">
            <dt className="text-sage-500">Infusions</dt>
            <dd className="font-medium text-sage-900">
              Up to {guide.brewTimes}x
            </dd>
          </div>
        ) : null}
      </dl>
      {guide.tips ? (
        <p className="text-sm text-sage-600 line-clamp-2 leading-relaxed">
          {guide.tips}
        </p>
      ) : null}
      <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600">
        View guide
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
    </LocalizedClientLink>
  )
}
