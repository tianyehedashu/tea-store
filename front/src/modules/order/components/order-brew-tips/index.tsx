import { HttpTypes } from "@medusajs/types"
import { resolveBrewData } from "@lib/util/brew-data"
import BrewTipsDisplay from "@modules/products/components/brew-tips-display"

export default async function OrderBrewTips({
  order,
}: {
  order: HttpTypes.StoreOrder
}) {
  const teaItem = order.items?.find((item) => {
    const metadata = item.product?.metadata as
      | Record<string, unknown>
      | undefined
    return metadata?.tea_type || metadata?.brew_override
  })

  if (!teaItem?.product) {
    return null
  }

  const brew = await resolveBrewData(
    teaItem.product.metadata as Record<string, unknown> | undefined
  )

  if (!brew) {
    return null
  }

  return (
    <div className="mt-8 p-6 bg-sage-50 rounded-2xl border border-sage-200">
      <h2 className="text-lg font-semibold text-sage-900 mb-4">
        Brew your {teaItem.product.title}
      </h2>
      <BrewTipsDisplay
        brew={brew}
        title="Brewing tips for your order"
        className="rounded-lg border border-sage-200 bg-white p-4"
      />
    </div>
  )
}
