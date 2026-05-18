import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"

export type TeaTypeFilter =
  | "green"
  | "white"
  | "oolong"
  | "black"
  | "puer"
  | "herbal"

export type PriceRangeFilter = "under_15" | "15_30" | "30_50" | "50_plus"

export type TeaProductFilters = {
  teaType?: TeaTypeFilter
  premium?: boolean
  organic?: boolean
  caffeineFree?: boolean
  singleOrigin?: boolean
  priceRange?: PriceRangeFilter
}

const PRICE_RANGE_MAX: Record<PriceRangeFilter, number> = {
  under_15: 1500,
  "15_30": 3000,
  "30_50": 5000,
  "50_plus": Infinity,
}

const PRICE_RANGE_MIN: Record<PriceRangeFilter, number> = {
  under_15: 0,
  "15_30": 1500,
  "30_50": 3000,
  "50_plus": 5000,
}

function getCheapestAmount(product: HttpTypes.StoreProduct): number | null {
  try {
    const { cheapestPrice } = getProductPrice({ product })
    return cheapestPrice?.calculated_price_number ?? null
  } catch {
    return null
  }
}

function metadataString(
  metadata: Record<string, unknown> | null | undefined,
  key: string
): string | undefined {
  const value = metadata?.[key]
  return typeof value === "string" ? value : undefined
}

export function filterTeaProducts(
  products: HttpTypes.StoreProduct[],
  filters: TeaProductFilters
): HttpTypes.StoreProduct[] {
  if (!Object.values(filters).some(Boolean)) {
    return products
  }

  return products.filter((product) => {
    const metadata = product.metadata as Record<string, unknown> | undefined

    if (filters.teaType) {
      if (metadataString(metadata, "tea_type") !== filters.teaType) {
        return false
      }
    }

    if (filters.premium) {
      if (metadataString(metadata, "grade") !== "premium") {
        return false
      }
    }

    if (filters.organic) {
      const grade = metadataString(metadata, "grade")
      const organicCert = metadata?.organic_certified
      if (grade !== "organic" && organicCert !== true) {
        return false
      }
    }

    if (filters.caffeineFree) {
      const teaType = metadataString(metadata, "tea_type")
      const caffeine = metadataString(metadata, "caffeine_level")
      if (teaType !== "herbal" && caffeine !== "none" && caffeine !== "free") {
        return false
      }
    }

    if (filters.singleOrigin) {
      if (!metadataString(metadata, "origin_id")) {
        return false
      }
    }

    if (filters.priceRange) {
      const amount = getCheapestAmount(product)
      if (amount === null) {
        return false
      }
      const min = PRICE_RANGE_MIN[filters.priceRange]
      const max = PRICE_RANGE_MAX[filters.priceRange]
      if (amount < min || amount >= max) {
        return false
      }
    }

    return true
  })
}

export function parseTeaFiltersFromSearchParams(
  params: Record<string, string | string[] | undefined>
): TeaProductFilters {
  const get = (key: string) => {
    const v = params[key]
    return typeof v === "string" ? v : undefined
  }

  return {
    teaType: get("tea_type") as TeaTypeFilter | undefined,
    premium: get("premium") === "1",
    organic: get("organic") === "1",
    caffeineFree: get("caffeine_free") === "1",
    singleOrigin: get("single_origin") === "1",
    priceRange: get("price") as PriceRangeFilter | undefined,
  }
}
