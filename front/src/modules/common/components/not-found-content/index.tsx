import InteractiveLink from "@modules/common/components/interactive-link"

type NotFoundContentProps = {
  title?: string
  description: string
  showHomeLink?: boolean
}

export default function NotFoundContent({
  title = "Page not found",
  description,
  showHomeLink = true,
}: NotFoundContentProps) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center">
      <h1 className="font-display text-3xl font-bold text-sage-900">{title}</h1>
      <p className="text-sm text-sage-600 max-w-md leading-relaxed">
        {description}
      </p>
      {showHomeLink ? (
        <InteractiveLink href="/">Go to storefront</InteractiveLink>
      ) : null}
    </div>
  )
}
