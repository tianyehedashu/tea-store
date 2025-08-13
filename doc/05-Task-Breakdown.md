# 任务拆分与里程碑

> 按阶段推进，优先实现最小可用闭环（MVP）。

## 里程碑 M0（准备/配置，1-2 天）
- 配置 `medusa-config.ts` 与环境变量（数据库、CORS、支付占位）。
- 扩充 `backend/src/scripts/seed.ts`：基础 `Region`、`ShippingOptions`、集合与示例商品。
- 前端环境：`MEDUSA_BACKEND_URL`、`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`。

## 里程碑 M1（后端内容域，3-5 天）
- 新建模块 `backend/src/modules/tea`：`Origin`、`BrewingGuide`、`TeaModuleService`、`index.ts`。
- 注册模块到 `medusa-config.ts`。
- Store API：`/store/tea/origins`、`/store/tea/guides`（只读）。
- Admin API：`/admin/tea/origins`、`/admin/tea/guides`（读写）。
- 单元/集成测试覆盖：模型与 API。

## 里程碑 M2（前端内容页与商品整合，4-6 天）
- 新增页面：`(main)/origins/*`、`(main)/guides/*`，组件 `origin-card`、`guide-steps`、`brew-quick-tips`。
- 商品详情 Quick Brew：读取 `product.metadata.brew_override`，回落到 `BrewingGuide`。
- 类目筛选扩展：`tea_type`、`origin_id`、`flavor_notes`、价格区间。
- SEO：sitemap 注册、元数据完善。

## 里程碑 M3（结账与物流完善，2-4 天）
- 启用支付网关（Stripe 或 PayPal 二选一先落地）。
- 配置国际运费模板，验证税费计算。
- 订单完成页展示冲泡提示与推荐商品。

## 里程碑 M4（优化与验收，2-4 天）
- 性能与 A11y 优化；打点与转化漏斗搭建。
- 修复遗留问题；最终文档与运维交接。

## 任务清单（按模块）
- 后端
  - 定义与迁移：`Origin`、`BrewingGuide`
  - Service：`TeaModuleService`
  - API：Store（只读）、Admin（读写）
  - 种子：`seed.ts` 示例产地/指南/商品
- 前端
  - 页面：`origins`、`guides` 列表与详情
  - 商品页：Quick Brew 集成
  - 数据函数：`getOrigins`、`getOriginById`、`getGuides`、`getGuideByType`
  - 筛选：茶类、产地、风味、价格
- 质量与 DevOps
  - 环境变量与密钥管理
  - 测试用例与 CI
  - 监控与日志
