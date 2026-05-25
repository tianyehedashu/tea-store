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
    <div className="min-h-screen bg-[#fffaf2]">
      <section className="hero-gradient border-b border-[#eadbc4]">
        <div className="content-container py-12 small:py-16">
          <div className="max-w-4xl">
            <p className="section-eyebrow mb-3">Collection</p>
            <h1 className="break-words font-display text-4xl leading-tight text-sage-900 xsmall:text-5xl small:text-6xl">
              {collection.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-sage-700 xsmall:text-lg xsmall:leading-relaxed">
              Curated teas selected for flavor, origin, and brewing character.
              Filter and sort to find your next cup.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf2]">
        <div className="content-container flex flex-col gap-6 py-8 small:flex-row small:items-start small:gap-8 small:py-12">
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
