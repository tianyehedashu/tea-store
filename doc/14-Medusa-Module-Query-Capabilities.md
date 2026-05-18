# Medusa 模块查询能力与实现原理（模糊/范围/分组/排序）

> 适用范围：Tea Store（Medusa v2）。本文梳理 Medusa 模块在查询维度的常见能力与边界，包含：模糊查询、范围查询、分组、排序与分页；并给出实现原理与示例代码。

---

## 1. 能力概览（结论先行）

- 模糊查询（Fuzzy / Full-Text）：
  - 支持情况：部分核心模块（如产品）支持通过 `q` 参数进行文本搜索；更高级能力（同义词、拼写纠正、权重）推荐对接搜索模块/搜索 Provider（如 MeiliSearch）。
  - 典型做法：`list/listAndCount` 的过滤对象支持 `q` 字段；或通过 `search` 模块先查 ID 再回填详情。
- 范围查询（Range）：
  - 支持：常见比较操作符（`lt/lte/gt/gte/in/between` 等）针对数值或时间字段可用，例如 `created_at`、`updated_at`、价格、库存等。
  - 典型做法：在过滤对象中对字段传入对象形式的操作符条件。
- 排序（Order）：
  - 支持：`order` 多字段排序；与分页（`skip/take`）组合使用。
- 分组/聚合（Group/Aggregation）：
  - 通用模块服务层不直接暴露通用的 `GROUP BY`/聚合 API。
  - 推荐方案：
    - 使用 `remoteQuery` 聚合跨模块数据，随后在应用层分组/统计；
    - 面向报表/大聚合场景，建设读模型（物化视图/缓存/搜索索引）并由事件驱动维护；
    - 特殊需求用自定义模块/仓储或专用分析/指标模块实现。

---

## 2. 使用示例

### 2.1 模块服务：同域复杂过滤 + 分页 + 排序

```ts
// GET /store/products?q=oolong&limit=20&offset=0
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productModule = req.scope.resolve("product")

  const q = (req.query.q as string) || undefined
  const limit = Number(req.query.limit ?? 20)
  const offset = Number(req.query.offset ?? 0)

  const [items, count] = await productModule.listAndCount(
    {
      q, // 模糊/文本搜索（模块支持时生效）
      status: ["published"],
      created_at: {
        gte: new Date("2024-01-01"), // 范围查询：时间/数值字段
        lt: new Date("2025-01-01"),
      },
      // 也可使用 in/between/metadata 字段等
    },
    {
      select: ["id", "title", "handle"],
      relations: ["variants", "variants.prices"],
      order: { created_at: "DESC", title: "ASC" }, // 多字段排序
      skip: offset,
      take: limit,
    }
  )

  res.json({ count, items })
}
```

### 2.2 `remoteQuery`：跨模块一次性读取并在应用层分组

```ts
// 示例：产品 + 变体 + 库存层级 + 销售渠道（字段名以当前版本为准）
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const data = await remoteQuery({
    entryPoint: "product",
    fields: [
      "id",
      "title",
      "variants.id",
      "variants.inventory_items.id",
      "variants.inventory_items.location_levels.location_id",
      "variants.inventory_items.location_levels.stocked_quantity",
      "sales_channels.id",
    ],
    filters: { status: ["published"], q: (req.query.q as string) || undefined },
    pagination: { limit: 50, offset: 0 },
    order: { created_at: "desc" },
  })

  // 在应用层进行分组/聚合（示意）
  const groupedByChannel = new Map<string, any[]>()
  for (const p of data) {
    for (const sc of p.sales_channels ?? []) {
      const list = groupedByChannel.get(sc.id) ?? []
      list.push(p)
      groupedByChannel.set(sc.id, list)
    }
  }

  res.json({ groups: [...groupedByChannel.entries()] })
}
```

### 2.3 搜索模块（可选）：更强的模糊检索

```ts
// 思路：
// 1) 通过搜索 Provider（如 MeiliSearch）按 q 检索获得 product_id 列表（支持同义词/拼写/权重）。
// 2) 再用模块服务 `list` 以 `id: { in: [...] }` 读取详情并完成分页/排序。
```

---

## 3. 实现原理（高层）

- 模块服务：
  - 提供强类型的过滤对象（如 `FilterableProductProps`）与查询配置（`FindConfig`）。
  - 过滤对象会被转换为底层数据访问层（DAL）的查询表达式（条件/排序/分页/关系展开），并由模块仓储执行。
  - 文本搜索：当模块支持 `q` 时，会在服务/仓储层将 `q` 映射到若干文本字段（如 `title/description/sku`），通常使用数据库的模糊匹配或专用索引；能力与性能取决于模块与底层实现。
- `remoteQuery`：
  - 基于 Medusa 的 link/关系图与字段选择，构建跨模块数据抓取计划，减少 N+1；按 `filters/pagination/order` 进行规划与合并返回。
- 搜索模块（可选）：
  - 使用搜索 Provider 维护倒排索引；写侧通过事件/同步任务更新索引；读侧以 `q` 检索 ID，再回填详情（或直接返回映射字段）。

---

## 4. 常用操作符与配置（参考）

> 实际可用操作符可能随模块略有差异，下列为常见集合：

- 等值与集合：`eq`（默认）、`in`、`ne`、`not`
- 比较：`lt`、`lte`、`gt`、`gte`、`between`
- 文本：`contains`、`starts_with`、`ends_with`（或模块自定义的 `q`）
- 空值：`is_null`
- 排序：`order: { fieldA: "ASC" | "DESC", fieldB: ... }`
- 分页：`skip/take`（偏移分页）；视需要可扩展为游标/锚点分页
- 字段与关系：`select` 精准选择字段，`relations` 控制关系展开

---

## 5. 实践建议

- 文本检索：
  - 若对相关性、容错、性能有要求，优先采用搜索模块（MeiliSearch/Elastic 等）；
  - 直接数据库 `contains/ilike` 需配合合适索引（如 trigram/GIN/Full-Text）。
- 范围与排序：
  - 为常用筛选/排序列建立索引；避免在未索引大表上做模糊匹配；
  - 始终返回稳定的排序与明确分页，避免重复/遗漏。
- 分组/聚合：
  - 报表/聚合走读模型（物化表/缓存/搜索索引）+ 事件驱动更新；
  - 轻量场景可在应用层对 `remoteQuery` 结果分组。
- 安全与一致性：
  - 查询层保持只读；写侧通过 Workflows 实现幂等约束与补偿；
  - Store/Admin 接口分别受 CORS/鉴权保护。

---

## 6. 常见问答（FAQ）

- Q：所有模块都支持 `q` 模糊搜索吗？
  - A：否。`q` 的支持与字段覆盖范围因模块而异；需要高级搜索请集成搜索模块。
- Q：模块服务是否支持 `GROUP BY`？
  - A：通用列表接口不提供聚合/分组 API；聚合建议用读模型或应用层处理。
- Q：如何保证复杂查询的性能？
  - A：精确选择字段（`select`）、控制关系展开（`relations`）、合理建索引、使用搜索 Provider、对高频复杂读采用读模型。

---

## 7. 进一步阅读

- `doc/06-CQRS-and-Complex-Queries.md`：CQRS 与复杂查询的整体实践
- Medusa 官方文档：API Routes、Workflows、Modules & Links、Search Providers

---

## 8. 前端 JS SDK 查询能力与用法

- 支持能力：

  - 通过 `@medusajs/js-sdk` 的 `sdk.client.fetch(path, { method, query, headers })` 传入查询参数，支持：
    - 模糊 `q`、范围比较（`gte/gt/lte/lt/in/between`）、排序 `order`、分页 `limit/offset`、字段选择 `fields`。
  - 资源化接口 `sdk.store.*` 提供部分资源的读写方法（如订单转移等命令型操作）。
  - 分组/聚合不直接提供，需要在前端聚合或通过后端自定义/`remoteQuery` 返回聚合结果。

- 初始化（节选自本仓库）：

```ts
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
```

- 常用查询示例：

```ts
// 模糊查询（q）
await sdk.client.fetch("/store/products", {
  method: "GET",
  query: { q: "oolong", limit: 12, offset: 0 },
})

// 范围查询（对象式 → 等价于 created_at[gte]/created_at[lt]）
await sdk.client.fetch("/store/orders", {
  method: "GET",
  query: {
    created_at: {
      gte: "2024-01-01T00:00:00.000Z",
      lt: "2025-01-01T00:00:00.000Z",
    },
  },
})

// 范围查询（括号键风格）
await sdk.client.fetch("/store/orders", {
  method: "GET",
  query: {
    "created_at[gte]": "2024-01-01T00:00:00.000Z",
    "created_at[lt]": "2025-01-01T00:00:00.000Z",
  },
})

// 排序与分页
await sdk.client.fetch("/store/orders", {
  method: "GET",
  query: { order: "-created_at", limit: 20, offset: 0 },
})

// 字段选择（缩小载荷）
await sdk.client.fetch("/store/products", {
  method: "GET",
  query: {
    fields: "id,title,handle,*variants.calculated_price",
    limit: 12,
    offset: 0,
  },
})
```

- 资源化接口（本仓库命令示例）：

```ts
// 订单转移（命令）
const { order } = await sdk.store.order.requestTransfer(
  orderId,
  {},
  { fields: "id,email" },
  headers
)
```

> 注：查询型读取在本仓库中主要采用 `sdk.client.fetch` 直接传参；如需统一封装，可在 `front/src/lib/data/*` 内抽象方法集中传入 `query` 参数。

---

## 9. 全链路示例（前端 → 后端 → 模块/remoteQuery → 前端）

### 9.1 开箱即用：内置 `/store/products` 查询

- 目标：按 `q` 模糊 + `created_at` 范围 + 排序 + 分页，前端直接通过 SDK 调用内置路由。

```ts
// front/src/lib/data/search-products.ts（示例）
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export async function searchProducts({
  q,
  start,
  end,
  order = "-created_at",
  limit = 12,
  offset = 0,
  fields = "id,title,handle,thumbnail,*variants.calculated_price",
}: {
  q?: string
  start?: string
  end?: string
  order?: string
  limit?: number
  offset?: number
  fields?: string
}): Promise<{ products: HttpTypes.StoreProduct[]; count: number }> {
  const query: Record<string, any> = { limit, offset, fields, order }
  if (q) query.q = q
  if (start || end) {
    query.created_at = {}
    if (start) query.created_at.gte = start
    if (end) query.created_at.lt = end
  }

  return sdk.client.fetch<{
    products: HttpTypes.StoreProduct[]
    count: number
  }>("/store/products", { method: "GET", query })
}
```

```ts
// 页面使用（示例）
import { searchProducts } from "@lib/data/search-products"

export default async function Page() {
  const { products } = await searchProducts({
    q: "oolong",
    start: "2024-01-01T00:00:00.000Z",
    end: "2025-01-01T00:00:00.000Z",
    order: "-created_at",
    limit: 12,
    offset: 0,
  })

  return (
    <div>
      {products.map((p) => (
        <div key={p.id}>{p.title}</div>
      ))}
    </div>
  )
}
```

- 内置路由由产品模块解析上述查询参数，并在服务层转为 DAL 条件执行，返回 `{ products, count }`。

### 9.2 可选：自定义 `/store/products/advanced` + `remoteQuery` 聚合

- 目标：一次性返回产品 + 库存层级 + 销售渠道，前端仅调用一个自定义接口。

```ts
// backend/src/api/store/products/advanced/route.ts（示例）
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const limit = Number(req.query.limit ?? 12)
  const offset = Number(req.query.offset ?? 0)

  const filters: any = { status: ["published"] }
  if (req.query.q) filters.q = req.query.q

  // 范围：支持 created_at[gte]/created_at[lt] 两种写法
  if (req.query["created_at[gte]"] || req.query["created_at[lt]"]) {
    filters.created_at = {}
    if (req.query["created_at[gte]"])
      filters.created_at.gte = req.query["created_at[gte]"]
    if (req.query["created_at[lt]"])
      filters.created_at.lt = req.query["created_at[lt]"]
  } else if (req.query.created_at) {
    filters.created_at = req.query.created_at
  }

  const order =
    req.query.order === "-created_at"
      ? { created_at: "desc" }
      : { created_at: "asc" }

  const products = await remoteQuery({
    entryPoint: "product",
    fields: [
      "id",
      "title",
      "handle",
      "thumbnail",
      "variants.id",
      "variants.title",
      "variants.inventory_items.location_levels.location_id",
      "variants.inventory_items.location_levels.stocked_quantity",
      "sales_channels.id",
      "sales_channels.name",
    ],
    filters,
    pagination: { limit, offset },
    order,
  })

  res.json({ products, count: products.length })
}
```

```ts
// 前端调用自定义接口（示例）
await sdk.client.fetch("/store/products/advanced", {
  method: "GET",
  query: {
    q: "oolong",
    "created_at[gte]": "2024-01-01T00:00:00.000Z",
    "created_at[lt]": "2025-01-01T00:00:00.000Z",
    order: "-created_at",
    limit: 12,
    offset: 0,
  },
})
```

### 9.3 cURL 快速验证

```bash
# 内置 /store/products（模糊 + 范围 + 排序 + 分页 + 字段选择）
curl -G "http://localhost:9000/store/products" \
  --data-urlencode "q=oolong" \
  --data-urlencode "created_at[gte]=2024-01-01T00:00:00.000Z" \
  --data-urlencode "created_at[lt]=2025-01-01T00:00:00.000Z" \
  --data-urlencode "order=-created_at" \
  --data-urlencode "limit=12" \
  --data-urlencode "offset=0" \
  --data-urlencode "fields=id,title,handle,thumbnail"

# 自定义 /store/products/advanced（跨模块聚合）
curl -G "http://localhost:9000/store/products/advanced" \
  --data-urlencode "q=oolong" \
  --data-urlencode "created_at[gte]=2024-01-01T00:00:00.000Z" \
  --data-urlencode "order=-created_at" \
  --data-urlencode "limit=12" \
  --data-urlencode "offset=0"
```

---

## 10. 默认接口示例（无需自定义后端）

- Products（列表 / Store）：

```ts
await sdk.client.fetch("/store/products", {
  method: "GET",
  query: {
    q: "green tea",
    limit: 12,
    offset: 0,
    order: "-created_at",
    fields: "id,title,handle,thumbnail",
  },
})
```

- Orders（列表 / Store，需要顾客登录）：

```ts
await sdk.client.fetch("/store/orders", {
  method: "GET",
  query: { limit: 10, offset: 0, order: "-created_at" },
  headers: await getAuthHeaders(),
})
```

- Collections（列表 / Store）：

```ts
await sdk.client.fetch("/store/collections", {
  method: "GET",
  query: { limit: 100, offset: 0 },
})
```

- Product Categories（列表 / Store）：

```ts
await sdk.client.fetch("/store/product-categories", {
  method: "GET",
  query: {
    fields: "*category_children,*products",
    limit: 100,
  },
})
```

- Regions（列表 / Store）：

```ts
await sdk.client.fetch("/store/regions", {
  method: "GET",
  query: { fields: "id,name,currency_code,countries" },
})
```

> 上述接口由核心模块默认提供，已支持常见查询参数（q/过滤/排序/分页/fields）。前端可直接通过 SDK 调用，无需后端自定义。
