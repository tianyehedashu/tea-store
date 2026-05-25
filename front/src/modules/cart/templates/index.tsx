import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="min-h-screen bg-[#fffaf2]">
      <section className="hero-gradient border-b border-[#eadbc4]">
        <div className="content-container py-8 small:py-10">
          <h1 className="font-display text-3xl text-sage-900 small:text-5xl">
            Your cart
          </h1>
          <p className="mt-2 text-sm leading-6 text-sage-600 xsmall:text-base">
            Review your selection before checkout.
          </p>
        </div>
      </section>

      <div
        className="content-container py-8 small:py-10"
        data-testid="cart-container"
      >
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 gap-6 small:grid-cols-[1fr_360px] small:gap-10">
            <div className="flex flex-col gap-y-6 rounded-lg border border-[#eadbc4] bg-white p-4 shadow-sm xsmall:p-5 small:p-8">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-24">
                {cart?.region && (
                  <div className="rounded-lg border border-[#eadbc4] bg-white p-4 shadow-sm xsmall:p-6">
                    <Summary cart={cart as any} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-[#eadbc4] bg-white shadow-sm">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
