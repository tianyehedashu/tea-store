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
        <div className="content-container grid gap-8 py-12 small:grid-cols-[1fr_0.72fr] small:items-end small:py-16">
          <div className="max-w-4xl">
            <p className="section-eyebrow mb-4 text-[#d79b62]">Tea store</p>
            <h1
              className="font-display text-5xl leading-tight text-[#fff7ec] small:text-6xl"
              data-testid="store-page-title"
            >
              Premium teas, easier to choose.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#dce5d7]">
              Explore loose-leaf teas by type, origin, cup profile, and brewing
              confidence. Every product keeps taste notes and preparation close
              to the buying decision.
            </p>
          </div>
          <div className="flex flex-col gap-3 small:items-end">
            <LocalizedClientLink
              href="/guides"
              className="brand-outline border-white/25 bg-white/10 text-white hover:bg-white hover:text-sage-900"
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
          className="content-container flex flex-col gap-8 py-10 small:flex-row small:items-start small:py-12"
          data-testid="category-container"
        >
          <RefinementList sortBy={sort} categories={categories} />
          <main className="flex-1 space-y-8">
            <div className="rounded-lg border border-[#eadbc4] bg-white px-6 py-5">
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
