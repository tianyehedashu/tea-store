import { resolveMedusaAssetUrl } from "@lib/util/medusa-image-url"
import { resolveSanityImageUrl } from "@lib/util/sanity-image-url"

/** Origin hero: Sanity CDN, Next public /images/origins, or Medusa /static. */
export function resolveOriginHeroImageUrl(
  heroImage: unknown,
  width = 1200
): string | null {
  const sanityUrl = resolveSanityImageUrl(heroImage, width)
  if (sanityUrl) {
    return sanityUrl
  }

  if (typeof heroImage === "object" && heroImage !== null) {
    const path = (heroImage as { path?: string }).path
    if (typeof path === "string" && path.startsWith("/images/")) {
      return path
    }
    const url = (heroImage as { url?: string }).url
    if (typeof url === "string") {
      if (url.startsWith("/images/")) {
        return url
      }
      return resolveMedusaAssetUrl(url) ?? url
    }
  }

  return null
}
