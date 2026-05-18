import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { filterTeaProducts, TeaTypeFilter } from "@lib/util/tea-product-filters"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function OrderSuggestedProducts({
  order,
  countryCode,
}: {
  order: HttpTypes.StoreOrder
  countryCode: string
}) {
  const region = await getRegion(countryCode)
  if (!region) {
    return null
  }

  const anchorItem = order.items?.find((item) => item.product?.handle)
  const anchorProduct = anchorItem?.product
  if (!anchorProduct) {
    return null
  }

  const metadata = anchorProduct.metadata as Record<string, unknown> | undefined
  const teaType =
    typeof metadata?.tea_type === "string" ? metadata.tea_type : undefined

  const { response } = await listProducts({
    countryCode,
    queryParams: { limit: 24 },
  })

  let candidates = response.products.filter((p) => p.id !== anchorProduct.id)

  if (teaType) {
    const sameType = filterTeaProducts(candidates, {
      teaType: teaType as TeaTypeFilter,
    })
    if (sameType.length > 0) {
      candidates = sameType
    }
  } else if (anchorProduct.collection_id) {
    candidates = candidates.filter(
      (p) => p.collection_id === anchorProduct.collection_id
    )
  }

  const suggested = candidates.slice(0, 4)
  if (suggested.length === 0) {
    return null
  }

  return (
    <div className="mt-10 pt-8 border-t border-sage-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-sage-900">
          You might also enjoy
        </h2>
        <LocalizedClientLink
          href="/store"
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          View all teas
        </LocalizedClientLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-6">
        {suggested.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>
    </div>
  )
}
