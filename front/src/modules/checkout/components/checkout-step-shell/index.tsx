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
        "rounded-2xl border bg-white p-6 small:p-8 transition-colors",
        isOpen
          ? "border-brand-200 shadow-sm ring-1 ring-brand-100"
          : "border-sage-200",
        isDisabled && !isOpen && "opacity-60"
      )}
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2
          className={clx(
            "font-display text-xl font-semibold text-sage-900 flex items-center gap-2",
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
            className="text-sm font-medium text-brand-600 hover:text-brand-700 shrink-0"
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
