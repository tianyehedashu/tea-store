import { getGuideByTypeCMS, BrewingGuideDTO } from "@lib/data/sanity"

export type BrewData = {
  teaType?: string
  waterTempC?: number
  leafGramPer100ml?: number
  brewTimes?: number
  timePlan?: { time_s?: number; note?: string }[]
  tips?: string
}

export function extractBrewOverride(
  metadata: Record<string, unknown> | null | undefined
): BrewData | null {
  const override = metadata?.brew_override
  if (!override || typeof override !== "object") {
    return null
  }

  const o = override as Record<string, unknown>
  return {
    teaType:
      typeof metadata?.tea_type === "string" ? metadata.tea_type : undefined,
    waterTempC: typeof o.water_temp_c === "number" ? o.water_temp_c : undefined,
    leafGramPer100ml:
      typeof o.leaf_gram_per_100ml === "number"
        ? o.leaf_gram_per_100ml
        : undefined,
    brewTimes: typeof o.brew_times === "number" ? o.brew_times : undefined,
    timePlan: Array.isArray(o.time_plan) ? o.time_plan : undefined,
    tips: typeof o.tips === "string" ? o.tips : undefined,
  }
}

export function mapGuideToBrewData(
  guide: BrewingGuideDTO | null
): BrewData | null {
  if (!guide) {
    return null
  }

  return {
    teaType: guide.teaType,
    waterTempC: guide.waterTempC,
    leafGramPer100ml: guide.leafGramPer100ml,
    brewTimes: guide.brewTimes,
    timePlan: guide.timePlan,
    tips: guide.tips,
  }
}

export async function resolveBrewData(
  metadata: Record<string, unknown> | null | undefined
): Promise<BrewData | null> {
  const override = extractBrewOverride(metadata)
  if (override) {
    return override
  }

  const teaType = metadata?.tea_type
  if (typeof teaType !== "string") {
    return null
  }

  try {
    return mapGuideToBrewData(await getGuideByTypeCMS(teaType))
  } catch {
    return null
  }
}
