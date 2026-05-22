import type { BrewData } from "@lib/util/brew-data"

type BrewTipsDisplayProps = {
  brew: BrewData
  title?: string
  className?: string
}

export default function BrewTipsDisplay({
  brew,
  title = "Quick Brew",
  className = "rounded-lg border border-[#eadbc4] bg-[#fffaf2] p-5 shadow-sm",
}: BrewTipsDisplayProps) {
  return (
    <div className={className}>
      <p className="mb-3 text-base font-semibold text-sage-900">{title}</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {typeof brew.waterTempC === "number" && (
          <div className="rounded-xl bg-white/70 p-3">
            <div className="text-sage-500">Water Temp</div>
            <div className="font-medium text-sage-900">{brew.waterTempC} C</div>
          </div>
        )}
        {typeof brew.leafGramPer100ml === "number" && (
          <div className="rounded-xl bg-white/70 p-3">
            <div className="text-sage-500">Leaf / 100ml</div>
            <div className="font-medium text-sage-900">
              {brew.leafGramPer100ml} g
            </div>
          </div>
        )}
        {typeof brew.brewTimes === "number" && (
          <div className="rounded-xl bg-white/70 p-3">
            <div className="text-sage-500">Times</div>
            <div className="font-medium text-sage-900">{brew.brewTimes}x</div>
          </div>
        )}
      </div>
      {brew.timePlan?.length ? (
        <div className="mt-3">
          <div className="mb-1 text-sm text-sage-500">Time Plan</div>
          <ul className="list-inside list-disc text-sm text-sage-800">
            {brew.timePlan.map((t, idx) => (
              <li key={idx}>
                {typeof t.time_s === "number" ? `${t.time_s}s` : "-"}
                {t.note ? ` - ${t.note}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {brew.tips ? (
        <div className="mt-3 text-sm">
          <div className="mb-1 text-sage-500">Tips</div>
          <p className="whitespace-pre-line text-sage-800">{brew.tips}</p>
        </div>
      ) : null}
    </div>
  )
}
