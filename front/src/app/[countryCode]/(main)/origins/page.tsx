import { Metadata } from "next"
import { getOrigins } from "@lib/data/origins"
import { listRegions } from "@lib/data/regions"
import OriginsIndexTemplate from "@modules/origins/templates/origins-index"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Tea Origins",
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
  const origins = await getOrigins()
  return <OriginsIndexTemplate origins={origins} />
}
