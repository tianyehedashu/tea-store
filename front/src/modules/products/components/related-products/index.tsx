import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { filterTeaProducts, TeaTypeFilter } from "@lib/util/tea-product-filters"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const metadata = product.metadata as Record<string, unknown> | undefined
  const teaType =
    typeof metadata?.tea_type === "string"
      ? (metadata.tea_type as TeaTypeFilter)
      : undefined

  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 24,
    },
  })

  let candidates = response.products.filter(
    (p) => p.id !== product.id && !p.is_giftcard
  )

  if (teaType) {
    const sameType = filterTeaProducts(candidates, { teaType })
    if (sameType.length > 0) {
      candidates = sameType
    }
  } else if (product.collection_id) {
    candidates = candidates.filter(
      (p) => p.collection_id === product.collection_id
    )
  } else if (product.tags?.length) {
    const tagIds = new Set(product.tags.map((t) => t.id).filter(Boolean))
    candidates = candidates.filter((p) =>
      p.tags?.some((t) => t.id && tagIds.has(t.id))
    )
  }

  const products = candidates.slice(0, 4)

  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-gray-600 mb-6">
          Related products
        </span>
        <p className="font-display text-2xl font-semibold text-sage-900 max-w-lg">
          {teaType
            ? "More teas from the same family, curated for your taste."
            : "You might also want to check out these products."}
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((related) => (
          <li key={related.id}>
            <Product region={region} product={related} />
          </li>
        ))}
      </ul>
    </div>
  )
}
