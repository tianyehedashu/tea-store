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
      className={`hero-gradient border-b border-[#eadbc4] ${className}`}
    >
      <div className="content-container max-w-4xl py-14 small:py-20">
        {eyebrow ? (
          <p className="section-eyebrow mb-3">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-4xl leading-tight text-sage-900 small:text-6xl">
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
