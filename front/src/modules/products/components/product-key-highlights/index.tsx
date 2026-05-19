import { HttpTypes } from "@medusajs/types"

import { formatTeaType, getTeaMetadata } from "@lib/types/tea-product-metadata"

type ProductKeyHighlightsProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductKeyHighlights({
  product,
}: ProductKeyHighlightsProps) {
  const metadata = getTeaMetadata(product)
  const badges: string[] = []

  const teaLabel = formatTeaType(metadata.tea_type)
  if (teaLabel) {
    badges.push(teaLabel)
  }

  if (metadata.grade) {
    badges.push(String(metadata.grade))
  }

  if (
    metadata.organic_certified === true ||
    metadata.organic_certified === "true" ||
    metadata.organic_certified === "yes"
  ) {
    badges.push("Organic")
  }

  if (metadata.caffeine_level) {
    badges.push(String(metadata.caffeine_level))
  }

  if (badges.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2" data-testid="product-key-highlights">
      {badges.map((badge) => (
        <span key={badge} className="brand-badge capitalize text-xs">
          {badge}
        </span>
      ))}
    </div>
  )
}
