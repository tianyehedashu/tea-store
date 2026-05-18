"use client"

import { setAddresses } from "@lib/data/cart"
import {
  checkoutSummaryLabelClass,
  checkoutSummaryTextClass,
} from "@lib/util/checkout-summary-classes"
import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"
import { Text, useToggleState } from "@medusajs/ui"
import CheckoutStepShell from "@modules/checkout/components/checkout-step-shell"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <CheckoutStepShell
      title="Shipping address"
      isOpen={isOpen}
      isComplete={Boolean(!isOpen && cart?.shipping_address)}
      showEdit={Boolean(!isOpen && cart?.shipping_address)}
      onEdit={handleEdit}
      editTestId="edit-address-button"
    >
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-2">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div className="pt-8">
                <h3 className="text-lg font-semibold text-sage-900 pb-4">
                  Billing address
                </h3>
                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton
              className="mt-6 !bg-brand-500 hover:!bg-brand-600 w-full small:w-auto"
              data-testid="submit-address-button"
            >
              Continue to delivery
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div className="text-sm">
          {cart && cart.shipping_address ? (
            <div className="grid grid-cols-1 small:grid-cols-3 gap-6">
              <div data-testid="shipping-address-summary">
                <Text className={checkoutSummaryLabelClass}>
                  Shipping address
                </Text>
                <Text className={checkoutSummaryTextClass}>
                  {cart.shipping_address.first_name}{" "}
                  {cart.shipping_address.last_name}
                </Text>
                <Text className={checkoutSummaryTextClass}>
                  {cart.shipping_address.address_1}{" "}
                  {cart.shipping_address.address_2}
                </Text>
                <Text className={checkoutSummaryTextClass}>
                  {cart.shipping_address.postal_code},{" "}
                  {cart.shipping_address.city}
                </Text>
                <Text className={checkoutSummaryTextClass}>
                  {cart.shipping_address.country_code?.toUpperCase()}
                </Text>
              </div>

              <div data-testid="shipping-contact-summary">
                <Text className={checkoutSummaryLabelClass}>Contact</Text>
                <Text className={checkoutSummaryTextClass}>
                  {cart.shipping_address.phone}
                </Text>
                <Text className={checkoutSummaryTextClass}>{cart.email}</Text>
              </div>

              <div data-testid="billing-address-summary">
                <Text className={checkoutSummaryLabelClass}>
                  Billing address
                </Text>
                {sameAsBilling ? (
                  <Text className={checkoutSummaryTextClass}>
                    Same as shipping address
                  </Text>
                ) : (
                  <>
                    <Text className={checkoutSummaryTextClass}>
                      {cart.billing_address?.first_name}{" "}
                      {cart.billing_address?.last_name}
                    </Text>
                    <Text className={checkoutSummaryTextClass}>
                      {cart.billing_address?.address_1}{" "}
                      {cart.billing_address?.address_2}
                    </Text>
                    <Text className={checkoutSummaryTextClass}>
                      {cart.billing_address?.postal_code},{" "}
                      {cart.billing_address?.city}
                    </Text>
                    <Text className={checkoutSummaryTextClass}>
                      {cart.billing_address?.country_code?.toUpperCase()}
                    </Text>
                  </>
                )}
              </div>
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      )}
    </CheckoutStepShell>
  )
}

export default Addresses
