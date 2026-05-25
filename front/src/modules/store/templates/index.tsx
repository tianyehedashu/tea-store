import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { TeaProductFilters } from "@lib/util/tea-product-filters"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  teaFilters,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  teaFilters?: TeaProductFilters
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const categories = await listCategories()

  return (
    <div className="min-h-screen bg-[#fffaf2]">
      <section className="border-b border-[#203428] bg-[#111d16] text-white">
        <div className="content-container grid gap-7 py-10 small:grid-cols-[1fr_0.72fr] small:items-end small:py-16">
          <div className="max-w-4xl">
            <p className="section-eyebrow mb-4 text-[#d79b62]">Tea store</p>
            <h1
              className="break-words font-display text-4xl leading-tight text-[#fff7ec] xsmall:text-5xl small:text-6xl"
              data-testid="store-page-title"
            >
              Premium teas, easier to choose.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#dce5d7] xsmall:text-lg xsmall:leading-8">
              Explore loose-leaf teas by type, origin, cup profile, and brewing
              confidence. Every product keeps taste notes and preparation close
              to the buying decision.
            </p>
          </div>
          <div className="flex flex-col gap-3 small:items-end">
            <LocalizedClientLink
              href="/guides"
              className="brand-outline w-full border-white/25 bg-white/10 text-white hover:bg-white hover:text-sage-900 xsmall:w-fit"
            >
              <span>Tea Guide</span>
              <span aria-hidden>→</span>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/origins"
              className="text-sm font-semibold text-[#f4eadc] transition hover:text-white"
            >
              Explore Origins
            </LocalizedClientLink>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf2]">
        <div
          className="content-container flex flex-col gap-6 py-8 small:flex-row small:items-start small:gap-8 small:py-12"
          data-testid="category-container"
        >
          <RefinementList sortBy={sort} categories={categories} />
          <main className="flex-1 space-y-8">
            <div className="rounded-lg border border-[#eadbc4] bg-white px-4 py-4 small:px-6 small:py-5">
              <p className="text-center text-sm leading-6 text-sage-700 small:text-left">
                Use filters to explore by tea type, origin, and flavor. Every
                product includes brewing guidance to help you choose with
                confidence.
              </p>
            </div>

            <div>
              <Suspense fallback={<SkeletonProductGrid />}>
                <PaginatedProducts
                  sortBy={sort}
                  page={pageNumber}
                  countryCode={countryCode}
                  teaFilters={teaFilters}
                />
              </Suspense>
            </div>
          </main>
        </div>
      </section>
    </div>
  )
}

export default StoreTemplate
