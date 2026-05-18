import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"

type ProductsByHandlesProps = {
  handles: string[]
  countryCode: string
  title?: string
  subtitle?: string
  limit?: number
}

export default async function ProductsByHandles({
  handles,
  countryCode,
  title = "Recommended teas",
  subtitle,
  limit = 4,
}: ProductsByHandlesProps) {
  const uniqueHandles = Array.from(new Set(handles.filter(Boolean))).slice(
    0,
    limit
  )
  if (uniqueHandles.length === 0) {
    return null
  }

  const region = await getRegion(countryCode)
  if (!region) {
    return null
  }

  const { response } = await listProducts({
    countryCode,
    queryParams: { limit: 48 },
  })

  const products = uniqueHandles
    .map((handle) => response.products.find((p) => p.handle === handle))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  if (products.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-sage-900">{title}</h2>
        {subtitle ? (
          <p className="mt-2 text-sage-600 leading-relaxed">{subtitle}</p>
        ) : null}
      </div>
      <ul className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-4 gap-6">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>
    </section>
  )
}
