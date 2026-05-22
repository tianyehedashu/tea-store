import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const proofPoints = [
  "Fresh seasonal lots",
  "Precise brew guidance",
  "Origin-led sourcing",
]

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#111d16] text-white">
      <Image
        src="/images/origins/longjing-hero.jpg"
        alt=""
        fill
        priority
        quality={88}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,29,22,0.92)_0%,rgba(17,29,22,0.72)_46%,rgba(17,29,22,0.22)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#111d16] to-transparent"
        aria-hidden
      />

      <div className="content-container relative z-10 flex min-h-[78svh] items-center py-16 small:py-20">
        <div className="max-w-3xl space-y-8">
          <p className="section-eyebrow text-[#d79b62]">Zentee tea house</p>
          <div className="space-y-5">
            <h1 className="font-display text-5xl leading-[1.02] text-[#fff7ec] small:text-7xl">
              Single-origin teas for calm, repeatable cups.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#e4eadf]">
              Shop curated loose-leaf teas with harvest context, tasting notes,
              and brew instructions clear enough for the first cup to land.
            </p>
          </div>

          <div className="flex flex-col gap-3 xsmall:flex-row">
            <LocalizedClientLink href="/store" className="brand-cta">
              Shop teas
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/origins"
              className="brand-outline border-white/25 bg-white/10 text-white hover:bg-white hover:text-sage-900"
            >
              Explore origins
            </LocalizedClientLink>
          </div>

          <div className="grid gap-3 border-t border-white/15 pt-6 small:grid-cols-3">
            {proofPoints.map((point) => (
              <div key={point} className="flex items-center gap-3">
                <span
                  className="h-2 w-2 rounded-full bg-[#d79b62]"
                  aria-hidden
                />
                <span className="text-sm font-medium text-[#f4eadc]">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
