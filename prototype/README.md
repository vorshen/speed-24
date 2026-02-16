# Design New Template

基于 Rspack 的多页面应用（MPA）React 项目脚手架，支持自动识别 pages 目录、资源内联、JSON 文件支持，以及 React JSX source 调试支持。

## 特性

- ✅ **多页面应用（MPA）**：自动识别 `src/pages/` 目录下的页面，为每个页面生成独立的 HTML 文件
- ✅ **资源内联**：生产环境下自动将 JS/CSS 内联到 HTML 中（保留 template.html 中的 CDN 链接）
- ✅ **JSON 内联**：生产环境下自动将 JSON 数据文件（blueprint.json、store.json、theme.json）内联到 HTML 中，无需额外的网络请求
- ✅ **JSON 支持**：支持直接导入 JSON 文件
- ✅ **JSX Source 属性**：生产环境强制保留 `__source` 属性，便于调试
- ✅ **TypeScript**：完整的 TypeScript 支持
- ✅ **Tailwind CSS**：内置 Tailwind CSS 配置
- ✅ **Blueprint 协议**：基于 Blueprint State Machine 的协议层

## 项目结构

```
workspace/
├── src/
│   ├── data/
│   │   ├── blueprint.json      # 状态机定义
│   │   ├── store.json          # 业务数据
│   │   └── theme.json          # 视觉样式配置
│   ├── core/
│   │   ├── app.ts              # 共享协议层
│   │   └── page-entry.ts       # 页面入口（自动处理渲染逻辑）
│   ├── components/             # 公共组件
│   │   └── Header.tsx
│   ├── pages/                  # MPA 应用页面
│   │   ├── home.tsx            # 首页
│   │   ├── detail.tsx          # 详情页
│   │   └── profile.tsx         # 个人资料页
│   └── template.html           # HTML 模板
├── dist/                       # 构建输出目录
├── package.json
├── tsconfig.json
├── rspack.config.ts           # Rspack 构建配置
├── tailwind.config.ts
└── postcss.config.js
```

## 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
```

开发服务器将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建结果将输出到 `dist/` 目录。每个页面都会生成对应的 HTML 文件，并且所有资源都会内联到 HTML 中（除了 template.html 中定义的 CDN 链接）。

### 预览构建结果

```bash
npm run preview
```

## 添加新页面

1. 在 `src/pages/` 目录下创建新的 `.tsx` 文件，例如 `about.tsx`
2. 构建工具会自动识别并生成对应的 `about.html`
3. **页面文件只需导出 default 组件**，渲染逻辑和协议层加载已由脚手架自动处理

示例：

```tsx
import React from 'react';
import { Header } from '../components/Header';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="About" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">About Page</h1>
      </main>
    </div>
  );
};

export default About;
```

**重要说明：**
- ✅ **只需导出 default 组件**：页面文件只需要导出 React 组件作为 default export
- ✅ **自动处理渲染**：脚手架会自动使用 React 18 的 `createRoot` API 渲染组件
- ✅ **自动加载协议层**：`core/app.ts` 会自动导入，无需手动引入
- ❌ **不需要**：手动导入 `../core/app`
- ❌ **不需要**：手动实现 `createRoot` 和渲染逻辑
- ❌ **不需要**：手动重写 `window.App.renderCurrentPage`

## 核心协议层

项目使用 Blueprint State Machine 协议层，通过 `window.App` 全局对象访问：

- `App.blueprint` - 状态机定义
- `App.store` - 业务数据
- `App.theme` - 主题配置
- `App.currentState` - 当前状态
- `App.initPage(pageName)` - 初始化页面
- `App.transitionTo(stateId)` - 状态转换
- `App.goBack()` - 返回导航

## 配置说明

### JSX Source 属性

生产环境强制保留 `__source` 属性，通过配置 `rspack.config.ts` 中的 `swc-loader` 实现：

```typescript
{
  loader: 'builtin:swc-loader',
  options: {
    jsc: {
      transform: {
        react: {
          development: true, // 生产环境也保留 __source
          refresh: false,    // 不使用热更新
        },
      },
    },
  },
}
```

### 资源内联

生产环境下，所有 JS、CSS 和 JSON 文件会自动内联到 HTML 中，但会保留 template.html 中定义的 CDN 链接（如 React、Tailwind CSS 等）。

**内联内容：**
- **JS 文件**：所有打包的 JavaScript 代码内联到 HTML
- **CSS 文件**：所有样式文件内联到 HTML
- **JSON 数据**：`src/data/` 目录下的 JSON 文件（blueprint.json、store.json、theme.json）会作为 `window.__INLINE_DATA__` 对象内联到 HTML 中

**使用内联数据：**

代码会自动优先使用内联数据（生产环境），如果没有则回退到 fetch（开发环境）：

```typescript
// 自动检测并使用内联数据
if (window.__INLINE_DATA__) {
  window.App.blueprint = window.__INLINE_DATA__.blueprint;
  window.App.store = window.__INLINE_DATA__.store;
  window.App.theme = window.__INLINE_DATA__.theme;
}
```

## 技术栈

- **构建工具**：Rspack
- **框架**：React 18
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **协议**：Blueprint State Machine

## 注意事项

1. **资源内联**：生产环境会自动内联资源，开发环境保持外部引用以便调试
2. **JSX Source 属性**：生产环境保留 `__source` 属性会增加打包体积，但便于调试
3. **页面路由**：每个页面都是独立的 HTML 文件，通过 URL 参数传递状态信息
4. **数据加载**：页面数据通过 JSON 文件加载，支持在构建时配置

## License

MIT
