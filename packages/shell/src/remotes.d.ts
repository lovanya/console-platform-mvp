declare module 'ecs/routes' {
  const Routes: React.ComponentType
  export default Routes
}

declare module 'ecs/InstanceTable' {
  interface Instance {
    id: string; name: string; status: string; region: string; spec: string
  }
  interface InstanceTableProps {
    instances: Instance[]
    onSelect?: (id: string) => void
  }
  const InstanceTable: React.FC<InstanceTableProps>
  export default InstanceTable
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
