# 部署与运维建议

## 1. 环境与依赖
- Node.js 20+；Medusa（后端）+ PostgreSQL；Next.js（前端）+ Tailwind；Sanity（SaaS）。
- 前端环境变量：`MEDUSA_BACKEND_URL`、`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`、`SANITY_PROJECT_ID`、`SANITY_DATASET`、`SANITY_API_READ_TOKEN`、`SANITY_STUDIO_URL`。
- 后端环境变量：`DATABASE_URL`、`MEDUSA_*`、`STRIPE_*`/`PAYPAL_*`、`CORS_ORIGIN`。

## 2. 构建与发布
- 后端：`yarn build && medusa start` 或容器化；健康检查与自动重启。
- 前端：Next.js 构建，部署到 Vercel/容器；Edge 中间件处理 `countryCode`；Tailwind 按需构建。

## 3. 数据与迁移
- 模块引入后执行迁移；数据库备份：每日全量、每小时增量、7–14 天保留；备份加密。

## 4. 监控与告警
- 前端：性能（LCP/INP/CLS）、错误上报；
- 后端：请求耗时/错误率、支付失败率、库存预警；
- Sanity：Webhook 成功率、再验证延迟、读取错误率；

## 5. 安全与合规
- Token 与密钥管理（仅服务端）；最小权限；
- Webhook 路由签名校验与来源白名单；
- CORS 白名单与管理端访问限制；日志脱敏；

## 6. 再验证与缓存
- 配置 `/api/revalidate` 保护：签名校验、速率限制、可观测；
- 精准失效 `origins/*`、`guides/*` 与首页推荐区域；
- 观察缓存命中率与时延，调整 ISR 窗口；

## 7. 发布与回滚
- 蓝绿/影子发布；失败回滚到上一个稳定版本；
- 发布前检查：迁移、种子脚本、环境与密钥；
- 灰度开关：支付与新模块可配置禁用。
