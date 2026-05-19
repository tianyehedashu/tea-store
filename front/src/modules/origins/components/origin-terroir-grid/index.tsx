import type { ReactNode } from "react"
import { OriginDTO } from "@lib/data/cms/types"

type TerroirFact = {
  label: string
  value: string
  icon: "climate" | "soil" | "elevation" | "harvest"
}

const ICONS: Record<TerroirFact["icon"], ReactNode> = {
  climate: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  soil: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21c-4-2-7-5-7-9a7 7 0 1114 0c0 4-3 7-7 9z" />
    </svg>
  ),
  elevation: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 20l6-8 4 5 4-6 6 9" />
    </svg>
  ),
  harvest: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
}

function collectTerroirFacts(origin: OriginDTO): TerroirFact[] {
  const facts: TerroirFact[] = []
  if (origin.climate) {
    facts.push({ label: "Climate", value: origin.climate, icon: "climate" })
  }
  if (origin.soil) {
    facts.push({ label: "Soil", value: origin.soil, icon: "soil" })
  }
  if (origin.altitude) {
    facts.push({ label: "Elevation", value: origin.altitude, icon: "elevation" })
  }
  if (origin.harvestSeason) {
    facts.push({ label: "Harvest", value: origin.harvestSeason, icon: "harvest" })
  }
  return facts
}

export default function OriginTerroirGrid({ origin }: { origin: OriginDTO }) {
  const facts = collectTerroirFacts(origin)
  if (facts.length === 0) {
    return null
  }

  return (
    <section className="space-y-5" aria-labelledby="terroir-heading">
      <h2 id="terroir-heading" className="text-xl font-semibold text-sage-900">
        Terroir at a glance
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {facts.map((fact) => (
          <li
            key={fact.label}
            className="flex gap-4 rounded-xl border border-sage-200 bg-white p-5 shadow-sm list-none"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              {ICONS[fact.icon]}
            </span>
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
                {fact.label}
              </p>
              <p className="text-sm text-sage-800 leading-relaxed">{fact.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
