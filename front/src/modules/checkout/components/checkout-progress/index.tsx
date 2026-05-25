const STEPS = [
  { id: "address", label: "Address" },
  { id: "delivery", label: "Delivery" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
] as const

export default function CheckoutProgress({
  currentStep,
}: {
  currentStep: string | null
}) {
  const activeIndex = STEPS.findIndex((s) => s.id === currentStep)
  const index = activeIndex >= 0 ? activeIndex : 0

  return (
    <nav
      aria-label="Checkout progress"
      className="no-scrollbar flex flex-nowrap gap-2 overflow-x-auto pb-1 small:gap-4"
    >
      {STEPS.map((step, stepIndex) => {
        const isActive = stepIndex === index
        const isDone = stepIndex < index

        return (
          <div
            key={step.id}
            className="flex shrink-0 items-center gap-2 text-sm"
            aria-current={isActive ? "step" : undefined}
          >
            <span
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                isActive
                  ? "bg-brand-500 text-white"
                  : isDone
                  ? "bg-brand-100 text-brand-700"
                  : "bg-sage-100 text-sage-500",
              ].join(" ")}
            >
              {stepIndex + 1}
            </span>
            <span
              className={
                isActive
                  ? "font-medium text-sage-900"
                  : isDone
                  ? "text-sage-700"
                  : "text-sage-500"
              }
            >
              {step.label}
            </span>
            {stepIndex < STEPS.length - 1 ? (
              <span className="hidden small:inline text-sage-300 mx-1">/</span>
            ) : null}
          </div>
        )
      })}
    </nav>
  )
}
