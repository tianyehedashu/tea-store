/** Build a Sanity CDN image URL from a GROQ `asset->url` or legacy image object. */
export function resolveSanityImageUrl(
  image: unknown,
  width = 800
): string | null {
  if (!image) {
    return null
  }

  if (typeof image === "string" && image.startsWith("http")) {
    return appendWidth(image, width)
  }

  if (typeof image === "object" && image !== null) {
    const record = image as Record<string, unknown>
    const directUrl = record.url
    if (typeof directUrl === "string" && directUrl.startsWith("http")) {
      return appendWidth(directUrl, width)
    }
  }

  return null
}

function appendWidth(url: string, width: number): string {
  if (url.includes("?")) {
    return `${url}&w=${width}&auto=format`
  }
  return `${url}?w=${width}&auto=format`
}
