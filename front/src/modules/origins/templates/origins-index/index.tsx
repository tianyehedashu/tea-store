import { OriginDTO } from "@lib/data/cms/types"
import EmptyState from "@modules/common/components/empty-state"
import PageHero from "@modules/common/components/page-hero"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import OriginCard from "@modules/origins/components/origin-card"

export default function OriginsIndexTemplate({
  origins,
}: {
  origins: OriginDTO[]
}) {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="Tea Origins"
        title="Where every leaf begins"
        description="Explore mountain gardens, regional terroir, and the flavor profiles that shape each harvest. Every Zentee tea is tied to a place you can trust."
      >
        <LocalizedClientLink href="/store" className="brand-cta text-sm">
          Shop by origin
        </LocalizedClientLink>
      </PageHero>

      <section className="content-container py-12">
        {origins.length === 0 ? (
          <EmptyState
            title="Origins coming soon"
            description="Origin profiles are being updated. Browse our full tea collection or check back soon for new regions."
            actionLabel="Browse all teas"
            actionHref="/store"
            secondaryLabel="Brewing guides"
            secondaryHref="/guides"
          />
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {origins.map((origin) => (
              <li key={origin.id}>
                <OriginCard origin={origin} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
