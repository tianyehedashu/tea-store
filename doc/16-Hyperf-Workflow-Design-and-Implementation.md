# 在 Hyperf 中实现 Medusa 风格工作流：架构设计与参考实现

本文给出在 PHP/Hyperf 框架中实现 Medusa v2 风格工作流（Workflow/Saga）的完整思路与示例代码，涵盖设计理念、数据模型、运行时编排、补偿策略、并行化、可观测性、测试与落地集成。目标是落地一个可在生产演进的轻量工作流引擎。

## 1. 目标与原则

- 贴合业务：支持电商典型流程（上架新品、下单、退款/取消、履约等）。
- 可恢复：进程故障/重启后可基于日志恢复并继续执行或补偿。
- 幂等性：步骤具备幂等或可补偿，避免重复副作用。
- 可组合：步骤可复用，工作流可嵌套或并行执行子流程。
- 可观测：全链路日志与追踪，便于排错与审计。
- 无侵入：作为库接入 Hyperf，通过容器解析业务服务。

## 2. 核心概念

- Step（步骤）：最小业务动作，执行副作用并返回 `StepResult`；可选定义对称补偿。
- Workflow（工作流）：由多个 Step 编排的流程，负责顺序/并行、聚合返回值与补偿执行。
- Context（上下文）：封装容器、日志、实例 ID、元数据等。
- Saga Log（执行日志）：持久化工作流与步骤的状态变化，用于恢复与审计。
- Outbox（事件外盒）：将对外发布的事件先写本地表，异步可靠发布。

## 3. 数据模型与迁移（建议）

最小化三张表，按需扩展：

- `workflow_instances`：一条工作流的执行实例
  - `id` (uuid)、`name`、`status` (PENDING/RUNNING/FAILED/COMPENSATING/COMPENSATED/COMPLETED)、`input_json`、`output_json`、`error`、`started_at`、`finished_at`
- `workflow_step_logs`：步骤级别日志
  - `id`、`instance_id`、`step_name`、`status` (PENDING/RUNNING/SUCCEEDED/FAILED/COMPENSATED)、`attempt`、`input_json`、`output_json`、`error`、`started_at`、`finished_at`
- `workflow_outbox`（可选）：对外事件外盒
  - `id`、`instance_id`、`event_type`、`payload_json`、`status` (PENDING/PUBLISHED/FAILED) 、`last_error`、`created_at`、`published_at`

示例迁移（伪代码，按 Hyperf/Migration 改写）：

```sql
CREATE TABLE workflow_instances (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  status VARCHAR(32) NOT NULL,
  input_json JSON NULL,
  output_json JSON NULL,
  error TEXT NULL,
  started_at DATETIME NULL,
  finished_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE workflow_step_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  instance_id CHAR(36) NOT NULL,
  step_name VARCHAR(191) NOT NULL,
  status VARCHAR(32) NOT NULL,
  attempt INT NOT NULL DEFAULT 1,
  input_json JSON NULL,
  output_json JSON NULL,
  error TEXT NULL,
  started_at DATETIME NULL,
  finished_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_instance_step (instance_id, step_name)
);

CREATE TABLE workflow_outbox (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  instance_id CHAR(36) NOT NULL,
  event_type VARCHAR(191) NOT NULL,
  payload_json JSON NOT NULL,
  status VARCHAR(32) NOT NULL,
  last_error TEXT NULL,
  created_at DATETIME NOT NULL,
  published_at DATETIME NULL,
  INDEX idx_status (status)
);
```

## 4. 接口与类设计（核心）

### 4.1 基础类型

```php
<?php

namespace App\Workflow;

use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;

final class WorkflowContext
{
    public function __construct(
        public string $instanceId,
        public ContainerInterface $container,
        public LoggerInterface $logger,
        public array $metadata = []
    ) {}
}

final class StepResult
{
    public function __construct(public array $data = []) {}

    public function get(string $key, mixed $default = null): mixed
    {
        return $this->data[$key] ?? $default;
    }
}
```

### 4.2 Step 与补偿

```php
<?php

namespace App\Workflow;

interface StepInterface
{
    public function name(): string;

    /**
     * 执行正向逻辑；异常将触发补偿流程。
     */
    public function execute(WorkflowContext $ctx, array $input): StepResult;

    /**
     * 对称补偿，可不实现（空实现即跳过）。
     */
    public function compensate(WorkflowContext $ctx, StepResult $result): void;
}

final class ClosureStep implements StepInterface
{
    public function __construct(
        private string $name,
        private \Closure $execute,
        private ?\Closure $compensate = null
    ) {}

    public function name(): string { return $this->name; }

    public function execute(WorkflowContext $ctx, array $input): StepResult
    {
        $fn = $this->execute; return $fn($ctx, $input);
    }

    public function compensate(WorkflowContext $ctx, StepResult $result): void
    {
        if ($this->compensate) { ($this->compensate)($ctx, $result); }
    }
}
```

### 4.3 工作流定义与并行编排

```php
<?php

namespace App\Workflow;

final class ParallelGroup
{
    /** @param StepInterface[] $steps */
    public function __construct(public array $steps) {}
}

final class WorkflowDefinition
{
    /** @param array<int, StepInterface|ParallelGroup> $plan */
    public function __construct(public string $name, public array $plan) {}
}

final class WorkflowBuilder
{
    /** @var array<int, StepInterface|ParallelGroup> */
    private array $plan = [];

    public function step(StepInterface $step): self
    {
        $this->plan[] = $step; return $this;
    }

    public function parallel(StepInterface ...$steps): self
    {
        $this->plan[] = new ParallelGroup($steps); return $this;
    }

    public function build(string $name): WorkflowDefinition
    {
        return new WorkflowDefinition($name, $this->plan);
    }
}
```

### 4.4 Runner（执行器，含日志与补偿）

```php
<?php

namespace App\Workflow;

use App\Workflow\Persistence\WorkflowRepositoryInterface;
use Ramsey\Uuid\Uuid;
use Swoole\Coroutine;
use Swoole\Coroutine\WaitGroup;

final class WorkflowRunner
{
    public function __construct(private WorkflowRepositoryInterface $repo) {}

    /**
     * 运行工作流：顺序 + 并行；失败触发逆序补偿。
     */
    public function run(WorkflowDefinition $def, array $input, \Psr\Container\ContainerInterface $container, \Psr\Log\LoggerInterface $logger): array
    {
        $instanceId = Uuid::uuid4()->toString();
        $ctx = new WorkflowContext($instanceId, $container, $logger);

        $this->repo->begin($instanceId, $def->name, $input);

        $executed = []; // 已成功步骤，用于补偿
        try {
            $currentInput = $input;
            foreach ($def->plan as $node) {
                if ($node instanceof ParallelGroup) {
                    $results = $this->runParallelGroup($ctx, $node, $currentInput);
                    $executed = array_merge($executed, $results["executed"]);
                    // 默认并行不产生聚合输入，如需聚合可在并行后接聚合 Step
                } else {
                    $res = $this->runStep($ctx, $node, $currentInput);
                    $executed[] = [$node, $res];
                    // 将关键输出合并进输入，便于下游使用
                    $currentInput = array_merge($currentInput, $res->data);
                }
            }

            $this->repo->finish($instanceId, status: 'COMPLETED', output: $currentInput);
            return $currentInput;
        } catch (\Throwable $e) {
            $logger->error("Workflow failed: {$e->getMessage()}", ['instanceId' => $instanceId]);
            $this->repo->markFailed($instanceId, $e);
            $this->compensate($ctx, $executed);
            $this->repo->finish($instanceId, status: 'COMPENSATED');
            throw $e; // 也可选择吞错并返回失败结果
        }
    }

    private function runStep(WorkflowContext $ctx, StepInterface $step, array $input): StepResult
    {
        $this->repo->stepBegin($ctx->instanceId, $step->name(), $input);
        try {
            $res = $step->execute($ctx, $input);
            $this->repo->stepSucceed($ctx->instanceId, $step->name(), $res->data);
            return $res;
        } catch (\Throwable $e) {
            $this->repo->stepFail($ctx->instanceId, $step->name(), $e);
            throw $e;
        }
    }

    /**
     * 使用协程并行执行一组互不依赖的步骤。
     */
    private function runParallelGroup(WorkflowContext $ctx, ParallelGroup $group, array $input): array
    {
        $wg = new WaitGroup();
        $wg->add(count($group->steps));
        $executed = [];
        $error = null;

        foreach ($group->steps as $step) {
            Coroutine::create(function () use ($ctx, $step, $input, &$executed, &$error, $wg) {
                try {
                    $res = $this->runStep($ctx, $step, $input);
                    $executed[] = [$step, $res];
                } catch (\Throwable $e) {
                    $error = $e;
                } finally {
                    $wg->done();
                }
            });
        }

        $wg->wait();
        if ($error) {
            throw $error;
        }
        return ["executed" => $executed];
    }

    private function compensate(WorkflowContext $ctx, array $executed): void
    {
        // 逆序补偿
        for ($i = count($executed) - 1; $i >= 0; $i--) {
            /** @var StepInterface $step */
            /** @var StepResult $res */
            [$step, $res] = $executed[$i];
            try {
                $this->repo->stepCompensateBegin($ctx->instanceId, $step->name());
                $step->compensate($ctx, $res);
                $this->repo->stepCompensateSucceed($ctx->instanceId, $step->name());
            } catch (\Throwable $e) {
                $ctx->logger->warning('Compensation failed', ['step' => $step->name(), 'error' => $e->getMessage()]);
                $this->repo->stepCompensateFail($ctx->instanceId, $step->name(), $e);
                // 视需求决定是否中断补偿或继续
            }
        }
    }
}
```

### 4.5 持久化接口（示意）

```php
<?php

namespace App\Workflow\Persistence;

interface WorkflowRepositoryInterface
{
    public function begin(string $instanceId, string $name, array $input): void;
    public function finish(string $instanceId, string $status, array $output = []): void;
    public function markFailed(string $instanceId, \Throwable $e): void;

    public function stepBegin(string $instanceId, string $stepName, array $input): void;
    public function stepSucceed(string $instanceId, string $stepName, array $output): void;
    public function stepFail(string $instanceId, string $stepName, \Throwable $e): void;

    public function stepCompensateBegin(string $instanceId, string $stepName): void;
    public function stepCompensateSucceed(string $instanceId, string $stepName): void;
    public function stepCompensateFail(string $instanceId, string $stepName, \Throwable $e): void;
}
```

> 实现可基于 Hyperf ORM/QueryBuilder；`input/output` 建议统一为 JSON 存储；异常记录 `message + trace`。

## 5. 幂等性与恢复

- 步骤幂等：为关键资源写入增加业务幂等键（如自然主键/唯一索引），重复调用保持相同结果。
- 步骤短事务：每个步骤内部自行开启/提交本地事务，避免长事务跨越多个步骤。
- 恢复：`runner.resume($instanceId)` 读取日志，定位最后一个成功步骤，继续执行后续步骤或触发补偿。
- 步骤去重：基于 `(instance_id, step_name, attempt)` 或业务幂等键避免重复副作用。

## 6. 并行与分支

- 无依赖的步骤可通过 `ParallelGroup` 使用 Swoole 协程并行，提高吞吐。
- 聚合：并行结束后，可追加一个聚合 Step 汇总结果，形成下游输入。
- 资源注意：并行步骤内使用各自的 DB 事务；合理设置连接池与并发限制。

## 7. 事件与 Outbox

- 步骤内对外发布事件改为写入 `workflow_outbox`；
- 独立发布器（Hyperf Crontab/AsyncQueue/Kafka Consumer）定期扫描 `PENDING` 并发布，成功标为 `PUBLISHED`，失败回写 `last_error` 重试；
- 保证“写入业务+写入外盒”同事务，避免丢事件。

## 8. 可观测性

- 统一使用 `LoggerInterface` 记录 `instanceId`、`stepName`、耗时与关键业务指标；
- 接入 OpenTelemetry（Hyperf Tracer）埋点 `workflow.instance`、`workflow.step`；
- 暴露 `/admin/workflows/:id` 查询实例状态与步骤日志（后续可做）。

## 9. 业务示例一：上架新品（Publish Tea Product）

以“确保分类存在 → 创建商品与变体 → 为库位建立初始库存”为例。下述代码演示如何在 Workflow 中编排领域服务（接口名称按你的系统适配）。

```php
<?php

use App\Workflow\{WorkflowBuilder, ClosureStep, StepResult, WorkflowRunner};
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;

$ensureCategory = new ClosureStep(
    'ensure-category',
    function($ctx, array $input) {
        $categoryService = $ctx->container->get(\App\Domain\CategoryService::class);
        $category = $categoryService->findByName($input['category']);
        if (! $category) {
            $category = $categoryService->create(['name' => $input['category'], 'is_active' => true]);
            // 可选：补偿删除该分类（仅当是本次创建的）
            return new StepResult(['categoryId' => $category->id, 'categoryCreated' => true]);
        }
        return new StepResult(['categoryId' => $category->id, 'categoryCreated' => false]);
    },
    function($ctx, StepResult $res) {
        if ($res->get('categoryCreated')) {
            $categoryService = $ctx->container->get(\App\Domain\CategoryService::class);
            $categoryService->deleteById($res->get('categoryId'));
        }
    }
);

$createProduct = new ClosureStep(
    'create-product',
    function($ctx, array $input) {
        $productService = $ctx->container->get(\App\Domain\ProductService::class);
        $backendBase = getenv('BACKEND_URL') ?: 'http://localhost:9000';
        $images = array_map(fn($n) => ['url' => $backendBase . '/static/' . $n], $input['images'] ?? []);

        $product = $productService->create([
            'title' => $input['title'],
            'description' => $input['description'] ?? null,
            'handle' => $input['handle'] ?? null,
            'status' => 'published',
            'category_ids' => [$input['categoryId']],
            'images' => $images,
            'options' => [['title' => 'Size', 'values' => array_values(array_unique(array_map(fn($v) => $v['options']['Size'] ?? 'Default', $input['variants'] ?? []))))]],
            'variants' => $input['variants'] ?? [],
        ]);

        return new StepResult(['productId' => $product->id]);
    },
    function($ctx, StepResult $res) {
        $productService = $ctx->container->get(\App\Domain\ProductService::class);
        $productService->deleteById($res->get('productId'));
    }
);

$createInventoryLevels = new ClosureStep(
    'create-inventory-levels',
    function($ctx, array $input) {
        $inventoryService = $ctx->container->get(\App\Domain\InventoryService::class);
        $variantItems = $inventoryService->listInventoryItemsByProductId($input['productId']);
        foreach ($variantItems as $item) {
            $inventoryService->ensureLevel([
                'inventory_item_id' => $item->id,
                'location_id' => $input['stockLocationId'],
                'stocked_quantity' => 1000,
            ]);
        }
        return new StepResult(['levelsCreated' => count($variantItems)]);
    },
    function($ctx, StepResult $res) {
        // 可选：回滚库存初始化（根据你的库存策略）
    }
);

$definition = (new WorkflowBuilder())
    ->step($ensureCategory)
    ->step($createProduct)
    ->step($createInventoryLevels)
    ->build('publish-tea-product');

// Controller 中：
// $result = $runner->run($definition, $request->all(), $container, $logger);
```

## 10. 业务示例二：下单流程（Place Order）

包含：校验购物车 → 预留库存 → 支付授权 → 创建订单（含补偿思路）。

```php
<?php

use App\Workflow\{WorkflowBuilder, ClosureStep, StepResult};

$validateCart = new ClosureStep(
    'validate-cart',
    function($ctx, array $input) {
        $cartService = $ctx->container->get(\App\Domain\CartService::class);
        $cart = $cartService->retrieve($input['cartId']);
        if (! $cart || $cart->customer_id !== $input['customerId'] || empty($cart->items)) {
            throw new \RuntimeException('Cart invalid or empty');
        }
        return new StepResult(['cart' => $cart]);
    }
);

$reserveInventory = new ClosureStep(
    'reserve-inventory',
    function($ctx, array $input) {
        $inventoryService = $ctx->container->get(\App\Domain\InventoryService::class);
        $reservations = $inventoryService->reserveForCart($input['cart']);
        return new StepResult(['reservationIds' => array_map(fn($r) => $r->id, $reservations)]);
    },
    function($ctx, StepResult $res) {
        $inventoryService = $ctx->container->get(\App\Domain\InventoryService::class);
        $inventoryService->releaseReservations($res->get('reservationIds', []));
    }
);

$authorizePayment = new ClosureStep(
    'authorize-payment',
    function($ctx, array $input) {
        $paymentService = $ctx->container->get(\App\Domain\PaymentService::class);
        $auth = $paymentService->authorize($input['cart'], $input['paymentMethod']);
        return new StepResult(['authorizationId' => $auth->id]);
    },
    function($ctx, StepResult $res) {
        $paymentService = $ctx->container->get(\App\Domain\PaymentService::class);
        $paymentService->voidOrRefund($res->get('authorizationId'));
    }
);

$createOrder = new ClosureStep(
    'create-order',
    function($ctx, array $input) {
        $orderService = $ctx->container->get(\App\Domain\OrderService::class);
        $order = $orderService->createFromCart($input['cart'], $input['authorizationId']);
        return new StepResult(['orderId' => $order->id]);
    },
    function($ctx, StepResult $res) {
        $orderService = $ctx->container->get(\App\Domain\OrderService::class);
        $orderService->cancel($res->get('orderId'));
    }
);

$placeOrder = (new WorkflowBuilder())
    ->step($validateCart)
    ->step($reserveInventory)
    ->step($authorizePayment)
    ->step($createOrder)
    ->build('place-order');
```

## 11. 在 Hyperf 中集成

- 依赖注入：在 `config/autoload/dependencies.php` 注册 `WorkflowRunner` 与 `WorkflowRepositoryInterface` 实现。
- 路由与控制器：

```php
// config/routes.php
use Hyperf\HttpServer\Router\Router;
Router::post('/api/workflows/publish-tea-product', [\App\Controller\WorkflowController::class, 'publishTeaProduct']);
Router::post('/api/workflows/place-order', [\App\Controller\WorkflowController::class, 'placeOrder']);
```

```php
<?php

namespace App\Controller;

use App\Workflow\{WorkflowRunner};
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;
use Hyperf\Di\Annotation\Inject;

class WorkflowController extends AbstractController
{
    public function __construct(
        private WorkflowRunner $runner,
        private ContainerInterface $container,
        private LoggerInterface $logger
    ) {}

    public function publishTeaProduct() {
        $input = $this->request->all();
        $definition = (new \App\Workflows\PublishTeaProductFactory())->definition(); // 将示例封装为工厂
        $result = $this->runner->run($definition, $input, $this->container, $this->logger);
        return $this->response->json($result);
    }
}
```

- 并行依赖：启用 Swoole 协程（Hyperf 默认支持），确保数据库连接池与并发限制配置合理。
- 事件与外盒：基于 Hyperf AsyncQueue/Kafka/Redis Stream 实现发布器消费 `workflow_outbox`。

## 12. 测试策略

- 步骤单测：为每个 Step 编写单元测试，覆盖正常/异常与补偿路径。
- 工作流集测：构建端到端测试，模拟整体成功、部分失败与补偿、恢复继续执行。
- 并行与资源：压测并行组，验证连接池、事务隔离与死锁重试策略。

## 13. 常见问题（FAQ）

- 必须全量实现补偿吗？
  - 建议为影响外部状态（支付、库存、消息）的步骤优先实现补偿；对幂等可重试的读操作可不必补偿。
- 如何选择事务边界？
  - 采用“步骤内短事务 + Saga 最终一致性”；避免跨步骤长事务。
- 如果补偿失败怎么办？
  - 记录失败并告警，保留人工介入能力；视需要引入「反向重试」任务。
- 如何恢复中断的工作流？
  - 通过实例 ID 读取 `workflow_step_logs`，从最后成功步骤继续；需在 Runner 提供 `resume()` API。

## 14. 最小原型落地清单

- [ ] 三张表迁移：实例、步骤日志、外盒
- [ ] Repository 接口 + ORM 实现
- [ ] 基础类型：`WorkflowContext`、`StepResult`
- [ ] 编排：`StepInterface`、`ClosureStep`、`WorkflowBuilder`、`ParallelGroup`
- [ ] 执行器：`WorkflowRunner`（顺序/并行、日志、补偿、错误处理）
- [ ] 示例：`PublishTeaProduct`、`PlaceOrder`
- [ ] 控制器/路由接入 + 配置
- [ ] Outbox 发布器/消费者 + 监控

---

以上方案在 Hyperf 中实现 Medusa 风格工作流，具备可恢复、可补偿与可观测特性。你可以先落地“最小原型落地清单”，随后迭代补充并行聚合、可视化追踪、后台检索与人工干预工具等能力。
