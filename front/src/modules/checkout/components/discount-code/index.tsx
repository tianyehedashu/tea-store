"use client"

import { Badge } from "@medusajs/ui"
import React, { useActionState } from "react"

import { applyPromotions, submitPromotionForm } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const { promotions = [] } = cart

  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code === undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    const code = formData.get("code")
    if (!code) {
      return
    }
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code === undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    await applyPromotions(codes)

    if (input) {
      input.value = ""
    }
  }

  const [message, formAction] = useActionState(submitPromotionForm, null)

  return (
    <div className="w-full flex flex-col gap-4">
      <form action={(a) => addPromotionCode(a)} className="w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
          data-testid="add-discount-button"
        >
          {isOpen ? "Hide promotion code" : "Add promotion code"}
        </button>

        {isOpen ? (
          <div className="mt-3 space-y-3">
            <div className="flex w-full flex-col gap-2 xsmall:flex-row">
              <input
                id="promotion-input"
                name="code"
                type="text"
                placeholder="Enter code"
                className="h-12 flex-1 rounded-lg border border-sage-200 bg-white px-4 py-2.5 text-base text-sage-900 placeholder:text-sage-400 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-200 small:text-sm"
                data-testid="discount-input"
              />
              <SubmitButton
                variant="secondary"
                className="h-12 shrink-0 !px-5"
                data-testid="discount-apply-button"
              >
                Apply
              </SubmitButton>
            </div>
            <ErrorMessage
              error={message}
              data-testid="discount-error-message"
            />
          </div>
        ) : null}
      </form>

      {promotions.length > 0 ? (
        <div className="space-y-2 pt-2 border-t border-sage-100">
          <p className="text-sm font-medium text-sage-900">
            Applied promotions
          </p>
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-sage-50 border border-sage-200 px-3 py-2"
              data-testid="discount-row"
            >
              <div className="flex flex-wrap items-center gap-2 min-w-0 text-sm text-sage-700">
                <Badge
                  color={promotion.is_automatic ? "green" : "grey"}
                  size="small"
                  className="shrink-0"
                >
                  <span data-testid="discount-code">{promotion.code}</span>
                </Badge>
                {promotion.application_method?.value !== undefined &&
                  promotion.application_method.currency_code !== undefined && (
                    <span className="text-sage-600">
                      {promotion.application_method.type === "percentage"
                        ? `${promotion.application_method.value}% off`
                        : convertToLocale({
                            amount: Number(promotion.application_method.value),
                            currency_code:
                              promotion.application_method.currency_code,
                          })}
                    </span>
                  )}
              </div>
              {!promotion.is_automatic ? (
                <button
                  type="button"
                  className="p-1 text-sage-500 hover:text-red-600 shrink-0"
                  onClick={() => {
                    if (!promotion.code) return
                    removePromotionCode(promotion.code)
                  }}
                  data-testid="remove-discount-button"
                  aria-label="Remove promotion code"
                >
                  <Trash size={14} />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default DiscountCode
