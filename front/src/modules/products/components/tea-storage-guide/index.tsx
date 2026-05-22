"use client"

import { HttpTypes } from "@medusajs/types"
import { Text, Heading } from "@medusajs/ui"

type TeaStorageMetadata = {
  shelf_life?: string
  storage_temperature?: string
  storage_humidity?: string
  storage_light?: string
  storage_air?: string
  storage_container?: string[]
  storage_environment?: string
  storage_notes?: string
  recommended_containers?: string[]
  avoid_storage?: string[]
}

type TeaStorageGuideProps = {
  product: HttpTypes.StoreProduct
}

const TeaStorageGuide = ({ product }: TeaStorageGuideProps) => {
  const metadata = (product.metadata as TeaStorageMetadata) || {}

  const containerTypeMap: Record<
    string,
    { name: string; description: string }
  > = {
    "tin-can": {
      name: "Tin Can",
      description: "Excellent sealing, moisture and oxidation resistant",
    },
    "ceramic-jar": {
      name: "Ceramic Jar",
      description: "Moderate breathability, preserves tea aroma",
    },
    "purple-clay": {
      name: "Purple Clay Jar",
      description: "Regulates humidity, improves with use",
    },
    "glass-jar": {
      name: "Glass Jar",
      description: "Sealed and transparent, easy to observe",
    },
    "bamboo-box": {
      name: "Bamboo Box",
      description: "Natural eco-friendly, suitable for short-term storage",
    },
    "paper-bag": {
      name: "Paper Bag",
      description: "Good breathability, poor moisture resistance",
    },
  }

  const storageIcons = {
    temperature: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a1 1 0 011 1v5.268l2.732 2.732a1 1 0 11-1.414 1.414L10 10.186l-2.318 2.228a1 1 0 01-1.414-1.414L9 8.268V3a1 1 0 011-1z" />
      </svg>
    ),
    humidity: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2l-.707.707L5.586 6.414a2 2 0 000 2.828L9.293 13a1 1 0 001.414 0l3.707-3.758a2 2 0 000-2.828L10.707 2.707 10 2z" />
      </svg>
    ),
    light: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
      </svg>
    ),
    container: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
      </svg>
    ),
  }

  return (
    <div className="space-y-6">
      {/* Storage Requirements */}
      <div className="rounded-lg border border-[#eadbc4] bg-[#fffaf2] p-4">
        <Heading
          level="h3"
          className="mb-4 flex items-center gap-2 text-lg font-semibold text-sage-900"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
            <path
              fillRule="evenodd"
              d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 5a1 1 0 011-1h6a1 1 0 110 2H5a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Storage Requirements
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metadata.storage_temperature && (
            <div className="flex items-start gap-3 rounded-lg border border-[#eadbc4] bg-white p-3">
              <div className="mt-0.5 text-[#a6602e]">
                {storageIcons.temperature}
              </div>
              <div>
                <Text className="text-sm font-medium text-sage-700">
                  Temperature
                </Text>
                <Text className="text-sm text-sage-600">
                  {metadata.storage_temperature}
                </Text>
              </div>
            </div>
          )}

          {metadata.storage_humidity && (
            <div className="flex items-start gap-3 rounded-lg border border-[#eadbc4] bg-white p-3">
              <div className="mt-0.5 text-[#a6602e]">
                {storageIcons.humidity}
              </div>
              <div>
                <Text className="text-sm font-medium text-sage-700">
                  Humidity
                </Text>
                <Text className="text-sm text-sage-600">
                  {metadata.storage_humidity}
                </Text>
              </div>
            </div>
          )}

          {metadata.storage_light && (
            <div className="flex items-start gap-3 rounded-lg border border-[#eadbc4] bg-white p-3">
              <div className="mt-0.5 text-[#a6602e]">{storageIcons.light}</div>
              <div>
                <Text className="text-sm font-medium text-sage-700">Light</Text>
                <Text className="text-sm text-sage-600">
                  {metadata.storage_light}
                </Text>
              </div>
            </div>
          )}

          {metadata.storage_air && (
            <div className="flex items-start gap-3 rounded-lg border border-[#eadbc4] bg-white p-3">
              <div className="mt-0.5 text-[#a6602e]">Air</div>
              <div>
                <Text className="text-sm font-medium text-sage-700">
                  Air Circulation
                </Text>
                <Text className="text-sm text-sage-600">
                  {metadata.storage_air}
                </Text>
              </div>
            </div>
          )}
        </div>

        {metadata.shelf_life && (
          <div className="mt-4 rounded-lg bg-white p-3">
            <Text className="text-sm font-medium text-sage-700">
              Shelf Life
            </Text>
            <Text className="text-sage-800">{metadata.shelf_life}</Text>
          </div>
        )}
      </div>

      {/* Recommended Containers */}
      {metadata.recommended_containers &&
        metadata.recommended_containers.length > 0 && (
          <div className="rounded-lg border border-[#eadbc4] bg-[#fffaf2] p-4">
            <Heading
              level="h3"
              className="mb-4 flex items-center gap-2 text-lg font-semibold text-sage-900"
            >
              {storageIcons.container}
              Recommended Storage Containers
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {metadata.recommended_containers.map((container, index) => {
                const containerInfo = containerTypeMap[container] || {
                  name: container,
                  description: "",
                }
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-[#eadbc4] bg-white p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5eddf] text-sm font-bold text-[#82471f]">
                      {index + 1}
                    </div>
                    <div>
                      <Text className="font-medium text-sage-900">
                        {containerInfo.name}
                      </Text>
                      {containerInfo.description && (
                        <Text className="text-sm text-sage-600">
                          {containerInfo.description}
                        </Text>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      {/* Storage Notes & Environment */}
      <div className="space-y-4 rounded-lg border border-[#eadbc4] bg-white p-4">
        <Heading level="h3" className="text-lg font-semibold text-grey-80">
          Storage Guidelines
        </Heading>

        {metadata.storage_environment && (
          <div>
            <Text className="text-sm font-medium text-grey-60 mb-2">
              Storage Environment
            </Text>
            <Text className="text-sm text-grey-70 leading-relaxed whitespace-pre-line">
              {metadata.storage_environment}
            </Text>
          </div>
        )}

        {metadata.storage_notes && (
          <div>
            <Text className="text-sm font-medium text-grey-60 mb-2">
              Important Notes
            </Text>
            <Text className="text-sm text-grey-70 leading-relaxed whitespace-pre-line">
              {metadata.storage_notes}
            </Text>
          </div>
        )}

        {metadata.avoid_storage && metadata.avoid_storage.length > 0 && (
          <div className="rounded-lg border border-[#eadbc4] bg-[#fffaf2] p-3">
            <Text className="mb-2 text-sm font-medium text-sage-900">
              Avoid these conditions
            </Text>
            <ul className="list-disc list-inside space-y-1">
              {metadata.avoid_storage.map((condition, index) => (
                <li key={index} className="text-sm text-red-600">
                  {condition}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeaStorageGuide
