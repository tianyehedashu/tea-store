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
    <div className="border border-grey-20 rounded-lg p-4 space-y-4">
      <Heading level="h3" className="text-lg font-semibold text-grey-80 mb-3">
        Origin & Terroir
      </Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {metadata.origin_province && (
            <div>
              <Text className="text-sm font-medium text-grey-60">Province</Text>
              <Text className="text-grey-80">{metadata.origin_province}</Text>
            </div>
          )}
          {metadata.origin_region && (
            <div>
              <Text className="text-sm font-medium text-grey-60">
                Specific Region
              </Text>
              <Text className="text-grey-80">{metadata.origin_region}</Text>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {metadata.origin_altitude && (
            <div>
              <Text className="text-sm font-medium text-grey-60">Altitude</Text>
              <Text className="text-grey-80">{metadata.origin_altitude}</Text>
            </div>
          )}
          {metadata.origin_climate && (
            <div>
              <Text className="text-sm font-medium text-grey-60">Climate</Text>
              <Text className="text-grey-80">{metadata.origin_climate}</Text>
            </div>
          )}
          {metadata.origin_soil && (
            <div>
              <Text className="text-sm font-medium text-grey-60">Soil Type</Text>
              <Text className="text-grey-80">{metadata.origin_soil}</Text>
            </div>
          )}
        </div>
      </div>

      {metadata.geographic_description && (
        <div className="pt-3 border-t border-grey-10">
          <Text className="text-sm font-medium text-grey-60 mb-2">
            Geographic Environment
          </Text>
          <Text className="text-sm text-grey-70 leading-relaxed whitespace-pre-line">
            {metadata.geographic_description}
          </Text>
        </div>
      )}

      {metadata.origin_history && (
        <div className="pt-3 border-t border-grey-10">
          <Text className="text-sm font-medium text-grey-60 mb-2">
            Cultural Heritage
          </Text>
          <Text className="text-sm text-grey-70 leading-relaxed whitespace-pre-line">
            {metadata.origin_history}
          </Text>
        </div>
      )}
    </div>
  )
}

export default TeaBasicInfo
