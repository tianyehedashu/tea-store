import { OriginDTO } from "@lib/data/cms/types"

type TerroirFact = { label: string; value: string }

function collectTerroirFacts(origin: OriginDTO): TerroirFact[] {
  const facts: TerroirFact[] = []
  if (origin.climate) {
    facts.push({ label: "Climate", value: origin.climate })
  }
  if (origin.soil) {
    facts.push({ label: "Soil", value: origin.soil })
  }
  if (origin.altitude) {
    facts.push({ label: "Elevation", value: origin.altitude })
  }
  if (origin.harvestSeason) {
    facts.push({ label: "Harvest", value: origin.harvestSeason })
  }
  return facts
}

export default function OriginTerroirGrid({ origin }: { origin: OriginDTO }) {
  const facts = collectTerroirFacts(origin)
  if (facts.length === 0) {
    return null
  }

  return (
    <section className="space-y-4" aria-labelledby="terroir-heading">
      <h2 id="terroir-heading" className="text-xl font-semibold text-sage-900">
        Terroir at a glance
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {facts.map((fact) => (
          <li
            key={fact.label}
            className="rounded-xl border border-sage-200 bg-sage-50/60 p-4 space-y-1 list-none"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
              {fact.label}
            </p>
            <p className="text-sm text-sage-800 leading-relaxed">{fact.value}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
