import { clx } from "@medusajs/ui"

type CheckoutOptionOptions = {
  disabled?: boolean
  variant?: "row" | "col"
}

export function checkoutOptionClasses(
  selected: boolean,
  options?: CheckoutOptionOptions
) {
  return clx(
    "checkout-option",
    options?.variant === "col" ? "checkout-option-col" : "checkout-option-row",
    selected && "checkout-option-selected",
    options?.disabled && "checkout-option-disabled"
  )
}
