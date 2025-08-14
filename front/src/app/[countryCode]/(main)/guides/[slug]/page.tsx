import { getGuideBySlugCMS, getGuidesCMS } from "@lib/data/sanity"
import { listRegions } from "@lib/data/regions"
import { notFound } from "next/navigation"

export const revalidate = 600

export async function generateStaticParams() {
  try {
    const [regions, guides] = await Promise.all([listRegions(), getGuidesCMS()])
    const countryCodes = regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    return (countryCodes || [])
      .flatMap((cc) => guides.map((g) => ({ countryCode: cc, slug: g.slug })))
  } catch {
    return []
  }
}

export default async function GuideDetail({
  params,
}: {
  params: Promise<{ countryCode: string; slug: string }>
}) {
  const p = await params
  const guide = await getGuideBySlugCMS(p.slug)
  if (!guide) return notFound()
  return (
    <div className="content-container py-10">
      <h1 className="text-2xl font-semibold mb-4">Brewing: {guide.teaType}</h1>
      <div className="grid grid-cols-2 gap-4">
        {typeof guide.waterTempC === "number" && (
          <div>
            <div className="text-ui-fg-subtle">Water Temp</div>
            <div className="font-medium">{guide.waterTempC} °C</div>
          </div>
        )}
        {typeof guide.leafGramPer100ml === "number" && (
          <div>
            <div className="text-ui-fg-subtle">Leaf / 100ml</div>
            <div className="font-medium">{guide.leafGramPer100ml} g</div>
          </div>
        )}
        {typeof guide.brewTimes === "number" && (
          <div>
            <div className="text-ui-fg-subtle">Times</div>
            <div className="font-medium">{guide.brewTimes}x</div>
          </div>
        )}
      </div>
      {guide.timePlan?.length ? (
        <div className="mt-6">
          <div className="text-ui-fg-subtle text-sm mb-1">Time Plan</div>
          <ul className="list-disc list-inside text-sm">
            {guide.timePlan.map((t, idx) => (
              <li key={idx}>
                {typeof t.time_s === "number" ? `${t.time_s}s` : "-"}
                {t.note ? ` – ${t.note}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {guide.tips ? (
        <div className="mt-6 text-sm">
          <div className="text-ui-fg-subtle mb-1">Tips</div>
          <p className="whitespace-pre-line">{guide.tips}</p>
        </div>
      ) : null}
    </div>
  )
}


