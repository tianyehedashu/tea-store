import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  return (
    <div className="space-y-16">
      {collections.slice(0, 3).map((collection) => (
        <div key={collection.id}>
          <ProductRail collection={collection} region={region} />
        </div>
      ))}
    </div>
  )
}
