# CMS 集成选型与方案（Strapi vs Sanity）

> 目标：为“产地（Origins）/ 冲泡指南（Brewing Guides）”等内容提供更强的编辑体验与工作流；电商域继续由 Medusa 承载。UI 使用英文，文档为中文。

## 1. 为什么要引入 CMS
- 低代码内容运营：编辑、审稿、版本、权限、预览、定时发布。
- 富媒体与多语言：组件化富文本、图片裁剪、国际化。
- 与电商解耦：商品（价格/库存/订单）与内容（故事/指南）分责清晰。

## 2. 选型对比
- Strapi（自托管）
  - 优点：自主管理与合规、强关系型建模、RBAC、插件（i18n/SEO/GraphQL）、REST/GraphQL、Webhooks。
  - 缺点：需自运维（扩缩容、备份、安全），版本升级与插件兼容成本。
  - 适用：对私有化/合规有诉求，或需要强关系建模与后端控制。
- Sanity（SaaS）
  - 优点：Studio 实时协作、GROQ 查询、出色 Preview、图片管线、内容版本化、Webhooks、托管省心。
  - 缺点：SaaS 依赖与计费；GROQ 学习曲线；自定义服务器端逻辑相对有限。
  - 适用：强调编辑体验与交付速度、期望极简运维。

推荐：默认选 Sanity（交付快、编辑体验强）；若必须自托管或需后端完全掌控，选 Strapi。

## 3. 内容模型（适配本项目）
- Origin
  - 字段：`title`、`slug`、`country`（ISO-3166 alpha-2）、`region`、`mountain`、`coordinates`、`climate`、`soil`、`flavor_profile[]`、`hero_image`、`gallery[]`、`seo.*`、`related_products[]`（Medusa 商品 id/handle）。
- BrewingGuide
  - 字段：`tea_type`（枚举）、`vessel`、`water_temp_c`、`leaf_gram_per_100ml`、`time_plan[]`、`brew_times`、`tips`、`content_blocks[]`、`images[]`、`seo.*`、`recommended_products[]`。
- 关系与约束：
  - Medusa 为商品权威；CMS 不存价格/库存，只保存“关联商品 id/handle”。
  - Medusa `product.metadata.origin_id` 与 CMS `Origin.slug` 对齐，避免双向强耦合。

## 4. 集成架构选项
- A. 前端直读 CMS（推荐起步）
  - Next.js 仅在服务端（RSC/Route Handler）通过 Token 访问 CMS；启用 ISR；CMS 发布通过 Webhook 调用 Next.js `/api/revalidate`。
  - 优点：无需同步，预览简洁；
  - 缺点：需要在前端服务器保管 Token，注意速率与缓存。
- B. 后端摄取（Medusa 同步）
  - Webhook/Cron 将 CMS 数据落到 `backend/src/modules/tea` 的表；前端只调用 Medusa。
  - 优点：查询单一来源、筛选与分页统一；
  - 缺点：同步/回滚/冲突处理复杂。
- C. 混合
  - 列表索引走 Medusa（利于筛选/分页）；详情富媒体直读 CMS；两侧用 `slug`/`tea_type` 对齐。

## 5. 安全与缓存
- Token 存储：仅服务器端环境变量；绝不暴露到客户端。
- 速率限制：对 CMS 请求加限流与退避；对再验证路由做签名校验。
- 缓存：
  - Next.js ISR：`origins/*`、`guides/*` 设置 10~60 分钟；
  - Webhook 触发精准路径再验证；
  - 后端模式下可在 Service 层设置短期只读缓存。

## 6. Webhooks 与预览
- Webhooks：`publish/unpublish` 事件 → 触发 `POST /api/revalidate`（携带签名）→ 失效对应路径缓存。
- 预览：Next.js `draft` 模式或自定义 `Preview` 路由；仅在服务端读取 CMS 草稿 Token。

## 7. 实施步骤
- Sanity 路线
  1) 创建项目/数据集，定义 `Origin`/`BrewingGuide` Schema；
  2) 配置 `SANITY_PROJECT_ID`、`SANITY_DATASET`、`SANITY_API_READ_TOKEN`；
  3) Next.js 服务器端编写 GROQ 查询与 ISR；
  4) 配置 Webhook → `/api/revalidate`；
  5) 商品详情页接入 Quick Brew 回落逻辑。
- Strapi 路线
  1) 部署 Strapi（Docker/容器），创建内容类型 `Origin`/`BrewingGuide`；
  2) 配置 `STRAPI_API_URL`、`STRAPI_API_TOKEN`；
  3) 开放只读 REST/GraphQL 权限；
  4) 配置 Webhook → `/api/revalidate`；
  5) 如需后端摄取，编写同步任务与迁移。

## 8. 查询示例
- Sanity（GROQ）
```groq
*[_type == "origin" && slug.current == $slug][0]{
  title, country, region, mountain, flavor_profile, hero_image,
  "products": related_products[]->{"handle": medusa_handle}
}
```
- Strapi（REST）
```http
GET /api/origins?filters[slug][$eq]=longjing&populate=*
Authorization: Bearer <STRAPI_API_TOKEN>
```

## 9. 选择建议（本项目）
- 内容复杂度中等、编辑体验优先、交付速度优先：优先 Sanity（模式 A）。
- 自托管/合规与私有化优先：选择 Strapi（模式 B 或 C）。

## 10. 环境变量
- `TEA_CONTENT_SOURCE=internal|sanity|strapi`
- Sanity：`SANITY_PROJECT_ID`、`SANITY_DATASET`、`SANITY_API_READ_TOKEN`、`SANITY_STUDIO_URL`
- Strapi：`STRAPI_API_URL`、`STRAPI_API_TOKEN`
