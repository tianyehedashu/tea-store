import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductBreadcrumb from "@modules/products/components/product-breadcrumb"
import ProductCompliance from "@modules/products/components/product-compliance"
import ProductSpecifications from "@modules/products/components/product-specifications"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import TeaProductTemplate from "./tea-product-template"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const isTeaProduct = (product: HttpTypes.StoreProduct): boolean => {
  if (product.metadata?.tea_type) {
    return true
  }

  if (product.type?.value?.toLowerCase().includes("tea")) {
    return true
  }

  if (
    product.categories?.some(
      (cat) =>
        cat.name?.toLowerCase().includes("tea") ||
        cat.handle?.toLowerCase().includes("tea")
    )
  ) {
    return true
  }

  if (product.collection?.handle?.toLowerCase().includes("tea")) {
    return true
  }

  const teaKeywords = [
    "tea",
    "cha",
    "matcha",
    "green tea",
    "black tea",
    "oolong",
    "pu-erh",
    "white tea",
  ]
  const searchText = `${product.title} ${product.description}`.toLowerCase()

  return teaKeywords.some((keyword) => searchText.includes(keyword))
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  if (isTeaProduct(product)) {
    return (
      <TeaProductTemplate
        product={product}
        region={region}
        countryCode={countryCode}
      />
    )
  }

  return (
    <>
      <ProductBreadcrumb product={product} />
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-6 relative"
        data-testid="product-container"
      >
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>
        <div className="block w-full relative">
          <ImageGallery images={product?.images || []} />
        </div>
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
          <ProductOnboardingCta />
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
        </div>
      </div>
      <div className="content-container my-12 space-y-12">
        <ProductSpecifications product={product} />
        <ProductCompliance product={product} />
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
