"use client"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import { getVariantSizeLabel } from "@lib/types/tea-product-metadata"

type ProductPurchaseMetaProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}

export default function ProductPurchaseMeta({
  product,
  variant,
}: ProductPurchaseMetaProps) {
  const sku = variant?.sku
  const sizeLabel = getVariantSizeLabel(variant)
  const weight = product.weight

  if (!sku && !weight && !sizeLabel) {
    return null
  }

  return (
    <div
      className="flex flex-col gap-1 text-xs text-sage-600"
      data-testid="product-purchase-meta"
    >
      {sku && (
        <Text>
          <span className="font-medium text-sage-700">SKU:</span> {sku}
        </Text>
      )}
      {(sizeLabel || weight) && (
        <Text>
          <span className="font-medium text-sage-700">Net content:</span>{" "}
          {[sizeLabel, weight ? `${weight} g` : null].filter(Boolean).join(" · ")}
        </Text>
      )}
    </div>
  )
}
