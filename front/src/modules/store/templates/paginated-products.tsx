import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <div className="space-y-8">
      {products.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-sage-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-sage-900">No teas found</h3>
          <p className="text-sage-600 max-w-md mx-auto">
            We couldn't find any teas matching your criteria. Try adjusting your filters or exploring our full collection.
          </p>
        </div>
      ) : (
        <>
          {/* Products count and sorting info */}
          <div className="flex items-center justify-between border-b border-sage-200 pb-4">
            <p className="text-sage-600">
              Showing <span className="font-medium text-sage-900">{products.length}</span> of{' '}
              <span className="font-medium text-sage-900">{count}</span> premium teas
            </p>
          </div>

          {/* Products Grid */}
          <ul
            className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-2 large:grid-cols-3 gap-8"
            data-testid="products-list"
          >
            {products.map((p) => {
              return (
                <li key={p.id} className="h-full">
                  <ProductPreview product={p} region={region} />
                </li>
              )
            })}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <div className="bg-white rounded-2xl shadow-lg border border-sage-200 p-2">
                <Pagination
                  data-testid="product-pagination"
                  page={page}
                  totalPages={totalPages}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
