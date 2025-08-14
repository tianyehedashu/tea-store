"use server"

import { cache } from "react"
import { sanityFetch, SanityClientOptions } from "./client"
import { BrewingGuideDTO } from "./types"

const GUIDES_LIST_GROQ = `
  *[_type == "brewingGuide"]|order(tea_type asc){
    "id": _id,
    "slug": slug.current,
    tea_type,
    vessel,
    water_temp_c,
    leaf_gram_per_100ml,
    brew_times,
    time_plan,
    tips,
    "recommendedProducts": recommended_products[]->{"handle": medusa_handle}
  }
`

const GUIDE_BY_SLUG_GROQ = `
  *[_type == "brewingGuide" && slug.current == $slug][0]{
    "id": _id,
    "slug": slug.current,
    tea_type,
    vessel,
    water_temp_c,
    leaf_gram_per_100ml,
    brew_times,
    time_plan,
    tips,
    "recommendedProducts": recommended_products[]->{"handle": medusa_handle}
  }
`

const GUIDE_BY_TYPE_GROQ = `
  *[_type == "brewingGuide" && tea_type == $teaType][0]{
    "id": _id,
    "slug": slug.current,
    tea_type,
    vessel,
    water_temp_c,
    leaf_gram_per_100ml,
    brew_times,
    time_plan,
    tips,
    "recommendedProducts": recommended_products[]->{"handle": medusa_handle}
  }
`

const mapGuide = (g: any): BrewingGuideDTO => ({
  id: g?.id,
  slug: g?.slug,
  teaType: g?.tea_type,
  vessel: g?.vessel,
  waterTempC: g?.water_temp_c,
  leafGramPer100ml: g?.leaf_gram_per_100ml,
  brewTimes: g?.brew_times,
  timePlan: g?.time_plan,
  tips: g?.tips,
  recommendedProducts: g?.recommendedProducts,
})

export const getGuidesCMS = cache(async (opts?: SanityClientOptions) => {
  const res = await sanityFetch<any[]>(GUIDES_LIST_GROQ, {}, {
    useDraft: opts?.useDraft,
    tags: ["guides"],
  })
  return (res || []).map(mapGuide)
})

export const getGuideBySlugCMS = cache(async (
  slug: string,
  opts?: SanityClientOptions
) => {
  const res = await sanityFetch<any>(
    GUIDE_BY_SLUG_GROQ,
    { slug },
    { useDraft: opts?.useDraft, tags: ["guides", `guide-${slug}`] }
  )
  return res ? mapGuide(res) : null
})

export const getGuideByTypeCMS = cache(async (
  teaType: string,
  opts?: SanityClientOptions
) => {
  const res = await sanityFetch<any>(
    GUIDE_BY_TYPE_GROQ,
    { teaType },
    { useDraft: opts?.useDraft, tags: ["guides", `guide-type-${teaType}`] }
  )
  return res ? mapGuide(res) : null
})


