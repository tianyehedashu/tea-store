import { NextRequest, NextResponse } from "next/server"
import {
  clearAllCache,
  clearCacheByTag,
  clearProductCache,
  clearCacheByPath,
} from "@lib/util/cache-manager"
import { CACHE_CONFIG } from "@lib/config/cache"

const CACHE_SECRET = process.env.REVALIDATE_SECRET

export async function POST(req: NextRequest) {
  try {
    // 验证权限
    const auth =
      req.headers.get("x-cache-token") || req.nextUrl.searchParams.get("secret")
    if (!CACHE_SECRET || auth !== CACHE_SECRET) {
      return NextResponse.json(
        { ok: false, message: "unauthorized" },
        { status: 401 }
      )
    }

    const body = (await req.json().catch(() => ({}))) as {
      action?: "clear-all" | "clear-tag" | "clear-products" | "clear-path"
      tag?: keyof typeof CACHE_CONFIG.TAGS
      path?: string
    }

    switch (body.action) {
      case "clear-all":
        await clearAllCache()
        return NextResponse.json({ ok: true, message: "所有缓存已清理" })

      case "clear-tag":
        if (!body.tag) {
          return NextResponse.json(
            { ok: false, message: "missing tag parameter" },
            { status: 400 }
          )
        }
        await clearCacheByTag(body.tag)
        return NextResponse.json({
          ok: true,
          message: `标签 ${body.tag} 缓存已清理`,
        })

      case "clear-products":
        await clearProductCache()
        return NextResponse.json({ ok: true, message: "商品相关缓存已清理" })

      case "clear-path":
        if (!body.path) {
          return NextResponse.json(
            { ok: false, message: "missing path parameter" },
            { status: 400 }
          )
        }
        await clearCacheByPath(body.path)
        return NextResponse.json({
          ok: true,
          message: `路径 ${body.path} 缓存已清理`,
        })

      default:
        return NextResponse.json(
          { ok: false, message: "invalid action" },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error("Cache management error:", error)
    return NextResponse.json(
      { ok: false, message: error?.message || "cache management error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const auth = req.nextUrl.searchParams.get("secret")
  if (!CACHE_SECRET || auth !== CACHE_SECRET) {
    return NextResponse.json(
      { ok: false, message: "unauthorized" },
      { status: 401 }
    )
  }

  return NextResponse.json({
    ok: true,
    availableActions: [
      "clear-all",
      "clear-tag",
      "clear-products",
      "clear-path",
    ],
    availableTags: Object.keys(CACHE_CONFIG.TAGS),
    cacheConfig: CACHE_CONFIG,
  })
}
