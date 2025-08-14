export type OriginDTO = {
  id: string
  title: string
  slug: string
  country?: string
  region?: string
  mountain?: string
  flavorProfile?: string[]
  heroImage?: unknown
  products?: { handle: string }[]
}

export type BrewingGuideDTO = {
  id: string
  slug: string
  teaType: string
  vessel?: string
  waterTempC?: number
  leafGramPer100ml?: number
  brewTimes?: number
  timePlan?: { time_s?: number; note?: string }[]
  tips?: string
  recommendedProducts?: { handle: string }[]
}


