import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const categories = await listCategories()

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative mx-auto border-b border-[#eadbc4] bg-[#fffaf2]/95 shadow-sm backdrop-blur-md duration-200">
        <nav className="content-container flex items-center justify-between h-20">
          {/* Mobile Menu */}
          <div className="flex-1 basis-0 h-full flex items-center small:hidden">
            <div className="h-full">
              <SideMenu regions={regions} categories={categories} />
            </div>
          </div>

          {/* Logo */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="font-display text-2xl font-semibold text-[#111d16] transition-colors duration-300 hover:text-[#82471f]"
              data-testid="nav-store-link"
            >
              Zentee
            </LocalizedClientLink>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="flex items-center gap-x-8 h-full flex-1 basis-0 justify-end">
            {/* Desktop Menu */}
            <div className="hidden small:flex items-center gap-x-8 h-full">
              <LocalizedClientLink
                className="text-sm font-semibold text-sage-800 transition-colors duration-300 hover:text-[#82471f]"
                href="/store"
                data-testid="nav-store-link"
              >
                Shop
              </LocalizedClientLink>

              {/* Tea Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-semibold text-sage-800 transition-colors duration-300 hover:text-[#82471f]">
                  Categories
                  <svg
                    className="w-4 h-4 transition-transform group-hover:rotate-180"
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

                <div className="invisible absolute left-0 top-full mt-3 w-60 translate-y-2 rounded-lg border border-[#eadbc4] bg-[#fffaf2] opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="py-4 px-2">
                    {categories
                      ?.filter((cat) => cat.name.includes("Tea"))
                      .slice(0, 6)
                      .map((category) => (
                        <LocalizedClientLink
                          key={category.id}
                          href={`/categories/${category.handle}`}
                          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-sage-800 transition-colors duration-200 hover:bg-white hover:text-[#82471f]"
                        >
                          <span className="h-2 w-2 rounded-full bg-[#a6602e]"></span>
                          {category.name}
                        </LocalizedClientLink>
                      ))}
                  </div>
                </div>
              </div>

              <LocalizedClientLink
                className="text-sm font-semibold text-sage-800 transition-colors duration-300 hover:text-[#82471f]"
                href="/guides"
              >
                Brewing Guides
              </LocalizedClientLink>

              <LocalizedClientLink
                className="text-sm font-semibold text-sage-800 transition-colors duration-300 hover:text-[#82471f]"
                href="/origins"
              >
                Origins
              </LocalizedClientLink>

              <LocalizedClientLink
                className="text-sm font-semibold text-sage-800 transition-colors duration-300 hover:text-[#82471f]"
                href="/about"
              >
                About
              </LocalizedClientLink>

              <LocalizedClientLink
                className="text-sm font-semibold text-sage-800 transition-colors duration-300 hover:text-[#82471f]"
                href="/help"
              >
                Help
              </LocalizedClientLink>

              <LocalizedClientLink
                className="text-sm font-semibold text-sage-800 transition-colors duration-300 hover:text-[#82471f]"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>

            <Suspense
              fallback={
                <LocalizedClientLink
                  className="brand-cta text-sm"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
