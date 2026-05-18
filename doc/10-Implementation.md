# 茶叶海外站实现说明（Medusa v2 + Next.js + Sanity）

> 站点 UI 使用英文；本文档为中文说明。电商域由 Medusa 承载，内容域（产地/冲泡指南）由 Sanity 承载。

## 1. 总览

- 目标：支持海外售卖茶叶，提供内容引流（Origins/Guides）→ 商品详情 → Quick Brew → 下单的完整闭环。
- 关键能力：
  - 商品 → 购物车 → 结账（复用 Starter 模块）
  - Sanity 内容页：`Origins`、`Brewing Guides`（RSC + ISR）
  - 产品详情 `Quick Brew` 参数展示（覆盖优先 `product.metadata.brew_override`，否则回落 Sanity 指南）
  - ISR 再验证（Sanity Webhook）与 Draft 预览
  - 茶叶品类与示例商品，商品元数据承载茶叶属性

## 2. 目录结构与关键文件

### 前端（Next.js App Router）

- 内容数据层（Sanity，已独立分层）
  - `front/src/lib/data/cms/client.ts`：GROQ 客户端（Draft/Token/Tag 缓存）
  - `front/src/lib/data/cms/types.ts`：`OriginDTO`、`BrewingGuideDTO`
  - `front/src/lib/data/cms/origins.ts`：`getOriginsCMS()`、`getOriginBySlugCMS()`
  - `front/src/lib/data/cms/guides.ts`：`getGuidesCMS()`、`getGuideBySlugCMS()`、`getGuideByTypeCMS()`
  - 汇总出口：`front/src/lib/data/sanity.ts`
- 内容页面（RSC + ISR）
  - 产地列表：`front/src/app/[countryCode]/(main)/origins/page.tsx`
  - 产地详情：`front/src/app/[countryCode]/(main)/origins/[slug]/page.tsx`
  - 指南列表：`front/src/app/[countryCode]/(main)/guides/page.tsx`
  - 指南详情：`front/src/app/[countryCode]/(main)/guides/[slug]/page.tsx`
- 产品页 Quick Brew
  - 组件：`front/src/modules/products/components/brew-quick-tips/index.tsx`
  - 注入：`front/src/modules/products/templates/product-info/index.tsx`
- 导航与入口
  - 顶部导航：`front/src/modules/layout/templates/nav/index.tsx`
  - 侧边菜单：`front/src/modules/layout/components/side-menu/index.tsx`
  - 首页入口：`front/src/app/[countryCode]/(main)/page.tsx`
- ISR/预览 API
  - 再验证：`front/src/app/api/revalidate/route.ts`
  - 预览：`front/src/app/api/preview/route.ts`

### 后端（Medusa v2）

- 种子数据：`backend/src/scripts/seed.ts`
  - 区域：`Europe (EUR)`、`North America (USD)`
  - 税区：为 EU/NA 国家建立默认税提供者
  - 仓与履约（阶段一）：`European Warehouse` 配置 Fulfillment Set（含 EU+NA 国家）；后续可拆分 NA 独立仓/履约
  - 运费：标准/加急两档，EUR/USD 与 region 价
  - 品类：`Green Tea`、`Oolong Tea`、`Black Tea`、`Puer Tea`
  - 商品：龙井、铁观音、滇红、熟普（含规格与多币种定价、`product.metadata` 茶叶属性与 `brew_override`）

## 3. 运行与环境变量

### 前端 `.env.local`

```
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_test_xxx
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token
SANITY_STUDIO_URL=https://your-project.sanity.studio
REVALIDATE_SECRET=your_revalidate_secret
PREVIEW_TOKEN=your_preview_token
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

### 启动

- 后端：`cd backend && pnpm i && pnpm dev`，然后 `pnpm seed`
- 前端：`cd front && pnpm i && pnpm dev`，访问 `http://localhost:8000`

### Sanity Webhook（ISR 再验证）

- URL：`/api/revalidate`
- Header：`x-revalidate-token: REVALIDATE_SECRET`
- Body 示例：`{ "type": "origin", "slug": "longjing" }`
- 实现要点：API 内部从 Medusa 拉取 `regions`，将 `/origins/{slug}`、`/guides/{slug}` 展开为 `/{countryCode}/...` 全量 `revalidatePath`；保留 `revalidateTag('origins'|'guides')` 兜底。

### 预览（Draft）

- URL：`/api/preview?token=PREVIEW_TOKEN`
- 说明：仅服务器端读取 Draft；客户端不暴露 Token。

## 4. 业务与展示逻辑

- 产品页 Quick Brew：
  - 优先读取 `product.metadata.brew_override`
  - 若无则回落 `getGuideByTypeCMS(product.metadata.tea_type)`
  - 展示：温度、投茶量、次数、时间计划、提示
- 内容页：
  - `Origins`：标题、国家/地区/山头、风味标签、代表商品链接
  - `Guides`：按茶类展示参数与步骤，推荐商品句柄预留

## 5. 架构对齐与改动说明

- 已对齐：
  - 电商域权威在 Medusa（商品/库存/订单）；茶叶属性放在 `product.metadata.*`
  - 内容域权威在 Sanity（前端 RSC 直读，服务端持 Token）
  - 路由采用 `/{countryCode}/(main)/**`，中间件负责地区注入
  - ISR + Webhook 再验证，预览安全可控
- 修正点：
  - 将 Sanity 数据访问从 `lib/cms/` 迁移并规范到 `lib/data/cms/` 分层
  - `revalidate` 支持按地区展开实际路径 `revalidatePath`（不再仅依赖无国家码路径）
  - 种子新增 NA 区域；后续建议继续将 NA 仓与履约实体完全独立（运营/履约隔离）

## 6. 后续迭代建议

- 履约拆分：为 NA 新建独立 Stock Location / Fulfillment Set / Shipping Options
- 列表筛选：基于 `product.metadata` 增加 `tea_type`、`origin_id`、价格区间与风味筛选
- 支付接入：启用 Stripe 或 PayPal 正式支付
- SEO 强化：元信息/结构化数据/地图/图片懒加载
- 预览体验：增加关闭预览入口；为 Editor 输出快捷预览链接

## 7. 变更清单（重要文件）

- Sanity 数据层：
  - `front/src/lib/data/cms/{client.ts, types.ts, origins.ts, guides.ts}`
  - `front/src/lib/data/sanity.ts`
- 内容页：
  - `front/src/app/[countryCode]/(main)/origins/page.tsx`
  - `front/src/app/[countryCode]/(main)/origins/[slug]/page.tsx`
  - `front/src/app/[countryCode]/(main)/guides/page.tsx`
  - `front/src/app/[countryCode]/(main)/guides/[slug]/page.tsx`gi
- Quick Brew：`front/src/modules/products/components/brew-quick-tips/index.tsx`
- 导航与入口：
  - `front/src/modules/layout/templates/nav/index.tsx`
  - `front/src/modules/layout/components/side-menu/index.tsx`
  - `front/src/app/[countryCode]/(main)/page.tsx`
- ISR/预览：
  - `front/src/app/api/revalidate/route.ts`
  - `front/src/app/api/preview/route.ts`
- 后端种子：`backend/src/scripts/seed.ts`
