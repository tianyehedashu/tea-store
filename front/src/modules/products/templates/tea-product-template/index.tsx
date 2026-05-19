import React, { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductBreadcrumb from "@modules/products/components/product-breadcrumb"
import ProductCompliance from "@modules/products/components/product-compliance"
import ProductSpecifications from "@modules/products/components/product-specifications"
import RelatedProducts from "@modules/products/components/related-products"
import TeaBasicInfo from "@modules/products/components/tea-basic-info"
import ProductInfo from "@modules/products/templates/product-info"
import ProductActionsWrapper from "@modules/products/templates/product-actions-wrapper"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"

import TeaProductTabs from "./tea-product-tabs"

type TeaProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const TeaProductTemplate: React.FC<TeaProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const isTeaProduct =
    product.metadata?.tea_type ||
    product.type?.value?.toLowerCase().includes("tea") ||
    product.categories?.some((cat) => cat.name?.toLowerCase().includes("tea"))

  if (!isTeaProduct) {
    return (
      <>
        <ProductBreadcrumb product={product} />
        <div
          className="content-container flex flex-col small:flex-row small:items-start py-6 relative"
          data-testid="product-container"
        >
          <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
            <ProductInfo product={product} />
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

  return (
    <>
      <ProductBreadcrumb product={product} />

      <div
        className="content-container flex flex-col large:flex-row large:items-start py-6 relative gap-8"
        data-testid="tea-product-container"
      >
        <div className="flex flex-col large:sticky large:top-48 large:py-0 large:max-w-[380px] w-full py-8 gap-y-6">
          <ProductInfo product={product} />
          <TeaBasicInfo product={product} />
        </div>

        <div className="block w-full relative large:max-w-[500px]">
          <ImageGallery images={product?.images || []} />
        </div>

        <div className="flex flex-col large:sticky large:top-48 large:py-0 large:max-w-[320px] w-full py-8 gap-y-12">
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
        <TeaProductTabs product={product} />
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

export default TeaProductTemplate
