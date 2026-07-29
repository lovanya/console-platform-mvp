// Module declarations for MF remotes (common package)
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
    data: Record<string, unknown>[]
    rowKey?: string
  }
  const Table: React.FC<TableProps>
  export default Table
}
