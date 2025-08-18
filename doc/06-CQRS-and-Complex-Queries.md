# Medusa v2 查询与命令分离（CQRS）实践指南

> 面向 Tea Store 项目（Medusa v2 后端 + Next.js 前端）。目标：解释查询（Query）与命令（Command）的职责边界，给出复杂查询的落地方式与示例，并总结最佳实践与检查清单。

---

## 1. 核心概念

- **查询（Query）**：只读、无副作用，用于获取数据。
  - 落地点：模块服务的 `list / listAndCount / retrieve`，或跨模块的 `remoteQuery`（基于 link 关系）。
- **命令（Command）**：修改状态或触发业务流程，通常具有事务与补偿逻辑。
  - 落地点：Workflows（步骤编排 + 事务/补偿），常由 `POST/PUT/PATCH/DELETE` 路由触发。

采用 CQRS 的好处：
- 读写职责清晰，查询层可专注效率与扩展性；
- 写侧通过工作流保证一致性、幂等与补偿；
- 便于演进出读模型（物化视图/缓存/索引）以支撑复杂高频查询。

---

## 2. 在本仓库中的体现

- API 路由：`backend/src/api/**`（文件式路由）。
  - `GET` 路由用于查询（可参考占位：`backend/src/api/store/custom/route.ts`、`backend/src/api/admin/custom/route.ts`）。
- Workflows：`backend/src/workflows/**`
  - 参见 `backend/src/workflows/README.md` 获取最小工作流示例与在路由中执行的方式。
- 种子与脚本里对现有状态的读取，使用模块服务的 `list*` 方法（如 `backend/src/scripts/seed.ts` 中的 `listStores / listRegions`）。

> 约定：查询路径不产生副作用；写操作通过工作流封装并由写方法触发。

---

## 3. 复杂查询的三种方式

### 3.1 模块服务 `.list/.listAndCount`（同一模块内复杂筛选）
适用：同一域内的复杂过滤、排序、分页、选择字段/关系。

```ts
// 示例：在 GET 路由中使用产品模块进行复杂过滤 + 分页 + 字段选择
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productModule = req.scope.resolve("product")
  const q = (req.query.q as string) || undefined
  const salesChannelId = (req.query.scId as string) || undefined
  const limit = Number(req.query.limit ?? 20)
  const offset = Number(req.query.offset ?? 0)

  const [items, count] = await productModule.listAndCount(
    {
      q,
      status: ["published"],
      sales_channel_id: salesChannelId,
      // 也可按 metadata、collection、category、price_list 等过滤
    },
    {
      select: ["id", "title", "handle"],
      relations: ["variants", "variants.prices"],
      order: { created_at: "DESC" },
      skip: offset,
      take: limit,
    }
  )

  res.json({ count, items })
}
```

要点：
- 优先复用模块内置过滤与关系；
- 控制字段选择（`select`）与关系展开（`relations`）避免过量数据；
- 统一分页（`skip/take`）与排序（`order`）。

### 3.2 `remoteQuery`（跨模块聚合查询）
适用：一次性读取多个模块（如产品 + 库存 + 销售渠道）并做跨域关联的响应组装。

```ts
// 示例：产品 + 变体 + 库存层级 + 销售渠道 的一次性查询（字段结构以当前版本文档为准）
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const remoteQuery = req.scope.resolve("remoteQuery")
  const limit = Number(req.query.limit ?? 20)
  const offset = Number(req.query.offset ?? 0)

  const result = await remoteQuery({
    entryPoint: "product",
    fields: [
      "id",
      "title",
      "variants.id",
      "variants.title",
      "variants.inventory_items.id",
      "variants.inventory_items.location_levels.location_id",
      "variants.inventory_items.location_levels.stocked_quantity",
      "sales_channels.id",
      "collections.id",
    ],
    filters: {
      status: ["published"],
      q: (req.query.q as string) || undefined,
      sales_channel_id: (req.query.scId as string) || undefined,
    },
    pagination: { limit, offset },
    order: { created_at: "desc" },
  })

  res.json(result)
}
```

要点：
- `remoteQuery` 基于 Medusa 的 link/关系图，避免 N+1；
- 仅选择需要的字段，降低序列化开销；
- 复杂跨域查询优先考虑 `remoteQuery`，其次再在应用层拼接。

### 3.3 读模型与缓存（Materialized View）
适用：报表、搜索、大聚合、复杂排序且高频读取的场景。

做法：
- 写侧（Workflow）完成后发布事件；
- 订阅者异步更新读模型（自建表/索引/缓存）；
- 查询路径直接读取读模型，稳定、低延迟。

---

## 4. 命令层：Workflows（写侧）

- 将业务写操作拆为步骤（`createStep`），在 `createWorkflow` 中编排；
- 支持事务/补偿（步骤失败时回滚）；
- 由 `POST/PUT/PATCH/DELETE` 路由触发执行。

```ts
// 极简工作流（详见 backend/src/workflows/README.md）
import { createWorkflow, createStep, WorkflowResponse, StepResponse } from "@medusajs/framework/workflows-sdk"

const step1 = createStep("step-1", async () => new StepResponse("ok"))

export default createWorkflow("demo", () => {
  const s1 = step1()
  return new WorkflowResponse({ s1 })
})
```

在路由中触发：

```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import demoWorkflow from "../../workflows/demo"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await demoWorkflow(req.scope).run({ input: { /* payload */ } })
  res.json(result)
}
```

---

## 5. API 路由职责边界

- `GET`：只读；解析与校验查询参数 → 调用查询层（模块服务/remoteQuery）→ 映射输出；
- `POST/PUT/PATCH/DELETE`：写入；解析与校验请求体 → 调用 Workflow → 返回结果；
- 不在路由中编码业务模型，保持薄控制器（Thin Controller）。

---

## 6. 常见问题与性能建议

- 避免 N+1：
  - 同模块查询用 `relations` 展开；跨模块用 `remoteQuery`；
- 缩小负载：
  - 使用 `select` 精准选择字段；分页与排序必须明确；
- 高频复杂读：
  - 引入读模型（表/搜索索引/缓存）并由事件驱动维护；
- 幂等与一致性：
  - 写侧在 Workflow 里实现幂等约束与补偿逻辑；
- 安全：
  - Store/Admin 路由分别受 `STORE_CORS/ADMIN_CORS` 白名单控制；Admin 必须鉴权。

---

## 7. 实施清单（Checklist）

- [ ] 新增写操作 → 定义 Workflow + 事件；路由仅触发工作流
- [ ] 新增复杂读 → 先评估 `listAndCount`；跨域再考虑 `remoteQuery`
- [ ] 高频/聚合读 → 设计读模型并通过事件同步
- [ ] API 路由薄，参数校验与字段选择明确，分页/排序一致
- [ ] 安全与配置遵循 `medusa-config.ts`，CORS 白名单与密钥齐备

---

## 8. 参考

- Medusa Workflows 概念与用法（官方文档）
- Medusa API Routes（官方文档）
- Tea Store 仓库：`backend/src/workflows/README.md`、`backend/src/api/**`、`backend/src/scripts/seed.ts`

> 注：具体 `remoteQuery` 的字段结构与过滤参数请以当前 Medusa 版本的官方文档为准。
