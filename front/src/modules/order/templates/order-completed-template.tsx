import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import OrderBrewTips from "@modules/order/components/order-brew-tips"
import OrderSuggestedProducts from "@modules/order/components/order-suggested-products"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
  countryCode?: string
}

export default async function OrderCompletedTemplate({
  order,
  countryCode,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10 rounded-2xl border border-sage-200 px-6 small:px-10"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="flex flex-col gap-y-3 text-sage-900 font-display text-3xl font-bold mb-4"
          >
            <span>Thank you!</span>
            <span>Your order was placed successfully.</span>
          </Heading>
          <OrderDetails order={order} />
          <Heading
            level="h2"
            className="font-display text-xl font-semibold text-sage-900"
          >
            Summary
          </Heading>
          <Items order={order} />
          <CartTotals totals={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <OrderBrewTips order={order} />
          {countryCode ? (
            <OrderSuggestedProducts order={order} countryCode={countryCode} />
          ) : null}
          <Help />
        </div>
      </div>
    </div>
  )
}
