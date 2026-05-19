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
  /** 列表卡片摘要 */
  summary?: string
  /** 详情页导语 */
  description?: string
  climate?: string
  soil?: string
  altitude?: string
  harvestSeason?: string
  highlights?: string[]
  teaStyles?: string[]
  history?: string
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
