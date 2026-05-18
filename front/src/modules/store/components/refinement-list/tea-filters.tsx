"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { clx } from "@medusajs/ui"
import type {
  PriceRangeFilter,
  TeaTypeFilter,
} from "@lib/util/tea-product-filters"

const TEA_TYPES: { value: TeaTypeFilter; label: string }[] = [
  { value: "green", label: "Green Tea" },
  { value: "white", label: "White Tea" },
  { value: "oolong", label: "Oolong Tea" },
  { value: "black", label: "Black Tea" },
  { value: "puer", label: "Pu-erh" },
  { value: "herbal", label: "Herbal" },
]

const PRICE_RANGES: { value: PriceRangeFilter; label: string }[] = [
  { value: "under_15", label: "Under €15" },
  { value: "15_30", label: "€15 – €30" },
  { value: "30_50", label: "€30 – €50" },
  { value: "50_plus", label: "€50+" },
]

function FilterToggle({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clx(
        "flex items-center gap-3 w-full text-sm transition-colors py-2 px-3 rounded-lg text-left",
        active
          ? "text-brand-700 bg-brand-50 font-medium"
          : "text-sage-700 hover:text-brand-600 hover:bg-sage-50"
      )}
    >
      <span
        className={clx(
          "w-4 h-4 border rounded flex items-center justify-center shrink-0",
          active ? "border-brand-600 bg-brand-600" : "border-sage-300 bg-white"
        )}
      >
        {active ? (
          <svg
            className="w-2.5 h-2.5 text-white"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 6l3 3 5-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      {label}
    </button>
  )
}

export default function TeaFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const toggleFlag = (key: string) => {
    const active = searchParams.get(key) === "1"
    updateParam(key, active ? null : "1")
  }

  const activeTeaType = searchParams.get("tea_type") as TeaTypeFilter | null
  const activePrice = searchParams.get("price") as PriceRangeFilter | null

  return (
    <>
      <div className="space-y-4 pt-6 border-t border-sage-200">
        <h3 className="text-sm font-semibold text-sage-900 uppercase tracking-wider">
          Tea Type
        </h3>
        <div className="space-y-2">
          <FilterToggle
            label="All types"
            active={!activeTeaType}
            onClick={() => updateParam("tea_type", null)}
          />
          {TEA_TYPES.map(({ value, label }) => (
            <FilterToggle
              key={value}
              label={label}
              active={activeTeaType === value}
              onClick={() =>
                updateParam("tea_type", activeTeaType === value ? null : value)
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-sage-200">
        <h3 className="text-sm font-semibold text-sage-900 uppercase tracking-wider">
          Quality & Origin
        </h3>
        <div className="space-y-2">
          <FilterToggle
            label="Premium Grade"
            active={searchParams.get("premium") === "1"}
            onClick={() => toggleFlag("premium")}
          />
          <FilterToggle
            label="Organic Certified"
            active={searchParams.get("organic") === "1"}
            onClick={() => toggleFlag("organic")}
          />
          <FilterToggle
            label="Caffeine Free"
            active={searchParams.get("caffeine_free") === "1"}
            onClick={() => toggleFlag("caffeine_free")}
          />
          <FilterToggle
            label="Single Origin"
            active={searchParams.get("single_origin") === "1"}
            onClick={() => toggleFlag("single_origin")}
          />
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-sage-200">
        <h3 className="text-sm font-semibold text-sage-900 uppercase tracking-wider">
          Price Range
        </h3>
        <div className="space-y-2">
          <FilterToggle
            label="Any price"
            active={!activePrice}
            onClick={() => updateParam("price", null)}
          />
          {PRICE_RANGES.map(({ value, label }) => (
            <FilterToggle
              key={value}
              label={label}
              active={activePrice === value}
              onClick={() =>
                updateParam("price", activePrice === value ? null : value)
              }
            />
          ))}
        </div>
      </div>
    </>
  )
}
