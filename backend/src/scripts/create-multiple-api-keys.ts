import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createSalesChannelsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
} from "@medusajs/medusa/core-flows"

interface ApiKeyResult {
  type: string
  title: string
  apiKey: string
  salesChannel: string
  salesChannelId: string
}

/**
 * 创建多个 Publishable API Key 的脚本
 * 运行方式: npm run exec ./src/scripts/create-multiple-api-keys.ts
 */
export default async function createMultipleApiKeys({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)

  try {
    logger.info("🚀 Creating multiple Publishable API Keys...")

    // 定义不同的 API Key 配置
    const apiKeyConfigs = [
      {
        title: "Website Store",
        description: "主要官网商店",
        salesChannelName: "Website Sales Channel",
        type: "main-website",
      },
      {
        title: "Mobile App",
        description: "移动应用专用",
        salesChannelName: "Mobile App Channel",
        type: "mobile-app",
      },
      {
        title: "Wholesale Portal",
        description: "批发商门户",
        salesChannelName: "B2B Wholesale Channel",
        type: "wholesale",
      },
      {
        title: "European Store",
        description: "欧洲地区专门店",
        salesChannelName: "Europe Sales Channel",
        type: "regional-europe",
      },
    ]

    const results: ApiKeyResult[] = []

    for (const config of apiKeyConfigs) {
      logger.info(`📝 Creating ${config.title}...`)

      // 1. 检查销售渠道是否存在，不存在则创建
      let salesChannel
      const existingChannels = await salesChannelService.listSalesChannels({
        name: config.salesChannelName,
      })

      if (existingChannels.length > 0) {
        salesChannel = existingChannels[0]
        logger.info(
          `   ✅ Using existing sales channel: ${config.salesChannelName}`
        )
      } else {
        // 创建新的销售渠道
        const { result: channelResult } = await createSalesChannelsWorkflow(
          container
        ).run({
          input: {
            salesChannelsData: [
              {
                name: config.salesChannelName,
                description: config.description,
                is_disabled: false,
              },
            ],
          },
        })
        salesChannel = channelResult[0]
        logger.info(
          `   ✅ Created new sales channel: ${config.salesChannelName}`
        )
      }

      // 2. 创建对应的 API Key
      const { result: apiKeyResult } = await createApiKeysWorkflow(
        container
      ).run({
        input: {
          api_keys: [
            {
              title: config.title,
              type: "publishable",
              created_by: "admin",
            },
          ],
        },
      })

      const apiKey = apiKeyResult[0]

      // 3. 关联 API Key 和销售渠道
      await linkSalesChannelsToApiKeyWorkflow(container).run({
        input: {
          id: apiKey.id,
          add: [salesChannel.id],
        },
      })

      results.push({
        type: config.type,
        title: config.title,
        apiKey: apiKey.token,
        salesChannel: config.salesChannelName,
        salesChannelId: salesChannel.id,
      })

      logger.info(
        `   ✅ ${config.title} - API Key: ${apiKey.token.substring(0, 20)}...`
      )
    }

    // 输出总结
    logger.info("\n🎉 All API Keys created successfully!")
    logger.info("📋 Summary:")

    results.forEach((result) => {
      logger.info(`\n${result.title}:`)
      logger.info(`  Type: ${result.type}`)
      logger.info(`  API Key: ${result.apiKey}`)
      logger.info(`  Sales Channel: ${result.salesChannel}`)
    })

    // 输出环境变量建议
    logger.info("\n📝 Environment Variables Examples:")
    logger.info("# For different frontends/apps:")
    results.forEach((result) => {
      const envName = `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY_${result.type
        .toUpperCase()
        .replace("-", "_")}`
      logger.info(`${envName}=${result.apiKey}`)
    })
  } catch (error) {
    logger.error("❌ Error creating multiple API Keys:", error)
    throw error
  }
}
