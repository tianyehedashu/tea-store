"use client"

import { HttpTypes } from "@medusajs/types"
import { Text, Heading } from "@medusajs/ui"

type TeaMetadata = {
  tea_type?: string
  tea_category?: string
  origin_province?: string
  origin_region?: string
  origin_altitude?: string
  origin_climate?: string
  origin_soil?: string
  origin_history?: string
  geographic_description?: string
}

type TeaBasicInfoProps = {
  product: HttpTypes.StoreProduct
}

const TeaBasicInfo = ({ product }: TeaBasicInfoProps) => {
  const metadata = (product.metadata as TeaMetadata) || {}
  
  const teaTypeMap: Record<string, string> = {
    green: "Green Tea",
    black: "Black Tea", 
    white: "White Tea",
    oolong: "Oolong Tea",
    puer: "Pu-erh Tea",
    dark: "Dark Tea",
    yellow: "Yellow Tea",
    flower: "Flower Tea",
    herbal: "Herbal Tea"
  }

  return (
    <div className="space-y-6">
      {/* Tea Category */}
      {metadata.tea_type && (
        <div className="rounded-lg bg-brand-50 border border-brand-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-brand-500"></div>
            <Text className="font-semibold text-brand-700">Tea Category</Text>
          </div>
          <Text className="text-brand-600">
            {teaTypeMap[metadata.tea_type] || metadata.tea_type}
          </Text>
          {metadata.tea_category && (
            <Text className="text-sm text-brand-500 mt-1">
              {metadata.tea_category}
            </Text>
          )}
        </div>
      )}

      {/* Origin Information */}
      <div className="border border-grey-20 rounded-lg p-4 space-y-4">
        <Heading level="h3" className="text-lg font-semibold text-grey-80 mb-3">
          Origin & Terroir
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Geographic Location */}
          <div className="space-y-2">
            {metadata.origin_province && (
              <div>
                <Text className="text-sm font-medium text-grey-60">Province</Text>
                <Text className="text-grey-80">{metadata.origin_province}</Text>
              </div>
            )}
            {metadata.origin_region && (
              <div>
                <Text className="text-sm font-medium text-grey-60">Specific Region</Text>
                <Text className="text-grey-80">{metadata.origin_region}</Text>
              </div>
            )}
          </div>

          {/* Environmental Conditions */}
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

        {/* Geographic Description */}
        {metadata.geographic_description && (
          <div className="pt-3 border-t border-grey-10">
            <Text className="text-sm font-medium text-grey-60 mb-2">Geographic Environment</Text>
            <Text className="text-sm text-grey-70 leading-relaxed whitespace-pre-line">
              {metadata.geographic_description}
            </Text>
          </div>
        )}

        {/* Cultural & Historical Background */}
        {metadata.origin_history && (
          <div className="pt-3 border-t border-grey-10">
            <Text className="text-sm font-medium text-grey-60 mb-2">Cultural Heritage</Text>
            <Text className="text-sm text-grey-70 leading-relaxed whitespace-pre-line">
              {metadata.origin_history}
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeaBasicInfo
