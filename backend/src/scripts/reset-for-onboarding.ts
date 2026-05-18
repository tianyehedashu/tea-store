import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function resetForOnboarding({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("🔄 开始完全重置以触发管理员引导流程...")

  try {
    // 1. 清除所有用户
    logger.info("1️⃣ 清除用户数据...")
    const { data: users } = await query.graph({
      entity: "user",
      fields: ["id", "email"],
    })

    if (users && users.length > 0) {
      const userModuleService = container.resolve(Modules.USER)
      for (const user of users) {
        await userModuleService.deleteUsers([user.id])
        logger.info(`   ✅ 删除用户: ${user.email}`)
      }
    } else {
      logger.info("   ✅ 没有用户需要删除")
    }

    // 2. 清除API密钥
    logger.info("2️⃣ 清除API密钥...")
    const { data: apiKeys } = await query.graph({
      entity: "api_key",
      fields: ["id", "title", "type"],
    })

    if (apiKeys && apiKeys.length > 0) {
      // 注意：这里可能需要根据Medusa v2的API来调整删除方式
      logger.info(
        `   找到 ${apiKeys.length} 个API密钥，跳过删除（保留发布密钥）`
      )
    }

    // 3. 清除商店配置中的管理员相关设置
    logger.info("3️⃣ 重置商店状态...")
    const storeModuleService = container.resolve(Modules.STORE)
    const stores = await storeModuleService.listStores()

    if (stores && stores.length > 0) {
      logger.info(`   找到 ${stores.length} 个商店，保持基础配置`)
    }

    // 4. 清除认证相关数据
    logger.info("4️⃣ 清除认证数据...")
    try {
      // 查询认证相关表
      const { data: authIdentities } = await query.graph({
        entity: "auth_identity",
        fields: ["id", "provider_identity_id"],
      })

      logger.info(`   找到 ${authIdentities?.length || 0} 个认证身份记录`)

      // 可以根据需要清除认证身份
      // 但要小心不要影响客户认证
    } catch (authError: any) {
      logger.info(`   认证模块查询跳过: ${authError.message}`)
    }

    logger.info("🎉 重置完成!")
    logger.info("")
    logger.info("📋 下一步操作:")
    logger.info("   1. 重启Medusa服务: pnpm run dev")
    logger.info("   2. 访问管理员面板: http://localhost:9000/app")
    logger.info("   3. 应该看到首次设置引导页面")
    logger.info("")
    logger.info("⚠️  如果仍然看到登录页面，请尝试:")
    logger.info("   - 清除浏览器缓存和Cookie")
    logger.info("   - 使用隐私/无痕模式")
    logger.info("   - 检查是否有残留的用户会话")
  } catch (error: any) {
    logger.error("❌ 重置过程中出错:", error.message)
    logger.error("详细错误:", error)
  }
}
