"use client"

import { HttpTypes } from "@medusajs/types"
import { Text, Heading } from "@medusajs/ui"

import { getTeaMetadata } from "@lib/types/tea-product-metadata"

type TeaBasicInfoProps = {
  product: HttpTypes.StoreProduct
}

const TeaBasicInfo = ({ product }: TeaBasicInfoProps) => {
  const metadata = getTeaMetadata(product)

  const hasTerroir =
    metadata.origin_province ||
    metadata.origin_region ||
    metadata.origin_altitude ||
    metadata.origin_climate ||
    metadata.origin_soil ||
    metadata.geographic_description ||
    metadata.origin_history

  if (!hasTerroir) {
    return null
  }

  return (
    <div className="space-y-4 rounded-2xl border border-sage-100 bg-sage-50/60 p-4">
      <Heading level="h3" className="mb-3 text-lg font-semibold text-sage-900">
        Origin & Terroir
      </Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {metadata.origin_province && (
            <div>
              <Text className="text-sm font-medium text-sage-600">Province</Text>
              <Text className="text-sage-900">{metadata.origin_province}</Text>
            </div>
          )}
          {metadata.origin_region && (
            <div>
              <Text className="text-sm font-medium text-sage-600">
                Specific Region
              </Text>
              <Text className="text-sage-900">{metadata.origin_region}</Text>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {metadata.origin_altitude && (
            <div>
              <Text className="text-sm font-medium text-sage-600">Altitude</Text>
              <Text className="text-sage-900">{metadata.origin_altitude}</Text>
            </div>
          )}
          {metadata.origin_climate && (
            <div>
              <Text className="text-sm font-medium text-sage-600">Climate</Text>
              <Text className="text-sage-900">{metadata.origin_climate}</Text>
            </div>
          )}
          {metadata.origin_soil && (
            <div>
              <Text className="text-sm font-medium text-sage-600">Soil Type</Text>
              <Text className="text-sage-900">{metadata.origin_soil}</Text>
            </div>
          )}
        </div>
      </div>

      {metadata.geographic_description && (
        <div className="border-t border-sage-100 pt-3">
          <Text className="mb-2 text-sm font-medium text-sage-600">
            Geographic Environment
          </Text>
          <Text className="text-sm leading-relaxed text-sage-700 whitespace-pre-line">
            {metadata.geographic_description}
          </Text>
        </div>
      )}

      {metadata.origin_history && (
        <div className="border-t border-sage-100 pt-3">
          <Text className="mb-2 text-sm font-medium text-sage-600">
            Cultural Heritage
          </Text>
          <Text className="text-sm leading-relaxed text-sage-700 whitespace-pre-line">
            {metadata.origin_history}
          </Text>
        </div>
      )}
    </div>
  )
}

export default TeaBasicInfo
