"use server"

export type SanityClientOptions = {
  useDraft?: boolean
}

export type SanityFetchInit = {
  useDraft?: boolean
  tags?: string[]
}

const getSanityBase = () => {
  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET
  if (!projectId || !dataset) {
    throw new Error(
      "Missing SANITY_PROJECT_ID or SANITY_DATASET environment variables."
    )
  }
  return { projectId, dataset }
}

const apiVersion = "2023-10-01"

export async function sanityFetch<T = any>(
  query: string,
  params?: Record<string, unknown>,
  init?: SanityFetchInit
): Promise<T> {
  const { projectId, dataset } = getSanityBase()
  const token = process.env.SANITY_API_READ_TOKEN
  const useDraft = Boolean(init?.useDraft)
  const url = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`
  )

  url.searchParams.set("query", query)

  if (params && Object.keys(params).length) {
    url.searchParams.set("%24params", JSON.stringify(params))
  }

  if (useDraft) {
    url.searchParams.set("perspective", "previewDrafts")
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers,
    next: init?.tags ? { tags: init.tags } : undefined,
    cache: "force-cache",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Sanity fetch error: ${res.status} ${text}`)
  }

  const json = (await res.json()) as { result: T }
  return json.result
}


