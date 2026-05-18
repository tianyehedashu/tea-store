"use client"

import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface MobileNavOverlayProps {
  isOpen: boolean
  onClose: () => void
  categories?: HttpTypes.StoreProductCategory[]
}

export default function MobileNavOverlay({
  isOpen,
  onClose,
  categories,
}: MobileNavOverlayProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
      setActiveSubmenu(null)
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const teaCategories =
    categories?.filter((cat) => cat.name.includes("Tea")) || []

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 shadow-xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage-200">
          <LocalizedClientLink
            href="/"
            onClick={onClose}
            className="font-display text-xl font-bold text-sage-900"
          >
            Zentee
          </LocalizedClientLink>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-sage-100 transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 text-sage-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex flex-col h-full pb-20 overflow-y-auto">
          <div className="px-6 py-6 space-y-6">
            {/* Main Navigation */}
            <nav className="space-y-4">
              <LocalizedClientLink
                href="/store"
                onClick={onClose}
                className="flex items-center gap-3 py-3 text-lg font-medium text-sage-900 hover:text-brand-600 transition-colors"
              >
                <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                Shop All Teas
              </LocalizedClientLink>

              {/* Categories */}
              <div className="space-y-2">
                <button
                  onClick={() =>
                    setActiveSubmenu(
                      activeSubmenu === "categories" ? null : "categories"
                    )
                  }
                  className="flex items-center justify-between w-full py-3 text-lg font-medium text-sage-900 hover:text-brand-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                    Tea Categories
                  </div>
                  <svg
                    className={`w-5 h-5 transform transition-transform duration-200 ${
                      activeSubmenu === "categories" ? "rotate-180" : ""
                    }`}
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
                </button>

                <div
                  className={`pl-6 space-y-2 overflow-hidden transition-all duration-300 ${
                    activeSubmenu === "categories"
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {teaCategories.map((category) => (
                    <LocalizedClientLink
                      key={category.id}
                      href={`/categories/${category.handle}`}
                      onClick={onClose}
                      className="block py-2 text-sage-700 hover:text-brand-600 transition-colors"
                    >
                      {category.name}
                    </LocalizedClientLink>
                  ))}
                </div>
              </div>

              <LocalizedClientLink
                href="/guides"
                onClick={onClose}
                className="flex items-center gap-3 py-3 text-lg font-medium text-sage-900 hover:text-brand-600 transition-colors"
              >
                <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                Brewing Guides
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/origins"
                onClick={onClose}
                className="flex items-center gap-3 py-3 text-lg font-medium text-sage-900 hover:text-brand-600 transition-colors"
              >
                <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                Tea Origins
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/account"
                onClick={onClose}
                className="flex items-center gap-3 py-3 text-lg font-medium text-sage-900 hover:text-brand-600 transition-colors"
              >
                <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                My Account
              </LocalizedClientLink>
            </nav>

            {/* Divider */}
            <div className="border-t border-sage-200"></div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-sage-900 uppercase tracking-wider">
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <LocalizedClientLink
                  href="/store"
                  onClick={onClose}
                  className="tea-category-card group py-4"
                >
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 mx-auto bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-sage-900">
                      Shop
                    </span>
                  </div>
                </LocalizedClientLink>

                <LocalizedClientLink
                  href="/guides"
                  onClick={onClose}
                  className="tea-category-card group py-4"
                >
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 mx-auto bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-sage-900">
                      Guides
                    </span>
                  </div>
                </LocalizedClientLink>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-auto p-6 bg-gradient-to-r from-brand-50 to-sage-50">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-sage-900">New to Tea?</h3>
              <p className="text-sm text-sage-600">
                Discover your perfect tea with our starter guide
              </p>
              <LocalizedClientLink
                href="/guides"
                onClick={onClose}
                className="brand-cta text-sm w-full justify-center"
              >
                Get Started
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
