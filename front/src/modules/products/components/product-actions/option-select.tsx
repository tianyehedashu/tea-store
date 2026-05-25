import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm font-semibold text-sage-900">
        Select {title}
      </span>
      <div
        className="grid grid-cols-2 gap-2 xsmall:grid-cols-3"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "min-h-11 rounded-lg border border-[#d8c4aa] bg-white px-3 py-2 text-sm font-semibold leading-5 text-sage-800 transition",
                {
                  "border-[#c46f35] bg-[#fff4e8] text-[#7a3f1d] shadow-sm ring-1 ring-[#e8c6a5]":
                    v === current,
                  "hover:border-[#c46f35] hover:bg-[#fffaf2]": v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
