
    export type RemoteKeys = 'common/RegionSelect' | 'common/PriceBadge';
    type PackageType<T> = T extends 'common/PriceBadge' ? typeof import('common/PriceBadge') :T extends 'common/RegionSelect' ? typeof import('common/RegionSelect') :any;