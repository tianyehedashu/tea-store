"use server"

import { revalidateTag, revalidatePath } from "next/cache"
import { getCacheTag } from "@lib/data/cookies"
import { CACHE_CONFIG } from "@lib/config/cache"

/**
 * 按标签清理缓存
 */
export async function clearCacheByTag(tag: keyof typeof CACHE_CONFIG.TAGS) {
  try {
    const cacheTag = await getCacheTag(CACHE_CONFIG.TAGS[tag])
    if (cacheTag) {
      await revalidateTag(cacheTag)
      console.log(`✅ 已清理缓存标签: ${cacheTag}`)
    }
  } catch (error) {
    console.error(`❌ 清理缓存失败:`, error)
  }
}

/**
 * 清理所有相关缓存
 */
export async function clearAllCache() {
  const tags = Object.keys(CACHE_CONFIG.TAGS) as Array<
    keyof typeof CACHE_CONFIG.TAGS
  >

  await Promise.allSettled(tags.map((tag) => clearCacheByTag(tag)))

  console.log("🎉 所有缓存清理完成")
}

/**
 * 清理商品相关缓存（产品+类别）
 */
export async function clearProductCache() {
  await Promise.allSettled([
    clearCacheByTag("PRODUCTS"),
    clearCacheByTag("CATEGORIES"),
  ])

  console.log("🛍️ 商品相关缓存清理完成")
}

/**
 * 按路径清理缓存
 */
export async function clearCacheByPath(path: string) {
  try {
    await revalidatePath(path)
    console.log(`✅ 已清理路径缓存: ${path}`)
  } catch (error) {
    console.error(`❌ 清理路径缓存失败:`, error)
  }
}
