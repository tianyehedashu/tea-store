import { ORIGIN_CATALOG, OriginCatalogEntry } from "@lib/constants/origin-catalog"
import { resolveMedusaAssetUrl } from "@lib/util/medusa-image-url"
import { OriginDTO } from "./cms/types"

function catalogEntryToOrigin(entry: OriginCatalogEntry): OriginDTO {
  const imageUrl = entry.heroImagePath
    ? resolveMedusaAssetUrl(entry.heroImagePath)
    : undefined

  return {
    id: `fallback-${entry.slug}`,
    title: entry.title,
    slug: entry.slug,
    country: entry.country,
    region: entry.region,
    mountain: entry.mountain,
    flavorProfile: entry.flavorProfile,
    summary: entry.summary,
    description: entry.description,
    climate: entry.climate,
    soil: entry.soil,
    altitude: entry.altitude,
    harvestSeason: entry.harvestSeason,
    highlights: entry.highlights,
    teaStyles: entry.teaStyles,
    history: entry.history,
    heroImage: imageUrl ? { url: imageUrl } : undefined,
    products: entry.productHandles.map((handle) => ({ handle })),
  }
}

export function buildFallbackOrigins(): OriginDTO[] {
  return ORIGIN_CATALOG.map(catalogEntryToOrigin)
}

export function getFallbackOriginBySlug(slug: string): OriginDTO | null {
  const entry = ORIGIN_CATALOG.find((item) => item.slug === slug)
  return entry ? catalogEntryToOrigin(entry) : null
}
