import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"

import { buildProductSpecifications } from "@lib/util/product-specifications"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductSpecificationsProps = {
  product: HttpTypes.StoreProduct
  selectedVariant?: HttpTypes.StoreProductVariant
}

export default function ProductSpecifications({
  product,
  selectedVariant,
}: ProductSpecificationsProps) {
  const rows = buildProductSpecifications(product, selectedVariant)

  if (rows.length === 0) {
    return null
  }

  const midpoint = Math.ceil(rows.length / 2)
  const left = rows.slice(0, midpoint)
  const right = rows.slice(midpoint)

  return (
    <section
      className="w-full border border-sage-200 rounded-xl p-6 bg-white"
      data-testid="product-specifications"
    >
      <Heading level="h2" className="text-xl font-semibold text-sage-900 mb-6">
        Product details
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-small-regular">
        {[left, right].map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-y-4">
            {column.map((row) => (
              <div key={row.label}>
                <span className="font-semibold text-sage-800">{row.label}</span>
                {row.href ? (
                  <p className="text-sage-700 capitalize">
                    <LocalizedClientLink
                      href={row.href}
                      className="text-brand-600 hover:text-brand-700"
                    >
                      {row.value}
                    </LocalizedClientLink>
                  </p>
                ) : (
                  <p className="text-sage-700">{row.value}</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
