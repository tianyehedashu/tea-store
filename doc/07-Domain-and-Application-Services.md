# Medusa v2 中的领域服务与应用服务（Tea Store 实践）

> 面向 Tea Store（Medusa v2 后端 + Next.js 前端）。本文用通俗方式说明：在 Medusa v2 里“领域服务”“应用服务”分别对应什么、放在哪里、怎么用、何时选谁。

---

## 一句话结论

- 领域服务（Domain Service）≈ 模块服务（Module Service）
  - 提供领域内的模型与业务方法，负责“读”和单域内“写”的基本能力。
- 应用服务（Application Service）≈ 工作流（Workflow）
  - 负责跨模块的用例编排、事务/补偿与幂等，承载“写侧/流程化”操作。

这与本仓库的 CQRS 约定一致：读侧主要走模块服务；写侧通过工作流封装和执行（见 `doc/06-CQRS-and-Complex-Queries.md`）。

---

## 在项目中的位置

- 模块/领域服务：`backend/src/modules/**`
  - 每个模块包含数据模型与“Service”类（模块主服务）。
  - 内置域（产品、定价、库存、订单……）由框架提供；自定义域可在此目录下扩展。
- 工作流/应用服务：`backend/src/workflows/**`
  - 用 `createWorkflow` + `createStep` 将多个服务调用编排成一个业务用例，可在路由、任务、订阅者中触发。
- API 路由：`backend/src/api/**`
  - `GET` 通常只读（查询）；`POST/PUT/PATCH/DELETE` 触发工作流（写侧）。

参考：
- 模块与服务入门：`backend/src/modules/README.md`
- 工作流入门示例：`backend/src/workflows/README.md`
- CQRS 说明：`doc/06-CQRS-and-Complex-Queries.md`

---

## 如何使用（最小示例）

### 1) 读侧：在路由中调用模块服务（领域服务）
文件位置：`backend/src/api/store/custom/route.ts`
```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // 解析内置产品模块的主服务（领域服务）
  const productModuleService = req.scope.resolve("product")

  const { q, limit = 10, offset = 0 } = req.query
  const [items, count] = await productModuleService.listAndCount(
    {
      q: q as string | undefined,
      status: ["published"],
    },
    {
      take: Number(limit),
      skip: Number(offset),
      select: ["id", "title"],
      order: { created_at: "desc" },
    }
  )

  res.json({ count, items })
}
```

要点：
- 模块服务适合同一域内的复杂筛选、分页、选择字段/关系；
- 跨域聚合查询可用 `remoteQuery`（见 CQRS 文档中的示例）。

### 2) 写侧：用工作流作为应用服务进行编排
文件位置：`backend/src/workflows/place-order-lite.ts`
```ts
import { createWorkflow, createStep, WorkflowResponse, StepResponse } from "@medusajs/framework/workflows-sdk"

// 步骤：校验与领域写入可分步抽象（失败时可补偿/回滚）
const reserveInventory = createStep("reserve-inventory", async (input: { variantId: string; qty: number }) => {
  // 伪代码：调用库存模块服务进行预留
  // const inventory = context.container.resolve("inventory")
  // await inventory.reserve({ variantId: input.variantId, quantity: input.qty })
  return new StepResponse({ ok: true })
})

export default createWorkflow("place-order-lite", (input: { cartId: string }) => {
  // 伪代码：编排多个步骤，例如校验购物车 → 预留库存 → 创建订单 → 发起支付
  const r = reserveInventory({ variantId: "var_123", qty: 1 })
  return new WorkflowResponse({ reserved: r })
})
```

在路由中触发：
文件位置：`backend/src/api/store/custom/route.ts`
```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import placeOrderLite from "../../../workflows/place-order-lite"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await placeOrderLite(req.scope).run({
    input: { cartId: req.body.cartId },
  })
  res.json(result)
}
```

要点：
- 工作流用于“用例级”编排，跨多个模块；
- 自带事务/补偿能力，便于保证一致性与幂等；
- 可从 API 路由、计划任务、事件订阅中执行。

---

## 何时选谁（实践准则）

- 选择模块服务（领域服务）
  - 只读查询，或单一域内的简单写入；
  - 同一域的复杂筛选、分页、排序、字段选择；
  - 需要高效读性能时，优先用 `.list/.listAndCount/.retrieve` 或 `remoteQuery`。
- 选择工作流（应用服务）
  - 涉及多个模块（产品/库存/订单/支付等）的跨域流程；
  - 需要事务/补偿与幂等（例如下单、取消、退款）；
  - 需要在多个入口触发（API/Job/Subscriber）。

---

## 最佳实践清单

- 保持读写分离：`GET` 不产生副作用；写操作集中到工作流。
- 输入校验靠近边界：在路由层校验请求体与权限，工作流内专注业务步骤。
- 服务命名与职责单一：模块服务聚焦所属域，不做跨域编排。
- 远程查询优先：跨域聚合用 `remoteQuery`，只取需要的字段，避免 N+1。
- 可观测性：关键工作流记录步骤结果与错误，便于排障与补偿。

---

## 模块内的工作流（可选）

- 可以。模块可以内置并导出 Workflow（例如官方提供的 Core Flows 也是模块随包导出的）。
- 团队项目的推荐做法仍是：模块主要暴露 Service/Step，应用层 `backend/src/workflows/**` 组合成具体工作流；
  若你在做可复用的“模块包”，把 Workflow 随模块一起发布是合理的。

### 示例 1：模块内定义并导出自有 Workflow（由宿主路由触发）
文件位置：`backend/src/modules/brand/workflows/sync-brand.ts`
```ts
import { createWorkflow, createStep, WorkflowResponse, StepResponse } from "@medusajs/framework/workflows-sdk"

const upsertBrandStep = createStep(
  "brand.upsert",
  async (input: { name: string; handle: string }) => {
    // 这里通常会解析模块服务并执行业务写入/回滚（略）
    return new StepResponse({ brandId: "brand_123" })
  }
)

export const syncBrandWorkflow = createWorkflow(
  "brand.sync",
  (input: { name: string; handle: string; productIds?: string[] }) => {
    const brand = upsertBrandStep({ name: input.name, handle: input.handle })
    return new WorkflowResponse({ brand })
  }
)
```

文件位置：`backend/src/api/admin/brands/sync/route.ts`
```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { syncBrandWorkflow } from "../../../../modules/brand/workflows/sync-brand"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await syncBrandWorkflow(req.scope).run({ input: req.body })
  res.json(result)
}
```

### 示例 2：模块内 Workflow 复用官方 Core Flow
文件位置：`backend/src/modules/brand/workflows/add-bundle-to-cart.ts`
```ts
import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { addToCartWorkflow } from "@medusajs/medusa/core-flows"

type AddBundleInput = {
  cart_id: string
  items: Array<{ variant_id: string; quantity: number }>
}

export const addBrandBundleToCart = createWorkflow(
  "brand.add-bundle-to-cart",
  ({ cart_id, items }: AddBundleInput) => {
    addToCartWorkflow.runAsStep({
      input: { cart_id, items },
    })
  }
)
```

文件位置：`backend/src/api/store/cart/add-bundle/route.ts`
```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { addBrandBundleToCart } from "../../../../modules/brand/workflows/add-bundle-to-cart"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await addBrandBundleToCart(req.scope).run({ input: req.body })
  res.json(result)
}
```

---

## 延伸阅读

- 模块与 Provider 装配说明：`doc/13-Modules-and-Providers.md`
- CQRS 与复杂查询指南：`doc/06-CQRS-and-Complex-Queries.md`
- 工作流入门与路由触发示例：`backend/src/workflows/README.md`

---

## 真实场景：下单赠送积分（Loyalty Points）

> 目标：用户支付成功/订单完成后，按订单金额赠送积分；后续可用于会员等级、兑换券、下次下单抵扣等。

### 职责划分

- 领域服务（Domain Service）：积分域模块（`loyalty`）
  - 存储与暴露积分账户与流水模型；
  - 提供领域方法：`addPoints`、`revokePoints`、`getBalance` 等；
  - 不关心“何时触发”，只负责“如何计算与落账”。
- 应用服务（Application Service）：工作流（Workflow）
  - 在“订单完成/支付成功”的用例节点触发积分发放；
  - 负责跨域协调：读取订单 → 计算积分 → 写入积分域；
  - 可由订阅者（事件驱动）或结账工作流（流程内编排）触发。

### 目录位置

- 模块（领域服务）：`backend/src/modules/loyalty/**`
- 工作流（应用服务）：`backend/src/workflows/loyalty/**`
- 可选订阅者：`backend/src/subscribers/**`

### 1) 定义积分域模块（领域服务）

文件位置：`backend/src/modules/loyalty/models.ts`
```ts
import { model } from "@medusajs/framework/utils"

export const LoyaltyAccount = model.define("loyalty_account", {
  id: model.id().primaryKey(),
  customer_id: model.text().unique(),
  balance: model.number().default(0),
  created_at: model.dateTime().defaultNow(),
  updated_at: model.dateTime().defaultNow(),
})

export const LoyaltyTransaction = model.define("loyalty_transaction", {
  id: model.id().primaryKey(),
  account_id: model.text().index(),
  order_id: model.text().nullable(),
  points: model.number(),
  type: model.enum(["earn", "revoke"]),
  reason: model.text().nullable(),
  created_at: model.dateTime().defaultNow(),
})
```

文件位置：`backend/src/modules/loyalty/service.ts`
```ts
import { MedusaService } from "@medusajs/framework/utils"
import { LoyaltyAccount, LoyaltyTransaction } from "./models"

class LoyaltyModuleService extends MedusaService({
  LoyaltyAccount,
  LoyaltyTransaction,
}) {
  async addPoints(input: { customerId: string; points: number; orderId?: string; reason?: string }) {
    const { customerId, points, orderId, reason } = input

    // 查找或创建账户
    const [existing] = await this.listLoyaltyAccounts({ customer_id: customerId })
    const account =
      existing ?? (await this.createLoyaltyAccounts({ customer_id: customerId, balance: 0 }))

    // 记一条流水
    await this.createLoyaltyTransactions({
      account_id: account.id,
      order_id: orderId,
      points,
      type: "earn",
      reason,
    })

    // 更新余额
    await this.updateLoyaltyAccounts(account.id, { balance: (account.balance ?? 0) + points })

    return this.retrieveLoyaltyAccounts(account.id)
  }
}

export default LoyaltyModuleService
```

文件位置：`backend/src/modules/loyalty/index.ts`
```ts
import LoyaltyModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const LOYALTY_MODULE = "loyalty"

export default Module(LOYALTY_MODULE, {
  service: LoyaltyModuleService,
})
```

在 `backend/medusa-config.ts` 中装配模块（节选）：
```ts
modules: [
  // ... 其他模块
  { resolve: "./src/modules/loyalty" },
]
```

> 说明：`MedusaService` 会基于模型名生成 CRUD 方法（如 `listLoyaltyAccounts/createLoyaltyTransactions` 等）。实际表结构与索引可按需扩展；上线前应生成迁移并执行。

### 2) 定义应用服务工作流：按订单发放积分

文件位置：`backend/src/workflows/loyalty/award-points-on-order.ts`
```ts
import { createWorkflow, createStep, WorkflowResponse, StepResponse } from "@medusajs/framework/workflows-sdk"

// 载入订单（跨域读）
const loadOrder = createStep(
  "order.load",
  async (input: { orderId: string }, { container }) => {
    const orderModule = container.resolve("order")
    const order = await orderModule.retrieveOrder(input.orderId)
    return new StepResponse(order)
  }
)

// 计算积分（可按币种/会员等级定制）
const calcPoints = createStep(
  "loyalty.calc",
  async (input: { amount: number; currency: string }) => {
    // 假设 amount 为最小货币单位（如 cents），1 积分/1 货币单位的 1 元（示例）
    const points = Math.max(0, Math.floor(input.amount / 100))
    return new StepResponse(points)
  }
)

// 记账（写入领域服务）
const addPoints = createStep(
  "loyalty.add",
  async (input: { customerId: string; points: number; orderId: string }, { container }) => {
    const loyalty = container.resolve("loyalty")
    const account = await loyalty.addPoints({
      customerId: input.customerId,
      points: input.points,
      orderId: input.orderId,
      reason: "order.completed",
    })
    return new StepResponse(account)
  }
)

export default createWorkflow("loyalty.award-on-order", async (input: { orderId: string }) => {
  const order = await loadOrder({ orderId: input.orderId })
  const points = await calcPoints({ amount: order.total ?? 0, currency: order.currency_code })

  // 无客户或 0 积分则直接返回（早返回）
  if (!order.customer_id || !points) {
    return new WorkflowResponse({ skipped: true })
  }

  const account = await addPoints({
    customerId: order.customer_id,
    points,
    orderId: order.id,
  })

  return new WorkflowResponse({ account, points })
})
```

### 3) 触发方式 A：事件订阅（推荐生产使用）

文件位置：`backend/src/subscribers/order-completed-loyalty.ts`
```ts
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import awardOnOrder from "../workflows/loyalty/award-points-on-order"

export default async function onOrderCompleted({ event: { data }, container }: SubscriberArgs<{ id: string }>) {
  // 以“订单完成/支付成功”的事件为触发点（事件名以当前版本为准）
  await awardOnOrder(container).run({ input: { orderId: data.id } })
}

export const config: SubscriberConfig = {
  event: "order.completed", // 或支付已捕获事件名（以实际版本为准）
}
```

> 注：若团队已用官方“下单”核心工作流，可在其末尾追加 `awardOnOrder.runAsStep(...)` 达到同样效果；事件名可根据实际版本与业务偏好选择“支付捕获”或“订单完成”。

### 4) 触发方式 B：自定义结账工作流内编排（可选）

文件位置：`backend/src/workflows/checkout/place-order-with-points.ts`
```ts
import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import awardOnOrder from "../loyalty/award-points-on-order"
// import { placeOrderFromCartWorkflow } from "@medusajs/medusa/core-flows" // 视版本与命名而定

export default createWorkflow("checkout.place-order-with-points", (input: { cart_id: string }) => {
  // 伪代码：下单 → 发放积分
  // const order = placeOrderFromCartWorkflow.runAsStep({ input: { cart_id: input.cart_id } })
  // awardOnOrder.runAsStep({ input: { orderId: order.id } })
})
```

### 5) 查询用户积分（只读 API 示例）

文件位置：`backend/src/api/store/loyalty/balance/route.ts`
```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.user?.customer_id // 需保证顾客已登录
  if (!customerId) return res.status(401).json({ message: "Unauthorized" })

  const loyalty = req.scope.resolve("loyalty")
  const [account] = await loyalty.listLoyaltyAccounts({ customer_id: customerId })
  res.json({ balance: account?.balance ?? 0 })
}
```

### 小结

- **领域服务**：承载积分域的模型与方法（纯业务语义、可复用）；
- **应用服务**：在订单完成这一“用例节点”上编排跨域步骤，保证一致性与幂等；
- **触发策略**：生产建议用订阅事件或接入自有结账工作流尾部；回滚/撤销可在取消/退款事件上对称实现 `revokePoints`。