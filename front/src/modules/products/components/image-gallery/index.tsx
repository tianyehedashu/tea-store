import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"

import { resolveMedusaAssetUrl } from "@lib/util/medusa-image-url"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (!images.length) {
    return (
      <div className="relative flex aspect-[4/5] items-center justify-center rounded-[2rem] border border-sage-100 bg-gradient-to-br from-sage-50 to-cream-50 text-sm text-sage-500">
        Product image coming soon
      </div>
    )
  }

  return (
    <div className="relative" data-testid="product-image-gallery">
      <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-brand-100/70 via-cream-100/60 to-transparent blur-3xl" />
      <div className="relative grid gap-4 medium:grid-cols-12">
        {images.map((image, index) => {
          const resolvedUrl = image.url
            ? resolveMedusaAssetUrl(image.url)
            : undefined
          const isHeroImage = index === 0
          const imageLayoutClass = isHeroImage
            ? "aspect-[4/5] rounded-[2rem] medium:col-span-7 medium:row-span-2"
            : index > 2
            ? "aspect-[4/5] rounded-[1.5rem] medium:col-span-4"
            : "aspect-[4/5] rounded-[1.5rem] medium:col-span-5"

          return (
            <Container
              key={image.id}
              className={[
                "group relative w-full overflow-hidden border border-white/80 bg-sage-100 shadow-[0_20px_60px_rgba(49,66,49,0.10)]",
                imageLayoutClass,
              ].join(" ")}
              id={image.id}
            >
              {resolvedUrl ? (
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
                <div className="pointer-events-none absolute inset-x-5 bottom-5 flex justify-between rounded-full border border-white/50 bg-white/75 px-4 py-2 text-xs font-medium text-sage-700 shadow-sm backdrop-blur">
                  <span>Zentee selection</span>
                  <span>{images.length} views</span>
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
