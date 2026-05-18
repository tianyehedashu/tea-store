# Medusa v2：应用服务 vs 领域服务（Q&A）

## 问题

那些属于应用服务，那些属于领域服务？以 Medusa 商城为例，给一个真实场景（如何在项目中实现）。

## 回答（要点）

- 领域服务（Domain Service）≈ 模块服务（Module Service）
  - 放在 `backend/src/modules/**`，负责所属业务域的模型与业务方法，适合同域读/写。
- 应用服务（Application Service）≈ 工作流（Workflow）
  - 放在 `backend/src/workflows/**`，负责跨模块用例编排（写侧）、幂等与补偿，可由路由/订阅者/任务触发。
- 路由层：`GET` 读侧通常直接调用模块服务；`POST/PUT/PATCH/DELETE` 写侧通过工作流执行。

### 实战示例：下单赠送积分（Loyalty Points）

- 积分域（领域服务）：在 `backend/src/modules/loyalty/**` 定义账户与流水模型，并在 `LoyaltyModuleService` 暴露 `addPoints/revokePoints/getBalance`。
- 应用服务（工作流）：`backend/src/workflows/loyalty/award-points-on-order.ts` 按订单金额计算并发放积分。
- 触发：订阅订单完成事件（`backend/src/subscribers/order-completed-loyalty.ts`）或在自定义结账工作流尾部 `runAsStep`。

## 参考

- 详细实现与代码片段：`doc/07-Domain-and-Application-Services.md`
- CQRS 与复杂查询：`doc/06-CQRS-and-Complex-Queries.md`
