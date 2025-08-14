"use server"

import { getGuideByTypeCMS, BrewingGuideDTO } from "@lib/data/sanity"
import { HttpTypes } from "@medusajs/types"

type BrewData = {
  teaType?: string
  waterTempC?: number
  leafGramPer100ml?: number
  brewTimes?: number
  timePlan?: { time_s?: number; note?: string }[]
  tips?: string
}

function extractOverride(metadata: Record<string, unknown> | null | undefined) {
  const override = (metadata as any)?.brew_override
  if (!override || typeof override !== "object") return null
  const o = override as Record<string, any>
  const data: BrewData = {
    teaType: (metadata as any)?.tea_type,
    waterTempC: typeof o.water_temp_c === "number" ? o.water_temp_c : undefined,
    leafGramPer100ml:
      typeof o.leaf_gram_per_100ml === "number" ? o.leaf_gram_per_100ml : undefined,
    brewTimes: typeof o.brew_times === "number" ? o.brew_times : undefined,
    timePlan: Array.isArray(o.time_plan) ? o.time_plan : undefined,
    tips: typeof o.tips === "string" ? o.tips : undefined,
  }
  return data
}

function mapGuideToBrewData(guide: BrewingGuideDTO | null): BrewData | null {
  if (!guide) return null
  return {
    teaType: guide.teaType,
    waterTempC: guide.waterTempC,
    leafGramPer100ml: guide.leafGramPer100ml,
    brewTimes: guide.brewTimes,
    timePlan: guide.timePlan,
    tips: guide.tips,
  }
}

export default async function BrewQuickTips({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const override = extractOverride(product?.metadata as any)
  let brew: BrewData | null = override

  if (!brew) {
    const teaType = (product?.metadata as any)?.tea_type
    if (teaType && typeof teaType === "string") {
      try {
        brew = mapGuideToBrewData(await getGuideByTypeCMS(teaType))
      } catch {
        brew = null
      }
    }
  }

  if (!brew) return null

  return (
    <div className="rounded-md border border-ui-border-base p-4">
      <div className="text-base font-semibold mb-2">Quick Brew</div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {typeof brew.waterTempC === "number" && (
          <div>
            <div className="text-ui-fg-subtle">Water Temp</div>
            <div className="font-medium">{brew.waterTempC} °C</div>
          </div>
        )}
        {typeof brew.leafGramPer100ml === "number" && (
          <div>
            <div className="text-ui-fg-subtle">Leaf / 100ml</div>
            <div className="font-medium">{brew.leafGramPer100ml} g</div>
          </div>
        )}
        {typeof brew.brewTimes === "number" && (
          <div>
            <div className="text-ui-fg-subtle">Times</div>
            <div className="font-medium">{brew.brewTimes}x</div>
          </div>
        )}
      </div>
      {brew.timePlan?.length ? (
        <div className="mt-3">
          <div className="text-ui-fg-subtle text-sm mb-1">Time Plan</div>
          <ul className="list-disc list-inside text-sm">
            {brew.timePlan.map((t, idx) => (
              <li key={idx}>
                {typeof t.time_s === "number" ? `${t.time_s}s` : "-"}
                {t.note ? ` – ${t.note}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {brew.tips ? (
        <div className="mt-3 text-sm">
          <div className="text-ui-fg-subtle mb-1">Tips</div>
          <p className="whitespace-pre-line">{brew.tips}</p>
        </div>
      ) : null}
    </div>
  )
}


