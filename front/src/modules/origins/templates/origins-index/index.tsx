import { OriginDTO } from "@lib/data/cms/types"
import EmptyState from "@modules/common/components/empty-state"
import OriginsIndexHero from "@modules/origins/components/origins-index-hero"
import OriginCard from "@modules/origins/components/origin-card"

export default function OriginsIndexTemplate({
  origins,
}: {
  origins: OriginDTO[]
}) {
  return (
    <div className="min-h-screen bg-cream-50/30">
      <OriginsIndexHero />

      <section className="content-container py-12 small:py-16">
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
          <>
            <p className="text-center text-sage-600 max-w-2xl mx-auto mb-10">
              {origins.length} growing regions in our current collection — select
              a origin to read about terroir, flavor, and linked teas.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
              {origins.map((origin) => (
                <li key={origin.id}>
                  <OriginCard origin={origin} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  )
}
