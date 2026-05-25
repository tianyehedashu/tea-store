"use client"

import { CheckCircleSolid } from "@medusajs/icons"
import { clx } from "@medusajs/ui"

type CheckoutStepShellProps = {
  title: string
  isOpen: boolean
  isComplete?: boolean
  isDisabled?: boolean
  onEdit?: () => void
  showEdit?: boolean
  editTestId?: string
  children: React.ReactNode
}

export default function CheckoutStepShell({
  title,
  isOpen,
  isComplete = false,
  isDisabled = false,
  onEdit,
  showEdit = false,
  editTestId,
  children,
}: CheckoutStepShellProps) {
  return (
    <section
      className={clx(
        "rounded-lg border bg-white p-4 transition-colors xsmall:p-5 small:p-8",
        isOpen
          ? "border-[#d5b58f] shadow-sm ring-1 ring-[#eadbc4]"
          : "border-[#eadbc4]",
        isDisabled && !isOpen && "opacity-60"
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4 small:mb-6 small:items-center">
        <h2
          className={clx(
            "flex min-w-0 items-center gap-2 font-display text-xl font-semibold text-sage-900",
            isDisabled && !isOpen && "pointer-events-none select-none"
          )}
        >
          {title}
          {isComplete && !isOpen ? (
            <CheckCircleSolid className="text-brand-500 shrink-0" />
          ) : null}
        </h2>
        {showEdit && onEdit && !isOpen ? (
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 text-sm font-medium text-[#a6602e] hover:text-[#82471f]"
            data-testid={editTestId}
          >
            Edit
          </button>
        ) : null}
      </div>
      {children}
    </section>
  )
}
