import { HttpTypes } from "@medusajs/types"

import { extractBrewOverride } from "@lib/util/brew-data"

export const DEFAULT_BRAND_NAME = "Zentee"

export type TeaProductMetadata = {
  brand_name?: string
  bullet_points?: string[]
  item_form?: string
  ingredients?: string
  allergen_information?: string
  country_of_origin?: string
  organic_certified?: boolean | string
  caffeine_level?: string
  manufacturer?: string
  legal_disclaimer?: string
  unit_count?: number
  tea_type?: string
  tea_category?: string
  origin_id?: string
  grade?: string
  harvest_season?: string
  cultivar?: string
  oxidation_level?: number
  flavor_notes?: string[]
  aroma_notes?: string[]
  altitude?: string
  origin_province?: string
  origin_region?: string
  origin_altitude?: string
  origin_climate?: string
  origin_soil?: string
  origin_history?: string
  geographic_description?: string
  brew_override?: Record<string, unknown>
}

const TEA_TYPE_LABELS: Record<string, string> = {
  green: "Green Tea",
  black: "Black Tea",
  white: "White Tea",
  oolong: "Oolong Tea",
  puer: "Pu-erh Tea",
  dark: "Dark Tea",
  yellow: "Yellow Tea",
  flower: "Flower Tea",
  herbal: "Herbal Tea",
}

export function getTeaMetadata(
  product: HttpTypes.StoreProduct
): TeaProductMetadata {
  return (product.metadata ?? {}) as TeaProductMetadata
}

export function getBrandName(metadata: TeaProductMetadata): string {
  return metadata.brand_name?.trim() || DEFAULT_BRAND_NAME
}

export function formatTeaType(teaType?: string): string | undefined {
  if (!teaType) {
    return undefined
  }
  return TEA_TYPE_LABELS[teaType] ?? teaType
}

export function formatOrganic(value: boolean | string | undefined): string {
  if (value === true || value === "true" || value === "yes") {
    return "Yes"
  }
  if (value === false || value === "false" || value === "no") {
    return "No"
  }
  if (typeof value === "string" && value.length > 0) {
    return value
  }
  return "No"
}

export function getBulletPoints(product: HttpTypes.StoreProduct): string[] {
  const metadata = getTeaMetadata(product)
  if (Array.isArray(metadata.bullet_points)) {
    const points = metadata.bullet_points
      .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
      .slice(0, 5)
    if (points.length > 0) {
      return points
    }
  }

  const fallback: string[] = []

  if (Array.isArray(metadata.flavor_notes)) {
    const notes = metadata.flavor_notes
      .filter((n): n is string => typeof n === "string" && n.length > 0)
      .slice(0, 2)
    if (notes.length > 0) {
      fallback.push(`Flavor profile: ${notes.join(", ")}`)
    }
  }

  if (metadata.grade) {
    fallback.push(`Grade: ${metadata.grade}`)
  }

  const brew = extractBrewOverride(
    product.metadata as Record<string, unknown> | null | undefined
  )
  if (brew?.tips) {
    fallback.push(brew.tips)
  }

  return fallback.slice(0, 3)
}

export function getVariantSizeLabel(
  variant?: HttpTypes.StoreProductVariant
): string | undefined {
  const option = variant?.options?.find((o) =>
    o.option?.title?.toLowerCase().includes("size")
  )
  return option?.value ?? variant?.title ?? undefined
}
