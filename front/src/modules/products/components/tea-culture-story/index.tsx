"use client"

import { HttpTypes } from "@medusajs/types"
import { Text, Heading } from "@medusajs/ui"

type TeaCultureMetadata = {
  brand_story?: string
  tea_tradition?: {
    history?: string
    cultural_significance?: string
    legends?: string[]
    ceremonies?: string[]
  }
  farm_story?: {
    farm_name?: string
    farmer_story?: string
    farming_philosophy?: string
    sustainable_practices?: string[]
    farm_images?: string[]
  }
  celebrity_endorsements?: Array<{
    person: string
    quote: string
    context?: string
  }>
  cultural_moments?: Array<{
    title: string
    description: string
    historical_period?: string
  }>
  tea_master_profile?: {
    name?: string
    experience?: string
    philosophy?: string
    awards?: string[]
    photo?: string
  }
  tea_education?: {
    origin_facts?: string[]
    cultural_etiquette?: string[]
    seasonal_significance?: string
  }
}

type TeaCultureStoryProps = {
  product: HttpTypes.StoreProduct
}

const TeaCultureStory = ({ product }: TeaCultureStoryProps) => {
  const metadata = (product.metadata as TeaCultureMetadata) || {}

  return (
    <div className="space-y-6">
      {/* Brand Story */}
      {metadata.brand_story && (
        <div className="border border-brand-200 rounded-lg p-6 bg-brand-50">
          <Heading
            level="h3"
            className="text-lg font-semibold text-brand-700 mb-4 flex items-center gap-2"
          >
            <span className="text-xl">🌟</span>
            Our Story
          </Heading>
          <Text className="text-brand-800 leading-relaxed whitespace-pre-line">
            {metadata.brand_story}
          </Text>
        </div>
      )}

      {/* Tea Master Profile */}
      {metadata.tea_master_profile &&
        Object.keys(metadata.tea_master_profile).length > 0 && (
          <div className="border border-sage-200 rounded-lg p-6 bg-sage-50">
            <Heading
              level="h3"
              className="text-lg font-semibold text-sage-700 mb-4 flex items-center gap-2"
            >
              <span className="text-xl">👨‍🌾</span>
              Tea Master
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {metadata.tea_master_profile.photo && (
                <div className="md:col-span-1">
                  <div className="w-full h-48 bg-sage-200 rounded-lg flex items-center justify-center">
                    <span className="text-sage-600">Master Photo</span>
                  </div>
                </div>
              )}

              <div className="md:col-span-2 space-y-4">
                {metadata.tea_master_profile.name && (
                  <div>
                    <Text className="font-semibold text-sage-800 text-lg">
                      {metadata.tea_master_profile.name}
                    </Text>
                  </div>
                )}

                {metadata.tea_master_profile.experience && (
                  <div>
                    <Text className="text-sm font-medium text-sage-600 mb-1">
                      Experience
                    </Text>
                    <Text className="text-sage-800">
                      {metadata.tea_master_profile.experience}
                    </Text>
                  </div>
                )}

                {metadata.tea_master_profile.philosophy && (
                  <div>
                    <Text className="text-sm font-medium text-sage-600 mb-1">
                      Philosophy
                    </Text>
                    <Text className="text-sage-800 italic">
                      "{metadata.tea_master_profile.philosophy}"
                    </Text>
                  </div>
                )}

                {metadata.tea_master_profile.awards &&
                  metadata.tea_master_profile.awards.length > 0 && (
                    <div>
                      <Text className="text-sm font-medium text-sage-600 mb-2">
                        Awards & Recognition
                      </Text>
                      <div className="flex flex-wrap gap-2">
                        {metadata.tea_master_profile.awards.map(
                          (award, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-sage-200 text-sage-800 text-xs rounded-full"
                            >
                              🏆 {award}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

      {/* Farm Story */}
      {metadata.farm_story && Object.keys(metadata.farm_story).length > 0 && (
        <div className="border border-green-200 rounded-lg p-6 bg-green-50">
          <Heading
            level="h3"
            className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2"
          >
            <span className="text-xl">🌱</span>
            {metadata.farm_story.farm_name
              ? `${metadata.farm_story.farm_name} Farm`
              : "Farm Story"}
          </Heading>

          <div className="space-y-4">
            {metadata.farm_story.farmer_story && (
              <div>
                <Text className="text-sm font-medium text-green-600 mb-2">
                  Farmer's Story
                </Text>
                <Text className="text-green-800 leading-relaxed whitespace-pre-line">
                  {metadata.farm_story.farmer_story}
                </Text>
              </div>
            )}

            {metadata.farm_story.farming_philosophy && (
              <div>
                <Text className="text-sm font-medium text-green-600 mb-2">
                  Farming Philosophy
                </Text>
                <Text className="text-green-800 leading-relaxed">
                  {metadata.farm_story.farming_philosophy}
                </Text>
              </div>
            )}

            {metadata.farm_story.sustainable_practices &&
              metadata.farm_story.sustainable_practices.length > 0 && (
                <div>
                  <Text className="text-sm font-medium text-green-600 mb-2">
                    🌍 Sustainable Practices
                  </Text>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {metadata.farm_story.sustainable_practices.map(
                      (practice, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-white rounded border border-green-100"
                        >
                          <span className="text-green-600">✓</span>
                          <Text className="text-sm text-green-700">
                            {practice}
                          </Text>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Tea Tradition & Culture */}
      {metadata.tea_tradition &&
        Object.keys(metadata.tea_tradition).length > 0 && (
          <div className="border border-amber-200 rounded-lg p-6 bg-amber-50">
            <Heading
              level="h3"
              className="text-lg font-semibold text-amber-700 mb-4 flex items-center gap-2"
            >
              <span className="text-xl">🏛️</span>
              Tea Tradition & Culture
            </Heading>

            <div className="space-y-4">
              {metadata.tea_tradition.history && (
                <div>
                  <Text className="text-sm font-medium text-amber-600 mb-2">
                    Historical Background
                  </Text>
                  <Text className="text-amber-800 leading-relaxed whitespace-pre-line">
                    {metadata.tea_tradition.history}
                  </Text>
                </div>
              )}

              {metadata.tea_tradition.cultural_significance && (
                <div>
                  <Text className="text-sm font-medium text-amber-600 mb-2">
                    Cultural Significance
                  </Text>
                  <Text className="text-amber-800 leading-relaxed">
                    {metadata.tea_tradition.cultural_significance}
                  </Text>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metadata.tea_tradition.legends &&
                  metadata.tea_tradition.legends.length > 0 && (
                    <div>
                      <Text className="text-sm font-medium text-amber-600 mb-2">
                        📜 Legends & Stories
                      </Text>
                      <ul className="space-y-2">
                        {metadata.tea_tradition.legends.map((legend, index) => (
                          <li
                            key={index}
                            className="text-sm text-amber-800 italic"
                          >
                            "... {legend}"
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {metadata.tea_tradition.ceremonies &&
                  metadata.tea_tradition.ceremonies.length > 0 && (
                    <div>
                      <Text className="text-sm font-medium text-amber-600 mb-2">
                        🍵 Traditional Ceremonies
                      </Text>
                      <ul className="space-y-1">
                        {metadata.tea_tradition.ceremonies.map(
                          (ceremony, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="text-amber-600">•</span>
                              <Text className="text-sm text-amber-800">
                                {ceremony}
                              </Text>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

      {/* Cultural Moments */}
      {metadata.cultural_moments && metadata.cultural_moments.length > 0 && (
        <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
          <Heading
            level="h3"
            className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2"
          >
            <span className="text-xl">⏰</span>
            Historical Moments
          </Heading>

          <div className="space-y-4">
            {metadata.cultural_moments.map((moment, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-purple-100 p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <Heading level="h3" className="font-semibold text-purple-800">
                    {moment.title}
                  </Heading>
                  {moment.historical_period && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {moment.historical_period}
                    </span>
                  )}
                </div>
                <Text className="text-purple-700 leading-relaxed">
                  {moment.description}
                </Text>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Celebrity Endorsements */}
      {metadata.celebrity_endorsements &&
        metadata.celebrity_endorsements.length > 0 && (
          <div className="border border-pink-200 rounded-lg p-6 bg-pink-50">
            <Heading
              level="h3"
              className="text-lg font-semibold text-pink-700 mb-4 flex items-center gap-2"
            >
              <span className="text-xl">⭐</span>
              Celebrity Endorsements
            </Heading>

            <div className="space-y-4">
              {metadata.celebrity_endorsements.map((endorsement, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-pink-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl text-pink-400">"</span>
                    <div className="flex-1">
                      <Text className="text-pink-800 italic leading-relaxed mb-2">
                        {endorsement.quote}
                      </Text>
                      <div className="flex justify-between items-center">
                        <Text className="font-semibold text-pink-700">
                          — {endorsement.person}
                        </Text>
                        {endorsement.context && (
                          <Text className="text-sm text-pink-600">
                            {endorsement.context}
                          </Text>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Tea Education */}
      {metadata.tea_education &&
        Object.keys(metadata.tea_education).length > 0 && (
          <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
            <Heading
              level="h3"
              className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2"
            >
              <span className="text-xl">📚</span>
              Tea Knowledge
            </Heading>

            <div className="space-y-4">
              {metadata.tea_education.origin_facts &&
                metadata.tea_education.origin_facts.length > 0 && (
                  <div>
                    <Text className="text-sm font-medium text-blue-600 mb-2">
                      🌍 Origin Facts
                    </Text>
                    <ul className="space-y-1">
                      {metadata.tea_education.origin_facts.map(
                        (fact, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <Text className="text-sm text-blue-800">
                              {fact}
                            </Text>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {metadata.tea_education.cultural_etiquette &&
                metadata.tea_education.cultural_etiquette.length > 0 && (
                  <div>
                    <Text className="text-sm font-medium text-blue-600 mb-2">
                      🤝 Cultural Etiquette
                    </Text>
                    <ul className="space-y-1">
                      {metadata.tea_education.cultural_etiquette.map(
                        (etiquette, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <Text className="text-sm text-blue-800">
                              {etiquette}
                            </Text>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {metadata.tea_education.seasonal_significance && (
                <div>
                  <Text className="text-sm font-medium text-blue-600 mb-2">
                    🗓️ Seasonal Significance
                  </Text>
                  <Text className="text-sm text-blue-800 leading-relaxed">
                    {metadata.tea_education.seasonal_significance}
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  )
}

export default TeaCultureStory
