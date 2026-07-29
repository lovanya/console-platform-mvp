import { type ComponentType, lazy, type ReactNode, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

/**
 * A loader function that returns a dynamic import.
 * The AppRouter auto-wraps this with React.lazy().
 */
// biome-ignore lint/suspicious/noExplicitAny: dynamic imports vary in their default export shape
export type Loader = () => Promise<{ default: any }>

/**
 * A route can use either:
 *  - `component`: a direct React component
 *  - `loader`: a function returning a dynamic import (auto lazy-loaded)
 */
export type RouteConfig = {
  path: string
  component?: ComponentType<unknown>
  loader?: Loader
  children?: RouteConfig[]
}

/**
 * Pick the appropriate component source:
 *  - `loader` → React.lazy() wrap
 *  - `component` → direct usage
 */
function pickComponent(route: RouteConfig): ComponentType<unknown> | null {
  if (route.loader) {
    return lazy(route.loader)
  }
  return route.component ?? null
}

/**
 * Recursively render a route config into React Router elements.
 */
function renderRoute(route: RouteConfig, key: string): ReactNode {
  const Component = pickComponent(route)

  if (route.children && route.children.length > 0) {
    return (
      <Route key={key} path={route.path} element={Component ? <Component /> : null}>
        {route.children.map((child, i) => renderRoute(child, `${key}.${i}`))}
      </Route>
    )
  }

  return <Route key={key} path={route.path} element={Component ? <Component /> : null} />
}

export interface AppRouterProps {
  routes: RouteConfig[]
  fallback?: ReactNode
}

/**
 * Config-driven router with built-in lazy loading.
 *
 * Usage:
 * ```tsx
 * const routes: RouteConfig[] = [
 *   {
 *     path: '/',
 *     component: ShellLayout,
 *     children: [
 *       { path: '', component: Dashboard },
 *       { path: 'products/:productId/*', loader: () => import('ecs/routes') },
 *       { path: 'billing/*', component: BillingSlot },
 *     ],
 *   },
 * ]
 *
 * <AppRouter routes={routes} fallback={<Loading />} />
 * ```
 */
export function AppRouter({ routes, fallback }: AppRouterProps) {
  return (
    <Suspense fallback={fallback ?? <div style={{ padding: 24, color: '#999' }}>加载中...</div>}>
      <Routes>{routes.map((route, i) => renderRoute(route, String(i)))}</Routes>
    </Suspense>
  )
}
