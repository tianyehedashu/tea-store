const Radio = ({
  checked,
  "data-testid": dataTestId,
}: {
  checked: boolean
  "data-testid"?: string
}) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      className="group relative flex h-5 w-5 shrink-0 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 rounded-full"
      data-testid={dataTestId || "radio-button"}
    >
      <div
        className={[
          "flex h-[14px] w-[14px] items-center justify-center rounded-full border transition-all",
          checked
            ? "border-brand-500 bg-brand-500"
            : "border-sage-300 bg-white group-hover:border-brand-400",
        ].join(" ")}
      >
        {checked ? <div className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
      </div>
    </button>
  )
}

export default Radio
