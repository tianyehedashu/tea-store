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
import TeaProductStory from "@modules/products/components/tea-product-story"
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

      <section className="relative overflow-hidden border-t border-sage-100 bg-gradient-to-b from-cream-50 via-white to-sage-50">
        <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand-100/70 blur-3xl" />
        <div className="pointer-events-none absolute left-8 top-16 hidden h-44 w-px bg-gradient-to-b from-transparent via-brand-300/60 to-transparent large:block" />
        <div className="pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-cream-200/35 blur-3xl" />
        <div
          className="content-container relative grid gap-8 py-8 small:py-12 large:grid-cols-[minmax(0,1fr)_minmax(330px,390px)] large:items-start large:gap-12 xlarge:gap-16"
          data-testid="tea-product-container"
        >
          <div className="flex min-w-0 flex-col gap-8">
            <ProductInfo product={product} />
            <ImageGallery images={product?.images || []} />
            <TeaBasicInfo product={product} />
          </div>

          <aside className="w-full rounded-[2rem] border border-sage-100 bg-white/92 p-5 shadow-[0_24px_70px_rgba(49,66,49,0.10)] backdrop-blur small:p-6 large:sticky large:top-28">
            <div className="mb-5 border-b border-sage-100 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                Reserve the ritual
              </p>
              <p className="mt-2 text-sm leading-6 text-sage-600">
                Choose a size, review the essentials, and keep the purchase path
                calm and clear.
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
        <TeaProductStory product={product} />
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
