"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import ProductPurchaseMeta from "@modules/products/components/product-purchase-meta"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [addFeedback, setAddFeedback] = useState<
    "idle" | "success" | "error"
  >("idle")
  const [addFeedbackMessage, setAddFeedbackMessage] = useState("")
  const countryCode = useParams().countryCode as string

  // Preselect the first purchasable variant so the primary CTA is ready.
  useEffect(() => {
    if (product.variants?.length) {
      const firstPurchasableVariant =
        product.variants.find((variant) => {
          if (!variant.manage_inventory || variant.allow_backorder) {
            return true
          }

          return (variant.inventory_quantity || 0) > 0
        }) ?? product.variants[0]

      const variantOptions = optionsAsKeymap(firstPurchasableVariant.options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setAddFeedback("idle")
    setAddFeedbackMessage("")
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const purchaseStateLabel = !selectedVariant
    ? "Choose a pack size"
    : inStock
    ? "In stock and ready to pack"
    : "Currently unavailable"

  const purchaseStateDescription = !selectedVariant
    ? "Pick the size that matches your brewing rhythm."
    : inStock
    ? "We will pack it to protect aroma and leaf shape."
    : "This variant cannot be added right now."

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)
    setAddFeedback("idle")
    setAddFeedbackMessage("")

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity,
        countryCode,
      })

      setAddFeedback("success")
      setAddFeedbackMessage(
        `${quantity} ${quantity > 1 ? "packs" : "pack"} added to cart.`
      )
    } catch {
      setAddFeedback("error")
      setAddFeedbackMessage("We could not add this tea. Please try again.")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-5" ref={actionsRef}>
        <div className="rounded-lg border border-[#eadbc4] bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-sage-900">
              {purchaseStateLabel}
            </span>
            <span
              className={
                inStock && selectedVariant
                  ? "h-2.5 w-2.5 rounded-full bg-[#c46f35]"
                  : "h-2.5 w-2.5 rounded-full bg-sage-300"
              }
              aria-hidden="true"
            />
          </div>
          <p className="mt-1 text-xs leading-5 text-sage-600">
            {purchaseStateDescription}
          </p>
        </div>

        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-y border-[#eadbc4] py-4">
          <ProductPrice product={product} variant={selectedVariant} />

          <ProductPurchaseMeta product={product} variant={selectedVariant} />
        </div>

        <div className="flex items-center justify-between gap-4">
          <label
            className="text-sm font-semibold text-sage-900"
            htmlFor="product-quantity"
          >
            Quantity
          </label>
          <select
            id="product-quantity"
            value={quantity}
            onChange={(e) => {
              setAddFeedback("idle")
              setAddFeedbackMessage("")
              setQuantity(Number(e.target.value))
            }}
            disabled={!!disabled || isAdding || !selectedVariant}
            className="h-11 min-w-24 rounded-lg border border-[#d8c4aa] bg-white px-3 text-sm font-medium text-sage-900 focus:border-[#c46f35] focus:outline-none focus:ring-1 focus:ring-[#e8c6a5]"
            data-testid="product-quantity-select"
            aria-label="Quantity"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="h-14 w-full rounded-lg bg-[#142219] text-base font-semibold text-white shadow-[0_14px_30px_rgba(20,34,25,0.22)] transition hover:bg-[#0d1811] disabled:bg-sage-200 disabled:text-sage-500"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant
            ? "Select variant"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : addFeedback === "success"
            ? "Added to cart"
            : quantity > 1
            ? `Add ${quantity} packs to cart`
            : "Add to cart"}
        </Button>
        {addFeedbackMessage && (
          <p
            className={
              addFeedback === "success"
                ? "rounded-lg border border-[#d8c4aa] bg-[#f5eddf] px-4 py-3 text-sm font-semibold text-sage-900"
                : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            }
            role={addFeedback === "error" ? "alert" : "status"}
            aria-live="polite"
            data-testid="add-to-cart-feedback"
          >
            {addFeedbackMessage}
          </p>
        )}
        <div className="grid gap-2 text-xs leading-5 text-sage-700">
          <p className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#c46f35]" />
            Carefully packed to protect aroma and leaf shape.
          </p>
          <p className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#c46f35]" />
            Brewing guidance included for a consistent first cup.
          </p>
          <p className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#c46f35]" />
            Live inventory prevents guessing at checkout.
          </p>
        </div>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
          addFeedback={addFeedback}
          addFeedbackMessage={addFeedbackMessage}
        />
      </div>
    </>
  )
}
