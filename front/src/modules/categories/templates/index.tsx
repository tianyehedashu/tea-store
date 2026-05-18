import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const categories = await listCategories()

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div className="hero-gradient min-h-screen">
      {/* Category Hero */}
      <section className="content-container pt-12 pb-8">
        <div className="max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-sage-600 mb-6">
            <LocalizedClientLink
              href="/store"
              className="hover:text-brand-600 transition-colors"
            >
              All Teas
            </LocalizedClientLink>
            {parents &&
              parents.reverse().map((parent) => (
                <span key={parent.id} className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <LocalizedClientLink
                    className="hover:text-brand-600 transition-colors"
                    href={`/categories/${parent.handle}`}
                    data-testid="sort-by-link"
                  >
                    {parent.name}
                  </LocalizedClientLink>
                </span>
              ))}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-brand-600 font-medium">{category.name}</span>
          </nav>

          <h1
            className="font-display text-4xl small:text-5xl font-bold text-sage-900 mb-4"
            data-testid="category-page-title"
          >
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-sage-700 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white">
        <div
          className="flex flex-col small:flex-row small:items-start content-container py-12 gap-8"
          data-testid="category-container"
        >
          <RefinementList
            sortBy={sort}
            categories={categories}
            data-testid="sort-by-container"
          />
          <main className="flex-1 space-y-8">
            {/* Subcategories */}
            {category.category_children && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-sage-900">
                  Explore Subcategories
                </h2>
                <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-6">
                  {category.category_children?.map((c) => (
                    <LocalizedClientLink
                      key={c.id}
                      href={`/categories/${c.handle}`}
                      className="tea-category-card group"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center mx-auto">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-sage-900 group-hover:text-brand-600 transition-colors">
                          {c.name}
                        </h3>
                        <div className="text-sm text-sage-600">
                          Explore Collection →
                        </div>
                      </div>
                    </LocalizedClientLink>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-sage-900">
                All {category.name}
              </h2>
              <Suspense
                fallback={
                  <SkeletonProductGrid
                    numberOfProducts={category.products?.length ?? 8}
                  />
                }
              >
                <PaginatedProducts
                  sortBy={sort}
                  page={pageNumber}
                  categoryId={category.id}
                  countryCode={countryCode}
                />
              </Suspense>
            </div>
          </main>
        </div>
      </section>
    </div>
  )
}
