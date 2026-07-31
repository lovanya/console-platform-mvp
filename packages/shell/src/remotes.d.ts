declare module 'ecs/routes' {
  const Routes: React.ComponentType
  export default Routes
}

declare module 'common/RegionSelect' {
  interface RegionSelectProps {
    value: string
    onChange: (region: string) => void
  }
  const RegionSelect: React.FC<RegionSelectProps>
  export default RegionSelect
}

declare module 'common/PriceBadge' {
  interface PriceBadgeProps {
    originalPrice: number
    discountPrice?: number
    unit: string
  }
  const PriceBadge: React.FC<PriceBadgeProps>
  export default PriceBadge
}

declare module 'common/LoadingFallback' {
  interface LoadingFallbackProps {
    message?: string
  }
  const LoadingFallback: React.FC<LoadingFallbackProps>
  export default LoadingFallback
}

declare module 'common/Card' {
  interface CardProps {
    title?: React.ReactNode
    extra?: React.ReactNode
    children: React.ReactNode
  }
  const Card: React.FC<CardProps>
  export default Card
}

declare module 'common/Table' {
  interface Column {
    key: string
    title: React.ReactNode
    align?: 'left' | 'right' | 'center'
    width?: number | string
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
  }
  interface TableProps {
    columns: Column[]
    data: Record<string, React.ReactNode>[]
    rowKey?: string
  }
  const Table: React.FC<TableProps>
  export default Table
}

declare module 'common/AppRouter' {
  // biome-ignore lint/suspicious/noExplicitAny: dynamic imports vary in default export shape
  type Loader = () => Promise<{ default: any }>
  type RouteConfig = {
    path?: string
    index?: boolean
    component?: React.ComponentType
    loader?: Loader
    element?: React.ReactNode
    children?: RouteConfig[]
  }
  interface AppRouterProps {
    routes: RouteConfig[]
    fallback?: React.ReactNode
  }
  const AppRouter: React.FC<AppRouterProps>
  export default AppRouter
  export type { Loader, RouteConfig }
}

declare module 'billing/bootstrap' {
  interface MountProps {
    container: HTMLElement | string
    basename?: string
  }
  export function bootstrap(props: MountProps): Promise<void>
  export function mount(props: MountProps): Promise<unknown>
  export function unmount(props?: MountProps): Promise<void>
}
