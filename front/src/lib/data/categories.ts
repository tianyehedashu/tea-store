import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"
import { getCacheConfig, CACHE_CONFIG } from "@lib/config/cache"

export const listCategories = async (query?: Record<string, any>) => {
  const limit = query?.limit || 100
  const cacheConfig = getCacheConfig("CATEGORIES")

  // 合并缓存配置
  const next = CACHE_CONFIG.ENV.CACHE_DISABLED
    ? undefined
    : { ...(await getCacheOptions("categories")), ...cacheConfig.next }

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache: cacheConfig.cache,
      }
    )
    .then(({ product_categories }) => product_categories)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`
  const cacheConfig = getCacheConfig("CATEGORIES")

  // 合并缓存配置
  const next = CACHE_CONFIG.ENV.CACHE_DISABLED
    ? undefined
    : {
        ...(await getCacheOptions("categories")),
        ...cacheConfig.next,
        revalidate: CACHE_CONFIG.ENV.CACHE_DISABLED ? 0 : 180, // 开发环境不缓存，生产环境3分钟
      }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        next,
        cache: cacheConfig.cache,
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
