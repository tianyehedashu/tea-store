import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

import { getTeaMetadata } from "@lib/types/tea-product-metadata"
import { hasComplianceContent } from "@lib/util/product-specifications"
import Accordion from "@modules/products/components/product-tabs/accordion"

type ProductComplianceProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductCompliance({ product }: ProductComplianceProps) {
  if (!hasComplianceContent(product)) {
    return null
  }

  const metadata = getTeaMetadata(product)

  return (
    <section className="w-full" data-testid="product-compliance">
      <Accordion
        type="single"
        collapsible
        className="border border-sage-200 rounded-xl overflow-hidden"
      >
        <Accordion.Item
          title="Ingredients, allergens & legal"
          headingSize="medium"
          value="compliance"
        >
          <div className="px-6 py-4 space-y-6">
            {metadata.ingredients && (
              <div>
                <Heading
                  level="h3"
                  className="text-base font-semibold text-sage-900 mb-2"
                >
                  Ingredients
                </Heading>
                <Text className="text-sm text-sage-700 leading-relaxed whitespace-pre-line">
                  {metadata.ingredients}
                </Text>
              </div>
            )}
            {metadata.allergen_information && (
              <div>
                <Heading
                  level="h3"
                  className="text-base font-semibold text-sage-900 mb-2"
                >
                  Allergen information
                </Heading>
                <Text className="text-sm text-sage-700 leading-relaxed whitespace-pre-line">
                  {metadata.allergen_information}
                </Text>
              </div>
            )}
            {metadata.manufacturer && (
              <div>
                <Heading
                  level="h3"
                  className="text-base font-semibold text-sage-900 mb-2"
                >
                  Manufacturer
                </Heading>
                <Text className="text-sm text-sage-700">
                  {metadata.manufacturer}
                </Text>
              </div>
            )}
            {metadata.legal_disclaimer && (
              <div>
                <Heading
                  level="h3"
                  className="text-base font-semibold text-sage-900 mb-2"
                >
                  Legal disclaimer
                </Heading>
                <Text className="text-xs text-sage-600 leading-relaxed whitespace-pre-line">
                  {metadata.legal_disclaimer}
                </Text>
              </div>
            )}
          </div>
        </Accordion.Item>
      </Accordion>
    </section>
  )
}

