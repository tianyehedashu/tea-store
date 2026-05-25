import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
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
    <div className="min-h-screen bg-[#fffaf2] pb-12 small:pb-16">
      <section className="hero-gradient border-b border-[#eadbc4]">
        <div className="content-container py-7 small:py-8">
          <h1 className="font-display text-3xl text-sage-900 small:text-5xl">
            Checkout
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-sage-600 xsmall:text-base">
            Secure checkout — your details are only used to fulfill this order.
          </p>
        </div>
      </section>

      <div className="content-container grid grid-cols-1 gap-6 py-8 small:grid-cols-[1fr_380px] small:gap-10 small:py-10 lg:gap-x-16">
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
