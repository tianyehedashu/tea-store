"use client"

import { Table, Text, clx } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isPreview = type === "preview"

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <Table.Row
      className={clx(
        "w-full",
        !isPreview &&
          "mb-4 block rounded-lg border border-[#eadbc4] bg-[#fffaf2] p-4 small:table-row small:rounded-none small:border-0 small:bg-transparent small:p-0"
      )}
      data-testid={isPreview ? "cart-item-preview" : "cart-item"}
    >
      <Table.Cell
        className={clx("!pl-0", {
          "p-4 w-24": isPreview,
          "block w-full p-0 small:table-cell small:w-24 small:p-4 small:!pl-0":
            !isPreview,
        })}
      >
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "w-20 small:w-24": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
            alt={item.product_title}
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell
        className={clx("text-left", {
          "block px-0 py-3 small:table-cell small:p-4": !isPreview,
        })}
      >
        <Text
          className="break-words text-sm font-semibold text-sage-900"
          data-testid="product-title"
        >
          {item.product_title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </Table.Cell>

      {type === "full" && (
        <Table.Cell className="block px-0 py-3 small:table-cell small:p-4">
          <div className="flex items-center justify-between gap-3 small:w-28 small:justify-start small:gap-2">
            <span className="text-sm font-medium text-sage-700 small:hidden">
              Quantity
            </span>
            <div className="flex items-center gap-2">
              <DeleteButton id={item.id} data-testid="product-delete-button" />
              <CartItemSelect
                value={item.quantity}
                onChange={(value) =>
                  changeQuantity(parseInt(value.target.value))
                }
                className="h-11 w-16 p-0 small:h-10 small:w-14 small:p-4"
                data-testid="product-select-button"
              >
                {/* TODO: Update this with the v2 way of managing inventory */}
                {Array.from(
                  {
                    length: Math.min(maxQuantity, 10),
                  },
                  (_, i) => (
                    <option value={i + 1} key={i}>
                      {i + 1}
                    </option>
                  )
                )}
              </CartItemSelect>
              {updating && <Spinner />}
            </div>
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell
        className={clx("!pr-0", {
          "block px-0 pt-3 small:table-cell small:p-4 small:!pr-0": !isPreview,
        })}
      >
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
            "flex items-center justify-between text-right small:block":
              !isPreview,
          })}
        >
          {type === "full" && (
            <span className="text-sm font-medium text-sage-700 small:hidden">
              Total
            </span>
          )}
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-sage-500">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
