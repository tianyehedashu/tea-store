# Medusa v2：模块（Module）与数据库对象（DB）如何解耦（Tea Store 实践）

> 面向 Tea Store（Medusa v2 后端 + Next.js 前端）。本文回答两个问题：
>
> 1. 模块与数据库对象是否解耦？2) 具体如何体现与落地？

---

## 一句话结论

- 是，Medusa v2 将模块与底层数据库实现解耦：
  - 用“模型 DSL（`model.define`）+ 通用服务基类（`MedusaService`）+ DAL（数据访问层）”屏蔽具体 SQL/驱动；
  - 模块之间不直接用外键耦合，跨模块关联通过“Module Link + `remoteQuery`”完成；
  - 读写职责清晰：模块服务提供领域内读写；跨域用例由工作流编排；
  - 模式迁移（Migration）由 CLI 根据模型定义生成/同步，模块级可演进。

---

## 为什么要解耦

- 降低耦合：模块作为“可复用能力包”，不依赖特定数据库语句或其他模块的表结构。
- 清晰边界：每个模块负责本域数据与行为，跨域通过链接与编排完成。
- 易于演进：模型变化 → 自动迁移；跨模块关系 → 通过链接图（link graph）维护。
- 可测试性：服务层以接口/容器解析，便于单测替身与集成测试。

---

## 解耦机制一览

### 1. 模型 DSL + DAL：屏蔽数据库细节

- 在模块内用 `model.define` 描述数据模型（字段、索引、默认值、枚举等）。
- 服务类继承 `MedusaService({ Models... })` 自动获得 CRUD 能力（`listX/createX/retrieveX/updateX`）。
- 业务代码面向服务（Service）编程，而非直接写 SQL。

示例（领域内模型与服务）：

```ts
// backend/src/modules/blog/models/post.ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  id: model.id().primaryKey(),
  title: model.text(),
  handle: model.text().unique(),
  published: model.boolean().default(false),
  created_at: model.dateTime().defaultNow(),
})

export default Post
```

```ts
// backend/src/modules/blog/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import Post from "./models/post"

class BlogModuleService extends MedusaService({ Post }) {
  // 领域内方法：可组合 CRUD，保持业务语义清晰
  async publish(handle: string) {
    const [post] = await this.listPosts({ handle })
    if (!post) throw new Error("post not found")
    return this.updatePosts(post.id, { published: true })
  }
}

export default BlogModuleService
```

```ts
// backend/src/modules/blog/index.ts
import BlogModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const BLOG_MODULE = "blog"

export default Module(BLOG_MODULE, {
  service: BlogModuleService,
})
```

> 迁移（Migration）来源于模型定义。运行 `npx medusa db:migrate` 会根据模块模型/链接生成或同步表结构。

### 2. Module Link：跨模块关联但不破坏隔离

- Link 用于在“不同模块的模型”之间建立关系，避免直接跨模块外键耦合。
- Link 定义存放于 `backend/src/links/**`，由 CLI 同步到数据库（通常生成一张链接表/关系）。

示例（来自本仓库的 link 范式）：

```ts
import BlogModule from "../modules/blog"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  ProductModule.linkable.product,
  BlogModule.linkable.post
)
```

随后同步数据库：

```bash
npx medusa db:migrate
```

> 含义：为产品（Product，来自核心模块）与文章（Post，自定义模块）建立链接关系。模块彼此仍保持独立；跨模块聚合依赖 link graph，而非硬编码外键。

### 3. `remoteQuery`：跨模块读取的一致入口

- 在 API/工作流中使用 `remoteQuery({ entryPoint, fields, filters, pagination, order })` 从 link graph 抓取跨模块数据。
- 仅声明所需字段，减少 N+1 与冗余载荷。

示例（API 路由端取“文章 + 关联产品”）：

```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const remoteQuery = req.scope.resolve("remoteQuery")
  const posts = await remoteQuery({
    entryPoint: "post",
    fields: [
      "id",
      "title",
      "handle",
      "products.id",
      "products.title",
      "products.thumbnail",
    ],
    filters: { published: true },
    pagination: { limit: 20, offset: 0 },
    order: { created_at: "desc" },
  })
  res.json({ posts })
}
```

> 相比直接 join，`remoteQuery` 借助 link graph 规划抓取与合并，业务层只关注字段树与筛选条件。

### 4. 依赖注入与容器解析：服务解耦于实现

- 在路由/工作流/订阅者里使用 `req.scope.resolve("<module-id>")` 获取模块主服务。
- 模块可替换为自定义实现或增加 Provider，不影响调用方。

示例（只读路由使用模块服务）：

```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const blog = req.scope.resolve("blog") // 解析 BlogModuleService
  const [items, count] = await blog.listPosts(
    { published: true },
    {
      select: ["id", "title", "handle"],
      order: { created_at: "desc" },
      take: 10,
      skip: 0,
    }
  )
  res.json({ count, items })
}
```

### 5. 写侧编排：工作流（Workflow）与补偿

- 跨模块写操作通过工作流统一编排，避免在模块内引入其他模块的写逻辑；
- 工作流的 Step 可解析多个模块服务，具备事务/补偿能力（失败回滚或对称撤销）。

示例（伪代码）：

```ts
import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"

const addFeaturedLink = createStep(
  "blog.feature-link",
  async ({ postId, productId }, { container }) => {
    // 通过 link 建立文章-产品关系（具体实现可为“写 link 表”或调用对应服务）
  }
)

export default createWorkflow(
  "blog.feature-product",
  ({ postId, productId }) => {
    addFeaturedLink({ postId, productId })
  }
)
```

---

## 端到端示例：自定义模块 + 跨模块关联 + 聚合读取

1. 定义模块与模型（见上文 Blog 示例）。

2. 建立与核心产品模块的链接：`backend/src/links/blog-post-product.ts`

```ts
import BlogModule from "../modules/blog"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  ProductModule.linkable.product,
  BlogModule.linkable.post
)
```

3. 同步数据库与模型变更：

```bash
npx medusa db:migrate
```

4. 在路由中读取跨模块数据：

```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const remoteQuery = req.scope.resolve("remoteQuery")
  const posts = await remoteQuery({
    entryPoint: "post",
    fields: ["id", "title", "products.id", "products.title"],
    filters: { published: true },
    pagination: { limit: 10, offset: 0 },
  })
  res.json({ posts })
}
```

5. 跨模块写入使用工作流（可选）：在“发布文章并关联推荐产品”用例中，将“发布文章（blog 域内写）”与“写 link（跨域）”拆成 Step，由工作流编排。

---

## 反模式与注意事项

- 不要在模块内直接写 SQL 或跨模块 join；使用 Service/DAL 与 `remoteQuery`。
- 不要在模块模型中持有对其他模块的硬外键；跨域关系交给 Module Link。
- 大聚合/报表场景：采用读模型（物化表/缓存/搜索索引）+ 事件驱动维护，避免在业务路径做重 join。
- 变更模型后务必生成/执行迁移；上线前在预生产环境验证。

---

## 与传统“实体直连数据库”的对比

- 传统：实体/仓储紧耦合某一数据库方言；跨域通过外键/join 直连，演进困难。
- Medusa v2：模型 DSL + DAL + 链接图；模块边界清晰，跨域读写有统一机制（`remoteQuery`/Workflow）。

---

## 常见问答（FAQ）

- 模块可以共用一个数据库吗？

  - 可以。模块共享同一实例（如 PostgreSQL），但通过模型 DSL 与链接机制保持逻辑隔离。

- 一定要用 Link 才能跨域读取吗？

  - 推荐。Link 让 `remoteQuery` 知道关系路径，避免在代码层硬编码关系与 join。

- 我能在模块内直接拿到另一个模块的表吗？

  - 不推荐。正确做法是：在应用层解析另一个模块的服务或使用 `remoteQuery` 按需读取。

- Link 同步如何进行？
  - 在 `backend/src/links/**` 定义 link 后，执行 `npx medusa db:migrate` 同步到数据库。

---

## 落地清单（Tea Store）

- 在 `backend/src/modules/**` 定义自有域模型与服务，避免 SQL。
- 跨模块建立关系 → `backend/src/links/**` 定义 `defineLink(...)` 并迁移。
- 只读跨域聚合 → `remoteQuery`。
- 跨域写用例 → 工作流。
- 复杂读模型/报表 → 读模型 + 事件驱动维护。

---

## 延伸阅读

- `backend/src/links/README.md`：Link 用法与示例
- `doc/13-Modules-and-Providers.md`：模块与 Provider 装配
- `doc/06-CQRS-and-Complex-Queries.md`：读写分离与复杂查询
- `doc/15-Workflows-Design-and-Guide.md`：工作流设计与最佳实践
