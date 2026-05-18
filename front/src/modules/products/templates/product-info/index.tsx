import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrewQuickTips from "@modules/products/components/brew-quick-tips"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-sm text-sage-600 hover:text-brand-600 transition-colors"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="font-display text-3xl leading-10 text-sage-900"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Text
          className="text-sm text-sage-600 leading-relaxed whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>

        <BrewQuickTips product={product} />
      </div>
    </div>
  )
}

export default ProductInfo
