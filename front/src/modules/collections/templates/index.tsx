import { Suspense } from "react"

import { HttpTypes } from "@medusajs/types"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="hero-gradient min-h-screen">
      <section className="content-container pt-12 pb-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 mb-3">
            Collection
          </p>
          <h1 className="font-display text-4xl small:text-5xl font-bold text-sage-900 mb-4">
            {collection.title}
          </h1>
          <p className="text-lg text-sage-700 max-w-2xl leading-relaxed">
            Curated teas selected for flavor, origin, and brewing character.
            Filter and sort to find your next cup.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="flex flex-col small:flex-row small:items-start py-6 content-container gap-8">
          <RefinementList sortBy={sort} />
          <main className="w-full flex-1">
            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={collection.products?.length ?? 8}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                collectionId={collection.id}
                countryCode={countryCode}
              />
            </Suspense>
          </main>
        </div>
      </section>
    </div>
  )
}
