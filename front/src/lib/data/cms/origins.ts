"use server"

import { cache } from "react"
import { sanityFetch, SanityClientOptions } from "./client"
import { OriginDTO } from "./types"

const ORIGIN_FIELDS = `
  "id": _id,
  title,
  "slug": slug.current,
  country,
  region,
  mountain,
  flavor_profile,
  summary,
  description,
  climate,
  soil,
  altitude,
  harvest_season,
  highlights,
  tea_styles,
  history,
  "hero_image": hero_image{
    "url": asset->url
  },
  "products": related_products[]->{"handle": medusa_handle}
`

const ORIGINS_LIST_GROQ = `
  *[_type == "origin"]|order(title asc){
    ${ORIGIN_FIELDS}
  }
`

const ORIGIN_BY_SLUG_GROQ = `
  *[_type == "origin" && slug.current == $slug][0]{
    ${ORIGIN_FIELDS}
  }
`

const mapOrigin = (o: Record<string, unknown> | null | undefined): OriginDTO => ({
  id: o?.id as string,
  title: o?.title as string,
  slug: o?.slug as string,
  country: o?.country as string | undefined,
  region: o?.region as string | undefined,
  mountain: o?.mountain as string | undefined,
  flavorProfile: o?.flavor_profile as string[] | undefined,
  summary: o?.summary as string | undefined,
  description: o?.description as string | undefined,
  climate: o?.climate as string | undefined,
  soil: o?.soil as string | undefined,
  altitude: o?.altitude as string | undefined,
  harvestSeason: o?.harvest_season as string | undefined,
  highlights: o?.highlights as string[] | undefined,
  teaStyles: o?.tea_styles as string[] | undefined,
  history: o?.history as string | undefined,
  heroImage: o?.hero_image,
  products: o?.products as { handle: string }[] | undefined,
})

export const getOriginsCMS = cache(async (opts?: SanityClientOptions) => {
  const res = await sanityFetch<Record<string, unknown>[]>(
    ORIGINS_LIST_GROQ,
    {},
    {
      useDraft: opts?.useDraft,
      tags: ["origins"],
    }
  )
  return (res || []).map(mapOrigin)
})

export const getOriginBySlugCMS = cache(
  async (slug: string, opts?: SanityClientOptions) => {
    const res = await sanityFetch<Record<string, unknown>>(
      ORIGIN_BY_SLUG_GROQ,
      { slug },
      { useDraft: opts?.useDraft, tags: ["origins", `origin-${slug}`] }
    )
    return res ? mapOrigin(res) : null
  }
)
