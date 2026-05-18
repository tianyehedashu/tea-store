import { Heading, Text } from "@medusajs/ui"

import { isStripe, paymentInfoMap } from "@lib/constants"
import {
  checkoutSummaryLabelClass,
  checkoutSummaryTextClass,
} from "@lib/util/checkout-summary-classes"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <div>
      <Heading
        level="h2"
        className="font-display text-xl font-semibold text-sage-900 my-6"
      >
        Payment
      </Heading>
      <div>
        {payment && (
          <div className="flex items-start gap-x-1 w-full">
            <div className="flex flex-col w-1/3">
              <Text className={checkoutSummaryLabelClass}>Payment method</Text>
              <Text
                className={checkoutSummaryTextClass}
                data-testid="payment-method"
              >
                {paymentInfoMap[payment.provider_id].title}
              </Text>
            </div>
            <div className="flex flex-col w-2/3">
              <Text className={checkoutSummaryLabelClass}>Payment details</Text>
              <div
                className={`flex gap-2 items-center ${checkoutSummaryTextClass}`}
              >
                <span className="flex items-center h-7 w-fit p-2 rounded-md bg-sage-100 text-sage-700">
                  {paymentInfoMap[payment.provider_id].icon}
                </span>
                <Text
                  className={checkoutSummaryTextClass}
                  data-testid="payment-amount"
                >
                  {isStripe(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} paid at ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleString()}`}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails
