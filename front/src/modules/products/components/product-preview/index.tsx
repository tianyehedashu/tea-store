import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
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
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="block">
      <article className="tea-card group" data-testid="product-wrapper">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/5]">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="transition-all duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sage-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          {/* Tea Type Badge */}
          {typeof product.metadata?.tea_type === 'string' && (
            <div className="absolute top-4 left-4">
              <span className="brand-badge backdrop-blur-sm bg-white/90">
                {String(product.metadata.tea_type)}
              </span>
            </div>
          )}
          
          {/* Grade Badge */}
          {typeof product.metadata?.grade === 'string' && (
            <div className="absolute top-4 right-4">
              <span className="px-2 py-1 text-xs font-medium bg-cream-100 text-cream-800 rounded-full border border-cream-200">
                {String(product.metadata.grade)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title and Origin */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-sage-900 group-hover:text-brand-600 transition-colors duration-300 line-clamp-2" data-testid="product-title">
              {product.title}
            </h3>
            {typeof product.metadata?.origin_id === 'string' && (
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
          {Array.isArray(product.metadata?.flavor_notes) && product.metadata.flavor_notes.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-sage-700 uppercase tracking-wide">Flavor Notes</p>
              <div className="flex flex-wrap gap-1.5">
                {product.metadata.flavor_notes.slice(0, 4).map((note: string) => (
                  <span key={note} className="inline-block px-3 py-1 text-xs bg-sage-50 text-sage-700 rounded-full border border-sage-200 capitalize">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Brewing Info Hint */}
          {typeof product.metadata?.brew_override === 'string' && (
            <div className="flex items-center gap-2 text-xs text-sage-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Brewing guide included</span>
            </div>
          )}
        </div>
      </article>
    </LocalizedClientLink>
  )
}
