"use client"

import { useState } from "react"
import { clx } from "@medusajs/ui"

export type FaqItem = {
  question: string
  answer: string
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <dl className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={item.question}
            className="brand-card border border-sage-200 overflow-hidden"
          >
            <dt>
              <button
                type="button"
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="text-lg font-semibold text-sage-900">
                  {item.question}
                </span>
                <span
                  className={clx(
                    "text-sage-500 transition-transform duration-200 shrink-0",
                    isOpen && "rotate-180"
                  )}
                  aria-hidden
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
            </dt>
            {isOpen ? (
              <dd className="px-6 pb-5 text-sage-700 leading-relaxed border-t border-sage-100 pt-4">
                {item.answer}
              </dd>
            ) : null}
          </div>
        )
      })}
    </dl>
  )
}
