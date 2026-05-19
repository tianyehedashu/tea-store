import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"

import { resolveMedusaAssetUrl } from "@lib/util/medusa-image-url"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-brand-100/70 via-cream-100/60 to-transparent blur-2xl" />
      <div className="relative flex flex-col gap-y-4">
        {images.map((image, index) => {
          const resolvedUrl = image.url
            ? resolveMedusaAssetUrl(image.url)
            : undefined
          return (
            <Container
              key={image.id}
              className="group relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-white/80 bg-sage-100 shadow-[0_20px_60px_rgba(49,66,49,0.12)]"
              id={image.id}
            >
              {resolvedUrl ? (
                <Image
                  src={resolvedUrl}
                  priority={index <= 2 ? true : false}
                  className="absolute inset-0 rounded-[2rem] transition duration-500 group-hover:scale-[1.03]"
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 576px) 100vw, (max-width: 1024px) 80vw, 560px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              ) : null}
            </Container>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
