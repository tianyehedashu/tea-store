import { Dialog, Transition } from "@headlessui/react"
import { Button, clx } from "@medusajs/ui"
import React, { Fragment, useEffect, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import OptionSelect from "./option-select"
import { HttpTypes } from "@medusajs/types"
import { isSimpleProduct } from "@lib/util/product"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
  addFeedback?: "idle" | "success" | "error"
  addFeedbackMessage?: string
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
  addFeedback,
  addFeedbackMessage,
}) => {
  const { state, open, close } = useToggleState()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const isSimple = isSimpleProduct(product)

  useEffect(() => {
    if (!state) {
      return
    }

    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previous
    }
  }, [state])

  return (
    <>
      <div
        className={clx("fixed inset-x-0 bottom-0 z-50 lg:hidden", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="safe-bottom flex h-full w-full flex-col items-center justify-center gap-y-3 border-t border-[#eadbc4] bg-[#fffaf2] px-4 pt-4 text-sm shadow-[0_-10px_30px_rgba(20,34,25,0.14)]"
            data-testid="mobile-actions"
          >
            <div className="flex max-w-full items-center gap-x-2 text-sage-900">
              <span
                className="truncate font-semibold"
                data-testid="mobile-title"
              >
                {product.title}
              </span>
              <span aria-hidden>-</span>
              {selectedPrice ? (
                <div className="flex shrink-0 items-end gap-x-2 text-sage-900 font-medium">
                  {selectedPrice.price_type === "sale" && (
                    <p>
                      <span className="line-through text-small-regular">
                        {selectedPrice.original_price}
                      </span>
                    </p>
                  )}
                  <span
                    className={clx({
                      "text-[#a6602e]": selectedPrice.price_type === "sale",
                    })}
                  >
                    {selectedPrice.calculated_price}
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            {addFeedbackMessage && (
              <p
                className={clx(
                  "w-full rounded-lg px-3 py-2 text-center text-xs font-semibold",
                  {
                    "border border-[#d8c4aa] bg-[#f5eddf] text-sage-900":
                      addFeedback === "success",
                    "border border-red-200 bg-red-50 text-red-700":
                      addFeedback === "error",
                  }
                )}
                role={addFeedback === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {addFeedbackMessage}
              </p>
            )}
            <div
              className={clx("grid grid-cols-2 w-full gap-x-4", {
                "!grid-cols-1": isSimple,
              })}
            >
              {!isSimple && (
                <Button
                  onClick={open}
                  variant="secondary"
                  className="h-12 w-full rounded-lg border-[#d8c4aa] bg-white px-3"
                  data-testid="mobile-actions-button"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate">
                      {variant
                        ? Object.values(options).join(" / ")
                        : "Select Options"}
                    </span>
                    <ChevronDown />
                  </div>
                </Button>
              )}
              <Button
                onClick={handleAddToCart}
                disabled={!inStock || !variant || isAdding}
                className="h-12 w-full rounded-lg bg-[#142219] text-white hover:bg-[#0d1811]"
                isLoading={isAdding}
                data-testid="mobile-cart-button"
              >
                {!variant
                  ? "Select variant"
                  : !inStock
                  ? "Out of stock"
                  : addFeedback === "success"
                  ? "Added"
                  : "Add to cart"}
              </Button>
            </div>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-end justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel
                  className="flex max-h-[86svh] w-full transform flex-col overflow-hidden rounded-t-lg text-left"
                  data-testid="mobile-actions-modal"
                >
                  <div className="flex w-full justify-end bg-transparent px-4 pb-3">
                    <button
                      onClick={close}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-sage-200 bg-white text-sage-800 shadow-sm hover:border-[#c46f35]"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="overflow-y-auto bg-[#fffaf2] px-4 py-6 xsmall:px-6">
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                option={option}
                                current={options[option.id]}
                                updateOption={updateOptions}
                                title={option.title ?? ""}
                                disabled={optionsDisabled}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  <div className="safe-bottom flex gap-3 border-t border-[#eadbc4] bg-[#f5eddf] px-4 py-4 xsmall:px-6">
                    <Button
                      onClick={close}
                      className="h-12 w-full rounded-lg bg-[#142219] text-white hover:bg-[#0d1811]"
                    >
                      Done
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
