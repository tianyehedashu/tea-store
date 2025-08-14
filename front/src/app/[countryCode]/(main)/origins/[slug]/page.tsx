import { getOriginBySlugCMS, getOriginsCMS } from "@lib/data/sanity"
import { listRegions } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { notFound } from "next/navigation"

export const revalidate = 600

export async function generateStaticParams() {
  try {
    const [regions, origins] = await Promise.all([listRegions(), getOriginsCMS()])
    const countryCodes = regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    return (countryCodes || [])
      .flatMap((cc) => origins.map((o) => ({ countryCode: cc, slug: o.slug })))
  } catch {
    return []
  }
}

export default async function OriginDetail({
  params,
}: {
  params: Promise<{ countryCode: string; slug: string }>
}) {
  const p = await params
  const origin = await getOriginBySlugCMS(p.slug)
  if (!origin) return notFound()
  return (
    <div className="content-container py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{origin.title}</h1>
        <div className="text-ui-fg-subtle">
          {[origin.country, origin.region, origin.mountain].filter(Boolean).join(" · ")}
        </div>
      </div>

      {origin.flavorProfile?.length ? (
        <div className="mb-6">
          <div className="text-sm text-ui-fg-subtle mb-1">Flavor Profile</div>
          <div className="flex flex-wrap gap-2">
            {origin.flavorProfile.map((f) => (
              <span key={f} className="text-xs px-2 py-1 rounded bg-ui-bg-subtle border">
                {f}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-3">Representative Products</h2>
        <div className="flex flex-wrap gap-3">
          {origin.products?.map((p) => (
            <LocalizedClientLink key={p.handle} href={`/products/${p.handle}`} className="underline">
              {p.handle}
            </LocalizedClientLink>
          )) || null}
        </div>
      </div>
    </div>
  )
}


