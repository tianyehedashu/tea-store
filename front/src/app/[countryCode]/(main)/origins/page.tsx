import { Metadata } from "next"
import { getOriginsCMS } from "@lib/data/sanity"
import { listRegions } from "@lib/data/regions"
import OriginsIndexTemplate from "@modules/origins/templates/origins-index"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Tea Origins | Zentee",
  description:
    "Discover the mountains, regions, and flavor profiles behind Zentee teas.",
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

export default async function OriginsIndex() {
  let origins = [] as Awaited<ReturnType<typeof getOriginsCMS>>
  try {
    origins = await getOriginsCMS()
  } catch {
    origins = []
  }

  return <OriginsIndexTemplate origins={origins} />
}
