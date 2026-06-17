import { useState } from 'react'

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

export default function RegionSelect({ value, onChange }: RegionSelectProps) {
  const [open, setOpen] = useState(false)

  const selected = REGIONS.find(r => r.id === value)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: '6px 12px',
          border: '1px solid #d9d9d9',
          borderRadius: 6,
          background: '#fff',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        {selected ? selected.name : '选择地域'}
        <span style={{ marginLeft: 8 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            margin: '4px 0',
            padding: 0,
            listStyle: 'none',
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            zIndex: 1000,
            minWidth: 180,
          }}
        >
          {REGIONS.map(r => (
            <li
              key={r.id}
              onClick={() => {
                onChange(r.id)
                setOpen(false)
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                background: r.id === value ? '#e6f4ff' : undefined,
                fontWeight: r.id === value ? 600 : undefined,
              }}
            >
              {r.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
