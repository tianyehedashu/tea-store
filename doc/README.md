# 茶叶海外站 - 文档索引

本目录收录基于当前仓库（Medusa v2 后端 `backend`，Next.js 前端 `front`）的项目文档。所有说明以简体中文撰写，站点 UI 使用英文。

## 文档列表

- [01-PRD 产品需求文档](./01-PRD.md)
- [02-Architecture 架构文档（基于当前 Medusa 项目）](./02-Architecture.md)
- [03-User-Scenarios 用户场景](./03-User-Scenarios.md)
- [04-Detailed-Design 详细设计（前后端）](./04-Detailed-Design.md)
- [05-Task-Breakdown 任务拆分与里程碑](./05-Task-Breakdown.md)
- [06-Risks-Testing 风险、测试与验收](./06-Risks-Testing.md)
- [07-Deployment-Operations 部署与运维](./07-Deployment-Operations.md)
- [08-Sanity-Integration Sanity 集成方案（已选）](./08-CMS-Integration.md)
- [09-Brand-Design-System 品牌与设计系统（Tailwind）](./09-Brand-Design-System.md)

## 参考仓库结构（关键位置）

- 后端（Medusa）：`backend`
  - 配置：`backend/medusa-config.ts`
  - 扩展点：`backend/src/modules`、`backend/src/api`、`backend/src/subscribers`、`backend/src/workflows`
  - 脚本：`backend/src/scripts/seed.ts`
- 前端（Next.js App Router）：`front`
  - SDK 配置：`front/src/lib/config.ts`
  - 路由根：`front/src/app/[countryCode]`
  - 数据访问：`front/src/lib/data/*`

> 注意：在新增功能、组件、API 前，应优先复用现有能力，避免重复定义相同功能。


