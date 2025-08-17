import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/*
  将数据库内以 /static/ 开头的媒体链接迁移为 /uploads/。
  - 处理 product.thumbnail
  - 处理 product.images[].url
*/
export default async function migrateStaticToUploads({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const product = container.resolve("product") as any

  logger.info("Starting migration: /static/ -> /uploads/")

  // 分页遍历，避免一次性拉取过多
  let offset = 0
  const limit = 100
  let total = 0
  let updated = 0

  while (true) {
    const [items, count] = await product.listAndCountProducts({}, { offset, limit, relations: ["images"] })
    if (offset === 0) total = count
    if (!items.length) break

    for (const p of items) {
      let changed = false

      if (typeof p.thumbnail === "string" && p.thumbnail.startsWith("/static/")) {
        p.thumbnail = p.thumbnail.replace("/static/", "/uploads/")
        changed = true
      }

      if (Array.isArray(p.images) && p.images.length) {
        for (const img of p.images) {
          if (img?.url && typeof img.url === "string" && img.url.startsWith("/static/")) {
            img.url = img.url.replace("/static/", "/uploads/")
            changed = true
          }
        }
      }

      if (changed) {
        await product.updateProducts([{
          id: p.id,
          thumbnail: p.thumbnail,
          images: (p.images || []).map((i: any) => ({ id: i.id, url: i.url })),
        }])
        updated += 1
      }
    }

    offset += items.length
    if (offset >= count) break
  }

  logger.info(`Migration completed. total=${total}, updated=${updated}`)
}


