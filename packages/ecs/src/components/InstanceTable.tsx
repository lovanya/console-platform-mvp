interface Instance {
  id: string; name: string; status: string; region: string; spec: string
}

interface InstanceTableProps {
  instances: Instance[]
  onSelect?: (id: string) => void
}

export default function InstanceTable({ instances, onSelect }: InstanceTableProps) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <thead>
        <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
          <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>ID</th>
          <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>名称</th>
          <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>状态</th>
          <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>地域</th>
          <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>规格</th>
        </tr>
      </thead>
      <tbody>
        {instances.map(inst => (
          <tr
            key={inst.id}
            onClick={() => onSelect?.(inst.id)}
            style={{ borderBottom: '1px solid #f0f0f0', cursor: onSelect ? 'pointer' : undefined }}
          >
            <td style={{ padding: '12px 16px' }}>{inst.id}</td>
            <td style={{ padding: '12px 16px' }}>{inst.name}</td>
            <td style={{ padding: '12px 16px' }}>{inst.status}</td>
            <td style={{ padding: '12px 16px' }}>{inst.region}</td>
            <td style={{ padding: '12px 16px' }}>{inst.spec}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
