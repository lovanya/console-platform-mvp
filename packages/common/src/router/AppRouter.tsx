import { type ComponentType, createElement, lazy, type ReactNode, Suspense } from 'react'
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
 *  - `element`: arbitrary ReactNode (for Navigate, fragments, etc.)
 *  - `index`: marks this route as the index route (no path needed)
 */
export type RouteConfig = {
  path?: string
  index?: boolean
  component?: ComponentType<unknown>
  loader?: Loader
  element?: ReactNode
  children?: RouteConfig[]
}

/**
 * Pick the component to render for a route, with priority:
 *  - `element` → use as-is (for Navigate, fragments)
 *  - `loader` → React.lazy() wrap
 *  - `component` → direct usage
 *  - fallback → null
 */
function pickElement(route: RouteConfig): ReactNode {
  if (route.element !== undefined) return route.element
  if (route.loader) {
    const LoadedComponent = lazy(route.loader as Loader)
    return createElement(LoadedComponent)
  }
  if (route.component) {
    const Component = route.component
    return createElement(Component)
  }
  return null
}

function renderRoute(route: RouteConfig, key: string): ReactNode {
  const element = pickElement(route)

  if (route.index) {
    return <Route key={key} index element={element} />
  }

  if (route.children && route.children.length > 0) {
    return (
      <Route key={key} path={route.path ?? ''} element={element}>
        {route.children.map((child, i) => renderRoute(child, `${key}.${i}`))}
      </Route>
    )
  }

  return <Route key={key} path={route.path ?? ''} element={element} />
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
 *       { index: true, element: <Navigate to="/dashboard" replace /> },
 *       { path: 'dashboard', component: Dashboard },
 *       { path: 'products/:id/*', loader: () => import('ecs/routes') },
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
      <Routes>{routes.map((route, i) => renderRoute(route, `${i}`))}</Routes>
    </Suspense>
  )
}
