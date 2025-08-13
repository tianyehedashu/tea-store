# 架构文档（基于当前 Medusa 项目）

> 后端：`backend`（Medusa v2）；前端：`front`（Next.js App Router）。UI 使用英文。

## 1. 仓库结构与关键位置
- 后端（Medusa）：`backend`
  - 配置：`backend/medusa-config.ts`
  - 扩展：`backend/src/modules`（模块）、`backend/src/api`（文件式路由）、`backend/src/subscribers`、`backend/src/workflows`
  - 脚本与数据：`backend/src/scripts/seed.ts`
- 前端（Next.js）：`front`
  - 路由根：`front/src/app/[countryCode]`
  - SDK：`front/src/lib/config.ts`
  - 数据：`front/src/lib/data/*`
  - 组件与模板：`front/src/modules/*`

## 2. 高层架构
- 前端通过 Medusa JS SDK 与 Store/Admin API 通信；内容域（产地、指南）通过自定义 Store API 提供只读访问。
- 后端 Medusa 负责电商域（产品、变体、库存、定价、订单）、地区/配送/支付；自定义模块 `tea` 负责内容域。
- 数据持久化采用 PostgreSQL（或当前配置的数据源）。

```mermaid
flowchart TD
  A[Next.js App Router] -->|JS SDK / REST| B[Medusa Backend]
  B --> C[(PostgreSQL)]
  B --> D[Stripe / PayPal]
  B --> F[Module: tea (Origin, BrewingGuide)]
  A --> E[CDN / Edge Cache]
```

## 3. 模块与 API 规划
- 模块：`backend/src/modules/tea`
  - 模型：`Origin`、`BrewingGuide`
  - Service：`TeaModuleService`（`listOrigins`, `getOrigin`, `listGuides`, `getGuide`, `getGuideByType`, `upsertOrigin`, `upsertGuide`）
  - 注册：在 `backend/medusa-config.ts` 的 `modules` 中添加 `resolve: "./src/modules/tea"`
- Store API（只读）：
  - `GET /store/tea/origins`、`GET /store/tea/origins/:id`
  - `GET /store/tea/guides`、`GET /store/tea/guides/:id`
  - `GET /store/tea/guides/by-type/:teaType`
- Admin API（读写）：
  - `POST/PUT/DELETE /admin/tea/origins`
  - `POST/PUT/DELETE /admin/tea/guides`

## 4. 数据模型策略
- 复用 `Product`/`Variant`，以 `product.metadata` 承载茶叶特性：
  - `tea_type`, `origin_id`, `grade`, `harvest_season`, `cultivar`, `oxidation_level`, `flavor_notes[]`, `aroma_notes[]`, `altitude`, `organic_certified`, `caffeine_level`, `brew_override`
- 自定义表仅定义内容域：`Origin`、`BrewingGuide`。

## 5. 地区、定价与物流
- 使用 `Region` 配置币种/税率；`ShippingOptions` 配置国际运费（标准/加急）。

## 6. 缓存与性能
- 前端：RSC 段级缓存 + ISR（产地/指南），骨架屏与渐进加载。
- 后端：合理的 Cache-Control；可选服务层只读缓存。

## 7. 环境变量（示例）
- 前端：`MEDUSA_BACKEND_URL`、`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- 后端：`DATABASE_URL`、`MEDUSA_*`、`STRIPE_*`/`PAYPAL_*`
- 内容源模式：`TEA_CONTENT_SOURCE` = `internal|strapi|sanity`
- Strapi：`STRAPI_API_URL`、`STRAPI_API_TOKEN`
- Sanity：`SANITY_PROJECT_ID`、`SANITY_DATASET`、`SANITY_API_READ_TOKEN`、`SANITY_STUDIO_URL`

## 8. CMS 集成架构（可选）
- 模式 A（前端直读 CMS，推荐起步）：
  - Next.js 仅在服务端（RSC/Route Handler）使用 Token 读取 CMS；页面采用 ISR；发布时由 CMS Webhook 触发再验证。
```mermaid
flowchart TD
  A[Next.js Server Components] -->|SDK/HTTP (Server only)| X[CMS (Strapi/Sanity)]
  A -->|JS SDK| B[Medusa Backend]
  B --> C[(PostgreSQL)]
  A --> E[CDN / ISR]
```
- 模式 B（后端摄取/同步到 Medusa 模块）：
  - 后端定时任务/Webhook 同步 CMS 内容到 `tea` 模块表；前端继续只调用 Medusa。
```mermaid
flowchart TD
  X[CMS] -->|Webhook/Cron Sync| B[Medusa Backend]
  B --> F[Module: tea (DB)]
  A[Next.js] -->|JS SDK| B
```
- 模式 C（混合）：
  - 列表页索引来自后端（便于筛选/分页），详情页富媒体直读 CMS。

- 对比：
  - A：零同步、实时预览、实现快；需处理双源（Medusa+CMS）调用与缓存。
  - B：单一后端、查询统一；需实现同步与冲突解决。
  - C：折中方案，前后端各取所长。

> 具体选型与落地细节见 `08-CMS-Integration.md`。
