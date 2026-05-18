"use client"

import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CheckoutStepShell from "@modules/checkout/components/checkout-step-shell"
import { useSearchParams } from "next/navigation"

import PaymentButton from "../payment-button"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <CheckoutStepShell
      title="Review & place order"
      isOpen={isOpen}
      isDisabled={!previousStepsCompleted && !isOpen}
    >
      {isOpen && previousStepsCompleted ? (
        <>
          <p className="text-sm text-sage-600 leading-relaxed mb-6">
            By placing your order, you agree to our{" "}
            <LocalizedClientLink
              href="/terms"
              className="text-brand-600 hover:underline"
            >
              Terms of Service
            </LocalizedClientLink>
            ,{" "}
            <LocalizedClientLink
              href="/returns"
              className="text-brand-600 hover:underline"
            >
              Returns Policy
            </LocalizedClientLink>
            , and{" "}
            <LocalizedClientLink
              href="/privacy"
              className="text-brand-600 hover:underline"
            >
              Privacy Policy
            </LocalizedClientLink>
            .
          </p>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      ) : !isOpen ? (
        <Text className="text-sm text-sage-500">
          Complete the steps above to review and place your order.
        </Text>
      ) : null}
    </CheckoutStepShell>
  )
}

export default Review
