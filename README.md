# Flow 24

Flow 24 是一个从 Web 原型到 React Native 业务实现的双轨项目仓库，核心目标是将原型中的状态流、参数语义和视觉风格，稳定地迁移到可持续演进的生产代码。

## 项目结构

```text
flow-24/
├── prototype/   # Web 原型（Rspack + React + TypeScript）
├── business/    # 业务实现（Expo SDK 54 + React Native + TypeScript）
└── AGENT.md     # 原型 -> 生产实现的语义迁移规范
```

- `prototype/`：作为语义输入源，包含页面流、交互与视觉设计基线。
- `business/`：生产导向实现，使用 React Native 复现并固化核心业务语义。
- `AGENT.md`：定义迁移时必须保持的行为一致性（状态机、参数合并、回退语义、Token 驱动样式等）。

## 核心语义约束

当前实现围绕以下语义保持一致：

- 明确状态流：`home -> difficulty -> game`
- 参数合并策略：`finalParams = defaults + runtimeOverrides`
- 回退行为：使用真实栈式历史 `goBack()`
- 分层边界：flow/data/theme 解耦，不在 UI 层硬编码业务常量

## 技术栈

### Prototype（Web）

- React 18
- TypeScript
- Rspack
- Tailwind CSS
- Framer Motion

### Business（Mobile）

- React Native
- Expo SDK 54
- TypeScript

## 快速开始

> 本仓库目前不是 monorepo workspace，请分别在子目录中安装和启动。

### 1) 运行 Web 原型

```bash
cd prototype
pnpm install
pnpm dev
```

- 默认开发地址：`http://localhost:3000`
- 构建命令：`pnpm build`
- 预览命令：`pnpm preview`

### 2) 运行 React Native 业务实现

```bash
cd business
pnpm install
pnpm start
```

随后使用 Expo Go 扫码预览，也可使用：

- `pnpm android`
- `pnpm ios`
- `pnpm web`

## 目录说明

### `prototype/`

- `src/pages/`：原型页面（home/difficulty/game）
- `src/data/`：语义参考数据（`blueprint.json`、`store.json`、`theme.json`）
- `design-specs/`：产品与视觉规范（含 Digital Zen 风格定义）

### `business/`

- `src/domain/flow-registry.ts`：状态流定义
- `src/core/navigation.ts`：状态创建、参数解析与跳转策略
- `src/domain/game-config.ts`：本地仓储实现（后续可替换为后端适配器）
- `src/domain/theme-tokens.ts`：主题 Token 与视觉语义映射
- `src/screens/`：业务页面实现

## 开发建议

- 变更业务流程时，先对齐 `prototype` 语义，再修改 `business`。
- 新增状态时，同时补充状态定义、参数默认值与回退路径。
- 保持 Token 驱动样式，避免关键视觉常量散落在组件中。
- 若后续接入后端，优先替换仓储/适配器边界，避免重写页面逻辑。

## 参考文档

- `AGENT.md`
- `prototype/README.md`
- `business/README.md`

