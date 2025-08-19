# Medusa v2 设计理念、好处、使用方法与实现方式（Tea Store 指南）

> 面向 Tea Store 项目（Medusa v2 后端 + Next.js 前端）。本文汇总 Medusa 的核心设计理念、优势、主要构件与运行机制，并给出上手路径与示例代码（含文件位置）。

---

## 1. 设计理念（Philosophy）

- 模块化与隔离（Modules & Isolation）
  - 每个模块抽象单一领域或能力（商品、库存、订单、文件等），模块彼此隔离，避免隐式耦合，可按需装配与替换。
- 依赖注入容器（Container & Scope）
  - 应用有“Medusa 容器”（框架与各模块资源），每个模块也有“模块容器”。在请求中使用 `req.scope`（请求级容器）解析依赖，保证上下文一致性与可测试性。
- CQRS（读写分离）
  - 读侧：模块服务或跨模块查询工具 `Query/remoteQuery`；写侧：工作流（Workflow）承载事务、补偿与幂等。
- 工作流即“应用服务”（Application Service）
  - 将一个业务用例拆为可回滚的步骤（Step）并编排执行，可内嵌条件、Hook、长任务（异步后台）。
- 事件驱动与可扩展（Events & Subscribers）
  - 核心流程发事件，可通过订阅者扩展行为；读模型/索引/缓存可在订阅者中异步维护。
- 配置驱动与 Provider 模式
  - 通过环境变量与 Provider 切换具体实现（例如存储、本地 → S3）。
- 薄控制器（Thin Controller）
  - API 路由只做校验、鉴权与编排调用，业务集中在服务/工作流中。

参考：
- 容器与资源：[Medusa Container、Module Container（官方）](https://docs.medusajs.com/learn/fundamentals/medusa-container/index.html.md)
- 工作流与特性：[Workflows（官方）](https://docs.medusajs.com/learn/fundamentals/workflows/index.html.md)

---

## 2. 好处（Benefits）

- 松耦合与可替换：模块隔离、Provider 可插拔。
- 一致性与可靠性：写侧以工作流承载，提供事务/补偿与幂等策略。
- 性能与可观测：读写分离、跨域查询使用 `Query/remoteQuery`，可按需引入读模型与指标。
- 安全与边界清晰：路由层完成鉴权与校验，服务/工作流聚焦业务。
- 可测试与可维护：请求级容器可注入替身；步骤化拆分更易测试与复用。

---

## 3. 核心构件（Building Blocks）

- 模块（Module）与服务（Service）：承载领域模型与方法。
- 数据模型（DML）：声明式定义表结构与关系。
- 模块链接（Module Link）与查询（Query/remoteQuery）：跨模块数据的关联与读取。
- 工作流（Workflow）与步骤（Step）：应用层用例编排，支持补偿、条件、Hook、长任务。
- 事件与订阅者（Events & Subscribers）：异步扩展与读模型维护。
- 定时任务（Scheduled Jobs）：周期性后台任务。
- API 路由（API Routes）：对外暴露能力的薄边界。

---

## 4. 使用方法（How-To）

### 4.1 创建工作流并在路由中触发

文件位置：`backend/src/workflows/hello-world.ts`
```ts
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"

export const helloWorldWorkflow = createWorkflow(
  "hello-world",
  () => new WorkflowResponse("Hello, world!")
)
```

文件位置：`backend/src/api/store/custom/route.ts`
```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { helloWorldWorkflow } from "../../../workflows/hello-world"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { result: message } = await helloWorldWorkflow(req.scope).run()
  res.json({ message })
}
```

要点：
- `req.scope` 是请求级容器，确保工作流和步骤解析到同一套依赖与上下文。
- 工作流还支持条件（when-then）、Hook、长运行（后台异步）。

### 4.2 在路由中做跨模块查询（读侧）

文件位置：`backend/src/api/store/custom/route.ts`
```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { data } = await query.graph({
    entity: "company",
    fields: ["id", "name"],
    filters: { name: "ACME" },
  })
  res.json({ companies: data })
}
```

要点：跨模块读取优先使用 `Query/remoteQuery`，只取所需字段，避免 N+1。

### 4.3 定义模块与服务（领域层）

文件位置：`backend/src/modules/blog/service.ts`
```ts
import { MedusaService } from "@medusajs/framework/utils"
import Post from "./models/post"

class BlogModuleService extends MedusaService({ Post }) {}

export default BlogModuleService
```

文件位置：`backend/src/modules/blog/index.ts`
```ts
import BlogModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const BLOG_MODULE = "blog"

export default Module(BLOG_MODULE, {
  service: BlogModuleService,
})
```

文件位置：`backend/medusa-config.ts`（片段）
```ts
modules: [
  { resolve: "./src/modules/blog" },
]
```

### 4.4 通过模块链接与跨域查询聚合数据

文件位置：`backend/src/links/product-brand.ts`
```ts
import BrandModule from "../modules/brand"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  { linkable: ProductModule.linkable.product, isList: true },
  BrandModule.linkable.brand
)
```

说明：定义链接后，可在 API 路由和工作流中用 `Query/remoteQuery` 一次性取回跨域数据。

### 4.5 用步骤化写侧保障一致性（示例）

文件位置：`backend/src/workflows/create-draft-order.ts`
```ts
import { createWorkflow, WorkflowResponse, createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

const createDraftOrderStep = createStep(
  "create-order",
  async ({}, { container }) => {
    const orderModule = container.resolve(Modules.ORDER)
    const draftOrder = await orderModule.createOrders({
      currency_code: "usd",
      items: [{ title: "Shirt", quantity: 1, unit_price: 3000 }],
      shipping_methods: [{ name: "Express shipping", amount: 3000 }],
      status: "draft",
    })
    return new StepResponse({ draftOrder }, draftOrder.id)
  },
  async (draftOrderId, { container }) => {
    if (!draftOrderId) return
    const orderModule = container.resolve(Modules.ORDER)
    await orderModule.deleteOrders([draftOrderId])
  }
)

export const createDraftOrderWorkflow = createWorkflow("create-draft-order", () => {
  const { draftOrder } = createDraftOrderStep()
  return new WorkflowResponse({ draftOrder })
})
```

---

## 5. 实现方式与运行机制（Under the Hood）

- 容器与作用域（Container & Scope）
  - Medusa 容器持有框架与已注册模块资源；模块容器持有模块内资源与部分框架资源。请求进入时构造 `req.scope`，供路由/工作流/步骤解析依赖。
- 工作流执行
  - `workflow(req.scope).run({ input })`：在请求容器内执行步骤；支持事务、补偿、条件（when-then）、Hook、长运行（后台工作流）。
- 模块隔离与链接
  - 模块数据独立存储；通过 `defineLink` 维护跨模块关联；用 `Query/remoteQuery` 基于关系图执行聚合读取。
- 事件与读模型
  - 写侧结束后发布事件；订阅者异步更新读模型/缓存/索引，查询路径直读读模型降低延迟。

---

## 6. 最佳实践（Best Practices）

- 路由薄、校验与鉴权前置；业务集中在服务/工作流。
- 读写分离：`GET` 仅查询；写操作封装为工作流。
- 跨模块读取优先 `Query/remoteQuery`，仅选择必要字段。
- 工作流提供幂等与补偿；重要步骤记录日志/指标，便于排障。
- 环境与 Provider 配置通过 `medusa-config.ts` 与环境变量管理；安全项（CORS、JWT/Cookie Secret）必须完整。

---

## 7. 常见问题（Q&A）

- 模块内部可以包含工作流吗？
  - 可以。更推荐模块提供 Service/Step，应用层在 `backend/src/workflows/**` 编排。若要发布可复用模块包，将 Workflow 与模块一起导出是合理的。
- `req.scope` 有什么用？
  - 它是请求级容器，保证工作流与步骤解析到一致的依赖（服务、查询、日志器等），同时便于事务/补偿与测试替换。

---

## 8. 参考资料（Further Reading）

- 架构概览：[Architecture（官方）](https://docs.medusajs.com/learn/introduction/architecture/index.html.md)
- 从 v1 到 v2 的变化与工作流示例：[From v1 to v2（官方）](https://docs.medusajs.com/learn/introduction/from-v1-to-v2/index.html.md)
- 容器与资源：[Medusa Container（官方）](https://docs.medusajs.com/learn/fundamentals/medusa-container/index.html.md)
- 模块与隔离：[Modules / Isolation（官方）](https://docs.medusajs.com/learn/fundamentals/modules/index.html.md)
- 模块链接与查询：[Module Links / Query（官方）](https://docs.medusajs.com/learn/fundamentals/module-links/index.html.md)
- 工作流 SDK 与核心工作流：[Workflows（官方）](https://docs.medusajs.com/learn/fundamentals/workflows/index.html.md)
