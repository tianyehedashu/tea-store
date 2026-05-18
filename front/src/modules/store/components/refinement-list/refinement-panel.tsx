import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import SortProducts, { SortOptions } from "./sort-products"
import TeaFilters from "./tea-filters"

type RefinementPanelProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: string) => void
  categories?: HttpTypes.StoreProductCategory[]
  "data-testid"?: string
  showHeading?: boolean
}

export default function RefinementPanel({
  sortBy,
  setQueryParams,
  categories,
  "data-testid": dataTestId,
  showHeading = true,
}: RefinementPanelProps) {
  return (
    <div className="space-y-6">
      {showHeading ? (
        <h2 className="text-xl font-semibold text-sage-900">
          Filter & Explore
        </h2>
      ) : null}

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-sage-900 uppercase tracking-wider">
          Tea Categories
        </h3>
        <div className="space-y-3">
          <LocalizedClientLink
            href="/store"
            className="flex items-center gap-3 text-sm text-sage-700 hover:text-brand-600 transition-colors py-2 px-3 rounded-lg hover:bg-sage-50"
          >
            <span className="w-2 h-2 rounded-full bg-sage-400" />
            All Teas
          </LocalizedClientLink>
          {categories
            ?.filter((cat) => cat.name.includes("Tea"))
            .map((category) => (
              <LocalizedClientLink
                key={category.id}
                href={`/categories/${category.handle}`}
                className="flex items-center gap-3 text-sm text-sage-700 hover:text-brand-600 transition-colors py-2 px-3 rounded-lg hover:bg-sage-50 group"
              >
                <span className="w-2 h-2 rounded-full bg-brand-400 group-hover:bg-brand-500 transition-colors" />
                {category.name}
              </LocalizedClientLink>
            ))}
        </div>
      </div>

      <Suspense fallback={null}>
        <TeaFilters />
      </Suspense>

      <div className="pt-6 border-t border-sage-200">
        <SortProducts
          sortBy={sortBy}
          setQueryParams={setQueryParams}
          data-testid={dataTestId}
        />
      </div>
    </div>
  )
}
