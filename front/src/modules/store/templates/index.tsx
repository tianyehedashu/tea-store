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
    <div className="hero-gradient min-h-screen">
      <section className="content-container pt-12 pb-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1
            className="font-display text-5xl small:text-6xl font-bold text-sage-900 mb-6 leading-tight"
            data-testid="store-page-title"
          >
            Premium Tea Collection
          </h1>
          <p className="text-lg text-sage-700 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover our carefully curated selection of premium teas from the
            finest tea gardens around the world. Each tea is sourced directly
            from trusted growers who share our commitment to quality and
            sustainability.
          </p>
          <div className="flex flex-col small:flex-row gap-4 justify-center items-center">
            <LocalizedClientLink href="/guides" className="brand-outline">
              <span>Tea Guide</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </LocalizedClientLink>
            <LocalizedClientLink href="/origins" className="brand-outline">
              <span>Explore Origins</span>
            </LocalizedClientLink>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div
          className="flex flex-col small:flex-row small:items-start content-container py-12 gap-8"
          data-testid="category-container"
        >
          <RefinementList sortBy={sort} categories={categories} />
          <main className="flex-1 space-y-8">
            <div className="rounded-2xl border border-sage-200 bg-sage-50/80 px-8 py-6">
              <p className="text-sage-700 leading-relaxed text-center small:text-left">
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
