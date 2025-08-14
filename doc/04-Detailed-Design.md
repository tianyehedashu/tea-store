# 详细设计（前后端）

> 复用现有能力优先，避免重复定义；UI 使用英文。

## 1. 后端设计（Medusa）
### 1.1 模块与模型
- 模块：`backend/src/modules/tea`
  - 模型 `Origin`、`BrewingGuide`（可选：作为内容缓存与统一筛选支持）
- 注册：在 `backend/medusa-config.ts` 的 `modules` 中加入 `resolve: "./src/modules/tea"`

### 1.2 服务与方法（TeaModuleService）
- `listOrigins(filters)`、`getOrigin(id)`、`listGuides(filters)`、`getGuide(id)`、`getGuideByType(teaType)`
- （可选）`syncFromSanity`：从 Sanity 同步内容到本地缓存表，支持统一分页与筛选。

### 1.3 API 路由
- Store（只读）：`/store/tea/origins*`、`/store/tea/guides*`
- Admin（读写，可选）：`/admin/tea/origins*`、`/admin/tea/guides*`

### 1.4 与产品域的整合
- `Product.metadata`：`tea_type`, `origin_id`, `grade`, `harvest_season`, `cultivar`, `oxidation_level`, `flavor_notes[]`, `aroma_notes[]`, `altitude`, `organic_certified`, `caffeine_level`, `brew_override`。
- 冲泡展示优先级：`metadata.brew_override` > Sanity `BrewingGuide`（按 `tea_type`）。

### 1.5 种子数据（`backend/src/scripts/seed.ts`）
- `Region`、`ShippingOptions`、集合/分类（Green/Oolong/Black/Puer）、示例商品/变体、示例产地/指南。

### 1.6 校验/安全
- Admin 路由鉴权、请求体校验、CORS 白名单、速率限制。

## 2. 前端设计（Next.js + Tailwind）
### 2.1 路由与页面
- `(main)/origins/*`、`(main)/guides/*`；首页、集合、商品详情、结账、订单完成、账户中心。

### 2.2 设计系统与 Tailwind
- 主题令牌（Tailwind `theme.extend`）：
  - 颜色：`brand.primary`、`brand.accent`、`surface`、`ink`、`muted`；
  - 字体：衬线标题、无衬线正文；字号/行高刻度；
  - 间距：4/8pt 刻度；圆角与阴影；暗色模式。
- 基础组件：按钮、输入、选择、卡片、徽章、Modal、Toast。
- 品牌组件：`NavBar`、`Hero`、`ProductCard`、`OriginCard`、`GuideSteps`、`BrewQuickTips`、`FooterBrand`。
- 动效：过渡 150–200ms、淡入/上滑、小范围缩放；谨慎使用视差与大面积动画。

### 2.3 数据访问与映射
- Sanity（服务器端）
  - `getOriginsCMS()`, `getOriginBySlugCMS()`, `getGuidesCMS()`, `getGuideByTypeCMS()`（GROQ 查询）
  - DTO 映射：`OriginCMS → OriginDTO`、`BrewingGuideCMS → BrewingGuideDTO`（统一给页面使用）
- Medusa（JS SDK）
  - 商品/价格/库存/购物车/订单；`product.metadata` 参与 UI 决策（例如 Quick Brew 覆盖）

### 2.4 预览与 ISR
- 预览：`/api/preview` 开启草稿读取（服务器端），仅对 Editor 可见；
- ISR：`origins/*`、`guides/*`、首页推荐设置 10–60 分钟；Sanity 发布 Webhook → `/api/revalidate` 精确失效。

### 2.5 SEO/可访问性
- 动态元信息与结构化数据（产品、文章）；
- 语义标签与可键盘操作；图片 `alt`、表单 `aria-*`；
- 站点地图与面包屑；
- CLS 控制：骨架屏与尺寸占位。

## 3. 页面模块要点
- 商品详情：品牌头图、关键信息（产地、品种、风味）、Quick Brew、相关商品。
- 产地详情：风土/图片/地图、代表茶、故事模块；
- 指南详情：参数卡片（温度、时间、投茶量、次数）、步骤组件、推荐商品；
- 订单完成：订单摘要 + 冲泡提示卡片 + 推荐再次购买；
- 账户中心：地址簿、订单列表、再次购买、资料编辑。

## 4. 性能与观测
- RSC + ISR；列表分页与图片懒加载；Tailwind 按需构建；
- 指标：LCP/INP/CLS、接口错误率、Sanity Webhook 成功率；
- 监控与日志：前端错误上报、后端请求追踪、Webhook 失败告警。
