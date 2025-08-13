# 产品需求文档（PRD）

> 站点目标：面向海外用户售卖各类茶叶，提供可转化的内容（冲泡指南、产地介绍），支持国际配送与主流支付。UI 使用英文。

## 1. 背景与目标
- 搭建一体化电商与内容站：商品（茶叶）、内容（Brewing Guides、Origins）深度融合，提升转化率与复购率。
- 优先复用 Medusa 标准域模型（产品、库存、订单、价格、地区、配送），以 `metadata` 扩展茶叶特性；自定义模块承载内容域。

## 2. 用户与角色
- 游客：浏览、搜索、加入购物车、匿名结账。
- 注册用户：地址簿、订单历史、重复购买、愿望清单（可先本地存储，后续扩展到服务器）。
- 运营（Admin）：商品与内容管理（产地、指南）、定价、库存、上/下架、营销（集合、标签）。

## 3. 茶叶域与内容
- 茶叶商品（复用 `Product`/`Variant`/`Category`/`Collection`）：
  - 核心属性（存于 `product.metadata`）：
    - `tea_type`（green/white/oolong/black/dark/puer/herbal/...）
    - `origin_id`、`grade`、`harvest_season`、`cultivar`
    - `oxidation_level`、`flavor_notes[]`、`aroma_notes[]`
    - `altitude`、`organic_certified`、`caffeine_level`
    - `brew_override`（可覆盖默认冲泡建议）
- 产地（自定义模块 `Origin`）：国家/地区/山头、气候、土壤、风味、代表茶、图片、坐标。
- 冲泡指南（自定义模块 `BrewingGuide`）：按茶类与器具给出温度、投茶量、浸泡时序、提示。

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
- 内容管理（Admin）
  - `Origin` 与 `BrewingGuide` 的 CRUD API；与商品关联通过 `metadata.origin_id`、`tea_type` 等。
- SEO/分析
  - `next-sitemap`、开放图、结构化数据；基础转化与漏斗统计。

## 5. 非功能需求
- 性能：RSC/SSR、骨架屏、CDN 缓存、图片优化。
- 安全：支付由网关托管，后端输入校验、速率限制、CORS 白名单。
- 国际化：UI 英文；内容先英文，后续可扩展多语言。
- 可观测：日志、错误上报、业务指标（转化、客单价）。

## 6. 验收标准（高层）
- 用户可基于分类/产地/风味完成筛选、下单并支付成功。
- 商品详情展示冲泡建议（有覆盖则优先，无则回落到指南）。
- 产地与指南页面可被搜索引擎收录（可生成 sitemap，SSR 输出）。

## 7. 内容管理（可选 CMS 集成）
- 目标与好处：
  - 降低非技术人员维护内容成本；多人协作、版本管理、审稿流程、预览发布；多语言扩展能力强。
  - 支持图文多媒体、富文本模块化、内容复用（指南与商品/集合的关联推荐）。
- 选型：Strapi vs Sanity（详见 `08-CMS-Integration.md`）
  - Strapi（自托管）：强关系型内容、RBAC、自主可控、插件生态（i18n、SEO、GraphQL）；需自行运维。
  - Sanity（SaaS）：实时协作、强 Schema/Studio、GROQ 查询、图像管线、极佳预览体验；SaaS 依赖与计费。
- 适配本项目的内容类型：
  - `Origin`：基础信息、媒体、地图坐标、代表茶（关联 Medusa 商品 id/handle）、SEO 字段、slug。
  - `BrewingGuide`：按 `tea_type` 聚合的参数与图文块、推荐商品（Medusa 商品 id 列表）。
- 与电商域的关系：
  - 商品仍以 Medusa 为权威来源；内容以 CMS 为权威来源。
  - 关联策略：`product.metadata.origin_id`/`tea_type` 与 CMS 中 `Origin.slug`/`Guide.tea_type` 对齐。
- 发布与预览：
  - 需支持 Preview（草稿）与 Publish（生产）；预览仅在服务端读取 CMS Token；
  - 发布触发 Next.js ISR 失效与后端缓存失效（Webhooks）。
- 验收（CMS 可选）：
  - 编辑人员可独立完成“新增产地/指南→预览→发布→前台可见”的流程；
  - 发布后 1 分钟内完成页面再验证（ISR revalidate）；
  - 商品详情页的 Quick Brew 与产地卡片正确联动。
