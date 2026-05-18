# Medusa v2 工作流：设计理念、优势、使用方法与实现

本文面向本项目的后端（Medusa v2，TypeScript）。内容涵盖工作流（Workflow）的设计理念、优势、核心 API、在本仓库中的使用方式与最佳实践，并给出与项目中现有代码的对照示例。

参考官方文档：[Workflows Fundamentals](https://docs.medusajs.com/learn/fundamentals/workflows)

## 1. 背景与设计理念

在电商域中，一个看似简单的业务动作（如下单、上架商品、创建促销）常常需要跨越多个模块与数据源：数据库写入、库存调整、价格与税费计算、异步消息、第三方系统调用等。单一事务往往无法覆盖所有步骤，失败时的回滚也不容易保证幂等与数据一致性。

Medusa v2 的工作流采用类似 Saga 的编排思想：

- 将一个业务过程拆分为有序的「步骤（Step）」；
- 每个步骤尽量保持职责单一、可重试、具备补偿（Compensation）思路；
- 通过声明式 DSL 组合步骤，形成可复用的「工作流（Workflow）」；
- 在运行时记录执行日志，必要时触发补偿逻辑以恢复一致性。

这带来以下策略性收益：

- 一致性：失败时按已执行步骤的逆序运行补偿，实现跨模块的「最终一致性」。
- 可组合：步骤与工作流均可复用、嵌套和组合，沉淀企业级流程能力。
- 可观测：工作流执行过程有明确的边界和日志，有助于排错与审计。
- 可测试：步骤是天然的单元测试单元，工作流是集成测试单元。

## 2. 核心概念与术语

- Step（步骤）：最小的业务动作，通常包含一次查询/写入/调用。以 `createStep` 声明，返回 `StepResponse`。
- Workflow（工作流）：由若干 Step 组合而成的业务流程。以 `createWorkflow` 声明，返回 `WorkflowResponse`。
- Compensation（补偿）：当工作流发生失败或显式回滚时，用于撤销已完成步骤副作用的策略。
- Scope/Container（依赖注入容器）：运行时传入的容器，可用于解析 Medusa 模块与服务。

## 3. 代码框架与核心 API

工作流 API 均来自 `@medusajs/framework/workflows-sdk`。

- `createStep(stepName, handler)`：定义步骤；`handler` 中可通过上下文解析容器、执行业务逻辑并返回 `StepResponse<T>`。
- `createWorkflow(workflowName, builder)`：定义工作流；`builder` 中以函数调用的方式编排若干步骤与子工作流，返回 `WorkflowResponse<T>`。
- `StepResponse(value)`：步骤返回值的载体；通常把后续需要用到的关键数据（如资源 ID）放入其中，便于补偿或下游步骤使用。
- `WorkflowResponse(value)`：工作流最终的聚合返回值。

目录位置约定：`backend/src/workflows/*`。

项目内已包含入门示例（节选）：

```11:52:backend/src/workflows/README.md
import {
  createStep,
  createWorkflow,
  WorkflowResponse,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"

const step1 = createStep("step-1", async () => {
  return new StepResponse(`Hello from step one!`)
})

type WorkflowInput = {
  name: string
}

const step2 = createStep(
  "step-2",
  async ({ name }: WorkflowInput) => {
    return new StepResponse(`Hello ${name} from step two!`)
  }
)

type WorkflowOutput = {
  message1: string
  message2: string
}

const helloWorldWorkflow = createWorkflow(
  "hello-world",
  (input: WorkflowInput) => {
    const greeting1 = step1()
    const greeting2 = step2(input)

    return new WorkflowResponse({
      message1: greeting1,
      message2: greeting2
    })
  }
)

export default helloWorldWorkflow
```

> 注：上例展示了如何声明 Step 与 Workflow 以及在工作流中组合步骤并汇总返回值。

## 4. 使用方法（在项目中的落地）

### 4.1 定义步骤与工作流

1. 在 `backend/src/workflows` 下新建文件，例如 `place-order.ts`。
2. 使用 `createStep` 把动作（如创建订单、预留库存、发送通知）拆分为多个步骤；
3. 使用 `createWorkflow` 进行编排，按依赖顺序组织步骤，最终 `return new WorkflowResponse(...)` 聚合返回值。

建议：

- 每个 Step 尽量只做一件事，输入/输出类型明确；
- 把后续会用到的关键 ID 放入 `StepResponse`；
- 如涉及外部系统或可能失败的副作用，提前设计补偿策略（见 5.2）。

### 4.2 调用与执行

工作流可在 API 路由、计划任务（Scheduled Jobs）或订阅者（Subscribers）中触发执行。

API 路由中的执行示例（节选）：

```61:81:backend/src/workflows/README.md
import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import myWorkflow from "../../../workflows/hello-world"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { result } = await myWorkflow(req.scope)
    .run({
      input: {
        name: req.query.name as string,
      },
    })

  res.send(result)
}
```

脚本/批处理中的执行示例（项目内已在多处调用官方核心 Flow）：

```1:26:backend/src/scripts/create-api-key.ts
import {
  createApiKeysWorkflow,
  linkSalesChannelsToApiKeyWorkflow
} from "@medusajs/medusa/core-flows";

export default async function createApiKey({ container }: ExecArgs) {
  // 创建 API Key
  const { result: apiKeyResult } = await createApiKeysWorkflow(container).run({
    input: { api_keys: [{ title: "Frontend Store", type: "publishable", created_by: "admin" }] },
  });

  // 关联销售渠道
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: apiKeyResult[0].id, add: [/* salesChannelId */] },
  });
}
```

项目的 `seed.ts` 同样大量使用了 `@medusajs/medusa/core-flows` 中的内置工作流完成开箱数据初始化、关联与清理（如 `createRegionsWorkflow`、`createProductsWorkflow`、`deleteProductsWorkflow` 等）。这说明：

- 你可以直接复用官方内置工作流；
- 也可以用同样的方式定义并执行自定义工作流，统一开发体验。

## 5. 进阶主题

### 5.1 组合与复用

- 工作流可以调用其他工作流；
- 步骤之间通过返回值传递必要信息；
- 通过把通用动作沉淀为步骤或子工作流，提升复用度，避免重复实现。

### 5.2 补偿（Compensation）与幂等

工作流的可靠性来自「失败即补偿」的约束。设计要点：

- 先设计正向流程，再逐步为关键步骤提供补偿策略；
- 补偿应「尽力而为」，以恢复到可接受的一致状态（如删除新建资源、释放库存等）；
- 尽量让步骤的副作用具备幂等特性（重复调用不会产生额外副作用）；
- 把补偿所需的关键标识（如资源 ID）通过 `StepResponse` 向外传递，避免再查找。

示意（简化示例，仅展示思路）：

```ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const createEntity = createStep(
  "create-entity",
  async (input, { container }) => {
    const svc = container.resolve("someService")
    const created = await svc.create(input)
    // 将补偿所需的 ID 放入返回值
    return new StepResponse({ id: created.id })
  }
  // 补偿策略可基于上一步返回值设计（伪代码，具体请参考官方文档的补偿用法）
)
```

> 补偿的具体写法以官方文档为准。核心原则是：为可能失败且有副作用的步骤设计对称的回滚策略。

### 5.3 依赖与并行（原则）

- 构建工作流时，以数据依赖关系来组织步骤顺序；
- 没有依赖关系的步骤可以并行化（具体以官方文档支持的编排能力为准）；
- 避免在步骤中做长时间阻塞的同步调用，合理拆分与异步化。

### 5.4 依赖注入与模块协作

- 在步骤中通过 `container` 解析 Medusa 的模块或服务（本项目多处使用 `Modules.*` 常量解析模块）；
- 与模块保持 API 一致性，避免绕过模块私有实现直接访问数据库。

### 5.5 可观测性与调试

- 为步骤与工作流使用清晰、可搜索的名称；
- 通过日志与执行状态定位失败点；
- 将关键业务指标（如订单号、资源 ID）写入日志便于排查。

## 6. 最佳实践清单

- 命名清晰：步骤用动词短语，工作流用业务结果短语；
- 纯度优先：把复杂副作用隔离到步骤边界，核心逻辑尽量纯函数；
- 小步快跑：把长流程拆小，复用率更高、补偿更易写；
- 一致接口：优先复用 `@medusajs/medusa/core-flows` 与项目内已存在步骤/工作流；
- 类型到位：为输入输出显式标注类型，避免 `any`；
- 失败即补偿：设计对称的补偿逻辑，保持幂等；
- 可测试：为关键步骤写单测，为工作流写集成测试；
- 可配置：把可变参数收敛到输入对象与配置项，便于扩展。

## 7. 常见问题（FAQ）

- 工作流和「模块/服务」是什么关系？
  - 模块/服务提供原子能力（读写/业务规则），工作流编排这些能力形成完整业务过程。
- 必须使用工作流吗？
  - 简单的、单步骤的 API 可以直接调用模块服务；涉及多个副作用、需要回滚/审计/复用的流程，建议使用工作流。
- 可以在前端使用工作流吗？
  - 工作流是后端能力；前端通过 API 触发后端工作流。

## 8. 参考与延伸阅读

- 官方文档：
  - [Workflows Fundamentals](https://docs.medusajs.com/learn/fundamentals/workflows)
  - [Scheduled Jobs](https://docs.medusajs.com/learn/fundamentals/scheduled-jobs)
- 本项目相关文件：
  - `backend/src/workflows/README.md`
  - `backend/src/scripts/seed.ts`
  - `backend/src/scripts/create-api-key.ts`

---

如需把新工作流集成到系统，请将文件放在 `backend/src/workflows/*`，并在 API 路由、计划任务或订阅者中以 `myWorkflow(req.scope).run({ input })` 的方式调用。遵循本文最佳实践与项目「复用优先」的约定进行实现。

## 9. 业务实例一：上架新品（Publish New Tea Product）

以「茶叶上新」为例，我们围绕项目中已使用的 `@medusajs/medusa/core-flows` 实现一个从「确保分类存在」到「创建产品与变体」再到「为库位生成库存记录」的完整工作流。示例尽量贴近 `backend/src/scripts/seed.ts` 的真实做法，便于迁移到生产逻辑。

### 9.1 工作流输入/输出

- 输入（可按需裁剪）：
  - `title`：商品标题
  - `description`：描述
  - `category`：所属分类（如 `"Green Tea"`）
  - `images`：图片文件名数组（位于后端静态目录 `/static` 下，如 `longjing-1.jpg`）
  - `variants`：变体清单（包含 `sku`、价格、选项等）
  - `stockLocationId`：要建立库存的库位 ID
- 输出：
  - `productId`：新建商品 ID

### 9.2 示例代码（可直接放入 `backend/src/workflows/publish-tea-product.ts`）

```ts
import {
  createStep,
  createWorkflow,
  WorkflowResponse,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows"

type VariantInput = {
  title: string
  sku: string
  options?: { Size?: string }
  prices: Array<{ amount: number; currency_code: string }>
}

type PublishTeaProductInput = {
  title: string
  description?: string
  handle?: string
  category: string
  images?: string[] // 文件名，如 longjing-1.jpg
  variants: VariantInput[]
  stockLocationId: string
}

type PublishTeaProductOutput = {
  productId: string
}

const ensureCategoryStep = createStep(
  "ensure-category",
  async (input: PublishTeaProductInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: existing } = await query.graph({
      entity: "product_category",
      fields: ["id", "name"],
      filters: { name: input.category },
    })

    if (existing && existing.length) {
      return new StepResponse({ categoryId: existing[0].id })
    }

    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: [{ name: input.category, is_active: true }],
      },
    })

    return new StepResponse({ categoryId: result[0].id })
  }
)

const createProductStep = createStep(
  "create-product",
  async (
    input: PublishTeaProductInput & { categoryId: string },
    { container }
  ) => {
    // 将静态文件名映射为可访问 URL（基于后端静态目录 /static）
    const backendBase =
      process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    const toUrl = (name: string) => `${backendBase}/static/${name}`

    const productPayload = {
      title: input.title,
      description: input.description,
      handle: input.handle,
      status: ProductStatus.PUBLISHED,
      category_ids: [input.categoryId],
      images: (input.images || []).map((n) => ({ url: toUrl(n) })),
      options: [
        {
          title: "Size",
          values: Array.from(
            new Set(input.variants.map((v) => v.options?.Size || "Default"))
          ),
        },
      ],
      variants: input.variants.map((v) => ({
        title: v.title,
        sku: v.sku,
        options: v.options || {},
        prices: v.prices,
      })),
    }

    const { result } = await createProductsWorkflow(container).run({
      input: { products: [productPayload] },
    })

    return new StepResponse({ productId: result[0].id })
  }
)

const createInventoryLevelsStep = createStep(
  "create-inventory-levels",
  async (
    input: { productId: string; stockLocationId: string },
    { container }
  ) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    // 查询刚创建商品下各变体对应的 inventory_item
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "variants.id", "variants.inventory_items.id"],
      filters: { id: input.productId },
    })

    const inventoryItemIds: string[] = []
    for (const v of products?.[0]?.variants || []) {
      for (const inv of v.inventory_items || []) {
        if (inv?.id) inventoryItemIds.push(inv.id)
      }
    }

    if (!inventoryItemIds.length) {
      return new StepResponse({ created: 0 })
    }

    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: inventoryItemIds.map((id) => ({
          inventory_item_id: id,
          location_id: input.stockLocationId,
          stocked_quantity: 1000,
        })),
      },
    })

    return new StepResponse({ created: inventoryItemIds.length })
  }
)

const publishTeaProductWorkflow = createWorkflow(
  "publish-tea-product",
  (
    input: PublishTeaProductInput
  ): WorkflowResponse<PublishTeaProductOutput> => {
    const { categoryId } = ensureCategoryStep(input)
    const { productId } = createProductStep({ ...input, categoryId })
    createInventoryLevelsStep({
      productId,
      stockLocationId: input.stockLocationId,
    })

    return new WorkflowResponse({ productId })
  }
)

export default publishTeaProductWorkflow
```

### 9.3 在 API 中调用

```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import publishTeaProductWorkflow from "../../../workflows/publish-tea-product"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await publishTeaProductWorkflow(req.scope).run({
    input: req.body,
  })

  res.json(result)
}
```

> 该示例真实复用了项目 `seed.ts` 中的核心 Flow：`createProductCategoriesWorkflow`、`createProductsWorkflow`、`createInventoryLevelsWorkflow`，同时展示了如何通过图查询 `query.graph` 获取 `inventory_item`，并在指定库位上初始化库存。

## 10. 业务实例二：下单流程（Place Order）

下单往往涉及跨模块的多步动作：校验购物车、预留库存/扣减、计算金额、授权支付、创建订单、发送通知等。这里给出一个「面向业务、通俗清晰」的工作流骨架，便于你按项目模块 API 细化实现。

> 说明：不同项目对模块 API 的封装不同，以下示例在步骤内的服务调用以「伪代码」示意，请结合 `Modules.*` 对应服务实际方法补全；补偿策略按你的支付与库存策略实现。

### 10.1 输入/输出

- 输入：`{ cartId, customerId, paymentMethod }`
- 输出：`{ orderId }`

### 10.2 工作流步骤设计

```ts
import {
  createStep,
  createWorkflow,
  WorkflowResponse,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

type PlaceOrderInput = {
  cartId: string
  customerId: string
  paymentMethod: string // e.g. "pp_system_default" 或三方支付标识
}

type PlaceOrderOutput = { orderId: string }

type ValidCart = { cart: any }
type InventoryReservation = { reservationIds: string[] }
type PaymentAuthorization = { authorizationId: string }

const validateCartStep = createStep(
  "validate-cart",
  async ({ cartId, customerId }: PlaceOrderInput, { container }) => {
    const cartService = container.resolve(Modules.CART) // 伪代码：获取购物车服务
    const cart = await cartService.retrieveCart(cartId)

    if (!cart || cart.customer_id !== customerId || !cart.items?.length) {
      throw new Error("Cart invalid or empty")
    }
    return new StepResponse<ValidCart>({ cart })
  }
)

const reserveInventoryStep = createStep(
  "reserve-inventory",
  async ({ cart }: ValidCart, { container }) => {
    const inventoryService = container.resolve(Modules.INVENTORY) // 伪代码
    const reservations = await inventoryService.reserveForCart(cart)
    // 返回预留记录用于后续发货或补偿释放
    return new StepResponse<InventoryReservation>({
      reservationIds: reservations.map((r: any) => r.id),
    })
  }
  // 补偿思路：如果后续失败，按 reservationIds 释放库存
)

const authorizePaymentStep = createStep(
  "authorize-payment",
  async (
    { cart, paymentMethod }: ValidCart & { paymentMethod: string },
    { container }
  ) => {
    const paymentService = container.resolve(Modules.PAYMENT) // 伪代码
    const authorization = await paymentService.authorize(cart, paymentMethod)
    return new StepResponse<PaymentAuthorization>({
      authorizationId: authorization.id,
    })
  }
  // 补偿思路：失败或回滚则 void/refund 掉 authorization
)

const createOrderStep = createStep(
  "create-order",
  async (
    { cart, authorizationId }: ValidCart & PaymentAuthorization,
    { container }
  ) => {
    const orderService = container.resolve(Modules.ORDER) // 伪代码
    const order = await orderService.createFromCart({
      cart,
      payment_authorization_id: authorizationId,
    })
    return new StepResponse<{ orderId: string }>({ orderId: order.id })
  }
  // 补偿思路：如已创建订单但后续失败，可取消订单并触发退款/释放库存
)

const placeOrderWorkflow = createWorkflow(
  "place-order",
  (input: PlaceOrderInput): WorkflowResponse<PlaceOrderOutput> => {
    const valid = validateCartStep(input)
    const reservations = reserveInventoryStep(valid)
    const payment = authorizePaymentStep({
      ...valid,
      paymentMethod: input.paymentMethod,
    })
    const order = createOrderStep({ ...valid, ...payment })

    return new WorkflowResponse({ orderId: order.orderId })
  }
)

export default placeOrderWorkflow
```

### 10.3 在 API 中调用

```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import placeOrderWorkflow from "../../../workflows/place-order"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await placeOrderWorkflow(req.scope).run({
    input: req.body,
  })
  res.json(result)
}
```

### 10.4 说明与落地建议

- 校验环节尽量早失败，减少下游副作用成本；
- 预留库存与支付授权均应具备补偿逻辑；
- 订单创建后根据业务需要触发异步步骤（发票、邮件、履约等）——可在订单创建成功后发送事件或继续在工作流中追加步骤；
- 对于「超卖」或价格变动等边界情况，校验时应二次确认库存与价格。

## 11. Medusa 工作流是如何运作的（内部机制简述）

> 本节总结 Medusa v2 `@medusajs/framework/workflows-sdk` 在运行时的通用模式，帮助你理解“为什么这样写会工作”。

- 工作流 DSL 与 DAG：

  - `createStep(name, handler)` 用于声明原子步骤；`createWorkflow(name, builder)` 在 `builder` 中以“函数调用”的方式串联步骤；
  - 每次在 `builder` 里调用步骤函数（如 `const a = stepA(input)`）会在内部构建一条节点依赖边，形成一个隐式 DAG（数据依赖图）；
  - 返回 `WorkflowResponse({ ... })` 时，SDK 聚合各节点的 `StepResponse` 结果为最终输出。

- 依赖注入与作用域（scope）：

  - 通过 `myWorkflow(scope).run({ input })` 执行工作流；`scope` 是请求/任务上下文容器，SDK 将其注入到步骤的 `handler` 第二个参数中；
  - 步骤可通过 `container.resolve(Modules.XYZ)` 或 `ContainerRegistrationKeys.*` 解析出模块与服务，保证与应用主容器一致。

- 输入、输出与上下文传递：

  - 步骤 `handler` 的返回值用 `new StepResponse(data)` 包裹；
  - 在 `builder` 中，步骤的调用返回值可作为下游步骤的输入一部分，如：`const { id } = createA(input); createB({ aId: id })`；
  - 最终 `WorkflowResponse` 用于聚合与返回请求侧真正需要的字段。

- 失败与补偿的理念：

  - 工作流强调“失败即补偿”的思路，步骤应尽量为有副作用的动作设计对应的回滚策略（如释放库存、作废支付授权、删除刚创建的资源）；
  - 关键标识（资源 ID、预留记录 ID 等）应通过 `StepResponse` 向后传递，便于在补偿中使用；
  - 具体补偿 API/写法以官方文档与所用模块的接口为准，项目落地时需要一一对齐。

- 并行与执行顺序：

  - SDK 会按照数据依赖顺序组织步骤；
  - 没有依赖关系的步骤可在 `builder` 内按并行策略组织（以官方支持为准），以加速整体执行；
  - 若存在“先聚合再下游”的需求，可通过一个“聚合步骤”整合并行结果后继续。

- 与 core-flows 的关系：
  - `@medusajs/medusa/core-flows` 提供了内置的、覆盖典型电商场景的工作流（如 `createProductsWorkflow`、`createRegionsWorkflow`、`deleteProductsWorkflow` 等）；
  - 在自定义工作流中直接复用这些内置 flow，可显著减少你需要实现与维护的代码量；
  - 本项目的 `seed.ts` 与示例工作流即采用了“自定义流程 + 复用核心 flow”的组合方式。
