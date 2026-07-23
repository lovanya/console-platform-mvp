
    export type RemoteKeys = 'ecs/routes' | 'ecs/InstanceTable';
    type PackageType<T> = T extends 'ecs/InstanceTable' ? typeof import('ecs/InstanceTable') :T extends 'ecs/routes' ? typeof import('ecs/routes') :any;