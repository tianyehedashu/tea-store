# Medusa v2：模块与数据库对象是否解耦（Q&A）

## 问题

Medusa 中 module 和数据库对象是否实现了解耦？如何体现？

## 回答（要点）

- 是。Medusa v2 通过“模型 DSL + 自研 DAL + Service/Workflow”实现解耦：
  - 模型 DSL：`model.define` 声明模型与约束，CLI 生成/同步迁移；
  - 服务层：`MedusaService` 自动提供 CRUD，以服务方法承载领域逻辑；
  - 跨模块关系：使用 Module Link（`backend/src/links/**`）维护链接图（link graph），避免硬外键耦合；
  - 跨模块读取：用 `remoteQuery` 声明字段树与过滤，减少 N+1；
  - 跨模块写入：用 Workflow 编排步骤，具备补偿与幂等。

### 端到端路径（示意）

1. 在 `backend/src/modules/**` 定义模型与服务；
2. 在 `backend/src/links/**` 用 `defineLink(...)` 建立跨模块关联并 `npx medusa db:migrate`；
3. 读侧用 `remoteQuery` 聚合返回所需字段；
4. 写侧用 Workflow 统一编排、回滚与观测。

## 参考

- 详细说明与示例：`doc/17-Module-and-DB-Decoupling.md`
- Link 用法：`backend/src/links/README.md`
- 工作流：`doc/15-Workflows-Design-and-Guide.md`
