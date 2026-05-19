"use server"

import { cache } from "react"
import { getOriginBySlugCMS, getOriginsCMS } from "./cms/origins"
import { OriginDTO } from "./cms/types"
import {
  buildFallbackOrigins,
  getFallbackOriginBySlug,
} from "./origins-fallback"

/** CMS 条目缺字段时，用 catalog 回落补全文案（图片与商品仍以 CMS 为准）。 */
function mergeWithCatalogFallback(origin: OriginDTO): OriginDTO {
  const fallback = getFallbackOriginBySlug(origin.slug)
  if (!fallback) {
    return origin
  }

  return {
    ...fallback,
    ...origin,
    id: origin.id,
    title: origin.title || fallback.title,
    slug: origin.slug,
    heroImage: origin.heroImage ?? fallback.heroImage,
    products:
      origin.products && origin.products.length > 0
        ? origin.products
        : fallback.products,
    flavorProfile: origin.flavorProfile?.length
      ? origin.flavorProfile
      : fallback.flavorProfile,
    summary: origin.summary || fallback.summary,
    description: origin.description || fallback.description,
    climate: origin.climate || fallback.climate,
    soil: origin.soil || fallback.soil,
    altitude: origin.altitude || fallback.altitude,
    harvestSeason: origin.harvestSeason || fallback.harvestSeason,
    highlights: origin.highlights?.length
      ? origin.highlights
      : fallback.highlights,
    teaStyles: origin.teaStyles?.length ? origin.teaStyles : fallback.teaStyles,
    history: origin.history || fallback.history,
  }
}

/** Sanity 优先；无文档或 API 不可用时使用 origin-catalog。 */
export const getOrigins = cache(async () => {
  try {
    const fromCms = await getOriginsCMS()
    if (fromCms.length > 0) {
      return fromCms.map(mergeWithCatalogFallback)
    }
  } catch {
    // SANITY_* 未配置或查询失败
  }
  return buildFallbackOrigins()
})

export const getOriginBySlug = cache(async (slug: string) => {
  try {
    const fromCms = await getOriginBySlugCMS(slug)
    if (fromCms) {
      return mergeWithCatalogFallback(fromCms)
    }
  } catch {
    // fall through to catalog
  }
  return getFallbackOriginBySlug(slug)
})
