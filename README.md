# Console Platform MVP

基于 MF 2.0 统一加载层、三级模块分级的云控制台前端架构验证项目。

## 架构

```
shell (Webpack 5 + MF 2.0)   ← Host 基座
  ├── common (Vite + MF)     ← Type A: 纯组件
  └── ecs (Vite + MF)        ← Type B: 产品页面集
```

## 启动

```bash
pnpm install
pnpm dev:common    # 启动 Type A 组件 remote (port 3002)
pnpm dev:ecs       # 启动 Type B 产品 remote (port 3001)
pnpm dev:shell     # 启动基座应用 (port 3000)
```

访问 http://localhost:3000

## 模块类型

| 类型 | 说明 | 示例 |
|------|------|------|
| Type A | 纯组件，props in/events out | RegionSelect, PriceBadge |
| Type B | 产品页面集，内部路由 | ECS 实例列表/详情 |
| Type C | 独立子应用，独立生命周期 | (预留) |
