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
      className="w-full rounded-lg border border-[#eadbc4] bg-white p-6 shadow-sm small:p-8"
      data-testid="product-specifications"
    >
      <Heading level="h2" className="mb-6 text-2xl font-semibold text-sage-900">
        Product details
      </Heading>
      <div className="grid grid-cols-1 gap-x-12 gap-y-4 text-small-regular md:grid-cols-2">
        {[left, right].map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-y-4">
            {column.map((row) => (
              <div
                key={row.label}
                className="rounded-lg bg-[#fffaf2] px-4 py-3"
              >
                <span className="section-eyebrow">
                  {row.label}
                </span>
                {row.href ? (
                  <p className="mt-1 text-sage-800 capitalize">
                    <LocalizedClientLink
                      href={row.href}
                      className="text-[#a6602e] hover:text-[#82471f]"
                    >
                      {row.value}
                    </LocalizedClientLink>
                  </p>
                ) : (
                  <p className="mt-1 text-sage-800">{row.value}</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
