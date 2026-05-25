import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="block">
      <article className="tea-card group" data-testid="product-wrapper">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            alt={product.title}
            className="transition-all duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111d16]/35 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />

          {/* Tea Type Badge */}
          {typeof product.metadata?.tea_type === "string" && (
            <div className="absolute top-4 left-4">
              <span className="brand-badge bg-[#fffaf2]/90 backdrop-blur-sm">
                {String(product.metadata.tea_type)}
              </span>
            </div>
          )}

          {/* Grade Badge */}
          {typeof product.metadata?.grade === "string" && (
            <div className="absolute top-4 right-4">
              <span className="rounded-full border border-[#eadbc4] bg-white/90 px-2 py-1 text-xs font-semibold text-[#82471f] backdrop-blur-sm">
                {String(product.metadata.grade)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4 p-4 small:p-5">
          {/* Title and Origin */}
          <div className="space-y-2">
            <h3
              className="line-clamp-2 text-lg font-semibold text-sage-900 transition-colors duration-300 group-hover:text-[#82471f]"
              data-testid="product-title"
            >
              {product.title}
            </h3>
            {typeof product.metadata?.origin_id === "string" && (
              <p className="text-sm text-sage-600 capitalize">
                Origin: {String(product.metadata.origin_id)}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            {cheapestPrice && (
              <div className="flex items-center gap-2">
                <PreviewPrice price={cheapestPrice} />
              </div>
            )}
          </div>

          {/* Flavor Notes */}
          {Array.isArray(product.metadata?.flavor_notes) &&
            product.metadata.flavor_notes.length > 0 && (
              <div className="space-y-2">
                <p className="section-eyebrow">Flavor Notes</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.metadata.flavor_notes
                    .slice(0, 4)
                    .map((note: string) => (
                      <span
                        key={note}
                        className="inline-block rounded-full border border-[#eadbc4] bg-[#fffaf2] px-2.5 py-1 text-xs capitalize text-sage-700 small:px-3"
                      >
                        {note}
                      </span>
                    ))}
                </div>
              </div>
            )}

          {/* Brewing Info Hint */}
          {typeof product.metadata?.brew_override === "string" && (
            <div className="flex items-center gap-2 border-t border-[#eadbc4] pt-3 text-xs font-medium text-sage-600">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Brewing guide included</span>
            </div>
          )}
        </div>
      </article>
    </LocalizedClientLink>
  )
}
