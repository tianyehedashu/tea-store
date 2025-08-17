import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";

export default async function clearUsers({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("🧹 开始清除所有用户数据以触发首次设置引导...");

  try {
    // 获取所有用户
    const { data: users } = await query.graph({
      entity: "user",
      fields: ["id", "email"],
    });

    if (!users || users.length === 0) {
      logger.info("✅ 没有找到用户数据，数据库已处于首次设置状态");
      return;
    }

    logger.info(`📊 找到 ${users.length} 个用户，准备清除:`);
    users.forEach((user: any) => {
      logger.info(`   - ${user.email} (${user.id})`);
    });

    // 使用原生数据库连接直接删除
    const userModuleService = container.resolve(Modules.USER);
    
    // 删除所有用户
    for (const user of users) {
      await userModuleService.deleteUsers([user.id]);
      logger.info(`   ✅ 删除用户: ${user.email}`);
    }

    logger.info("🎉 所有用户数据已清除！");
    logger.info("💡 现在访问 http://localhost:9000/app 应该会显示首次设置引导页面");
    
  } catch (error: any) {
    logger.error("❌ 清除用户数据时出错:", error.message);
    
    // 如果上面的方法失败，尝试直接SQL删除
    try {
      logger.info("🔄 尝试使用直接数据库操作...");
      
      const dbConfig = container.resolve("configModule").projectConfig;
      if (dbConfig.databaseUrl) {
        // 这里可以添加直接数据库操作的逻辑
        logger.info("⚠️  请手动删除 medusa_user 表中的数据");
      }
    } catch (fallbackError: any) {
      logger.error("❌ 备用方法也失败:", fallbackError.message);
    }
  }
}
