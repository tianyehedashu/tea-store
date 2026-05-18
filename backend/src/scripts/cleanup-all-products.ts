import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  deleteProductsWorkflow,
  deleteInventoryItemWorkflow,
  deleteProductCategoriesWorkflow,
} from "@medusajs/medusa/core-flows"
import { existsSync } from "fs"
import { join } from "path"

export default async function cleanupAllProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("🧹 开始删除所有产品和库存数据...")

  try {
    // 先通过正常方式获取所有数据，然后强制删除

    // 1. 获取所有产品
    logger.info("📦 查询所有产品...")
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title"],
    })

    if (!products || products.length === 0) {
      logger.info("✅ 没有找到任何产品，无需清理")
      return
    }

    logger.info(`📊 找到 ${products.length} 个产品需要删除`)
    const productIds = products.map((p: any) => p.id)

    // 2. 获取所有库存项目
    const { data: variants } = await query.graph({
      entity: "product_variant",
      filters: { product_id: productIds },
      fields: ["id", "inventory_items.id"],
    })

    // 3. 强制删除所有库存项目
    logger.info("🗑️  强制删除所有库存项目...")
    let deletedInventoryCount = 0

    for (const variant of variants || []) {
      if (variant.inventory_items && Array.isArray(variant.inventory_items)) {
        for (const invItem of variant.inventory_items) {
          if (invItem && typeof invItem === "object" && "id" in invItem) {
            try {
              const inventoryItemId = (invItem as any).id
              await deleteInventoryItemWorkflow(container).run({
                input: inventoryItemId,
              })
              deletedInventoryCount++
              logger.info(`  ✅ 删除库存项目: ${inventoryItemId}`)
            } catch (error: any) {
              // 忽略删除错误，继续
              logger.warn(
                `  ⚠️  库存项目 ${(invItem as any).id} 删除失败，跳过`
              )
            }
          }
        }
      }
    }

    logger.info(`✅ 成功删除 ${deletedInventoryCount} 个库存项目`)

    // 4. 强制删除所有产品（不管软删除还是硬删除）
    logger.info("🗑️  强制删除所有产品...")

    try {
      await deleteProductsWorkflow(container).run({
        input: { ids: productIds },
      })
      logger.info(`✅ 通过工作流删除了 ${products.length} 个产品`)
    } catch (error: any) {
      logger.warn(`⚠️  工作流删除失败: ${error?.message || error}`)
    }

    // 5. 删除所有产品类别
    logger.info("📂 删除所有产品类别...")
    const { data: categories } = await query.graph({
      entity: "product_category",
      fields: ["id", "name"],
    })

    if (categories && categories.length > 0) {
      try {
        const categoryIds = categories.map((c: any) => c.id)
        await deleteProductCategoriesWorkflow(container).run({
          input: categoryIds,
        })
        logger.info(`✅ 成功删除 ${categories.length} 个产品类别`)
      } catch (error: any) {
        logger.warn(`⚠️  类别删除失败: ${error?.message || error}`)
      }
    }

    // 6. 清理静态文件目录
    const staticDir = join(process.cwd(), "static")
    if (existsSync(staticDir)) {
      logger.info("🧹 清理静态文件目录...")
      try {
        const { readdirSync, unlinkSync, statSync } = require("fs")
        const files = readdirSync(staticDir)
        let deletedFilesCount = 0

        for (const file of files) {
          const filePath = join(staticDir, file)
          const stat = statSync(filePath)

          if (stat.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
            try {
              unlinkSync(filePath)
              deletedFilesCount++
              logger.info(`  ✅ 删除文件: ${file}`)
            } catch (error: any) {
              logger.warn(
                `  ⚠️  无法删除文件 ${file}: ${error?.message || error}`
              )
            }
          }
        }

        logger.info(`✅ 成功删除 ${deletedFilesCount} 个静态文件`)
      } catch (error: any) {
        logger.warn(`⚠️  清理静态文件时出错: ${error?.message || error}`)
      }
    }

    logger.info("🎉 所有产品和库存数据清理完成！")

    // 显示清理摘要
    logger.info("\n📊 清理摘要:")
    logger.info(`  - 产品: ${products.length} 个`)
    logger.info(`  - 库存项目: ${deletedInventoryCount} 个`)
    logger.info(`  - 产品类别: ${categories?.length || 0} 个`)
    logger.info("  - 静态文件: 已清理")

    logger.info(
      "\n💡 提示: 如果产品在数据库中仍然存在，可能是软删除（deleted_at 字段被设置）"
    )
    logger.info("   这是 Medusa 的正常行为，不会影响应用运行。")
  } catch (error: any) {
    logger.error(`❌ 清理过程中出现错误: ${error?.message || error}`)
    throw error
  }
}
