"use client"

import { HttpTypes } from "@medusajs/types"
import { Text, Heading, Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type TeaToolsMetadata = {
  essential_tools?: string[]
  advanced_tools?: string[]
  tea_set_recommendations?: Array<{
    name: string
    items: string[]
    description?: string
    price_range?: string
    product_id?: string
  }>
  brewing_accessories?: Array<{
    name: string
    description: string
    importance: "essential" | "recommended" | "optional"
    product_id?: string
  }>
}

type TeaToolsRecommendProps = {
  product: HttpTypes.StoreProduct
}

const TeaToolsRecommend = ({ product }: TeaToolsRecommendProps) => {
  const metadata = (product.metadata as TeaToolsMetadata) || {}

  const toolCategoryMap: Record<
    string,
    { name: string; description: string; icon: string }
  > = {
    teapot: {
      name: "Teapot",
      description: "Primary brewing vessel",
      icon: "🫖",
    },
    gaiwan: {
      name: "Gaiwan",
      description: "Traditional lidded bowl",
      icon: "🍵",
    },
    "tea-cup": {
      name: "Tea Cup",
      description: "For serving and tasting",
      icon: "☕",
    },
    "tea-strainer": {
      name: "Tea Strainer",
      description: "Filter tea leaves",
      icon: "🥄",
    },
    "tea-tray": {
      name: "Tea Tray",
      description: "Catch overflow water",
      icon: "🍽️",
    },
    "tea-towel": {
      name: "Tea Towel",
      description: "Clean and dry vessels",
      icon: "🧻",
    },
    kettle: {
      name: "Kettle",
      description: "Heat water to proper temperature",
      icon: "🔥",
    },
    thermometer: {
      name: "Thermometer",
      description: "Monitor water temperature",
      icon: "🌡️",
    },
    timer: { name: "Timer", description: "Time steeping duration", icon: "⏱️" },
    scale: {
      name: "Digital Scale",
      description: "Measure tea accurately",
      icon: "⚖️",
    },
    "storage-tin": {
      name: "Storage Tin",
      description: "Keep tea fresh",
      icon: "🥫",
    },
    "bamboo-scoop": {
      name: "Tea Scoop",
      description: "Measure and transfer tea",
      icon: "🥄",
    },
  }

  const importanceColors = {
    essential: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      badge: "bg-red-100 text-red-800",
    },
    recommended: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      badge: "bg-yellow-100 text-yellow-800",
    },
    optional: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      badge: "bg-green-100 text-green-800",
    },
  }

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case "essential":
        return "Essential"
      case "recommended":
        return "Recommended"
      case "optional":
        return "Optional"
      default:
        return importance
    }
  }

  return (
    <div className="space-y-6">
      {/* Essential Tools */}
      {metadata.essential_tools && metadata.essential_tools.length > 0 && (
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <Heading
            level="h3"
            className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2"
          >
            <span className="text-xl">⭐</span>
            Essential Tea Tools
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metadata.essential_tools.map((tool, index) => {
              const toolInfo = toolCategoryMap[tool] || {
                name: tool,
                description: "",
                icon: "🔧",
              }
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white rounded-md border border-red-100"
                >
                  <span className="text-2xl">{toolInfo.icon}</span>
                  <div>
                    <Text className="font-medium text-red-800">
                      {toolInfo.name}
                    </Text>
                    <Text className="text-sm text-red-600">
                      {toolInfo.description}
                    </Text>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Advanced Tools */}
      {metadata.advanced_tools && metadata.advanced_tools.length > 0 && (
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
          <Heading
            level="h3"
            className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2"
          >
            <span className="text-xl">🚀</span>
            Advanced Tea Tools
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metadata.advanced_tools.map((tool, index) => {
              const toolInfo = toolCategoryMap[tool] || {
                name: tool,
                description: "",
                icon: "🔧",
              }
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white rounded-md border border-blue-100"
                >
                  <span className="text-2xl">{toolInfo.icon}</span>
                  <div>
                    <Text className="font-medium text-blue-800">
                      {toolInfo.name}
                    </Text>
                    <Text className="text-sm text-blue-600">
                      {toolInfo.description}
                    </Text>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tea Set Recommendations */}
      {metadata.tea_set_recommendations &&
        metadata.tea_set_recommendations.length > 0 && (
          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <Heading
              level="h3"
              className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2"
            >
              <span className="text-xl">🎁</span>
              Curated Tea Sets
            </Heading>

            <div className="space-y-4">
              {metadata.tea_set_recommendations.map((set, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-purple-100 p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Heading
                        level="h3"
                        className="font-semibold text-purple-800"
                      >
                        {set.name}
                      </Heading>
                      {set.description && (
                        <Text className="text-sm text-purple-600 mt-1">
                          {set.description}
                        </Text>
                      )}
                    </div>
                    {set.price_range && (
                      <div className="text-right">
                        <Text className="text-lg font-bold text-purple-700">
                          {set.price_range}
                        </Text>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <Text className="text-sm font-medium text-purple-700 mb-2">
                      Includes:
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {set.items.map((item, itemIndex) => (
                        <span
                          key={itemIndex}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {set.product_id && (
                    <LocalizedClientLink href={`/products/${set.product_id}`}>
                      <Button variant="secondary" size="small" className="mt-2">
                        View Tea Set
                      </Button>
                    </LocalizedClientLink>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Brewing Accessories by Importance */}
      {metadata.brewing_accessories &&
        metadata.brewing_accessories.length > 0 && (
          <div className="space-y-4">
            <Heading
              level="h3"
              className="text-lg font-semibold text-grey-80 flex items-center gap-2"
            >
              <span className="text-xl">🛠️</span>
              Brewing Accessories
            </Heading>

            {["essential", "recommended", "optional"].map((importance) => {
              const accessories = metadata.brewing_accessories?.filter(
                (acc) => acc.importance === importance
              )
              if (!accessories || accessories.length === 0) return null

              const colors =
                importanceColors[importance as keyof typeof importanceColors]

              return (
                <div
                  key={importance}
                  className={`border ${colors.border} rounded-lg p-4 ${colors.bg}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-1 ${colors.badge} text-xs font-medium rounded-full`}
                    >
                      {getImportanceText(importance)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {accessories.map((accessory, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-md border border-opacity-50 p-3"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Text className={`font-medium ${colors.text}`}>
                            {accessory.name}
                          </Text>
                          {accessory.product_id && (
                            <LocalizedClientLink
                              href={`/products/${accessory.product_id}`}
                            >
                              <Button
                                variant="transparent"
                                size="small"
                                className="text-xs"
                              >
                                View
                              </Button>
                            </LocalizedClientLink>
                          )}
                        </div>
                        <Text className="text-sm text-grey-70">
                          {accessory.description}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

      {/* Tea Tool Categories Guide */}
      <div className="border border-grey-20 rounded-lg p-4 bg-cream-50">
        <Heading
          level="h3"
          className="text-lg font-semibold text-cream-800 mb-4 flex items-center gap-2"
        >
          <span className="text-xl">📚</span>
          Tea Tool Guide by Tea Type
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-md border border-cream-100">
              <Text className="font-medium text-cream-800 mb-1">
                🍃 Green Tea
              </Text>
              <Text className="text-sm text-cream-700">
                Glass cup, lower temperature kettle, fine strainer
              </Text>
            </div>
            <div className="p-3 bg-white rounded-md border border-cream-100">
              <Text className="font-medium text-cream-800 mb-1">
                🥀 Black Tea
              </Text>
              <Text className="text-sm text-cream-700">
                Ceramic/porcelain teapot, milk jug, sugar bowl
              </Text>
            </div>
            <div className="p-3 bg-white rounded-md border border-cream-100">
              <Text className="font-medium text-cream-800 mb-1">
                🌸 Oolong Tea
              </Text>
              <Text className="text-sm text-cream-700">
                Yixing teapot or gaiwan, fairness cup, aroma cup
              </Text>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-md border border-cream-100">
              <Text className="font-medium text-cream-800 mb-1">
                ⚫ Pu-erh Tea
              </Text>
              <Text className="text-sm text-cream-700">
                Clay teapot, tea pick, large tea tray
              </Text>
            </div>
            <div className="p-3 bg-white rounded-md border border-cream-100">
              <Text className="font-medium text-cream-800 mb-1">
                ⚪ White Tea
              </Text>
              <Text className="text-sm text-cream-700">
                Glass or porcelain vessel, gentle strainer
              </Text>
            </div>
            <div className="p-3 bg-white rounded-md border border-cream-100">
              <Text className="font-medium text-cream-800 mb-1">
                🌺 Flower Tea
              </Text>
              <Text className="text-sm text-cream-700">
                Glass teapot, blooming tea vessel, honey dipper
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeaToolsRecommend
