# Medusa v2 与 ORM 的关系（Q&A）

## 问题

和 ORM 的关系呢？是不是利用了 ORM 去实现的？

## 回答（要点）

- 对开发者而言，不是传统“直接使用 ORM 实体/仓储”的模型。
- Medusa v2 对外暴露的是：
  - 模型 DSL（`model.define`）+ 自研 DAL（数据访问层）；
  - `MedusaService`（CRUD/领域方法）、`remoteQuery`（跨模块只读聚合）、Workflow（写侧编排与补偿）。
- 底层可能使用查询构建器/轻量映射作为实现细节，但对业务层透明；稳定接口是 Service/Workflow/remoteQuery，而非 ORM API。

### 与传统 ORM 的差异

- 关系管理：跨模块用 Module Link + link graph，而非实体导航外键；
- 跨域查询：用 `remoteQuery` 声明字段树与过滤，而非 ORM 级联加载；
- 写侧一致性：复杂写通过 Workflow 组织步骤与补偿，而非在 ORM 事务里串多模块写。

## 参考

- 解耦机制与示例：`doc/17-Module-and-DB-Decoupling.md`
