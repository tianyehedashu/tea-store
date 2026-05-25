import Image from "next/image"
import { OriginDTO } from "@lib/data/cms/types"
import { resolveOriginHeroImageUrl } from "@lib/util/origin-hero-image"
import CdnVideo from "@modules/common/components/cdn-video"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function OriginHero({ origin }: { origin: OriginDTO }) {
  const imageUrl = resolveOriginHeroImageUrl(origin.heroImage, 1600)
  const location = [origin.mountain, origin.region, origin.country]
    .filter(Boolean)
    .join(" · ")

  return (
    <section className="relative isolate overflow-hidden bg-[#111d16]">
      <div className="absolute inset-0">
        {origin.heroVideo ? (
          <CdnVideo
            video={origin.heroVideo}
            className="absolute inset-0"
            videoClassName="absolute inset-0"
            autoPlay
            controls={false}
            loop
            muted
            preload="metadata"
          />
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            quality={90}
          />
        ) : (
          <div className="absolute inset-0 bg-[#111d16]" />
        )}
        <div
          className="absolute inset-0 bg-[linear-gradient(0deg,rgba(17,29,22,0.92)_0%,rgba(17,29,22,0.58)_54%,rgba(17,29,22,0.25)_100%)]"
          aria-hidden
        />
      </div>

      <div className="content-container relative z-10 flex min-h-[min(52svh,28rem)] flex-col justify-end pb-9 pt-20 small:min-h-[min(56vh,32rem)] small:pb-12 small:pt-24">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/85">
          <LocalizedClientLink
            href="/origins"
            className="hover:text-white transition-colors"
          >
            Origins
          </LocalizedClientLink>
          <span aria-hidden className="text-white/50">
            /
          </span>
          <span className="font-medium text-white">{origin.title}</span>
        </nav>
        <h1 className="max-w-4xl break-words font-display text-4xl leading-[1.1] text-[#fff7ec] xsmall:text-5xl lg:text-6xl">
          {origin.title}
        </h1>
        {location ? (
          <p className="mt-3 text-lg text-white/90">{location}</p>
        ) : null}
        {origin.summary ? (
          <p className="mt-4 max-w-2xl text-base small:text-lg text-white/80 leading-relaxed">
            {origin.summary}
          </p>
        ) : null}
      </div>
    </section>
  )
}
