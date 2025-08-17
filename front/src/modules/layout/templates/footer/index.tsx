import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  // Filter for tea-related categories
  const teaCategories = productCategories?.filter(cat => 
    cat.name.toLowerCase().includes('tea') || 
    cat.handle?.toLowerCase().includes('tea')
  ) || []

  // Filter for tea collections
  const teaCollections = collections?.filter(col =>
    col.title.toLowerCase().includes('tea') ||
    col.handle?.toLowerCase().includes('tea') ||
    col.handle?.toLowerCase().includes('organic') ||
    col.handle?.toLowerCase().includes('premium')
  ) || []

  return (
    <footer className="bg-gradient-to-b from-sage-50 to-sage-100 border-t border-sage-200">
      <div className="content-container">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <LocalizedClientLink
                  href="/"
                  className="font-display text-3xl font-bold text-sage-900 hover:text-brand-600 transition-colors duration-300"
                >
                  Zentee
                </LocalizedClientLink>
                <p className="mt-3 text-sage-600 text-sm leading-relaxed">
                  Discover the art of mindful tea drinking. Premium organic teas 
                  sourced from the finest gardens, bringing zen and tranquility to your daily ritual.
                </p>
              </div>
              
              {/* Tea Philosophy */}
              <div className="p-4 bg-white/60 rounded-lg border border-sage-200">
                <p className="text-xs text-sage-700 italic leading-relaxed">
                  "Every cup of tea is a conversation with nature"<br/>
                  <span className="text-sage-500">— Ancient Tea Wisdom</span>
                </p>
              </div>
            </div>

            {/* Tea Categories */}
            {teaCategories.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sage-800 font-semibold text-base">
                  🍃 Tea Varieties
                </h3>
                <ul className="space-y-2">
                  {teaCategories.slice(0, 6).map((category) => (
                    <li key={category.id}>
                      <LocalizedClientLink
                        className="text-sage-600 hover:text-brand-600 transition-colors duration-200 text-sm flex items-center gap-2"
                        href={`/categories/${category.handle}`}
                        data-testid="category-link"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                        {category.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Collections & Featured */}
            <div className="space-y-4">
              <h3 className="text-sage-800 font-semibold text-base">
                🌸 Collections
              </h3>
              <ul className="space-y-2">
                {teaCollections.slice(0, 5).map((collection) => (
                  <li key={collection.id}>
                    <LocalizedClientLink
                      className="text-sage-600 hover:text-brand-600 transition-colors duration-200 text-sm flex items-center gap-2"
                      href={`/collections/${collection.handle}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                      {collection.title}
                    </LocalizedClientLink>
                  </li>
                ))}
                <li>
                  <LocalizedClientLink
                    className="text-sage-600 hover:text-brand-600 transition-colors duration-200 text-sm flex items-center gap-2"
                    href="/store"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                    View All Products
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>

            {/* Tea Knowledge & Support */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sage-800 font-semibold text-base">
                  📚 Tea Knowledge
                </h3>
                <ul className="space-y-2">
                  <li>
                    <LocalizedClientLink 
                      href="/guides" 
                      className="text-sage-600 hover:text-brand-600 transition-colors duration-200 text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                      Brewing Guides
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink 
                      href="/origins" 
                      className="text-sage-600 hover:text-brand-600 transition-colors duration-200 text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                      Tea Origins
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink 
                      href="/about" 
                      className="text-sage-600 hover:text-brand-600 transition-colors duration-200 text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                      Our Story
                    </LocalizedClientLink>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-sage-800 font-semibold text-base">
                  🫖 Support
                </h3>
                <ul className="space-y-2">
                  <li>
                    <LocalizedClientLink 
                      href="/account" 
                      className="text-sage-600 hover:text-brand-600 transition-colors duration-200 text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                      My Account
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <a 
                      href="/contact" 
                      className="text-sage-600 hover:text-brand-600 transition-colors duration-200 text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/shipping" 
                      className="text-sage-600 hover:text-brand-600 transition-colors duration-200 text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                      Shipping Info
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-sage-200 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sage-600">
              <Text className="text-sm">
                © {new Date().getFullYear()} Zentee. All rights reserved.
              </Text>
              <div className="flex items-center gap-4 text-xs">
                <a href="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy</a>
                <span className="text-sage-400">•</span>
                <a href="/terms" className="hover:text-brand-600 transition-colors">Terms of Service</a>
                <span className="text-sage-400">•</span>
                <a href="/returns" className="hover:text-brand-600 transition-colors">Returns</a>
              </div>
            </div>
            
            {/* Zen Quote */}
            <div className="text-center md:text-right">
              <p className="text-xs text-sage-500 italic">
                "In every cup, find peace" ☯️
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
