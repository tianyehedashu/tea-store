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
      <header className="relative mx-auto duration-200 bg-white/95 backdrop-blur-md border-b border-sage-200 shadow-sm">
        <nav className="content-container flex items-center justify-between h-20">
          {/* Mobile Menu */}
          <div className="flex-1 basis-0 h-full flex items-center small:hidden">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          {/* Logo */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="font-display text-2xl font-bold text-sage-900 hover:text-brand-600 transition-colors duration-300"
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
                className="text-sage-700 hover:text-brand-600 transition-colors duration-300 font-medium"
                href="/store"
                data-testid="nav-store-link"
              >
                Shop
              </LocalizedClientLink>
              
              {/* Tea Categories Dropdown */}
              <div className="relative group">
                <button className="text-sage-700 hover:text-brand-600 transition-colors duration-300 font-medium flex items-center gap-1">
                  Categories
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-sage-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="py-4 px-2">
                    {categories?.filter(cat => cat.name.includes('Tea')).slice(0, 6).map((category) => (
                      <LocalizedClientLink
                        key={category.id}
                        href={`/categories/${category.handle}`}
                        className="flex items-center gap-3 px-4 py-3 text-sage-700 hover:text-brand-600 hover:bg-sage-50 rounded-lg transition-colors duration-200"
                      >
                        <span className="w-2 h-2 rounded-full bg-brand-400"></span>
                        {category.name}
                      </LocalizedClientLink>
                    ))}
                  </div>
                </div>
              </div>

              <LocalizedClientLink
                className="text-sage-700 hover:text-brand-600 transition-colors duration-300 font-medium"
                href="/guides"
              >
                Brewing Guides
              </LocalizedClientLink>
              
              <LocalizedClientLink
                className="text-sage-700 hover:text-brand-600 transition-colors duration-300 font-medium"
                href="/origins"
              >
                Origins
              </LocalizedClientLink>
              
              <LocalizedClientLink
                className="text-sage-700 hover:text-brand-600 transition-colors duration-300 font-medium"
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
