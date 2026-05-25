import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"

import CdnVideo from "@modules/common/components/cdn-video"
import { TeaProductVideo } from "@lib/types/tea-product-metadata"
import { resolveMedusaAssetUrl } from "@lib/util/medusa-image-url"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  videos?: TeaProductVideo[]
}

type GalleryMedia =
  | {
      kind: "image"
      id: string
      url?: string
      index: number
    }
  | {
      kind: "video"
      id: string
      video: TeaProductVideo
      index: number
    }

const ImageGallery = ({ images, videos = [] }: ImageGalleryProps) => {
  const media: GalleryMedia[] = [
    ...images.map((image, index) => ({
      kind: "image" as const,
      id: image.id,
      url: image.url,
      index,
    })),
    ...videos.map((video, index) => ({
      kind: "video" as const,
      id: `video-${video.url}-${index}`,
      video,
      index: images.length + index,
    })),
  ]

  if (!media.length) {
    return (
      <div className="relative flex aspect-[4/5] items-center justify-center rounded-lg border border-sage-100 bg-[#fffaf2] text-sm text-sage-500">
        Product media coming soon
      </div>
    )
  }

  return (
    <div className="relative" data-testid="product-image-gallery">
      <div className="no-scrollbar relative flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 medium:grid medium:grid-cols-12 medium:gap-4 medium:overflow-visible medium:pb-0">
        {media.map((item, index) => {
          const resolvedUrl =
            item.kind === "image" && item.url
              ? resolveMedusaAssetUrl(item.url)
              : undefined
          const isHeroImage = index === 0
          const imageLayoutClass = isHeroImage
            ? "aspect-[4/5] rounded-lg medium:col-span-7 medium:row-span-2"
            : index > 2
            ? "aspect-[4/5] rounded-lg medium:col-span-4"
            : "aspect-[4/5] rounded-lg medium:col-span-5"
          const mobileWidthClass =
            media.length === 1
              ? "flex-[0_0_100%]"
              : "flex-[0_0_86%] xsmall:flex-[0_0_72%]"

          return (
            <Container
              key={item.id}
              className={[
                "group relative w-full snap-center overflow-hidden border border-white/70 bg-sage-100 shadow-[0_20px_60px_rgba(4,18,10,0.18)] medium:flex-none",
                mobileWidthClass,
                imageLayoutClass,
              ].join(" ")}
              id={item.id}
            >
              {item.kind === "video" ? (
                <CdnVideo
                  video={item.video}
                  className="absolute inset-0"
                  videoClassName="absolute inset-0"
                  controls
                  loop={false}
                  muted={false}
                  preload="metadata"
                />
              ) : resolvedUrl ? (
                <Image
                  src={resolvedUrl}
                  priority={index <= 1 ? true : false}
                  className="absolute inset-0 transition duration-700 group-hover:scale-[1.025]"
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes={
                    isHeroImage
                      ? "(max-width: 1024px) 100vw, 680px"
                      : "(max-width: 1024px) 100vw, 420px"
                  }
                  style={{
                    objectFit: "cover",
                  }}
                />
              ) : null}
              {isHeroImage ? (
                <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-between rounded-lg border border-white/45 bg-[#fffaf2]/85 px-4 py-2 text-xs font-semibold text-sage-800 shadow-sm backdrop-blur">
                  <span>Zentee leaf view</span>
                  <span>{media.length} media</span>
                </div>
              ) : null}
              {item.kind === "video" ? (
                <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/45 bg-[#111d16]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#fffaf2] backdrop-blur">
                  Video
                </div>
              ) : null}
            </Container>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
