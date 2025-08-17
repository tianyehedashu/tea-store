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
    "gaiwan": { name: "Gaiwan", description: "Traditional lidded bowl, excellent for all teas" },
    "yixing-teapot": { name: "Yixing Teapot", description: "Purple clay, enhances tea flavor over time" },
    "glass-cup": { name: "Glass Cup", description: "Perfect for green teas, watch leaves unfurl" },
    "ceramic-teapot": { name: "Ceramic Teapot", description: "Neutral material, preserves original taste" },
    "bamboo-whisk": { name: "Bamboo Whisk", description: "Essential for whisked teas like matcha" }
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Quick Brewing Parameters */}
      <div className="border border-green-200 rounded-lg p-4 bg-green-50">
        <Heading level="h3" className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"/>
          </svg>
          Quick Brewing Guide
        </Heading>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metadata.water_temperature && (
            <div className="text-center p-3 bg-white rounded-md border border-green-100">
              <div className="text-2xl font-bold text-green-600">{metadata.water_temperature}°C</div>
              <Text className="text-sm text-green-700">Water Temp</Text>
            </div>
          )}

          {metadata.tea_to_water_ratio && (
            <div className="text-center p-3 bg-white rounded-md border border-green-100">
              <div className="text-lg font-bold text-green-600">{metadata.tea_to_water_ratio}</div>
              <Text className="text-sm text-green-700">Tea:Water Ratio</Text>
            </div>
          )}

          {metadata.water_volume && (
            <div className="text-center p-3 bg-white rounded-md border border-green-100">
              <div className="text-lg font-bold text-green-600">{metadata.water_volume}</div>
              <Text className="text-sm text-green-700">Water Volume</Text>
            </div>
          )}

          {metadata.optimal_servings && (
            <div className="text-center p-3 bg-white rounded-md border border-green-100">
              <div className="text-2xl font-bold text-green-600">{metadata.optimal_servings}</div>
              <Text className="text-sm text-green-700">Servings</Text>
            </div>
          )}
        </div>

        {metadata.water_quality && (
          <div className="mt-4 p-3 bg-green-100 rounded-md">
            <Text className="text-sm font-medium text-green-700">💧 Water Quality</Text>
            <Text className="text-green-800">{metadata.water_quality}</Text>
          </div>
        )}
      </div>

      {/* Steeping Times */}
      {metadata.steeping_times && metadata.steeping_times.length > 0 && (
        <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
          <Heading level="h3" className="text-lg font-semibold text-orange-700 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
            Steeping Timeline
          </Heading>

          <div className="space-y-3">
            {metadata.steeping_times.map((step, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-md border border-orange-100">
                <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center font-bold text-orange-700">
                  {step.round}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Text className="font-semibold text-orange-800">
                      {formatTime(step.time_seconds)}
                    </Text>
                    {step.note && (
                      <Text className="text-sm text-orange-600">- {step.note}</Text>
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
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
          <Heading level="h3" className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Step-by-Step Instructions
          </Heading>

          <ol className="space-y-3">
            {metadata.brewing_steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700 text-sm flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <Text className="text-blue-800 leading-relaxed">{step}</Text>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Recommended Vessels */}
      {metadata.vessel_recommendations && metadata.vessel_recommendations.length > 0 && (
        <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
          <Heading level="h3" className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
            Recommended Tea Vessels
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metadata.vessel_recommendations.map((vessel, index) => {
              const vesselInfo = vesselTypeMap[vessel] || { name: vessel, description: "" }
              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-md border border-purple-100">
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <Text className="font-medium text-purple-800">{vesselInfo.name}</Text>
                    {vesselInfo.description && (
                      <Text className="text-sm text-purple-600">{vesselInfo.description}</Text>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Advanced Techniques & Tasting Notes */}
      <div className="border border-grey-20 rounded-lg p-4 space-y-4">
        {metadata.advanced_techniques && (
          <div>
            <Heading level="h3" className="text-base font-semibold text-grey-80 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Advanced Techniques
            </Heading>
            <Text className="text-sm text-grey-70 leading-relaxed whitespace-pre-line">
              {metadata.advanced_techniques}
            </Text>
          </div>
        )}

        {metadata.tasting_notes && metadata.tasting_notes.length > 0 && (
          <div>
            <Heading level="h3" className="text-base font-semibold text-grey-80 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              Tasting Notes
            </Heading>
            <div className="flex flex-wrap gap-2">
              {metadata.tasting_notes.map((note, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-grey-10 text-grey-70 text-sm rounded-full border border-grey-20"
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
