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
    <div className="rounded-lg border border-[#eadbc4] bg-white p-5 shadow-sm">
      {showHeading ? (
        <h2 className="mb-6 font-display text-2xl text-sage-900">
          Filter & Explore
        </h2>
      ) : null}

      <div className="space-y-4">
        <h3 className="section-eyebrow">
          Tea Categories
        </h3>
        <div className="space-y-3">
          <LocalizedClientLink
            href="/store"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sage-700 transition-colors hover:bg-[#fffaf2] hover:text-[#82471f]"
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
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sage-700 transition-colors hover:bg-[#fffaf2] hover:text-[#82471f]"
              >
                <span className="h-2 w-2 rounded-full bg-[#a6602e] transition-colors group-hover:bg-[#82471f]" />
                {category.name}
              </LocalizedClientLink>
            ))}
        </div>
      </div>

      <Suspense fallback={null}>
        <TeaFilters />
      </Suspense>

      <div className="mt-6 border-t border-[#eadbc4] pt-6">
        <SortProducts
          sortBy={sortBy}
          setQueryParams={setQueryParams}
          data-testid={dataTestId}
        />
      </div>
    </div>
  )
}
