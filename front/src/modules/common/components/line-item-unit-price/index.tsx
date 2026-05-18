import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
}

const LineItemUnitPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemUnitPriceProps) => {
  const { total, original_total } = item
  const lineTotal = total ?? 0
  const lineOriginalTotal = original_total ?? 0
  const hasReducedPrice =
    original_total != null && total != null && lineTotal < lineOriginalTotal

  const percentage_diff =
    lineOriginalTotal > 0
      ? Math.round(((lineOriginalTotal - lineTotal) / lineOriginalTotal) * 100)
      : 0

  return (
    <div className="flex flex-col text-sage-600 justify-center h-full">
      {hasReducedPrice && (
        <>
          <p>
            {style === "default" && (
              <span className="text-sage-500">Original: </span>
            )}
            <span
              className="line-through"
              data-testid="product-unit-original-price"
            >
              {convertToLocale({
                amount: lineOriginalTotal / item.quantity,
                currency_code: currencyCode,
              })}
            </span>
          </p>
          {style === "default" && (
            <span className="text-brand-600 font-medium">
              -{percentage_diff}%
            </span>
          )}
        </>
      )}
      <span
        className={clx("text-base-regular", {
          "text-brand-600 font-semibold": hasReducedPrice,
        })}
        data-testid="product-unit-price"
      >
        {convertToLocale({
          amount: lineTotal / item.quantity,
          currency_code: currencyCode,
        })}
      </span>
    </div>
  )
}

export default LineItemUnitPrice
