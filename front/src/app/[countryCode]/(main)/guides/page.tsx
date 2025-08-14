import { getGuidesCMS } from "@lib/data/sanity"
import { listRegions } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const revalidate = 600

export async function generateStaticParams() {
  try {
    const regions = await listRegions()
    const countryCodes = regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    return (countryCodes || []).map((cc) => ({ countryCode: cc }))
  } catch {
    return []
  }
}

export default async function GuidesIndex({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  let guides = [] as Awaited<ReturnType<typeof getGuidesCMS>>
  try {
    guides = await getGuidesCMS()
  } catch {
    guides = []
  }
  const p = await params
  return (
    <div className="content-container py-10">
      <h1 className="text-2xl font-semibold mb-6">Brewing Guides</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((g) => (
          <LocalizedClientLink
            key={g.id}
            href={`/guides/${g.slug}`}
            className="block border rounded-md p-4 hover:shadow-sm"
          >
            <div className="text-lg font-medium">{g.teaType}</div>
            {typeof g.waterTempC === "number" && (
              <div className="text-sm text-ui-fg-subtle">{g.waterTempC} °C</div>
            )}
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  )
}


