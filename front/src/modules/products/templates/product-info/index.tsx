import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrewQuickTips from "@modules/products/components/brew-quick-tips"
import ProductBulletPoints from "@modules/products/components/product-bullet-points"
import ProductFlavorNotes from "@modules/products/components/product-flavor-notes"
import ProductKeyHighlights from "@modules/products/components/product-key-highlights"
import { getBrandName, getTeaMetadata } from "@lib/types/tea-product-metadata"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const metadata = getTeaMetadata(product)
  const brandName = getBrandName(metadata)

  return (
    <div id="product-info">
      <div className="mx-auto flex flex-col gap-y-4 lg:max-w-[500px]">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-sm font-medium text-sage-600 transition-colors hover:text-brand-600"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}

        <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
          {brandName}
        </Text>

        <Heading
          level="h1"
          className="font-display text-4xl leading-[1.08] text-sage-900 small:text-5xl"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <ProductKeyHighlights product={product} />
        <ProductBulletPoints product={product} />
        <ProductFlavorNotes product={product} />

        {product.description && (
          <Text
            className="text-base leading-7 text-sage-700 whitespace-pre-line"
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
