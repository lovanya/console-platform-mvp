const REGIONS = [
  { id: 'cn-hangzhou', name: '华东 1（杭州）' },
  { id: 'cn-shanghai', name: '华东 2（上海）' },
  { id: 'cn-beijing', name: '华北 2（北京）' },
  { id: 'cn-shenzhen', name: '华南 1（深圳）' },
  { id: 'cn-hongkong', name: '香港' },
  { id: 'us-west-1', name: '美国西部 1（硅谷）' },
]

interface RegionSelectProps {
  value: string
  onChange: (region: string) => void
}

// Pure stateless component — no React hooks needed
// This is a Type A "pure component" that only renders based on props
export default function RegionSelect({ value, onChange }: RegionSelectProps) {
  const selected = REGIONS.find(r => r.id === value)

  return (
    <div style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      <span style={{ fontSize: 13, color: '#666' }}>地域：</span>
      {REGIONS.map(r => (
        <button
          key={r.id}
          onClick={() => onChange(r.id)}
          style={{
            padding: '4px 10px',
            border: '1px solid',
            borderColor: r.id === value ? '#1677ff' : '#d9d9d9',
            borderRadius: 4,
            background: r.id === value ? '#e6f4ff' : '#fff',
            color: r.id === value ? '#1677ff' : '#333',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: r.id === value ? 600 : 400,
          }}
        >
          {r.id.replace('cn-', '')}
        </button>
      ))}
      <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>
        ({selected?.name})
      </span>
    </div>
  )
}