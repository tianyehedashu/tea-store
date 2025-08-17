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

const TeaProductTabs = ({ product }: TeaProductTabsProps) => {
  const tabs = [
    {
      id: "brewing-guide",
      label: "🍵 Brewing Guide",
      component: <TeaBrewingGuide product={product} />,
    },
    {
      id: "production-info", 
      label: "🌱 Harvest & Production",
      component: <TeaProductionInfo product={product} />,
    },
    {
      id: "storage-guide",
      label: "📦 Storage & Care",
      component: <TeaStorageGuide product={product} />,
    },
    {
      id: "health-benefits",
      label: "💊 Health & Wellness",
      component: <TeaHealthBenefits product={product} />,
    },
    {
      id: "tools-recommend",
      label: "🛠️ Tea Tools & Accessories",
      component: <TeaToolsRecommend product={product} />,
    },
    {
      id: "culture-story",
      label: "📚 Culture & Story",
      component: <TeaCultureStory product={product} />,
    },
  ]

  // Filter out empty tabs based on product metadata
  const availableTabs = tabs.filter(tab => {
    const metadata = product.metadata as any
    
    switch (tab.id) {
      case "brewing-guide":
        return metadata?.water_temperature || 
               metadata?.tea_to_water_ratio ||
               metadata?.steeping_times ||
               metadata?.brewing_steps
      
      case "production-info":
        return metadata?.harvest_season ||
               metadata?.harvest_standard ||
               metadata?.processing_methods ||
               metadata?.vintage_year
      
      case "storage-guide":
        return metadata?.shelf_life ||
               metadata?.storage_temperature ||
               metadata?.storage_container ||
               metadata?.recommended_containers
      
      case "health-benefits":
        return metadata?.active_compounds ||
               metadata?.health_benefits ||
               metadata?.nutritional_info ||
               metadata?.suitable_for
      
      case "tools-recommend":
        return metadata?.essential_tools ||
               metadata?.advanced_tools ||
               metadata?.tea_set_recommendations ||
               metadata?.brewing_accessories
      
      case "culture-story":
        return metadata?.brand_story ||
               metadata?.tea_tradition ||
               metadata?.farm_story ||
               metadata?.celebrity_endorsements ||
               metadata?.tea_master_profile
      
      default:
        return true
    }
  })

  if (availableTabs.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      {/* Tab Section Header */}
      <div className="text-center mb-8">
        <Heading level="h2" className="text-2xl font-bold text-grey-80 mb-2">
          Tea Details & Information
        </Heading>
        <p className="text-grey-60 max-w-2xl mx-auto">
          Discover everything about this tea - from brewing techniques to cultural heritage. 
          Click on each section below to explore detailed information.
        </p>
      </div>

      {/* Accordion Tabs */}
      <Accordion type="multiple" className="space-y-4">
        {availableTabs.map((tab, i) => (
          <Accordion.Item
            key={tab.id}
            title={tab.label}
            headingSize="medium"
            value={tab.id}
            className="border border-grey-20 rounded-lg overflow-hidden"
          >
            <div className="px-6 py-4">
              {tab.component}
            </div>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Educational Footer */}
      <div className="mt-12 text-center p-6 bg-cream-50 rounded-lg border border-cream-200">
        <Heading level="h4" className="text-lg font-semibold text-cream-800 mb-2">
          🌿 Tea Culture & Education
        </Heading>
        <p className="text-cream-700 text-sm max-w-3xl mx-auto">
          Tea is more than just a beverage - it's a journey through culture, tradition, and mindfulness. 
          Each cup tells a story of the land, the people, and the centuries-old wisdom that brings this 
          leaf from garden to your cup. Explore, taste, and discover the world of tea.
        </p>
      </div>
    </div>
  )
}

export default TeaProductTabs
