// 开发环境检测
const isDevelopment = process.env.NODE_ENV === "development"
const disableCache = process.env.DISABLE_CACHE === "true" || isDevelopment

/**
 * 缓存配置常量
 */
export const CACHE_CONFIG = {
  // 缓存时间（秒） - 开发环境禁用缓存
  TTL: {
    PRODUCTS: disableCache ? 0 : 300, // 商品: 开发环境不缓存 / 生产环境5分钟
    CATEGORIES: disableCache ? 0 : 300, // 类别: 开发环境不缓存 / 生产环境5分钟
    COLLECTIONS: disableCache ? 0 : 600, // 合集: 开发环境不缓存 / 生产环境10分钟
    REGIONS: disableCache ? 0 : 3600, // 地区: 开发环境不缓存 / 生产环境1小时
    CUSTOMER: disableCache ? 0 : 1800, // 用户: 开发环境不缓存 / 生产环境30分钟
    CART: 0, // 购物车: 始终不缓存
  },

  // 缓存标签
  TAGS: {
    PRODUCTS: "products",
    CATEGORIES: "categories",
    COLLECTIONS: "collections",
    REGIONS: "regions",
    CUSTOMER: "customers",
    CART: "carts",
  },

  // 缓存策略
  STRATEGY: {
    FORCE_CACHE: disableCache
      ? ("no-store" as const)
      : ("force-cache" as const),
    NO_STORE: "no-store" as const,
    REVALIDATE: "revalidate" as const,
  },

  // 环境信息
  ENV: {
    IS_DEVELOPMENT: isDevelopment,
    CACHE_DISABLED: disableCache,
  },
} as const

/**
 * 获取缓存选项
 */
export function getCacheConfig(type: keyof typeof CACHE_CONFIG.TTL) {
  const ttl = CACHE_CONFIG.TTL[type]

  if (CACHE_CONFIG.ENV.CACHE_DISABLED || ttl === 0) {
    return {
      cache: CACHE_CONFIG.STRATEGY.NO_STORE,
    }
  }

  return {
    next: {
      revalidate: ttl,
      tags: [CACHE_CONFIG.TAGS[type]],
    },
    cache: CACHE_CONFIG.STRATEGY.FORCE_CACHE,
  }
}

/**
 * 获取无缓存选项
 */
export function getNoCacheConfig() {
  return {
    cache: CACHE_CONFIG.STRATEGY.NO_STORE,
  }
}

/**
 * 日志输出缓存状态
 */
export function logCacheStatus() {
  if (CACHE_CONFIG.ENV.IS_DEVELOPMENT) {
    console.log(
      `🗂️ 缓存状态: ${CACHE_CONFIG.ENV.CACHE_DISABLED ? "已禁用" : "已启用"}`
    )
    console.log(`📊 TTL 配置:`, CACHE_CONFIG.TTL)
  }
}
