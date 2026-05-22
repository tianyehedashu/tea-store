import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function OriginsIndexHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#111d16]">
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
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,29,22,0.9)_0%,rgba(17,29,22,0.72)_52%,rgba(17,29,22,0.35)_100%)]"
          aria-hidden
        />
      </div>
      <div className="content-container relative z-10 py-16 small:py-20 max-w-3xl">
        <p className="section-eyebrow mb-3 text-[#d79b62]">
          Tea Origins
        </p>
        <h1 className="font-display text-4xl leading-tight text-[#fff7ec] small:text-6xl">
          Where every leaf begins
        </h1>
        <p className="mt-4 text-lg text-white/85 leading-relaxed max-w-2xl">
          Explore mountain gardens, regional terroir, and the flavor profiles
          that shape each harvest. Every Zentee tea is tied to a place you can
          trust.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <LocalizedClientLink href="/store" className="brand-cta">
            Shop by origin
          </LocalizedClientLink>
          <LocalizedClientLink href="/guides" className="brand-outline border-white/25 bg-white/10 text-white hover:bg-white hover:text-sage-900">
            Brewing guides
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
