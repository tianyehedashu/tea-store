"use client"

import { HttpTypes } from "@medusajs/types"
import { Text, Heading } from "@medusajs/ui"

type TeaHealthMetadata = {
  active_compounds?: Array<{
    name: string
    content?: string
    benefits?: string[]
  }>
  health_benefits?: Array<{
    category: string
    benefits: string[]
    scientific_evidence?: string
  }>
  nutritional_info?: {
    caffeine_mg_per_cup?: number
    antioxidants?: string
    vitamins?: string[]
    minerals?: string[]
    calories_per_cup?: number
  }
  contraindications?: string[]
  suitable_for?: string[]
  not_suitable_for?: string[]
  daily_consumption_limit?: string
  special_notes?: string
}

type TeaHealthBenefitsProps = {
  product: HttpTypes.StoreProduct
}

const TeaHealthBenefits = ({ product }: TeaHealthBenefitsProps) => {
  const metadata = (product.metadata as TeaHealthMetadata) || {}

  const compoundIcons: Record<string, string> = {
    polyphenols: "Poly",
    catechins: "Cate",
    caffeine: "Cafe",
    theanine: "Calm",
    tannins: "Tann",
    flavonoids: "Oolong",
    antioxidants: "Anti",
    vitamins: "Vit",
    minerals: "Min",
  }

  const benefitCategoryIcons: Record<string, string> = {
    cardiovascular: "Heart",
    digestive: "Digest",
    mental: "Mind",
    immune: "Anti",
    skin: "Skin",
    weight: "Scale",
    "anti-aging": "Age",
    detox: "Detox",
    energy: "Cafe",
    sleep: "Sleep",
  }

  return (
    <div className="space-y-6">
      {/* Nutritional Information */}
      {metadata.nutritional_info && (
        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
          <Heading
            level="h3"
            className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2"
          >
            <span className="text-xl">Stats</span>
            Nutritional Profile (per cup)
          </Heading>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {typeof metadata.nutritional_info.caffeine_mg_per_cup ===
              "number" && (
              <div className="text-center p-3 bg-white rounded-md border border-green-100">
                <div className="text-2xl font-bold text-green-600">
                  {metadata.nutritional_info.caffeine_mg_per_cup}mg
                </div>
                <Text className="text-sm text-green-700">Caffeine</Text>
              </div>
            )}

            {typeof metadata.nutritional_info.calories_per_cup === "number" && (
              <div className="text-center p-3 bg-white rounded-md border border-green-100">
                <div className="text-2xl font-bold text-green-600">
                  {metadata.nutritional_info.calories_per_cup}
                </div>
                <Text className="text-sm text-green-700">Calories</Text>
              </div>
            )}

            {metadata.nutritional_info.antioxidants && (
              <div className="text-center p-3 bg-white rounded-md border border-green-100">
                <div className="text-lg font-bold text-green-600">High</div>
                <Text className="text-sm text-green-700">Antioxidants</Text>
              </div>
            )}

            <div className="text-center p-3 bg-white rounded-md border border-green-100">
              <div className="text-lg font-bold text-green-600">Natural</div>
              <Text className="text-sm text-green-700">Ingredients</Text>
            </div>
          </div>

          {(metadata.nutritional_info.vitamins ||
            metadata.nutritional_info.minerals) && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {metadata.nutritional_info.vitamins && (
                <div className="p-3 bg-white rounded-md border border-green-100">
                  <Text className="font-medium text-green-700 mb-2">
                    Vitamins
                  </Text>
                  <div className="flex flex-wrap gap-1">
                    {metadata.nutritional_info.vitamins.map(
                      (vitamin, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {vitamin}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {metadata.nutritional_info.minerals && (
                <div className="p-3 bg-white rounded-md border border-green-100">
                  <Text className="font-medium text-green-700 mb-2">
                    Minerals
                  </Text>
                  <div className="flex flex-wrap gap-1">
                    {metadata.nutritional_info.minerals.map(
                      (mineral, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {mineral}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Active Compounds */}
      {metadata.active_compounds && metadata.active_compounds.length > 0 && (
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
          <Heading
            level="h3"
            className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2"
          >
            <span className="text-xl">Poly</span>
            Active Compounds
          </Heading>

          <div className="space-y-3">
            {metadata.active_compounds.map((compound, index) => (
              <div
                key={index}
                className="bg-white rounded-md border border-blue-100 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {compoundIcons[compound.name.toLowerCase()] || "Cate"}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <Text className="font-semibold text-blue-800">
                        {compound.name}
                      </Text>
                      {compound.content && (
                        <Text className="text-sm text-blue-600 font-medium">
                          {compound.content}
                        </Text>
                      )}
                    </div>
                    {compound.benefits && compound.benefits.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                        {compound.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex}>{benefit}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Benefits by Category */}
      {metadata.health_benefits && metadata.health_benefits.length > 0 && (
        <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
          <Heading
            level="h3"
            className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2"
          >
            <span className="text-xl">Story</span>
            Health Benefits
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metadata.health_benefits.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-md border border-purple-100 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">
                    {benefitCategoryIcons[category.category.toLowerCase()] ||
                      "Skin"}
                  </span>
                  <Text className="font-semibold text-purple-800 capitalize">
                    {category.category} Health
                  </Text>
                </div>

                <ul className="space-y-2">
                  {category.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <Text className="text-sm text-purple-700">{benefit}</Text>
                    </li>
                  ))}
                </ul>

                {category.scientific_evidence && (
                  <div className="mt-3 p-2 bg-purple-100 rounded text-xs text-purple-600">
                    <Text className="font-medium">Research:</Text>
                    <Text>{category.scientific_evidence}</Text>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suitability & Contraindications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Suitable For */}
        {metadata.suitable_for && metadata.suitable_for.length > 0 && (
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <Heading
              level="h3"
              className="text-base font-semibold text-green-700 mb-3 flex items-center gap-2"
            >
              <span className="text-lg">Yes</span>
              Suitable For
            </Heading>
            <ul className="space-y-2">
              {metadata.suitable_for.map((group, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-green-600">+</span>
                  <Text className="text-sm text-green-700">{group}</Text>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Not Suitable For */}
        {metadata.not_suitable_for && metadata.not_suitable_for.length > 0 && (
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <Heading
              level="h3"
              className="text-base font-semibold text-red-700 mb-3 flex items-center gap-2"
            >
              <span className="text-lg">Note️</span>
              Not Suitable For
            </Heading>
            <ul className="space-y-2">
              {metadata.not_suitable_for.map((group, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-red-600">Note</span>
                  <Text className="text-sm text-red-700">{group}</Text>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="border border-grey-20 rounded-lg p-4 space-y-4">
        {metadata.daily_consumption_limit && (
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-md border border-amber-200">
            <span className="text-xl">Limit</span>
            <div>
              <Text className="font-medium text-amber-800">
                Daily Consumption Limit
              </Text>
              <Text className="text-sm text-amber-700">
                {metadata.daily_consumption_limit}
              </Text>
            </div>
          </div>
        )}

        {metadata.contraindications &&
          metadata.contraindications.length > 0 && (
            <div>
              <Heading
                level="h3"
                className="text-base font-semibold text-grey-80 mb-2 flex items-center gap-2"
              >
                <span className="text-lg">Health</span>
                Important Contraindications
              </Heading>
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <ul className="list-disc list-inside space-y-1">
                  {metadata.contraindications.map((contra, index) => (
                    <li key={index} className="text-sm text-red-700">
                      {contra}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        {metadata.special_notes && (
          <div>
            <Text className="text-sm font-medium text-grey-60 mb-2">
              Special Notes
            </Text>
            <Text className="text-sm text-grey-70 leading-relaxed whitespace-pre-line">
              {metadata.special_notes}
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeaHealthBenefits
