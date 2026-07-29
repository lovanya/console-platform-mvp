declare module 'ecs/routes' {
  const Routes: React.ComponentType
  export default Routes
}

declare module 'ecs/InstanceTable' {
  interface Instance {
    id: string
    name: string
    status: string
    region: string
    spec: string
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

declare module 'billing/bootstrap' {
  interface MountProps {
    container: HTMLElement | string
    basename?: string
  }
  export function bootstrap(props: MountProps): Promise<void>
  export function mount(props: MountProps): Promise<unknown>
  export function unmount(props?: MountProps): Promise<void>
}
