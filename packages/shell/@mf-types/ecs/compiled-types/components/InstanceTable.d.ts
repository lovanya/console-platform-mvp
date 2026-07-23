interface Instance {
    id: string;
    name: string;
    status: string;
    region: string;
    spec: string;
}
interface InstanceTableProps {
    instances: Instance[];
    onSelect?: (id: string) => void;
}
export default function InstanceTable({ instances, onSelect }: InstanceTableProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=InstanceTable.d.ts.map