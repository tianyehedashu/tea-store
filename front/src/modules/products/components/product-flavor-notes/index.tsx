import { HttpTypes } from "@medusajs/types"

import { getTeaMetadata } from "@lib/types/tea-product-metadata"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductFlavorNotesProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductFlavorNotes({
  product,
}: ProductFlavorNotesProps) {
  const metadata = getTeaMetadata(product)
  const notes = Array.isArray(metadata.flavor_notes)
    ? metadata.flavor_notes.filter(
        (n): n is string => typeof n === "string" && n.length > 0
      )
    : []

  if (notes.length === 0 && !metadata.origin_id) {
    return null
  }

  return (
    <div className="space-y-3" data-testid="product-flavor-notes">
      {notes.length > 0 && (
        <div>
          <p className="text-xs font-medium text-sage-700 uppercase tracking-wide mb-2">
            Flavor notes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {notes.map((note) => (
              <span
                key={note}
                className="inline-block px-3 py-1 text-xs bg-sage-50 text-sage-700 rounded-full border border-sage-200 capitalize"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      )}
      {metadata.origin_id && (
        <p className="text-sm text-sage-600">
          Origin:{" "}
          <LocalizedClientLink
            href={`/origins/${metadata.origin_id}`}
            className="text-brand-600 hover:text-brand-700 capitalize font-medium"
          >
            {metadata.origin_id.replace(/-/g, " ")}
          </LocalizedClientLink>
        </p>
      )}
    </div>
  )
}
