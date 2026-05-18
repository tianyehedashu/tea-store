type PageHeroProps = {
  eyebrow?: string
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export default function PageHero({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: PageHeroProps) {
  return (
    <section
      className={`hero-gradient border-b border-sage-200/60 ${className}`}
    >
      <div className="content-container py-14 small:py-16 max-w-4xl">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 mb-3">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-4xl small:text-5xl font-bold text-sage-900 leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-lg text-sage-700 leading-relaxed max-w-2xl">
            {description}
          </p>
        ) : null}
        {children ? (
          <div className="mt-8 flex flex-wrap gap-4">{children}</div>
        ) : null}
      </div>
    </section>
  )
}
