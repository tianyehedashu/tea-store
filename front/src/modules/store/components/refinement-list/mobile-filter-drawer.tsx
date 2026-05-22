"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import {
  clearStoreFilterParams,
  countActiveStoreFilters,
} from "@lib/util/store-filters"

import RefinementPanel from "./refinement-panel"
import { SortOptions } from "./sort-products"

type MobileFilterDrawerProps = {
  sortBy: SortOptions
  categories?: HttpTypes.StoreProductCategory[]
  "data-testid"?: string
}

export default function MobileFilterDrawer({
  sortBy,
  categories,
  "data-testid": dataTestId,
}: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeCount = countActiveStoreFilters(searchParams)

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

  const clearFilters = () => {
    const query = clearStoreFilterParams(searchParams)
    router.push(query ? `${pathname}?${query}` : pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) {
      return
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }
    if (open) {
      window.addEventListener("keydown", onKeyDown)
    }
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <div className="small:hidden w-full mb-6">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#eadbc4] bg-white px-4 py-3 text-sm font-medium text-sage-900 shadow-sm transition-colors hover:border-[#d5b58f]"
          aria-expanded={open}
          aria-controls="mobile-filter-drawer"
        >
          <svg
            className="w-5 h-5 text-sage-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
          {activeCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#a6602e] px-1.5 text-xs font-semibold text-white">
              {activeCount}
            </span>
          ) : null}
        </button>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-[#eadbc4] bg-white px-4 py-3 text-sm font-medium text-sage-700 transition-colors hover:text-[#82471f]"
          >
            Clear
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-sage-900/40 backdrop-blur-sm"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-filter-drawer"
            className={clx(
              "absolute bottom-0 left-0 right-0 max-h-[88vh] flex flex-col",
              "rounded-t-lg border-t border-[#eadbc4] bg-[#fffaf2] shadow-2xl"
            )}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[#eadbc4] px-6 py-4">
              <h2 className="text-lg font-semibold text-sage-900">
                Filters & sort
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-sage-600 hover:bg-sage-100"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 flex-1">
              <RefinementPanel
                sortBy={sortBy}
                setQueryParams={setQueryParams}
                categories={categories}
                data-testid={dataTestId}
                showHeading={false}
              />
            </div>

            <div className="flex shrink-0 gap-3 border-t border-[#eadbc4] bg-[#f5eddf] px-6 py-4">
              {activeCount > 0 ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex-1 brand-outline text-sm justify-center py-3"
                >
                  Clear all
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 brand-cta text-sm justify-center py-3"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
