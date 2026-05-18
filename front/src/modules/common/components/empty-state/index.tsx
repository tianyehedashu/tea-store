import LocalizedClientLink from "@modules/common/components/localized-client-link"

type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  secondaryLabel,
  secondaryHref,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4 space-y-4 max-w-md mx-auto">
      <div className="w-20 h-20 mx-auto rounded-full bg-sage-100 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-sage-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-sage-900">{title}</h2>
      <p className="text-sage-600 leading-relaxed">{description}</p>
      {(actionHref && actionLabel) || (secondaryHref && secondaryLabel) ? (
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {actionHref && actionLabel ? (
            <LocalizedClientLink
              href={actionHref}
              className="brand-cta text-sm"
            >
              {actionLabel}
            </LocalizedClientLink>
          ) : null}
          {secondaryHref && secondaryLabel ? (
            <LocalizedClientLink
              href={secondaryHref}
              className="brand-outline text-sm"
            >
              {secondaryLabel}
            </LocalizedClientLink>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
