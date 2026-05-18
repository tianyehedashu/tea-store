import { getBaseURL } from "@lib/util/env"
import type { MetadataRoute } from "next"

const STATIC_PATHS = [
  "",
  "/store",
  "/about",
  "/help",
  "/origins",
  "/guides",
  "/privacy",
  "/terms",
  "/returns",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseURL().replace(/\/$/, "")
  const countryCode = process.env.NEXT_PUBLIC_DEFAULT_REGION ?? "us"
  const lastModified = new Date()

  return STATIC_PATHS.map((path) => ({
    url: `${baseUrl}/${countryCode}${path}`,
    lastModified,
    changeFrequency: path === "" || path === "/store" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/store" ? 0.9 : 0.7,
  }))
}
