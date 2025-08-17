import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Collection Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="font-display text-2xl small:text-3xl font-bold text-sage-900">
            {collection.title}
          </h3>
          {collection.metadata?.description && (
            <p className="text-sage-600 max-w-2xl">
              {String(collection.metadata.description)}
            </p>
          )}
        </div>
        <LocalizedClientLink
          href={`/collections/${collection.handle}`}
          className="group flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold transition-colors duration-300"
        >
          <span>View All</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </LocalizedClientLink>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 large:grid-cols-4 gap-8">
        {pricedProducts.slice(0, 4).map((product) => (
          <div key={product.id} className="h-full">
            <ProductPreview product={product} region={region} isFeatured />
          </div>
        ))}
      </div>

      {/* Show all button for mobile */}
      <div className="flex justify-center small:hidden">
        <LocalizedClientLink
          href={`/collections/${collection.handle}`}
          className="brand-outline w-full text-center"
        >
          View All {collection.title}
        </LocalizedClientLink>
      </div>
    </div>
  )
}
