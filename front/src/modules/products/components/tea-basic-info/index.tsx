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
    <section className="space-y-5 rounded-[2rem] border border-sage-100 bg-white/80 p-5 shadow-sm backdrop-blur small:p-6">
      <div className="flex flex-col gap-2 small:flex-row small:items-end small:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
            Origin notes
          </p>
          <Heading
            level="h3"
            className="mt-2 font-display text-2xl font-semibold text-sage-900"
          >
            Terroir, softly stated.
          </Heading>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-3">
          {metadata.origin_province && (
            <div className="rounded-2xl bg-sage-50/70 p-4">
              <Text className="text-sm font-medium text-sage-600">Province</Text>
              <Text className="text-sage-900">{metadata.origin_province}</Text>
            </div>
          )}
          {metadata.origin_region && (
            <div className="rounded-2xl bg-sage-50/70 p-4">
              <Text className="text-sm font-medium text-sage-600">
                Specific Region
              </Text>
              <Text className="text-sage-900">{metadata.origin_region}</Text>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {metadata.origin_altitude && (
            <div className="rounded-2xl bg-sage-50/70 p-4">
              <Text className="text-sm font-medium text-sage-600">Altitude</Text>
              <Text className="text-sage-900">{metadata.origin_altitude}</Text>
            </div>
          )}
          {metadata.origin_climate && (
            <div className="rounded-2xl bg-sage-50/70 p-4">
              <Text className="text-sm font-medium text-sage-600">Climate</Text>
              <Text className="text-sage-900">{metadata.origin_climate}</Text>
            </div>
          )}
          {metadata.origin_soil && (
            <div className="rounded-2xl bg-sage-50/70 p-4">
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
    </section>
  )
}

export default TeaBasicInfo
