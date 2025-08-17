import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { 
  createApiKeysWorkflow,
  linkSalesChannelsToApiKeyWorkflow 
} from "@medusajs/medusa/core-flows";

/**
 * 单独创建 Publishable API Key 的脚本
 * 运行方式: npm run exec ./src/scripts/create-api-key.ts
 */
export default async function createApiKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  try {
    logger.info("Creating new Publishable API Key...");
    
    // 创建 API Key
    const { result: apiKeyResult } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Frontend Store", // 可以自定义名称
            type: "publishable",
            created_by: "admin",
          },
        ],
      },
    });
    
    const apiKey = apiKeyResult[0];
    logger.info(`✅ API Key created successfully: ${apiKey.token}`);
    
    // 获取默认销售渠道
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL);
    const salesChannels = await salesChannelService.listSalesChannels({
      name: "Default Sales Channel"
    });
    
    if (salesChannels.length > 0) {
      // 关联到销售渠道
      await linkSalesChannelsToApiKeyWorkflow(container).run({
        input: {
          id: apiKey.id,
          add: [salesChannels[0].id],
        },
      });
      
      logger.info(`✅ API Key linked to sales channel: ${salesChannels[0].name}`);
    }
    
    logger.info("🎉 Setup complete!");
    logger.info("Add this to your frontend .env.local file:");
    logger.info(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`);
    
  } catch (error) {
    logger.error("❌ Error creating API Key:", error);
    throw error;
  }
}
