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
      <div className="flex flex-col gap-4 small:flex-row small:items-end small:justify-between">
        <div className="space-y-2">
          <p className="section-eyebrow">Collection</p>
          <h3 className="font-display text-2xl leading-tight text-sage-900 small:text-4xl">
            {collection.title}
          </h3>
          {typeof collection.metadata?.description === "string" &&
            collection.metadata.description && (
              <p className="text-sage-600 max-w-2xl">
                {collection.metadata.description}
              </p>
            )}
        </div>
        <LocalizedClientLink
          href={`/collections/${collection.handle}`}
          className="brand-outline hidden small:inline-flex"
        >
          <span>View All</span>
          <span aria-hidden>→</span>
        </LocalizedClientLink>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-5 xsmall:gap-6 small:grid-cols-2 small:gap-8 medium:grid-cols-3 large:grid-cols-4">
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
          className="brand-outline w-full justify-center"
        >
          View All {collection.title}
        </LocalizedClientLink>
      </div>
    </div>
  )
}
