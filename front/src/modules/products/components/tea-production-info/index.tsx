"use client"

import { HttpTypes } from "@medusajs/types"
import { Text, Heading } from "@medusajs/ui"

type TeaProductionMetadata = {
  harvest_season?: string
  harvest_standard?: string
  processing_methods?: string[]
  vintage_year?: string
  aging_period?: string
  processing_master?: string
  harvest_date?: string
  leaf_grade?: string
  oxidation_level?: string
  fermentation_type?: string
  drying_method?: string
  roasting_level?: string
}

type TeaProductionInfoProps = {
  product: HttpTypes.StoreProduct
}

const TeaProductionInfo = ({ product }: TeaProductionInfoProps) => {
  const metadata = (product.metadata as TeaProductionMetadata) || {}

  const harvestSeasonMap: Record<string, string> = {
    "pre-qingming": "Pre-Qingming (Early Spring)",
    "post-qingming": "Post-Qingming (Mid Spring)",
    "pre-guyu": "Pre-Grain Rain (Late Spring)",
    "post-guyu": "Post-Grain Rain (Early Summer)",
    summer: "Summer Tea",
    autumn: "Autumn Tea",
    winter: "Winter Tea",
  }

  const harvestStandardMap: Record<string, string> = {
    "bud-only": "Bud Only",
    "one-bud-one-leaf": "One Bud One Leaf",
    "one-bud-two-leaves": "One Bud Two Leaves",
    "one-bud-three-leaves": "One Bud Three Leaves",
    "mature-leaves": "Mature Leaves",
  }

  return (
    <div className="space-y-6">
      {/* Harvest Information */}
      <div className="border border-sage-200 rounded-lg p-4 bg-sage-50">
        <Heading
          level="h3"
          className="text-lg font-semibold text-sage-700 mb-4 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" />
          </svg>
          Harvest & Picking
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            {metadata.harvest_season && (
              <div>
                <Text className="text-sm font-medium text-sage-600">
                  Harvest Season
                </Text>
                <Text className="text-sage-800">
                  {harvestSeasonMap[metadata.harvest_season] ||
                    metadata.harvest_season}
                </Text>
              </div>
            )}

            {metadata.harvest_date && (
              <div>
                <Text className="text-sm font-medium text-sage-600">
                  Harvest Date
                </Text>
                <Text className="text-sage-800">{metadata.harvest_date}</Text>
              </div>
            )}

            {metadata.harvest_standard && (
              <div>
                <Text className="text-sm font-medium text-sage-600">
                  Picking Standard
                </Text>
                <Text className="text-sage-800">
                  {harvestStandardMap[metadata.harvest_standard] ||
                    metadata.harvest_standard}
                </Text>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {metadata.leaf_grade && (
              <div>
                <Text className="text-sm font-medium text-sage-600">
                  Leaf Grade
                </Text>
                <Text className="text-sage-800">{metadata.leaf_grade}</Text>
              </div>
            )}

            {metadata.vintage_year && (
              <div>
                <Text className="text-sm font-medium text-sage-600">
                  Vintage Year
                </Text>
                <Text className="text-sage-800">{metadata.vintage_year}</Text>
              </div>
            )}

            {metadata.aging_period && (
              <div>
                <Text className="text-sm font-medium text-sage-600">
                  Aging Period
                </Text>
                <Text className="text-sage-800">{metadata.aging_period}</Text>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Processing Information */}
      <div className="border border-cream-200 rounded-lg p-4 bg-cream-50">
        <Heading
          level="h3"
          className="text-lg font-semibold text-cream-800 mb-4 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
          Processing Craftsmanship
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            {metadata.processing_methods && (
              <div>
                <Text className="text-sm font-medium text-cream-700">
                  Processing Methods
                </Text>
                <div className="flex flex-wrap gap-2 mt-1">
                  {metadata.processing_methods.map((method, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-cream-200 text-cream-800 text-xs rounded-full"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {metadata.oxidation_level && (
              <div>
                <Text className="text-sm font-medium text-cream-700">
                  Oxidation Level
                </Text>
                <Text className="text-cream-800">
                  {metadata.oxidation_level}
                </Text>
              </div>
            )}

            {metadata.fermentation_type && (
              <div>
                <Text className="text-sm font-medium text-cream-700">
                  Fermentation
                </Text>
                <Text className="text-cream-800">
                  {metadata.fermentation_type}
                </Text>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {metadata.drying_method && (
              <div>
                <Text className="text-sm font-medium text-cream-700">
                  Drying Method
                </Text>
                <Text className="text-cream-800">{metadata.drying_method}</Text>
              </div>
            )}

            {metadata.roasting_level && (
              <div>
                <Text className="text-sm font-medium text-cream-700">
                  Roasting Level
                </Text>
                <Text className="text-cream-800">
                  {metadata.roasting_level}
                </Text>
              </div>
            )}

            {metadata.processing_master && (
              <div>
                <Text className="text-sm font-medium text-cream-700">
                  Processing Master
                </Text>
                <Text className="text-cream-800">
                  {metadata.processing_master}
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeaProductionInfo
