# 任务拆分与里程碑

> 已选方案：Medusa + Sanity + Next.js + Tailwind。优先完成 Sanity 前端直读 + ISR + Webhook 再验证。

## 里程碑 M0（准备/配置，1-2 天）
- 后端：`medusa-config.ts`、数据库与 CORS；`seed.ts`：Region、ShippingOptions、集合、示例商品。
- 前端：`MEDUSA_BACKEND_URL`、`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`；Tailwind 主题搭建。
- Sanity：创建项目/数据集，定义 `Origin`/`BrewingGuide` Schema，设置只读 Token。

## 里程碑 M1（内容域与页面，3-5 天）
- Sanity GROQ 查询与 DTO 映射：`getOriginsCMS`、`getGuidesCMS` 等。
- 页面：`(main)/origins/*`、`(main)/guides/*`；组件：`OriginCard`、`GuideSteps`、`BrewQuickTips`。
- ISR：路径与超时时间配置；`/api/revalidate` 路由（签名校验）。

## 里程碑 M2（商品整合与下单，4-6 天）
- 商品详情 Quick Brew 集成（先读 `metadata.brew_override`，回落 Sanity Guide）。
- 列表筛选扩展：`tea_type`、`origin_id`、`flavor_notes`、价格区间。
- 结账：选择 Stripe 或 PayPal 落地；订单完成页“冲泡提示”。

## 里程碑 M3（品牌与优化，3-5 天）
- 品牌页与礼包：`/about`、`Gift Sets`；品牌组件（Hero/Nav/FooterBrand）。
- 预览模式：`/api/preview` 与草稿读取；权限控制。
- 性能与 A11y：骨架屏、图片优化、关键指标优化。

## 里程碑 M4（验收与交付，2-4 天）
- 测试：单元/集成/E2E（关键流程与 ISR/预览）。
- 监控：前端/后端日志与告警、Webhook 成功率仪表。
- 文档与交付：运维手册、环境变量清单、回滚策略。

## 任务清单（按模块）
- 后端
  - `seed.ts`、支付与配送配置
  - （可选）内容缓存层与 API（摄取/混合模式时启用）
- 前端
  - Tailwind 主题与基础组件
  - 内容页与商品整合
  - 数据函数与 DTO 映射（Sanity + Medusa）
  - 预览与 ISR、`/api/revalidate`
- Sanity
  - Schema、角色与权限、Webhook 配置
  - 编辑工作流（预览→发布→失效）
- 质量与 DevOps
  - 环境变量与密钥管理
  - 测试、CI、监控与告警
  - 安全（签名校验、最小权限）
