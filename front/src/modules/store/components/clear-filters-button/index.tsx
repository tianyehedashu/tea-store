"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  clearStoreFilterParams,
  countActiveStoreFilters,
} from "@lib/util/store-filters"

export default function ClearFiltersButton() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeCount = countActiveStoreFilters(searchParams)

  if (activeCount === 0) {
    return null
  }

  const handleClear = () => {
    const query = clearStoreFilterParams(searchParams)
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <button
      type="button"
      onClick={handleClear}
      className="brand-outline text-sm mx-auto"
    >
      Clear all filters
    </button>
  )
}
