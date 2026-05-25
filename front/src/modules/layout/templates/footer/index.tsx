import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  const teaCategories =
    productCategories?.filter(
      (cat) =>
        cat.name.toLowerCase().includes("tea") ||
        cat.handle?.toLowerCase().includes("tea")
    ) || []

  const teaCollections =
    collections?.filter(
      (col) =>
        col.title.toLowerCase().includes("tea") ||
        col.handle?.toLowerCase().includes("tea") ||
        col.handle?.toLowerCase().includes("organic") ||
        col.handle?.toLowerCase().includes("premium")
    ) || []

  const linkClass =
    "text-sm text-[#c9d6c5] transition-colors hover:text-[#fffaf2]"

  return (
    <footer className="border-t border-[#203428] bg-[#111d16] text-[#fffaf2]">
      <div className="content-container">
        <div className="grid gap-10 py-14 small:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr] small:py-20">
          <div className="max-w-sm space-y-5">
            <LocalizedClientLink
              href="/"
              className="font-display text-3xl font-semibold text-[#fff7ec] transition-colors hover:text-[#d79b62]"
            >
              Zentee
            </LocalizedClientLink>
            <p className="text-sm leading-7 text-[#c9d6c5]">
              Single-origin loose-leaf teas with origin stories, tasting notes,
              and practical brewing guidance for a better daily cup.
            </p>
            <LocalizedClientLink
              href="/store"
              className="brand-cta w-full justify-center xsmall:w-fit"
            >
              Shop teas
            </LocalizedClientLink>
          </div>

          {teaCategories.length > 0 && (
            <div className="space-y-4">
              <h3 className="section-eyebrow text-[#d79b62]">Tea varieties</h3>
              <ul className="space-y-3">
                {teaCategories.slice(0, 6).map((category) => (
                  <li key={category.id}>
                    <LocalizedClientLink
                      className={linkClass}
                      href={`/categories/${category.handle}`}
                      data-testid="category-link"
                    >
                      {category.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="section-eyebrow text-[#d79b62]">Collections</h3>
            <ul className="space-y-3">
              {teaCollections.slice(0, 5).map((collection) => (
                <li key={collection.id}>
                  <LocalizedClientLink
                    className={linkClass}
                    href={`/collections/${collection.handle}`}
                  >
                    {collection.title}
                  </LocalizedClientLink>
                </li>
              ))}
              <li>
                <LocalizedClientLink className={linkClass} href="/store">
                  View all products
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="section-eyebrow text-[#d79b62]">Explore</h3>
            <ul className="space-y-3">
              <li>
                <LocalizedClientLink href="/guides" className={linkClass}>
                  Brewing guides
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/origins" className={linkClass}>
                  Tea origins
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/about" className={linkClass}>
                  Our story
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/help" className={linkClass}>
                  Help and FAQ
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/account" className={linkClass}>
                  My account
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-[#c9d6c5] small:flex-row small:items-center small:justify-between">
          <Text className="text-sm">
            © {new Date().getFullYear()} Zentee. All rights reserved.
          </Text>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <LocalizedClientLink
              href="/privacy"
              className="transition-colors hover:text-[#fffaf2]"
            >
              Privacy Policy
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/terms"
              className="transition-colors hover:text-[#fffaf2]"
            >
              Terms of Service
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/returns"
              className="transition-colors hover:text-[#fffaf2]"
            >
              Returns
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
