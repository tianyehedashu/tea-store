"use server"

import { cache } from "react"
import { sanityFetch, SanityClientOptions } from "./client"
import { OriginDTO } from "./types"

const ORIGINS_LIST_GROQ = `
  *[_type == "origin"]|order(title asc){
    "id": _id,
    title,
    "slug": slug.current,
    country,
    region,
    mountain,
    flavor_profile,
    hero_image,
    "products": related_products[]->{"handle": medusa_handle}
  }
`

const ORIGIN_BY_SLUG_GROQ = `
  *[_type == "origin" && slug.current == $slug][0]{
    "id": _id,
    title,
    "slug": slug.current,
    country,
    region,
    mountain,
    flavor_profile,
    hero_image,
    "products": related_products[]->{"handle": medusa_handle}
  }
`

const mapOrigin = (o: any): OriginDTO => ({
  id: o?.id,
  title: o?.title,
  slug: o?.slug,
  country: o?.country,
  region: o?.region,
  mountain: o?.mountain,
  flavorProfile: o?.flavor_profile,
  heroImage: o?.hero_image,
  products: o?.products,
})

export const getOriginsCMS = cache(async (opts?: SanityClientOptions) => {
  const res = await sanityFetch<any[]>(ORIGINS_LIST_GROQ, {}, {
    useDraft: opts?.useDraft,
    tags: ["origins"],
  })
  return (res || []).map(mapOrigin)
})

export const getOriginBySlugCMS = cache(async (
  slug: string,
  opts?: SanityClientOptions
) => {
  const res = await sanityFetch<any>(
    ORIGIN_BY_SLUG_GROQ,
    { slug },
    { useDraft: opts?.useDraft, tags: ["origins", `origin-${slug}`] }
  )
  return res ? mapOrigin(res) : null
})


