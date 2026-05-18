"use server"

import { HttpTypes } from "@medusajs/types"
import { resolveBrewData } from "@lib/util/brew-data"
import BrewTipsDisplay from "@modules/products/components/brew-tips-display"

export default async function BrewQuickTips({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const brew = await resolveBrewData(
    product?.metadata as Record<string, unknown> | undefined
  )

  if (!brew) {
    return null
  }

  return <BrewTipsDisplay brew={brew} />
}
