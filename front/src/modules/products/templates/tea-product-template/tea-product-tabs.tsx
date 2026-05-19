"use client"

import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"

import TeaProductionInfo from "@modules/products/components/tea-production-info"
import TeaStorageGuide from "@modules/products/components/tea-storage-guide"
import TeaBrewingGuide from "@modules/products/components/tea-brewing-guide"
import TeaToolsRecommend from "@modules/products/components/tea-tools-recommend"
import TeaHealthBenefits from "@modules/products/components/tea-health-benefits"
import TeaCultureStory from "@modules/products/components/tea-culture-story"

import Accordion from "@modules/products/components/product-tabs/accordion"

type TeaProductTabsProps = {
  product: HttpTypes.StoreProduct
}

type TeaDetailsMetadata = Record<string, unknown>

const hasMetadataValue = (metadata: TeaDetailsMetadata, key: string) =>
  Boolean(metadata[key])

const TeaProductTabs = ({ product }: TeaProductTabsProps) => {
  const tabs = [
    {
      id: "brewing-guide",
      label: "Brewing guide",
      component: <TeaBrewingGuide product={product} />,
    },
    {
      id: "production-info",
      label: "Harvest & production",
      component: <TeaProductionInfo product={product} />,
    },
    {
      id: "storage-guide",
      label: "Storage & care",
      component: <TeaStorageGuide product={product} />,
    },
    {
      id: "health-benefits",
      label: "Health & wellness",
      component: <TeaHealthBenefits product={product} />,
    },
    {
      id: "tools-recommend",
      label: "Tea tools & accessories",
      component: <TeaToolsRecommend product={product} />,
    },
    {
      id: "culture-story",
      label: "Culture & story",
      component: <TeaCultureStory product={product} />,
    },
  ]

  // Filter out empty tabs based on product metadata
  const availableTabs = tabs.filter((tab) => {
    const metadata = (product.metadata ?? {}) as TeaDetailsMetadata

    switch (tab.id) {
      case "brewing-guide":
        return [
          "water_temperature",
          "tea_to_water_ratio",
          "steeping_times",
          "brewing_steps",
        ].some((key) => hasMetadataValue(metadata, key))

      case "production-info":
        return [
          "harvest_season",
          "harvest_standard",
          "processing_methods",
          "vintage_year",
        ].some((key) => hasMetadataValue(metadata, key))

      case "storage-guide":
        return [
          "shelf_life",
          "storage_temperature",
          "storage_container",
          "recommended_containers",
        ].some((key) => hasMetadataValue(metadata, key))

      case "health-benefits":
        return [
          "active_compounds",
          "health_benefits",
          "nutritional_info",
          "suitable_for",
        ].some((key) => hasMetadataValue(metadata, key))

      case "tools-recommend":
        return [
          "essential_tools",
          "advanced_tools",
          "tea_set_recommendations",
          "brewing_accessories",
        ].some((key) => hasMetadataValue(metadata, key))

      case "culture-story":
        return [
          "brand_story",
          "tea_tradition",
          "farm_story",
          "celebrity_endorsements",
          "tea_master_profile",
        ].some((key) => hasMetadataValue(metadata, key))

      default:
        return true
    }
  })

  if (availableTabs.length === 0) {
    return null
  }

  return (
    <section className="w-full rounded-[2rem] border border-sage-100 bg-white p-6 shadow-sm small:p-8">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
          Deeper knowledge
        </p>
        <Heading
          level="h2"
          className="mt-3 font-display text-3xl font-semibold text-sage-900"
        >
          Tea details & information
        </Heading>
        <p className="mt-3 text-sm leading-6 text-sage-600">
          Explore brewing technique, production, care, and cultural context only
          when you want the detail.
        </p>
      </div>

      <Accordion type="multiple" className="space-y-3">
        {availableTabs.map((tab) => (
          <Accordion.Item
            key={tab.id}
            title={tab.label}
            headingSize="medium"
            value={tab.id}
            className="overflow-hidden rounded-2xl border border-sage-100 bg-sage-50/40"
          >
            <div className="border-t border-sage-100 bg-white px-5 py-5 small:px-6">
              {tab.component}
            </div>
          </Accordion.Item>
        ))}
      </Accordion>

      <div className="mt-8 rounded-2xl border border-cream-200 bg-cream-50 p-6">
        <Heading
          level="h3"
          className="mb-2 font-display text-xl font-semibold text-cream-900"
        >
          Tea culture, without the noise
        </Heading>
        <p className="max-w-3xl text-sm leading-6 text-cream-800">
          Each cup carries land, craft, and time. The page keeps that story close
          to the purchase decision, but never lets it obscure the essentials.
        </p>
      </div>
    </section>
  )
}

export default TeaProductTabs
