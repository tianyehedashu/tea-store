# 详细设计（前后端）

> 复用现有能力优先，避免重复定义；UI 使用英文。

## 1. 后端设计（Medusa）
### 1.1 模块与模型
- 模块：`backend/src/modules/tea`
  - 模型 `Origin`
    - 字段：`id`、`name`、`country`（ISO-3166 Alpha-2）、`region`、`mountain`、`latitude`、`longitude`、`climate`、`soil`、`flavor_profile[]`、`description`、`hero_image`
  - 模型 `BrewingGuide`
    - 字段：`id`、`tea_type`、`vessel`、`water_temp_c`、`leaf_gram_per_100ml`、`time_plan[]`（如 `[20, 15, 15]` 秒）`brew_times`、`tips`、`images[]`
- 注册：在 `backend/medusa-config.ts` 的 `modules` 中加入 `resolve: "./src/modules/tea"`

### 1.2 服务与方法（TeaModuleService）
- `listOrigins(filters)`、`getOrigin(id)`
- `listGuides(filters)`、`getGuide(id)`、`getGuideByType(teaType)`
- `upsertOrigin(payload)`、`upsertGuide(payload)`（Admin）

### 1.3 API 路由
- Store（只读）：
  - `GET /store/tea/origins`
  - `GET /store/tea/origins/:id`
  - `GET /store/tea/guides`
  - `GET /store/tea/guides/:id`
  - `GET /store/tea/guides/by-type/:teaType`
- Admin（读写）：
  - `POST/PUT/DELETE /admin/tea/origins`
  - `POST/PUT/DELETE /admin/tea/guides`

### 1.4 与产品域的整合
- `Product.metadata` 字段：`tea_type`, `origin_id`, `grade`, `harvest_season`, `cultivar`, `oxidation_level`, `flavor_notes[]`, `aroma_notes[]`, `altitude`, `organic_certified`, `caffeine_level`, `brew_override`。
- 冲泡展示优先级：`product.metadata.brew_override` > `BrewingGuide`（按 `tea_type`）。

### 1.5 种子数据（`backend/src/scripts/seed.ts`）
- 基础 `Region`（多币种）与 `ShippingOptions`（标准/加急）。
- 集合/分类：`Green`, `Oolong`, `Black`, `Puer` 等。
- 示例 `Origin`：`Longjing (Hangzhou, CN)`, `Yiwu (Yunnan, CN)`。
- 示例 `BrewingGuide`：`green`, `oolong`, `black` 的推荐参数。
- 示例商品与变体：50g/100g/250g。

### 1.6 校验/安全
- Admin 路由鉴权（Medusa Admin 体系），请求体校验（DTO/Schema）。
- Store 路由开启 CORS 白名单；必要的速率限制。

## 2. 前端设计（Next.js）
### 2.1 路由与页面
- `front/src/app/[countryCode]/(main)/origins/page.tsx`：产地列表
- `front/src/app/[countryCode]/(main)/origins/[originId]/page.tsx`：产地详情
- `front/src/app/[countryCode]/(main)/guides/page.tsx`：指南列表
- `front/src/app/[countryCode]/(main)/guides/[slugOrType]/page.tsx`：指南详情

### 2.2 组件
- 新增 `front/src/modules/content/*`：
  - `origin-card`、`origin-hero`、`guide-steps`、`brew-quick-tips`
- 复用 `modules/products/components/*` 的价格、库存、图片组件。

### 2.3 数据访问
- 新增 `front/src/lib/data/tea.ts`：
  - `getOrigins`, `getOriginById`, `getGuides`, `getGuideByType`
- 商品详情 Quick Brew：读取 `product.metadata.brew_override`，无则调用 `getGuideByType(teaType)`。

### 2.4 筛选与搜索
- 类目/集合页增加筛选：`tea_type`、`origin_id`、`flavor_notes`、价格区间、库存。
- 短期基于 `product.metadata` 与 `tags` 客户端/后端组合过滤；后期可接入搜索服务。

### 2.5 SEO/可用性
- `next-sitemap` 注册 `origins/*`、`guides/*`。
- OpenGraph 与元数据：详情页动态标题/描述/封面。
- 骨架屏复用 `modules/skeletons`；移动端优先布局。

## 3. API 契约（示例）
- `GET /store/tea/origins?country=CN&region=Yunnan`
```json
{
  "items": [
    { "id": "orig_longjing", "name": "Longjing", "country": "CN", "region": "Zhejiang" }
  ],
  "count": 1
}
```
- `GET /store/tea/guides/by-type/oolong`
```json
{
  "guide": {
    "tea_type": "oolong",
    "water_temp_c": 95,
    "leaf_gram_per_100ml": 3,
    "time_plan": [20, 15, 15],
    "brew_times": 5,
    "tips": "Warm the gaiwan before brewing."
  }
}
```

## 4. 性能与观测
- 前端：RSC + ISR；关键路径减小包体；图片懒加载；合理缓存策略。
- 后端：端点级别 Cache-Control；必要时添加只读缓存层。
- 观测：前端错误上报、后端日志/请求追踪、业务指标（转化、客单价）。
