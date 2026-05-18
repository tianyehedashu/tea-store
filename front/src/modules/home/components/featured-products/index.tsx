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
      {collections.slice(0, 3).map((collection, index) => (
        <div
          key={collection.id}
          className={
            index % 2 === 1 ? "bg-white rounded-3xl p-8 shadow-sm" : ""
          }
        >
          <ProductRail collection={collection} region={region} />
        </div>
      ))}
    </div>
  )
}
