import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrewQuickTips from "@modules/products/components/brew-quick-tips"
import ProductBulletPoints from "@modules/products/components/product-bullet-points"
import ProductFlavorNotes from "@modules/products/components/product-flavor-notes"
import ProductKeyHighlights from "@modules/products/components/product-key-highlights"
import {
  formatTeaType,
  getBrandName,
  getTeaMetadata,
} from "@lib/types/tea-product-metadata"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const metadata = getTeaMetadata(product)
  const brandName = getBrandName(metadata)
  const originLabel =
    metadata.origin_region ||
    metadata.origin_province ||
    metadata.origin_id?.replace(/-/g, " ")
  const summaryItems = [
    {
      label: "Type",
      value: formatTeaType(metadata.tea_type) || metadata.tea_category,
    },
    {
      label: "Origin",
      value: originLabel,
    },
    {
      label: "Grade",
      value: metadata.grade,
    },
  ].filter((item): item is { label: string; value: string } =>
    Boolean(item.value)
  )

  return (
    <div id="product-info">
      <div className="mx-auto flex flex-col gap-y-5">
        <div className="flex flex-wrap items-center gap-3">
          {product.collection && (
            <LocalizedClientLink
              href={`/collections/${product.collection.handle}`}
              className="rounded-full border border-[#eadbc4] bg-white px-3 py-1 text-xs font-medium text-sage-700 transition-colors hover:border-[#d5b58f] hover:text-[#82471f]"
            >
              {product.collection.title}
            </LocalizedClientLink>
          )}

          <Text className="section-eyebrow">
            {brandName}
          </Text>
        </div>

        <Heading
          level="h1"
          className="max-w-3xl font-display text-5xl leading-[0.98] text-sage-900 small:text-6xl"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <ProductKeyHighlights product={product} />
        <ProductBulletPoints product={product} />
        <ProductFlavorNotes product={product} />

        {summaryItems.length ? (
          <div className="grid gap-3 xsmall:grid-cols-3">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-[#eadbc4] bg-white p-4"
              >
                <p className="section-eyebrow">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-medium capitalize text-sage-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {product.description && (
          <Text
            className="max-w-3xl text-base leading-7 text-sage-700 whitespace-pre-line"
            data-testid="product-description"
          >
            {product.description}
          </Text>
        )}

        <BrewQuickTips product={product} />
      </div>
    </div>
  )
}

export default ProductInfo
