import { HttpTypes } from "@medusajs/types"

import { getBulletPoints } from "@lib/types/tea-product-metadata"

type ProductBulletPointsProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductBulletPoints({
  product,
}: ProductBulletPointsProps) {
  const bullets = getBulletPoints(product)

  if (bullets.length === 0) {
    return null
  }

  return (
    <ul
      className="grid gap-2 text-sm text-sage-800"
      data-testid="product-bullet-points"
    >
      {bullets.map((point) => (
        <li key={point} className="flex gap-3 leading-relaxed">
          <span
            className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand-500"
            aria-hidden="true"
          />
          {point}
        </li>
      ))}
    </ul>
  )
}
