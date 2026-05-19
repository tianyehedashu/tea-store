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

      <section className="border-t border-sage-100 bg-gradient-to-b from-cream-50/80 via-white to-white">
        <div
          className="content-container grid gap-6 py-8 small:py-12 large:grid-cols-[minmax(0,420px)_minmax(420px,560px)_minmax(320px,380px)] large:items-start large:gap-10 xlarge:gap-14"
          data-testid="tea-product-container"
        >
          <div className="order-2 flex w-full flex-col gap-y-5 rounded-[2rem] border border-sage-100 bg-white/85 p-5 shadow-sm backdrop-blur small:p-6 large:sticky large:top-28 large:order-1">
            <ProductInfo product={product} />
            <TeaBasicInfo product={product} />
          </div>

          <div className="order-1 w-full large:order-2">
            <ImageGallery images={product?.images || []} />
          </div>

          <aside className="order-3 w-full rounded-[2rem] border border-sage-100 bg-white p-5 shadow-[0_24px_70px_rgba(49,66,49,0.10)] small:p-6 large:sticky large:top-28">
            <div className="mb-5 border-b border-sage-100 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                Reserve your tea
              </p>
              <p className="mt-2 text-sm leading-6 text-sage-600">
                Select a size, review the harvest notes, and add this blend to
                your cart.
              </p>
            </div>
            <div className="flex flex-col gap-y-6">
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
          </aside>
        </div>
      </section>

      <div className="content-container my-12 space-y-10 small:my-16">
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
