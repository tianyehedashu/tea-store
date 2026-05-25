import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  const itemCount =
    cart?.items?.reduce(
      (total: number, item: any) => total + item.quantity,
      0
    ) ?? 0

  return (
    <aside className="order-first small:order-none small:sticky small:top-24">
      <details className="rounded-lg border border-[#eadbc4] bg-white shadow-sm small:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-semibold text-sage-900 [&::-webkit-details-marker]:hidden">
          <span>Order summary</span>
          <span className="rounded-full bg-[#f5eddf] px-3 py-1 text-xs text-sage-700">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </summary>
        <div className="space-y-5 border-t border-[#eadbc4] px-4 py-5">
          <ItemsPreviewTemplate cart={cart} />
          <DiscountCode cart={cart} />
          <Divider />
          <CartTotals totals={cart} />
        </div>
      </details>

      <div className="hidden space-y-6 rounded-lg border border-[#eadbc4] bg-white p-6 shadow-sm small:block">
        <h2 className="text-xl font-semibold text-sage-900">In your cart</h2>
        <Divider />
        <ItemsPreviewTemplate cart={cart} />
        <DiscountCode cart={cart} />
        <Divider />
        <CartTotals totals={cart} />
      </div>
    </aside>
  )
}

export default CheckoutSummary
