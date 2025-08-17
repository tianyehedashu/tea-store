"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@medusajs/ui"

import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  'data-testid'?: string
  categories?: HttpTypes.StoreProductCategory[]
}

const RefinementList = ({ sortBy, 'data-testid': dataTestId, categories }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <aside className="flex small:flex-col gap-8 py-6 mb-8 small:px-0 pl-6 small:min-w-[320px] small:mr-8">
      {/* Filter Header */}
      <div className="hidden small:block">
        <h2 className="text-xl font-semibold text-sage-900 mb-6">Filter & Explore</h2>
      </div>

      {/* Tea Categories */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-sage-900 uppercase tracking-wider">Tea Categories</h3>
          <div className="space-y-3">
            <LocalizedClientLink
              href="/store"
              className="flex items-center gap-3 text-sm text-sage-700 hover:text-brand-600 transition-colors py-2 px-3 rounded-lg hover:bg-sage-50"
            >
              <span className="w-2 h-2 rounded-full bg-sage-400"></span>
              All Teas
            </LocalizedClientLink>
            {categories?.filter(cat => cat.name.includes('Tea')).map((category) => (
              <LocalizedClientLink
                key={category.id}
                href={`/categories/${category.handle}`}
                className="flex items-center gap-3 text-sm text-sage-700 hover:text-brand-600 transition-colors py-2 px-3 rounded-lg hover:bg-sage-50 group"
              >
                <span className="w-2 h-2 rounded-full bg-brand-400 group-hover:bg-brand-500 transition-colors"></span>
                {category.name}
              </LocalizedClientLink>
            ))}
          </div>
        </div>
        
        {/* Quick Filters */}
        <div className="space-y-4 pt-6 border-t border-sage-200">
          <h3 className="text-sm font-semibold text-sage-900 uppercase tracking-wider">Quality & Origin</h3>
          <div className="space-y-3">
            <button className="flex items-center gap-3 w-full text-sm text-sage-700 hover:text-brand-600 transition-colors py-2 px-3 rounded-lg hover:bg-sage-50 text-left">
              <div className="w-4 h-4 border border-sage-300 rounded bg-white"></div>
              Premium Grade
            </button>
            <button className="flex items-center gap-3 w-full text-sm text-sage-700 hover:text-brand-600 transition-colors py-2 px-3 rounded-lg hover:bg-sage-50 text-left">
              <div className="w-4 h-4 border border-sage-300 rounded bg-white"></div>
              Organic Certified
            </button>
            <button className="flex items-center gap-3 w-full text-sm text-sage-700 hover:text-brand-600 transition-colors py-2 px-3 rounded-lg hover:bg-sage-50 text-left">
              <div className="w-4 h-4 border border-sage-300 rounded bg-white"></div>
              Caffeine Free
            </button>
            <button className="flex items-center gap-3 w-full text-sm text-sage-700 hover:text-brand-600 transition-colors py-2 px-3 rounded-lg hover:bg-sage-50 text-left">
              <div className="w-4 h-4 border border-sage-300 rounded bg-white"></div>
              Single Origin
            </button>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-4 pt-6 border-t border-sage-200">
          <h3 className="text-sm font-semibold text-sage-900 uppercase tracking-wider">Price Range</h3>
          <div className="space-y-3">
            <button className="flex items-center gap-3 w-full text-sm text-sage-700 hover:text-brand-600 transition-colors py-2 px-3 rounded-lg hover:bg-sage-50 text-left">
              <div className="w-4 h-4 border border-sage-300 rounded bg-white"></div>
              Under €15
            </button>
            <button className="flex items-center gap-3 w-full text-sm text-sage-700 hover:text-brand-600 transition-colors py-2 px-3 rounded-lg hover:bg-sage-50 text-left">
              <div className="w-4 h-4 border border-sage-300 rounded bg-white"></div>
              €15 - €30
            </button>
            <button className="flex items-center gap-3 w-full text-sm text-sage-700 hover:text-brand-600 transition-colors py-2 px-3 rounded-lg hover:bg-sage-50 text-left">
              <div className="w-4 h-4 border border-sage-300 rounded bg-white"></div>
              €30 - €50
            </button>
            <button className="flex items-center gap-3 w-full text-sm text-sage-700 hover:text-brand-600 transition-colors py-2 px-3 rounded-lg hover:bg-sage-50 text-left">
              <div className="w-4 h-4 border border-sage-300 rounded bg-white"></div>
              €50+
            </button>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="pt-6 border-t border-sage-200">
        <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
      </div>
    </aside>
  )
}

export default RefinementList
