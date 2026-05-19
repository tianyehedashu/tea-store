/** Default Store API fields for product list/detail (variants, options, inventory). */
export const PRODUCT_LIST_FIELDS =
  "*variants.calculated_price,+variants.manage_inventory,+variants.allow_backorder,+variants.inventory_quantity,+variants.options.*,+variants.sku,+options.*,+handle,+title,thumbnail,images.*,+metadata,+tags,+weight,+origin_country,+material"
