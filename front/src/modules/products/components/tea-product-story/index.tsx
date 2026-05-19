import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

import {
  formatTeaType,
  getTeaMetadata,
} from "@lib/types/tea-product-metadata"

type TeaProductStoryProps = {
  product: HttpTypes.StoreProduct
}

const joinList = (value?: string[] | string) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ")
  }

  return value
}

export default function TeaProductStory({ product }: TeaProductStoryProps) {
  const metadata = getTeaMetadata(product)
  const flavorNotes = joinList(metadata.flavor_notes)
  const aromaNotes = joinList(metadata.aroma_notes)
  const origin = [
    metadata.origin_region,
    metadata.origin_province,
    metadata.country_of_origin,
  ]
    .filter(Boolean)
    .join(", ")

  const highlights = [
    {
      label: "Origin",
      value: origin || metadata.origin_id?.replace(/-/g, " "),
    },
    {
      label: "Tea family",
      value: formatTeaType(metadata.tea_type) || metadata.tea_category,
    },
    {
      label: "Harvest",
      value: metadata.harvest_season,
    },
    {
      label: "Cultivar",
      value: metadata.cultivar,
    },
  ].filter((item): item is { label: string; value: string } =>
    Boolean(item.value)
  )

  const tasting = [
    flavorNotes ? `Flavor: ${flavorNotes}` : undefined,
    aromaNotes ? `Aroma: ${aromaNotes}` : undefined,
    metadata.grade ? `Grade: ${metadata.grade}` : undefined,
    metadata.caffeine_level ? `Caffeine: ${metadata.caffeine_level}` : undefined,
  ].filter((item): item is string => Boolean(item))

  if (!highlights.length && !tasting.length && !metadata.geographic_description) {
    return null
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-sage-100 bg-gradient-to-br from-cream-50 via-white to-sage-50 p-6 shadow-sm small:p-8">
      <div className="pointer-events-none absolute right-8 top-8 hidden h-28 w-28 rounded-full border border-brand-200/60 small:block" />
      <div className="pointer-events-none absolute right-16 top-16 hidden h-12 w-12 rounded-full bg-brand-100/60 small:block" />

      <div className="relative grid gap-8 large:grid-cols-[minmax(0,0.85fr)_minmax(320px,1fr)] large:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
            From leaf to cup
          </p>
          <Heading
            level="h2"
            className="mt-3 font-display text-3xl leading-tight text-sage-900 small:text-4xl"
          >
            A quiet profile of origin, craft, and ritual.
          </Heading>
          {metadata.geographic_description ? (
            <Text className="mt-5 max-w-xl text-base leading-7 text-sage-700">
              {metadata.geographic_description}
            </Text>
          ) : product.description ? (
            <Text className="mt-5 max-w-xl text-base leading-7 text-sage-700">
              {product.description}
            </Text>
          ) : null}
        </div>

        <div className="grid gap-3 xsmall:grid-cols-2">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-medium capitalize text-sage-900">
                {item.value}
              </p>
            </div>
          ))}
          {tasting.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-sage-100 bg-sage-50/70 p-4"
            >
              <p className="text-sm leading-6 text-sage-800">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
