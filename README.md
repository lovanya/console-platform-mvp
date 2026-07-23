# Console Platform MVP

基于 MF 2.0 统一加载层、三级模块分级的云控制台前端架构验证项目。

## 架构（混合 bundler 验证）

```
Shell:    Rspack 1.x + @module-federation/enhanced (port 3000)
common:   Vite + @module-federation/vite (port 3002)    [Type A: 纯组件]
ecs:      Webpack 5 + @module-federation/enhanced (port 3001) [Type B: 产品页面集]
```

**验证目标**：Rspack 基座能否同时加载 Vite 和 Webpack 两种不同 bundler 的远程模块。

## 启动

```bash
pnpm install
pnpm dev:common    # Type A Vite remote (port 3002)
pnpm dev:ecs       # Type B Webpack remote (port 3001)
pnpm dev:shell     # Rspack 基座应用 (port 3000)
```

或并行启动：

```bash
pnpm dev
```

访问 http://localhost:3000

## 关键设计

| 角色 | 技术栈 | 理由 |
|------|--------|------|
| 基座 (Shell) | Rspack 1.x | 大型基座构建速度 5-10x 优于 Webpack |
| Type A (common) | Vite | 纯组件开发体验最好，HMR < 1s |
| Type B (ecs) | Webpack 5 | 模拟存量项目的实际情况，验证兼容性 |

所有远程模块使用同一个 `@module-federation/enhanced@2.5.x` runtime，确保跨 bundler 兼容。

## 模块类型

| 类型 | 说明 | 示例 |
|------|------|------|
| Type A | 纯组件，props in/events out | RegionSelect, PriceBadge |
| Type B | 产品页面集合，内部路由 | ECS 实例列表/详情 |

## 关键技术点

- **shared singleton**：React/React-DOM/React-Router-DOM 在所有端单例
- **varFilename**：Vite 远程模块输出 `remoteEntry.var.js` 兼容 var 格式，让 Webpack/Rspack 基座能正常加载
- **公共包**：`@console/shared` 提供 EventBus 和跨包类型定义