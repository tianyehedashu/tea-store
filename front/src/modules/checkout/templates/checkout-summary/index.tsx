import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <aside className="sticky top-24">
      <div className="space-y-6 rounded-lg border border-[#eadbc4] bg-white p-6 shadow-sm">
        <Divider className="small:hidden" />
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
