import { BrewingGuideDTO } from "@lib/data/cms/types"
import EmptyState from "@modules/common/components/empty-state"
import PageHero from "@modules/common/components/page-hero"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import GuideCard from "@modules/guides/components/guide-card"

export default function GuidesIndexTemplate({
  guides,
}: {
  guides: BrewingGuideDTO[]
}) {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="Brewing Guides"
        title="Brew with confidence"
        description="Water temperature, leaf ratio, and steeping rhythm for each tea type. Use these guides at home or match them to products in our shop."
      >
        <LocalizedClientLink href="/store" className="brand-cta text-sm">
          Shop teas
        </LocalizedClientLink>
      </PageHero>

      <section className="content-container py-12">
        {guides.length === 0 ? (
          <EmptyState
            title="Guides coming soon"
            description="Brewing guides are managed in Sanity and will appear here once published."
            actionLabel="Browse teas"
            actionHref="/store"
          />
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <li key={guide.id}>
                <GuideCard guide={guide} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
