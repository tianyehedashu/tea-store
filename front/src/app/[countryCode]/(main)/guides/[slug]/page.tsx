import { Metadata } from "next"
import { getGuideBySlugCMS, getGuidesCMS } from "@lib/data/sanity"
import { listRegions } from "@lib/data/regions"
import GuideDetailTemplate from "@modules/guides/templates/guide-detail"
import { notFound } from "next/navigation"

export const revalidate = 600

export async function generateStaticParams() {
  try {
    const [regions, guides] = await Promise.all([listRegions(), getGuidesCMS()])
    const countryCodes = regions
      ?.map((r) => r.countries?.map((c) => c.iso_2))
      .flat()
    return (countryCodes || []).flatMap((cc) =>
      guides.map((g) => ({ countryCode: cc, slug: g.slug }))
    )
  } catch {
    return []
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const guide = await getGuideBySlugCMS(slug).catch(() => null)
  if (!guide) {
    return { title: "Brewing Guide" }
  }
  return {
    title: `Brew ${guide.teaType}`,
    description: `How to brew ${guide.teaType} tea — temperature, ratio, and steeping steps.`,
  }
}

export default async function GuideDetail({
  params,
}: {
  params: Promise<{ countryCode: string; slug: string }>
}) {
  const p = await params
  const guide = await getGuideBySlugCMS(p.slug)
  if (!guide) {
    return notFound()
  }

  return <GuideDetailTemplate guide={guide} countryCode={p.countryCode} />
}
