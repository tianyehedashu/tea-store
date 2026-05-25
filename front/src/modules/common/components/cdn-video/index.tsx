import { CdnVideo as CdnVideoType } from "@lib/types/cdn-video"
import { resolveMedusaAssetUrl } from "@lib/util/medusa-image-url"

type CdnVideoProps = {
  video: CdnVideoType
  className?: string
  videoClassName?: string
  autoPlay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
  preload?: "auto" | "metadata" | "none"
}

export default function CdnVideo({
  video,
  className = "",
  videoClassName = "",
  autoPlay = false,
  controls = true,
  loop = false,
  muted = true,
  playsInline = true,
  preload = "metadata",
}: CdnVideoProps) {
  const src = resolveMedusaAssetUrl(video.url)
  const poster = resolveMedusaAssetUrl(video.poster)

  if (!src) {
    return null
  }

  return (
    <div className={["overflow-hidden", className].join(" ")}>
      <video
        aria-label={video.title}
        autoPlay={autoPlay}
        className={["h-full w-full object-cover", videoClassName].join(" ")}
        controls={controls}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        poster={poster}
        preload={preload}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
