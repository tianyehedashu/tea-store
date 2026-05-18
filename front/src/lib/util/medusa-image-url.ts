/**
 * 将 Medusa 返回的图片 URL 规范为当前环境的后端 origin，
 * 避免 seed/.env 使用 localhost 与浏览器实际 MEDUSA_BACKEND_URL（如 127.0.0.1）不一致导致列表图与详情图错位或优化加载失败。
 */
export function resolveMedusaAssetUrl(
  url: string | null | undefined
): string | undefined {
  if (!url || typeof url !== "string") {
    return undefined
  }

  const base = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

  try {
    const parsed = new URL(url)
    if (parsed.pathname.startsWith("/static/")) {
      const baseUrl = new URL(base)
      return `${baseUrl.origin}${parsed.pathname}${parsed.search}`
    }
    return url
  } catch {
    if (url.startsWith("/static/")) {
      return `${base.replace(/\/$/, "")}${url}`
    }
    return url
  }
}
