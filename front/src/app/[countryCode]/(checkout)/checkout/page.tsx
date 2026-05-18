import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout | Zentee",
  description: "Complete your tea order securely.",
}

type Props = {
  searchParams: Promise<{ step?: string }>
}

export default async function Checkout(props: Props) {
  const searchParams = await props.searchParams
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()
  const currentStep = searchParams.step ?? "address"

  return (
    <div className="min-h-screen bg-cream-50/50 pb-16">
      <section className="border-b border-sage-200 bg-white">
        <div className="content-container py-8">
          <h1 className="font-display text-3xl font-bold text-sage-900">
            Checkout
          </h1>
          <p className="mt-2 text-sage-600">
            Secure checkout — your details are only used to fulfill this order.
          </p>
        </div>
      </section>

      <div className="content-container grid grid-cols-1 small:grid-cols-[1fr_380px] gap-10 lg:gap-x-16 py-10">
        <PaymentWrapper cart={cart}>
          <CheckoutForm
            cart={cart}
            customer={customer}
            currentStep={currentStep}
          />
        </PaymentWrapper>
        <CheckoutSummary cart={cart} />
      </div>
    </div>
  )
}
