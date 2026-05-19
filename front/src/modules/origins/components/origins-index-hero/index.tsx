import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function OriginsIndexHero() {
  return (
    <section className="relative isolate overflow-hidden bg-sage-900">
      <div className="absolute inset-0">
        <Image
          src="/images/origins/origins-index-hero.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={85}
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-sage-950/85 via-sage-900/70 to-sage-900/40"
          aria-hidden
        />
      </div>
      <div className="content-container relative z-10 py-16 small:py-20 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-200 mb-3">
          Tea Origins
        </p>
        <h1 className="font-display text-4xl small:text-5xl font-bold text-white leading-tight">
          Where every leaf begins
        </h1>
        <p className="mt-4 text-lg text-white/85 leading-relaxed max-w-2xl">
          Explore mountain gardens, regional terroir, and the flavor profiles
          that shape each harvest. Every Zentee tea is tied to a place you can
          trust.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <LocalizedClientLink href="/store" className="brand-cta text-sm">
            Shop by origin
          </LocalizedClientLink>
          <LocalizedClientLink href="/guides" className="brand-outline text-sm border-white/40 text-white hover:bg-white/10">
            Brewing guides
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
