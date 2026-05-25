"use client"

import { HttpTypes } from "@medusajs/types"
import { Text, Heading } from "@medusajs/ui"

type TeaBrewingMetadata = {
  water_temperature?: number
  water_quality?: string
  tea_to_water_ratio?: string
  steeping_times?: { round: number; time_seconds: number; note?: string }[]
  brewing_steps?: string[]
  vessel_recommendations?: string[]
  advanced_techniques?: string
  tasting_notes?: string[]
  optimal_servings?: number
  water_volume?: string
}

type TeaBrewingGuideProps = {
  product: HttpTypes.StoreProduct
}

const TeaBrewingGuide = ({ product }: TeaBrewingGuideProps) => {
  const metadata = (product.metadata as TeaBrewingMetadata) || {}

  const vesselTypeMap: Record<string, { name: string; description: string }> = {
    gaiwan: {
      name: "Gaiwan",
      description: "Traditional lidded bowl, excellent for all teas",
    },
    "yixing-teapot": {
      name: "Yixing Teapot",
      description: "Purple clay, enhances tea flavor over time",
    },
    "glass-cup": {
      name: "Glass Cup",
      description: "Perfect for green teas, watch leaves unfurl",
    },
    "ceramic-teapot": {
      name: "Ceramic Teapot",
      description: "Neutral material, preserves original taste",
    },
    "bamboo-whisk": {
      name: "Bamboo Whisk",
      description: "Essential for whisked teas like matcha",
    },
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`
  }

  return (
    <div className="space-y-5">
      {/* Quick Brewing Parameters */}
      <div className="rounded-lg border border-[#eadbc4] bg-[#fffaf2] p-5">
        <Heading
          level="h3"
          className="mb-4 flex items-center gap-2 text-lg font-semibold text-sage-900"
        >
          Quick Brewing Guide
        </Heading>

        <div className="grid grid-cols-1 gap-3 xsmall:grid-cols-2 md:grid-cols-4">
          {metadata.water_temperature && (
            <div className="rounded-lg border border-white/80 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-brand-700">
                {metadata.water_temperature}°C
              </div>
              <Text className="text-sm text-sage-600">Water Temp</Text>
            </div>
          )}

          {metadata.tea_to_water_ratio && (
            <div className="rounded-lg border border-white/80 bg-white p-4 text-center shadow-sm">
              <div className="text-lg font-bold text-brand-700">
                {metadata.tea_to_water_ratio}
              </div>
              <Text className="text-sm text-sage-600">Tea:Water Ratio</Text>
            </div>
          )}

          {metadata.water_volume && (
            <div className="rounded-lg border border-white/80 bg-white p-4 text-center shadow-sm">
              <div className="text-lg font-bold text-brand-700">
                {metadata.water_volume}
              </div>
              <Text className="text-sm text-sage-600">Water Volume</Text>
            </div>
          )}

          {metadata.optimal_servings && (
            <div className="rounded-lg border border-white/80 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-brand-700">
                {metadata.optimal_servings}
              </div>
              <Text className="text-sm text-sage-600">Servings</Text>
            </div>
          )}
        </div>

        {metadata.water_quality && (
          <div className="mt-4 rounded-lg bg-white/75 p-4">
            <Text className="text-sm font-medium text-sage-700">
              Water Quality
            </Text>
            <Text className="text-sage-800">{metadata.water_quality}</Text>
          </div>
        )}
      </div>

      {/* Steeping Times */}
      {metadata.steeping_times && metadata.steeping_times.length > 0 && (
        <div className="rounded-lg border border-[#eadbc4] bg-[#fffaf2] p-5">
          <Heading
            level="h3"
            className="mb-4 flex items-center gap-2 text-lg font-semibold text-cream-900"
          >
            Steeping Timeline
          </Heading>

          <div className="space-y-3">
            {metadata.steeping_times.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-lg border border-[#eadbc4] bg-white p-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-200 font-bold text-cream-900">
                  {step.round}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Text className="font-semibold text-cream-900">
                      {formatTime(step.time_seconds)}
                    </Text>
                    {step.note && (
                      <Text className="text-sm text-cream-800">
                        - {step.note}
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brewing Steps */}
      {metadata.brewing_steps && metadata.brewing_steps.length > 0 && (
        <div className="rounded-lg border border-[#eadbc4] bg-white p-5">
          <Heading
            level="h3"
            className="mb-4 flex items-center gap-2 text-lg font-semibold text-sage-900"
          >
            Step-by-Step Instructions
          </Heading>

          <ol className="space-y-3">
            {metadata.brewing_steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-sage-100 text-sm font-bold text-sage-800">
                  {index + 1}
                </div>
                <Text className="leading-relaxed text-sage-800">{step}</Text>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Recommended Vessels */}
      {metadata.vessel_recommendations &&
        metadata.vessel_recommendations.length > 0 && (
          <div className="rounded-lg border border-[#eadbc4] bg-[#fffaf2] p-5">
            <Heading
              level="h3"
              className="mb-4 flex items-center gap-2 text-lg font-semibold text-sage-900"
            >
              Recommended Tea Vessels
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {metadata.vessel_recommendations.map((vessel, index) => {
                const vesselInfo = vesselTypeMap[vessel] || {
                  name: vessel,
                  description: "",
                }
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-white/80 bg-white p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 text-sm font-bold text-sage-800">
                      {index + 1}
                    </div>
                    <div>
                      <Text className="font-medium text-sage-900">
                        {vesselInfo.name}
                      </Text>
                      {vesselInfo.description && (
                        <Text className="text-sm text-sage-600">
                          {vesselInfo.description}
                        </Text>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      {/* Advanced Techniques & Tasting Notes */}
      <div className="space-y-4 rounded-lg border border-[#eadbc4] bg-white p-5">
        {metadata.advanced_techniques && (
          <div>
            <Heading
              level="h3"
              className="mb-2 flex items-center gap-2 text-base font-semibold text-sage-900"
            >
              Advanced Techniques
            </Heading>
            <Text className="text-sm leading-relaxed text-sage-700 whitespace-pre-line">
              {metadata.advanced_techniques}
            </Text>
          </div>
        )}

        {metadata.tasting_notes && metadata.tasting_notes.length > 0 && (
          <div>
            <Heading
              level="h3"
              className="mb-2 flex items-center gap-2 text-base font-semibold text-sage-900"
            >
              Tasting Notes
            </Heading>
            <div className="flex flex-wrap gap-2">
              {metadata.tasting_notes.map((note, index) => (
                <span
                  key={index}
                  className="rounded-full border border-[#eadbc4] bg-sage-50 px-3 py-1 text-sm text-sage-700"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeaBrewingGuide
