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
      className="list-disc pl-5 space-y-2 text-sm text-sage-800"
      data-testid="product-bullet-points"
    >
      {bullets.map((point) => (
        <li key={point} className="leading-relaxed">
          {point}
        </li>
      ))}
    </ul>
  )
}
