import { Metadata } from "next"
import { Suspense } from "react"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import ScrollToTop from "@modules/layout/components/scroll-to-top"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

// Loading components for better UX
function LoadingNav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <div className="h-20 bg-white/95 backdrop-blur-md border-b border-sage-200 animate-pulse">
        <div className="content-container flex items-center justify-between h-full">
          <div className="w-32 h-6 bg-sage-200 rounded"></div>
          <div className="flex gap-4">
            <div className="w-16 h-4 bg-sage-200 rounded"></div>
            <div className="w-16 h-4 bg-sage-200 rounded"></div>
            <div className="w-16 h-4 bg-sage-200 rounded"></div>
          </div>
          <div className="w-20 h-8 bg-sage-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}

function LoadingFooter() {
  return (
    <div className="bg-brand-50 border-t border-sage-200 animate-pulse">
      <div className="content-container py-16">
        <div className="grid grid-cols-1 small:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-24 h-6 bg-sage-200 rounded"></div>
            <div className="space-y-2">
              <div className="w-full h-4 bg-sage-200 rounded"></div>
              <div className="w-3/4 h-4 bg-sage-200 rounded"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="w-20 h-6 bg-sage-200 rounded"></div>
            <div className="space-y-2">
              <div className="w-full h-4 bg-sage-200 rounded"></div>
              <div className="w-3/4 h-4 bg-sage-200 rounded"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-6 bg-sage-200 rounded"></div>
            <div className="space-y-2">
              <div className="w-full h-4 bg-sage-200 rounded"></div>
              <div className="w-3/4 h-4 bg-sage-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()
    shippingOptions = shipping_options
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation with loading fallback */}
      <Suspense fallback={<LoadingNav />}>
        <Nav />
      </Suspense>

      {/* Notification Banners */}
      <div className="relative">
        {customer && cart && (
          <div className="bg-amber-50 border-b border-amber-200">
            <CartMismatchBanner customer={customer} cart={cart} />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        {/* Background pattern for visual interest */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGNpcmNsZSBmaWxsPSJyZ2JhKDkxLCAxNTQsIDkxLCAwLjAyKSIgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIvPgo8L2c+Cjwvc3ZnPg==')] pointer-events-none"></div>
        
        {/* Content with smooth transitions */}
        <div className="relative z-10">
          {props.children}
        </div>
      </main>

      {/* Shopping interactions */}
      {cart && (
        <Suspense fallback={null}>
          <FreeShippingPriceNudge
            variant="popup"
            cart={cart}
            shippingOptions={shippingOptions}
          />
        </Suspense>
      )}

      {/* Footer with loading fallback */}
      <Suspense fallback={<LoadingFooter />}>
        <Footer />
      </Suspense>

      {/* Scroll to top button */}
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </div>
  )
}
