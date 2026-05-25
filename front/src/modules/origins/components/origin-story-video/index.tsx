import { OriginDTO } from "@lib/data/cms/types"
import CdnVideo from "@modules/common/components/cdn-video"

export default function OriginStoryVideo({ origin }: { origin: OriginDTO }) {
  if (!origin.storyVideo) {
    return null
  }

  return (
    <section className="overflow-hidden rounded-lg border border-[#eadbc4] bg-white shadow-sm">
      <CdnVideo
        video={origin.storyVideo}
        className="aspect-video bg-sage-100"
        videoClassName="block"
        controls
        muted={false}
      />
      <div className="space-y-2 p-6">
        <p className="section-eyebrow">Origin story</p>
        {origin.storyVideo.title ? (
          <h2 className="font-display text-2xl leading-tight text-sage-900">
            {origin.storyVideo.title}
          </h2>
        ) : null}
        {origin.storyVideo.description ? (
          <p className="text-sm leading-6 text-sage-700">
            {origin.storyVideo.description}
          </p>
        ) : null}
      </div>
    </section>
  )
}
