import type { BrewData } from "@lib/util/brew-data"

type BrewTipsDisplayProps = {
  brew: BrewData
  title?: string
  className?: string
}

export default function BrewTipsDisplay({
  brew,
  title = "Quick Brew",
  className = "rounded-2xl border border-sage-200 bg-sage-50/50 p-6",
}: BrewTipsDisplayProps) {
  return (
    <div className={className}>
      <p className="text-base font-semibold mb-2">{title}</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {typeof brew.waterTempC === "number" && (
          <div>
            <div className="text-sage-500">Water Temp</div>
            <div className="font-medium">{brew.waterTempC} C</div>
          </div>
        )}
        {typeof brew.leafGramPer100ml === "number" && (
          <div>
            <div className="text-sage-500">Leaf / 100ml</div>
            <div className="font-medium">{brew.leafGramPer100ml} g</div>
          </div>
        )}
        {typeof brew.brewTimes === "number" && (
          <div>
            <div className="text-sage-500">Times</div>
            <div className="font-medium">{brew.brewTimes}x</div>
          </div>
        )}
      </div>
      {brew.timePlan?.length ? (
        <div className="mt-3">
          <div className="text-sage-500 text-sm mb-1">Time Plan</div>
          <ul className="list-disc list-inside text-sm">
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
          <div className="text-sage-500 mb-1">Tips</div>
          <p className="whitespace-pre-line">{brew.tips}</p>
        </div>
      ) : null}
    </div>
  )
}
