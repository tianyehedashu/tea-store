import { Metadata } from "next"
import { getGuidesCMS } from "@lib/data/sanity"
import { listRegions } from "@lib/data/regions"
import GuidesIndexTemplate from "@modules/guides/templates/guides-index"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Brewing Guides | Zentee",
  description:
    "Water temperature, leaf ratio, and steeping steps for green, oolong, black, and more.",
}

export async function generateStaticParams() {
  try {
    const regions = await listRegions()
    const countryCodes = regions
      ?.map((r) => r.countries?.map((c) => c.iso_2))
      .flat()
    return (countryCodes || []).map((cc) => ({ countryCode: cc }))
  } catch {
    return []
  }
}

export default async function GuidesIndex() {
  let guides = [] as Awaited<ReturnType<typeof getGuidesCMS>>
  try {
    guides = await getGuidesCMS()
  } catch {
    guides = []
  }

  return <GuidesIndexTemplate guides={guides} />
}
