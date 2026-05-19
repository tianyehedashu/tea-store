import { HttpTypes } from "@medusajs/types"

import { getBrandName, getTeaMetadata } from "@lib/types/tea-product-metadata"
import { getProductPrice } from "@lib/util/get-product-price"

type ProductJsonLdProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default function ProductJsonLd({
  product,
  countryCode,
}: ProductJsonLdProps) {
  const metadata = getTeaMetadata(product)
  const { cheapestPrice } = getProductPrice({ product })
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    "https://tea.leodennis.top"

  const origin = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`
  const url = `${origin}/${countryCode}/products/${product.handle}`
  const image =
    product.images?.[0]?.url || product.thumbnail || undefined

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.title,
    image,
    sku: product.variants?.[0]?.sku,
    brand: {
      "@type": "Brand",
      name: getBrandName(metadata),
    },
    offers: cheapestPrice
      ? {
          "@type": "Offer",
          url,
          priceCurrency: cheapestPrice.currency_code?.toUpperCase(),
          price: cheapestPrice.calculated_price_number,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
