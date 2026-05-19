import { HttpTypes } from "@medusajs/types"

import {
  formatOrganic,
  formatTeaType,
  getTeaMetadata,
  getVariantSizeLabel,
} from "@lib/types/tea-product-metadata"

export type ProductSpecRow = {
  label: string
  value: string
  href?: string
}

function pushRow(
  rows: ProductSpecRow[],
  label: string,
  value: string | undefined,
  href?: string
) {
  if (!value?.trim()) {
    return
  }
  rows.push({ label, value: value.trim(), href })
}

export function buildProductSpecifications(
  product: HttpTypes.StoreProduct,
  selectedVariant?: HttpTypes.StoreProductVariant
): ProductSpecRow[] {
  const metadata = getTeaMetadata(product)
  const rows: ProductSpecRow[] = []

  pushRow(rows, "Brand", metadata.brand_name ?? "Zentee")
  pushRow(rows, "Tea variety", formatTeaType(metadata.tea_type))

  if (Array.isArray(metadata.flavor_notes) && metadata.flavor_notes.length > 0) {
    pushRow(
      rows,
      "Flavor",
      metadata.flavor_notes.map((n) => n).join(", ")
    )
  }

  pushRow(rows, "Item form", metadata.item_form)
  pushRow(rows, "Caffeine content", metadata.caffeine_level)
  pushRow(rows, "Grade", metadata.grade)
  pushRow(rows, "Cultivar", metadata.cultivar)
  pushRow(rows, "Harvest season", metadata.harvest_season)

  if (metadata.oxidation_level !== undefined) {
    pushRow(rows, "Oxidation level", `${metadata.oxidation_level}%`)
  }

  if (metadata.origin_id) {
    pushRow(rows, "Origin", metadata.origin_id, `/origins/${metadata.origin_id}`)
  }

  const country =
    product.origin_country ?? metadata.country_of_origin ?? undefined
  pushRow(rows, "Country of origin", country)

  pushRow(rows, "Organic", formatOrganic(metadata.organic_certified))

  const sizeLabel = getVariantSizeLabel(selectedVariant)
  if (sizeLabel) {
    pushRow(rows, "Size", sizeLabel)
  }

  if (product.weight) {
    pushRow(rows, "Package weight", `${product.weight} g`)
  }

  if (metadata.unit_count !== undefined) {
    pushRow(rows, "Unit count", String(metadata.unit_count))
  }

  if (selectedVariant?.sku) {
    pushRow(rows, "SKU", selectedVariant.sku)
  }

  pushRow(rows, "Material", product.material ?? undefined)

  if (product.type?.value) {
    pushRow(rows, "Product type", product.type.value)
  }

  if (product.length && product.width && product.height) {
    pushRow(
      rows,
      "Dimensions",
      `${product.length}L x ${product.width}W x ${product.height}H`
    )
  }

  return rows
}

export function hasComplianceContent(product: HttpTypes.StoreProduct): boolean {
  const metadata = getTeaMetadata(product)
  return Boolean(
    metadata.ingredients?.trim() ||
      metadata.allergen_information?.trim() ||
      metadata.legal_disclaimer?.trim() ||
      metadata.manufacturer?.trim()
  )
}
