# Medusa v2 数据库管理与部署指南

## 📋 目录

- [概述](#概述)
- [数据库命令详解](#数据库命令详解)
- [部署流程](#部署流程)
- [环境配置](#环境配置)
- [数据库迁移](#数据库迁移)
- [种子数据管理](#种子数据管理)
- [故障排除](#故障排除)
- [最佳实践](#最佳实践)

## 概述

Medusa v2 提供了完整的数据库管理和部署工具链，支持自动化的数据库迁移、初始化和数据管理。本文档详细介绍这些功能的使用方法和最佳实践。

## 数据库命令详解

### 核心命令

#### `medusa db:setup`

**一键数据库初始化**（推荐用于新环境）

```bash
medusa db:setup
```

**功能：**

- 创建数据库（如果不存在）
- 运行所有待执行的迁移
- 同步数据库模式与应用定义的链接

**适用场景：**

- 新环境部署
- 全新数据库初始化
- 开发环境快速搭建

#### `medusa db:create`

**仅创建数据库**

```bash
medusa db:create
```

**功能：**

- 根据 `DATABASE_URL` 创建数据库
- 不执行迁移或其他操作

**适用场景：**

- 手动控制初始化流程
- 数据库服务器已存在，需要创建新的数据库

#### `medusa db:migrate`

**执行数据库迁移**

```bash
medusa db:migrate
```

**功能：**

- 执行所有待执行的迁移文件
- 更新数据库模式到最新版本

**适用场景：**

- 应用更新后的数据库升级
- 生产环境部署
- 开发环境同步最新模式

#### `medusa db:migrate:scripts`

**运行迁移脚本**

```bash
medusa db:migrate:scripts
```

**功能：**

- 执行所有模块的迁移脚本
- 用于数据迁移和转换

#### `medusa db:rollback [modules...]`

**回滚迁移**

```bash
# 回滚所有模块的最后一批迁移
medusa db:rollback

# 回滚特定模块的迁移
medusa db:rollback product inventory
```

**功能：**

- 撤销最后执行的迁移批次
- 支持指定模块回滚

**⚠️ 注意：** 生产环境谨慎使用

#### `medusa db:generate [modules...]`

**生成迁移文件**

```bash
# 为所有模块生成迁移
medusa db:generate

# 为特定模块生成迁移
medusa db:generate product
```

**功能：**

- 基于模型变更生成迁移文件
- 支持增量迁移

#### `medusa db:sync-links`

**同步数据库链接**

```bash
medusa db:sync-links
```

**功能：**

- 同步应用定义的模块间链接
- 确保关系表的一致性

### 高级命令

#### `medusa user`

**创建管理员用户**

```bash
medusa user
```

**交互式创建：**

- 邮箱地址
- 密码
- 用户角色

## 部署流程

### 🚀 新环境完整部署

#### 1. 环境准备

```bash
# 克隆项目
git clone <repository-url>
cd tea-store

# 安装依赖
cd backend
pnpm install

cd ../front
pnpm install
```

#### 2. 环境配置

创建 `backend/.env` 文件：

```env
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/tea_store"

# CORS 配置
STORE_CORS="http://localhost:3000,https://yourdomain.com"
ADMIN_CORS="http://localhost:7001,https://admin.yourdomain.com"
AUTH_CORS="http://localhost:3000,http://localhost:7001"

# 密钥配置（生产环境必须使用强密钥）
JWT_SECRET="your-super-secret-jwt-key"
COOKIE_SECRET="your-super-secret-cookie-key"

# 后端服务配置
MEDUSA_BACKEND_URL="http://localhost:9000"
```

创建 `front/.env.local` 文件：

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL="http://localhost:9000"
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY="pk_xxxxx"  # 稍后获取
```

#### 3. 数据库初始化

```bash
cd backend

# 一键初始化数据库
medusa db:setup

# 初始化种子数据
pnpm run seed

# 创建管理员用户
medusa user
```

#### 4. 启动服务

```bash
# 启动后端
cd backend
pnpm run start

# 启动前端（新终端）
cd front
pnpm run dev
```

### 🔄 生产环境部署更新

```bash
# 1. 更新代码
git pull origin main

# 2. 安装依赖
pnpm install

# 3. 构建应用
pnpm run build

# 4. 执行数据库迁移
medusa db:migrate

# 5. 重启服务
pm2 restart tea-store-backend
```

### 📦 容器化部署

#### Dockerfile 示例

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm run build

# 暴露端口
EXPOSE 9000

# 启动命令
CMD ["pnpm", "run", "start"]
```

#### Docker Compose 示例

```yaml
# docker-compose.yml
version: "3.8"

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: tea_store
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: "postgresql://postgres:password@postgres:5432/tea_store"
      JWT_SECRET: "your-jwt-secret"
      COOKIE_SECRET: "your-cookie-secret"
    depends_on:
      - postgres
    ports:
      - "9000:9000"
    command: sh -c "medusa db:setup && pnpm run seed && pnpm run start"

  frontend:
    build: ./front
    environment:
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: "http://localhost:9000"
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 环境配置

### 必需环境变量

| 变量名          | 描述             | 示例                                  |
| --------------- | ---------------- | ------------------------------------- |
| `DATABASE_URL`  | 数据库连接字符串 | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET`    | JWT 签名密钥     | `your-super-secret-jwt-key`           |
| `COOKIE_SECRET` | Cookie 签名密钥  | `your-super-secret-cookie-key`        |

### CORS 配置

| 变量名       | 描述               | 示例                                          |
| ------------ | ------------------ | --------------------------------------------- |
| `STORE_CORS` | 前端商店允许的来源 | `http://localhost:3000,https://store.com`     |
| `ADMIN_CORS` | 管理界面允许的来源 | `http://localhost:7001,https://admin.com`     |
| `AUTH_CORS`  | 认证相关允许的来源 | `http://localhost:3000,http://localhost:7001` |

### 可选配置

| 变量名               | 描述             | 默认值                   |
| -------------------- | ---------------- | ------------------------ |
| `MEDUSA_BACKEND_URL` | 后端 API 地址    | `http://localhost:9000`  |
| `REDIS_URL`          | Redis 连接字符串 | `redis://localhost:6379` |

## 数据库迁移

### 迁移文件结构

```
backend/
├── migrations/
│   ├── Migration20231201000000.ts
│   ├── Migration20231201120000.ts
│   └── ...
```

### 创建自定义迁移

1. **生成迁移文件：**

```bash
medusa db:generate
```

2. **编辑迁移文件：**

```typescript
import { Migration } from "@medusajs/medusa"

export default class Migration20231201000000 implements Migration {
  name = "Migration20231201000000"

  async up(): Promise<void> {
    // 升级逻辑
    this.addSql(`
      CREATE TABLE custom_table (
        id varchar PRIMARY KEY,
        name varchar NOT NULL,
        created_at timestamp DEFAULT now()
      );
    `)
  }

  async down(): Promise<void> {
    // 回滚逻辑
    this.addSql("DROP TABLE custom_table;")
  }
}
```

3. **执行迁移：**

```bash
medusa db:migrate
```

### 迁移最佳实践

1. **始终提供回滚逻辑**
2. **测试迁移脚本**
3. **备份生产数据库**
4. **分阶段执行大型迁移**

## 种子数据管理

### 内置种子脚本

项目包含以下种子脚本：

```bash
# 执行完整种子数据
pnpm run seed

# 清理所有数据并重新播种
pnpm run seed:fresh

# 仅清理数据
pnpm run cleanup
```

### 种子数据内容

- **区域配置**：国家、货币、税率
- **商店设置**：基础商店信息
- **产品类别**：茶叶分类
- **产品数据**：示例茶叶产品
- **库存数据**：产品库存信息
- **API 密钥**：前端访问密钥

### 自定义种子数据

编辑 `backend/src/scripts/seed.ts` 添加自定义数据：

```typescript
// 添加自定义产品类别
const customCategories = [
  {
    name: "Premium Tea",
    description: "High-quality premium tea collection",
    handle: "premium-tea",
  },
]

const categoryResult = await createProductCategoriesWorkflow(container).run({
  input: customCategories,
})
```

## 故障排除

### 常见问题

#### 1. 数据库连接失败

**症状：**

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**解决方案：**

- 检查数据库服务是否运行
- 验证 `DATABASE_URL` 配置
- 确认网络连接和防火墙设置

#### 2. 迁移执行失败

**症状：**

```
Error: relation "product" already exists
```

**解决方案：**

```bash
# 检查迁移状态
medusa db:migrate --dry-run

# 手动回滚
medusa db:rollback

# 清理并重新初始化
medusa db:setup
```

#### 3. 权限错误

**症状：**

```
Error: permission denied for database
```

**解决方案：**

- 检查数据库用户权限
- 确认用户有创建数据库的权限
- 验证连接字符串中的用户名密码

#### 4. 种子数据重复

**症状：**

```
Error: duplicate key value violates unique constraint
```

**解决方案：**

```bash
# 清理现有数据
pnpm run cleanup

# 重新播种
pnpm run seed
```

### 调试技巧

1. **启用详细日志：**

```bash
medusa db:migrate --verbose
```

2. **检查数据库状态：**

```sql
-- 查看迁移记录
SELECT * FROM medusa_migrations;

-- 查看表结构
\dt
```

3. **验证环境变量：**

```bash
echo $DATABASE_URL
```

## 最佳实践

### 开发环境

1. **使用本地数据库**
2. **定期同步最新迁移**
3. **使用种子数据进行测试**
4. **备份重要的本地数据**

```bash
# 开发环境日常流程
git pull origin main
pnpm install
medusa db:migrate
pnpm run dev
```

### 测试环境

1. **自动化部署**
2. **完整的数据重置**
3. **性能测试**

```bash
# 测试环境部署脚本
#!/bin/bash
git pull origin main
pnpm install
pnpm run build
medusa db:setup
pnpm run seed
pnpm run start
```

### 生产环境

1. **渐进式部署**
2. **数据库备份**
3. **回滚计划**
4. **监控和日志**

```bash
# 生产环境部署脚本
#!/bin/bash

# 1. 备份数据库
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. 更新代码
git pull origin main

# 3. 安装依赖
pnpm install

# 4. 构建应用
pnpm run build

# 5. 执行迁移
medusa db:migrate

# 6. 重启服务
pm2 restart tea-store-backend

# 7. 验证部署
curl -f http://localhost:9000/health || exit 1
```

### 数据安全

1. **定期备份**

```bash
# 自动备份脚本
#!/bin/bash
pg_dump $DATABASE_URL | gzip > /backups/backup_$(date +%Y%m%d).sql.gz
find /backups -name "backup_*.sql.gz" -mtime +7 -delete
```

2. **敏感信息管理**

- 使用环境变量
- 密钥轮换
- 访问控制

3. **监控**

- 数据库性能
- 迁移状态
- 错误日志

## 总结

Medusa v2 提供了强大而灵活的数据库管理工具链。正确使用这些工具可以确保：

- 🚀 **快速部署**：一键初始化新环境
- 🔄 **平滑升级**：自动化迁移管理
- 📊 **数据一致性**：种子数据和链接同步
- 🛡️ **安全可靠**：备份和回滚机制

遵循本文档的最佳实践，可以确保 Tea Store 项目在各种环境中稳定运行。
