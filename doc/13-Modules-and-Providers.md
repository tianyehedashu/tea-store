## Medusa v2 模块（Modules）与提供者（Providers）装配说明

### 适用范围

- 项目：Tea Store（Medusa v2 后端）
- 目标：解释模块/Provider 的架构思想、默认装配项与如何扩展；说明本仓库对文件上传/访问的目录策略与迁移建议。

---

## 核心概念与架构理念

### 模块（Module）

- 抽象一类业务能力（如产品、库存、订单、文件等）。
- 提供域模型、服务（Service）与对外的 API/工作流钩子。

### 提供者（Provider）

- 模块的具体实现，可按需替换（例如文件存储：本地 → S3/GCS）。
- 通过 `medusa-config.ts` 的 `modules` 数组进行声明式装配。

### 配置驱动（12-Factor）

- 所有敏感/环境相关参数通过环境变量注入（`DATABASE_URL`、`STORE_CORS`、`JWT_SECRET` 等）。
- 以“声明式配置 + 约定优于配置”的方式完成依赖注入与模块初始化。

---

## 本项目的默认装配（medusa-config.ts）

### 文件模块（File Module）本地 Provider

项目显式装配了文件模块，并选择了本地文件 Provider。上传文件落盘到后端工程内的目录，并基于 `MEDUSA_BACKEND_URL` 生成可访问 URL。

```ts
// 摘自 backend/medusa-config.ts 的 modules 片段
modules: [
  {
    resolve: "@medusajs/medusa/file",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/file-local",
          id: "local",
          options: {
            upload_dir: "static",
            backend_url:
              process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
          },
        },
      ],
    },
  },
]
```

要点：

- **存储位置**：默认为 `backend/static`（相对后端工作目录）。
- **访问 URL**：由 Provider 基于 `backend_url` 生成，前端使用此 URL 显示媒体资源。
- **安全边界**：整体受 `projectConfig.http` 的 CORS、JWT、Cookie Secret 等约束。

---

## 本仓库的文件访问策略与迁移

---

## Medusa v2 核心内置模块（自动装配）

以下为 `@medusajs/medusa` 提供的核心业务域能力，通常无需在 `medusa-config.ts` 显式声明：

- **产品（Product）**：商品、选项、变体、媒体关联
- **定价（Pricing）**：价格列表、货币、含/不含税价计算
- **库存（Inventory）**：库存项、保留量、出入库调整
- **购物车（Cart）**：购物车生命周期、行项与价格更新
- **订单（Order）**：下单、支付/履约状态、取消与退款
- **客户与账号（Customer & Auth）**：账户资料、认证与会话
- **区域与币种（Region/Currency）**：市场区域、货币、税设定承载体
- **销售渠道（Sales Channel）**：渠道隔离、商品/价格在渠道维度的暴露
- **促销与折扣（Promotion/Discount）**：优惠码、规则与条件、订单/行项折扣
- **税务（Tax）**：税率/策略抽象，与地区与定价协同计算

这些模块在框架层面完成依赖注入与组合，对业务方透明；当需要替换某类“实现”（如支付、搜索、通知、配送），可通过 Provider 型模块进行扩展。

---

## 可选 Provider 型模块（按需扩展）

### 常见类型

- **支付（Payment）**：Stripe、Adyen、PayPal 等；开发可用“手动支付”进行流程联调。
- **搜索（Search）**：开发用内存搜索；生产推荐外部搜索（Meilisearch、OpenSearch 等）。
- **通知（Notification）**：邮件、短信、IM；开发可用内存/控制台 Provider。
- **履约/配送（Fulfillment/Shipping）**：运费计算、出库/发货、物流商对接。

### 装配范式（示例）

```ts
modules: [
  {
    resolve: "<模块包名>",
    options: {
      providers: [
        {
          resolve: "<provider 包名>",
          id: "<唯一ID>",
          options: {
            /* 凭证与定制项，使用环境变量注入 */
          },
        },
      ],
    },
  },
]
```

### 切换文件模块到云存储（S3 示意）

```ts
modules: [
  {
    resolve: "@medusajs/medusa/file",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/file-s3",
          id: "s3",
          options: {
            bucket: process.env.S3_BUCKET,
            region: process.env.S3_REGION,
            access_key_id: process.env.S3_ACCESS_KEY_ID,
            secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
            // 可选：CDN 自定义域
            // cdn_url: process.env.CDN_URL,
          },
        },
      ],
    },
  },
]
```

建议：

- 所有凭证/开关通过环境变量注入。
- 严格配置 `STORE_CORS`/`ADMIN_CORS`/`AUTH_CORS` 的白名单。
- 生产环境设置强随机 `JWT_SECRET`/`COOKIE_SECRET`，并确保 `MEDUSA_BACKEND_URL` 为公网可达地址。

---

## 环境变量速查

- **DATABASE_URL**：Postgres 连接字符串
- **STORE_CORS / ADMIN_CORS / AUTH_CORS**：分别控制 Store/Admin/Auth 的跨域白名单（逗号分隔）
- **JWT_SECRET / COOKIE_SECRET**：会话与令牌安全（生产必须强随机）
- **MEDUSA_BACKEND_URL**：后端对外基础 URL（影响文件 URL 生成）

---

## 在代码中使用模块服务

在 API 路由中可通过 IoC 容器解析模块主服务：

```ts
// 伪代码示例
export const GET = async (req, res) => {
  const productModuleService = req.scope.resolve("product")
  const [items, count] = await productModuleService.listAndCount()
  res.json({ count })
}
```

---

## 自定义模块（快速指南）

1. 在 `backend/src/modules/<name>/models/*.ts` 定义数据模型。
2. 在 `backend/src/modules/<name>/service.ts` 定义服务，继承 `MedusaService(...)`。
3. 在 `backend/src/modules/<name>/index.ts` 导出模块定义（`Module(name, { service })`）。
4. 在 `backend/medusa-config.ts` 的 `modules` 中通过相对路径装配。
5. 用 `medusa db:generate <name>` 生成迁移，`medusa db:migrate` 执行迁移。

---
