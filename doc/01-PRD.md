# 产品需求文档（PRD）

> 站点目标：面向海外用户售卖各类茶叶，提供可转化的内容（冲泡指南、产地介绍），支持国际配送与主流支付。UI 使用英文。

## 1. 背景与目标
- 搭建一体化电商与内容站：商品（茶叶）、内容（Brewing Guides、Origins）深度融合，提升转化率与复购率。
- 优先复用 Medusa 标准域模型（产品、库存、订单、价格、地区、配送），以 `metadata` 扩展茶叶特性；自定义模块承载内容域。

## 2. 用户与角色
- 游客：浏览、搜索、加入购物车、匿名结账。
- 注册用户：地址簿、订单历史、重复购买、愿望清单（可先本地存储，后续扩展到服务器）。
- 运营（Admin/Editor）：商品与内容管理（产地、指南）、定价、库存、上/下架、营销（集合、标签）；在 Sanity 中进行内容编辑、预览与发布。

## 3. 茶叶域与内容
- 茶叶商品（复用 `Product`/`Variant`/`Category`/`Collection`）：
  - 核心属性（存于 `product.metadata`）：
    - `tea_type`（green/white/oolong/black/dark/puer/herbal/...）
    - `origin_id`、`grade`、`harvest_season`、`cultivar`
    - `oxidation_level`、`flavor_notes[]`、`aroma_notes[]`
    - `altitude`、`organic_certified`、`caffeine_level`
    - `brew_override`（可覆盖默认冲泡建议）
- 产地（Sanity 内容 + 内部可选缓存）：国家/地区/山头、气候、土壤、风味、代表茶、图片、坐标、SEO 字段、slug。
- 冲泡指南（Sanity 内容 + 内部可选缓存）：按茶类与器具给出温度、投茶量、浸泡时序、提示、内容块、推荐商品列表。

## 4. 功能需求
- 导航与内容
  - 顶部导航：“Shop”、“Brewing Guides”、“Origins”、“About”、“Help/FAQ”。
  - SEO 友好静态页：产地、指南、集合、商品详情。
- 商品浏览
  - 分类/集合页：筛选（茶类、产地、风味、价格区间、库存），排序（热门、价格、上新）。
  - 商品详情：图文、参数、Quick Brew（来自 `metadata.brew_override` 或对应指南）。
  - 关联：同产地/同类推荐。
- 购物车与结账
  - 支持匿名与登录结账；地址/配送/税费；Stripe 或 PayPal（先落地其一）。
  - 国际配送：按地区/国家配置运费模板（标准/加急）。
- 账户中心
  - 订单历史、地址簿、资料、密码重置、复购。
- 内容管理（Sanity）
  - Editor 可在 Sanity 中创建/编辑 `Origin` 与 `BrewingGuide`，预览后发布；发布触发前端 ISR 失效。
- SEO/分析
  - `next-sitemap`、开放图、结构化数据；基础转化与漏斗统计。

## 5. 非功能需求
- 性能：RSC/SSR、骨架屏、CDN 缓存、图片优化。
- 安全：支付由网关托管，后端输入校验、速率限制、CORS 白名单；Sanity Token 仅服务器端持有。
- 国际化：UI 英文；内容先英文，后续可扩展多语言。
- 可观测：日志、错误上报、业务指标（转化、客单价）。

## 6. 验收标准（高层）
- 用户可基于分类/产地/风味完成筛选、下单并支付成功。
- 商品详情展示冲泡建议（有覆盖则优先，无则回落到指南）。
- 产地与指南页面可被搜索引擎收录（可生成 sitemap，SSR 输出）。

## 7. 技术栈与总体约束（已选）
- Medusa v2（后端电商域）、Next.js App Router（前端）、Tailwind CSS（样式）、Sanity（内容域）。
- 仅支持新方案，不考虑兼容遗留数据或旧系统。
- 服务端读取 Sanity（GROQ），页面采用 ISR，发布触发再验证。

## 8. 品牌与 UI 要求（英文 UI）
- 品牌关键词：Craft / Pure / Mountain / Origin / Ritual。
- 设计要素：
  - 色板：`brand.primary`（深墨绿/玉色）、`brand.accent`（茶金/铜）、`surface`、`ink`、`muted`；深浅主题可扩展。
  - 字体：衬线标题 + 无衬线正文字体（含西文变体）；字号与行高遵循 4/8pt 尺度。
  - 图像：微颗粒胶片质感、近景茶叶与山水远景，统一色调。
  - 组件风格：圆角小、投影克制、分割线弱、留白足、动效时长 150–200ms。
- 可访问性：对比度 AA、可键盘操作、焦点可见、表单语义完整。

## 9. 端到端流程（E2E）
- 内容侧：Editor 在 Sanity 新建/编辑 → 预览 → 发布 → Webhook 触发 Next.js `/api/revalidate` → 用户侧页面刷新为最新。
- 购物侧：用户浏览 → 筛选 → 详情 Quick Brew → 加车 → 结账 → 支付成功 → 订单确认页展示冲泡提示与推荐。
- 售后侧：订单状态邮件/页面、再次购买、NPS 收集；内容页导流继续沉淀搜索流量。

## 10. 可观测与合规
- 监控：前端性能（LCP/INP/CLS）、错误率；后端请求与错误；Sanity Webhook 成功率与再验证延迟。
- 安全：环境变量加密管理、最小权限、Webhook 签名校验。
