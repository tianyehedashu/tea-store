import { Metadata } from "next"
import { getOriginBySlug, getOrigins } from "@lib/data/origins"
import { listRegions } from "@lib/data/regions"
import OriginDetailTemplate from "@modules/origins/templates/origin-detail"
import { notFound } from "next/navigation"

export const revalidate = 600

export async function generateStaticParams() {
  try {
    const [regions, origins] = await Promise.all([
      listRegions(),
      getOrigins(),
    ])
    const countryCodes = regions
      ?.map((r) => r.countries?.map((c) => c.iso_2))
      .flat()
    return (countryCodes || []).flatMap((cc) =>
      origins.map((o) => ({ countryCode: cc, slug: o.slug }))
    )
  } catch {
    return []
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const origin = await getOriginBySlug(slug)
  if (!origin) {
    return { title: "Origin | Zentee" }
  }
  return {
    title: `${origin.title} | Zentee Origins`,
    description: `Explore ${origin.title} — terroir, flavor, and teas from this origin.`,
  }
}

export default async function OriginDetail({
  params,
}: {
  params: Promise<{ countryCode: string; slug: string }>
}) {
  const p = await params
  const origin = await getOriginBySlug(p.slug)
  if (!origin) {
    return notFound()
  }

  return <OriginDetailTemplate origin={origin} countryCode={p.countryCode} />
}
