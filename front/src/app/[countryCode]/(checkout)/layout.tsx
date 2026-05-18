import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-cream-50 relative small:min-h-screen">
      <div className="h-16 bg-white border-b border-sage-200">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-sm font-medium text-sage-700 flex items-center gap-x-2 flex-1 basis-0 hover:text-brand-600 transition-colors"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="hidden small:inline">Back to cart</span>
            <span className="small:hidden">Back</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="font-display text-xl font-bold text-sage-900 hover:text-brand-600 transition-colors"
            data-testid="store-link"
          >
            Zentee
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
    </div>
  )
}
