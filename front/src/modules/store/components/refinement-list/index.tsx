"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import MobileFilterDrawer from "./mobile-filter-drawer"
import RefinementPanel from "./refinement-panel"
import { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
  categories?: HttpTypes.StoreProductCategory[]
}

const RefinementList = ({
  sortBy,
  "data-testid": dataTestId,
  categories,
}: RefinementListProps) => {
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
    <>
      <MobileFilterDrawer
        sortBy={sortBy}
        categories={categories}
        data-testid={dataTestId}
      />
      <aside className="hidden small:sticky small:top-24 small:block small:min-w-[300px] small:max-w-[320px]">
        <RefinementPanel
          sortBy={sortBy}
          setQueryParams={setQueryParams}
          categories={categories}
          data-testid={dataTestId}
        />
      </aside>
    </>
  )
}

export default RefinementList
