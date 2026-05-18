const FILTER_PARAM_KEYS = [
  "tea_type",
  "price",
  "premium",
  "organic",
  "caffeine_free",
  "single_origin",
  "page",
] as const

export function countActiveStoreFilters(
  searchParams: URLSearchParams | ReadonlyURLSearchParams
): number {
  let count = 0

  if (searchParams.get("tea_type")) {
    count++
  }
  if (searchParams.get("price")) {
    count++
  }

  for (const key of ["premium", "organic", "caffeine_free", "single_origin"]) {
    if (searchParams.get(key) === "1") {
      count++
    }
  }

  return count
}

export function clearStoreFilterParams(
  searchParams: URLSearchParams | ReadonlyURLSearchParams
): string {
  const next = new URLSearchParams(searchParams.toString())

  for (const key of FILTER_PARAM_KEYS) {
    next.delete(key)
  }

  return next.toString()
}

type ReadonlyURLSearchParams = {
  get(name: string): string | null
  toString(): string
}
