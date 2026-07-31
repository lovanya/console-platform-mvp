// Module declarations for MF remotes (common package)
declare module 'common/components' {
  interface RegionSelectProps {
    value: string
    onChange: (region: string) => void
  }
  const RegionSelect: React.FC<RegionSelectProps>
  const PriceBadge: React.FC<{
    originalPrice: number
    discountPrice?: number
    unit: string
  }>
  interface LoadingFallbackProps {
    message?: string
  }
  const LoadingFallback: React.FC<LoadingFallbackProps>
  interface CardProps {
    title?: React.ReactNode
    extra?: React.ReactNode
    children: React.ReactNode
  }
  const Card: React.FC<CardProps>
  interface TableColumn {
    key: string
    title: React.ReactNode
    align?: 'left' | 'right' | 'center'
    width?: number | string
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
  }
  interface TableProps {
    columns: TableColumn[]
    data: Record<string, React.ReactNode>[]
    rowKey?: string
  }
  const Table: React.FC<TableProps>
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
  const AppRouter: (props: AppRouterProps) => React.ReactElement

  export type { Loader, RouteConfig }
  export { AppRouter, Card, LoadingFallback, PriceBadge, RegionSelect, Table }
}
