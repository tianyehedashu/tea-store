import type { BrewingGuideDTO } from "@lib/data/cms/types"

type GuideStepsProps = {
  guide: Pick<BrewingGuideDTO, "timePlan" | "vessel" | "brewTimes">
}

export default function GuideSteps({ guide }: GuideStepsProps) {
  const steps = guide.timePlan ?? []
  if (steps.length === 0 && !guide.vessel) {
    return null
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-sage-900">Brewing steps</h2>
      {guide.vessel ? (
        <p className="text-sage-600">
          Recommended vessel:{" "}
          <span className="font-medium text-sage-900 capitalize">
            {guide.vessel}
          </span>
        </p>
      ) : null}
      {steps.length > 0 ? (
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li
              key={`${index}-${step.time_s ?? "step"}`}
              className="flex gap-4 p-4 rounded-xl bg-sage-50 border border-sage-200"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white text-sm font-semibold">
                {index + 1}
              </span>
              <div className="space-y-1 min-w-0">
                <p className="font-medium text-sage-900">
                  {typeof step.time_s === "number"
                    ? `Steep ${step.time_s} seconds`
                    : "Steep"}
                  {guide.brewTimes && index === 0
                    ? ` · up to ${guide.brewTimes} infusions`
                    : ""}
                </p>
                {step.note ? (
                  <p className="text-sm text-sage-600 leading-relaxed">
                    {step.note}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  )
}
