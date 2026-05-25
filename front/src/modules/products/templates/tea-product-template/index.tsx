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
import BrewTipsDisplay from "@modules/products/components/brew-tips-display"
import ProductInfo from "@modules/products/templates/product-info"
import ProductActionsWrapper from "@modules/products/templates/product-actions-wrapper"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { extractBrewOverride } from "@lib/util/brew-data"
import {
  formatTeaType,
  getBrandName,
  getBulletPoints,
  getProductMediaVideos,
  getTeaMetadata,
} from "@lib/types/tea-product-metadata"

import TeaProductTabs from "./tea-product-tabs"

type TeaProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const titleCase = (value?: string) =>
  value
    ?.replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const joinNotes = (notes?: string[], fallback?: string) => {
  const cleanNotes = Array.isArray(notes)
    ? notes.filter((note): note is string => Boolean(note))
    : []

  return cleanNotes.length ? cleanNotes.slice(0, 3).join(" / ") : fallback
}

type HeroStat = {
  label: string
  value?: string
  detail?: string
}

const HeroProof = ({
  bulletPoints,
  heroStats,
  className = "",
}: {
  bulletPoints: string[]
  heroStats: HeroStat[]
  className?: string
}) => (
  <div className={["space-y-8", className].filter(Boolean).join(" ")}>
    {bulletPoints.length ? (
      <ul className="grid gap-3 text-sm text-[#eef4ea]">
        {bulletPoints.map((point) => (
          <li key={point} className="flex gap-3 leading-6">
            <span
              className="mt-2 h-2 w-2 flex-none rounded-full bg-[#d79b62]"
              aria-hidden="true"
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    ) : null}

    <div className="grid gap-3 xsmall:grid-cols-3 large:grid-cols-1">
      {heroStats.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-white/10 bg-white/[0.06] p-4"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d7c7ad]">
            {item.label}
          </p>
          <p className="mt-2 text-sm font-semibold capitalize text-white">
            {item.value}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#b9c9b5]">{item.detail}</p>
        </div>
      ))}
    </div>
  </div>
)

const TeaProductTemplate: React.FC<TeaProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const metadata = getTeaMetadata(product)
  const mediaVideos = getProductMediaVideos(product)
  const brandName = getBrandName(metadata)
  const teaType =
    formatTeaType(metadata.tea_type) ||
    titleCase(metadata.tea_category) ||
    "Curated Tea"
  const originLabel =
    [metadata.origin_region, metadata.origin_province]
      .filter(Boolean)
      .join(", ") ||
    metadata.origin_id?.replace(/-/g, " ") ||
    metadata.country_of_origin ||
    "Selected garden"
  const flavorLabel = joinNotes(metadata.flavor_notes, "Clean / layered / calm")
  const aromaLabel = joinNotes(metadata.aroma_notes, "Aroma-led cup")
  const bulletPoints = getBulletPoints(product).slice(0, 4)
  const brewData = extractBrewOverride(
    product.metadata as Record<string, unknown> | null | undefined
  )
  const heroDescription =
    product.description ||
    `A ${teaType.toLowerCase()} selected for a clear cup, steady aroma, and an easy brewing rhythm.`

  const heroStats = [
    {
      label: "Origin",
      value: titleCase(originLabel),
      detail: metadata.harvest_season
        ? `${titleCase(metadata.harvest_season)} harvest`
        : "Traceable lot",
    },
    {
      label: "Cup profile",
      value: flavorLabel,
      detail: aromaLabel,
    },
    {
      label: "Brew rhythm",
      value: metadata.caffeine_level || "Daily ritual",
      detail: metadata.grade ? `${titleCase(metadata.grade)} grade` : teaType,
    },
  ]

  const proofCards = [
    {
      label: "Taste first",
      value: flavorLabel,
      body: "Flavor, aroma, and finish are clear at a glance, so you can picture the cup before opening the details.",
    },
    {
      label: "Easy to brew",
      value: "Temp, ratio, timing",
      body: "Exact water temperature, leaf ratio, and steep timing help the first session land cleanly.",
    },
    {
      label: "Worth the shelf",
      value: bulletPoints[0] || "Picked for repeat cups",
      body: "Selected for the kind of cup that earns a regular place in a daily routine.",
    },
  ]

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
            <ImageGallery images={product?.images || []} videos={mediaVideos} />
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

      <section className="relative overflow-hidden border-t border-[#203428] bg-[#111d16] text-white">
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        <div
          className="content-container relative grid gap-7 py-7 small:py-12 large:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(330px,390px)] large:items-start large:gap-8 xlarge:gap-10"
          data-testid="tea-product-container"
        >
          <div className="flex min-w-0 flex-col justify-between gap-8 large:min-h-[720px] large:py-3">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                {product.collection && (
                  <LocalizedClientLink
                    href={`/collections/${product.collection.handle}`}
                    className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-xs font-medium text-[#f7ead8] transition hover:border-[#c98952] hover:text-white"
                  >
                    {product.collection.title}
                  </LocalizedClientLink>
                )}
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d79b62]">
                  {brandName} selection
                </span>
              </div>

              <div className="space-y-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d7c7ad]">
                  {teaType}
                </p>
                <h1
                  className="max-w-3xl break-words font-display text-4xl leading-[1.06] text-[#fff7ec] xsmall:text-5xl small:text-6xl large:text-7xl"
                  data-testid="product-title"
                >
                  {product.title}
                </h1>
                <p
                  className="max-w-xl text-base leading-7 text-[#dce5d7] xsmall:text-lg"
                  data-testid="product-description"
                >
                  {heroDescription}
                </p>
              </div>
            </div>

            <HeroProof
              bulletPoints={bulletPoints}
              heroStats={heroStats}
              className="hidden large:block"
            />
          </div>

          <div className="min-w-0 large:py-3">
            <ImageGallery images={product?.images || []} videos={mediaVideos} />
          </div>

          <HeroProof
            bulletPoints={bulletPoints}
            heroStats={heroStats}
            className="large:hidden"
          />

          <aside className="w-full self-start rounded-lg border border-[#e2cfb4] bg-[#fffaf2] p-5 text-sage-900 shadow-[0_28px_80px_rgba(4,18,10,0.32)] small:p-6 large:sticky large:top-24">
            <div className="mb-5 border-b border-[#eadbc4] pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a6602e]">
                Build your tea shelf
              </p>
              <h2 className="mt-2 font-display text-3xl leading-tight text-sage-900">
                Choose the pack, start the ritual.
              </h2>
              <p className="mt-3 text-sm leading-6 text-sage-700">
                Live price, stock, size, and guidance stay in one place so the
                next step feels obvious.
              </p>
            </div>
            <div className="mb-5 grid grid-cols-1 gap-2 text-center text-[11px] font-semibold uppercase tracking-wide text-sage-700 xsmall:grid-cols-3">
              <span className="rounded-lg border border-[#eadbc4] bg-white px-2 py-2">
                Fresh pack
              </span>
              <span className="rounded-lg border border-[#eadbc4] bg-white px-2 py-2">
                Brew notes
              </span>
              <span className="rounded-lg border border-[#eadbc4] bg-white px-2 py-2">
                Secure pay
              </span>
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

      <section className="border-b border-sage-100 bg-[#fffaf2]">
        <div className="content-container grid gap-6 py-8 small:py-10 large:grid-cols-[minmax(260px,0.62fr)_1fr] large:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a6602e]">
              Why this cup works
            </p>
            <h2 className="mt-3 max-w-md font-display text-3xl leading-tight text-sage-900 small:text-4xl">
              Taste, brew, and origin are clear before the first click.
            </h2>
          </div>
          <div className="grid gap-3 medium:grid-cols-3">
            {proofCards.map((card) => (
              <div
                key={card.label}
                className="rounded-lg border border-[#eadbc4] bg-white p-5 shadow-sm"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a6602e]">
                  {card.label}
                </p>
                <p className="mt-3 text-base font-semibold capitalize text-sage-900">
                  {card.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-sage-700">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="content-container my-12 grid gap-8 small:my-16 large:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="space-y-8">
          <TeaProductStory product={product} />
          <TeaBasicInfo product={product} />
        </div>
        <div className="space-y-8">
          {brewData ? (
            <BrewTipsDisplay
              brew={brewData}
              title="Brew it right on the first cup"
            />
          ) : null}
          <ProductSpecifications product={product} />
        </div>
      </div>

      <div className="content-container my-12 space-y-10 small:my-16">
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
