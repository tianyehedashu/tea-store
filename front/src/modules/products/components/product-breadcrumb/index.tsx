import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductBreadcrumbProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="content-container py-4"
      data-testid="product-breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm text-sage-600">
        <li>
          <LocalizedClientLink href="/" className="hover:text-brand-600">
            Home
          </LocalizedClientLink>
        </li>
        <li aria-hidden="true">/</li>
        {product.collection ? (
          <>
            <li>
              <LocalizedClientLink
                href={`/collections/${product.collection.handle}`}
                className="hover:text-brand-600"
              >
                {product.collection.title}
              </LocalizedClientLink>
            </li>
            <li aria-hidden="true">/</li>
          </>
        ) : (
          <>
            <li>
              <LocalizedClientLink href="/store" className="hover:text-brand-600">
                Shop
              </LocalizedClientLink>
            </li>
            <li aria-hidden="true">/</li>
          </>
        )}
        <li className="text-sage-900 font-medium truncate max-w-[200px] small:max-w-none">
          {product.title}
        </li>
      </ol>
    </nav>
  )
}
