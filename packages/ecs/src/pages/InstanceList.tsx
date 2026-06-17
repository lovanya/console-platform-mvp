import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Instance {
  id: string
  name: string
  status: 'Running' | 'Stopped' | 'Starting'
  region: string
  spec: string
  createTime: string
}

const MOCK_DATA: Instance[] = [
  { id: 'i-2ze3x5y7', name: 'web-server-01', status: 'Running', region: 'cn-hangzhou', spec: 'ecs.g7.xlarge', createTime: '2025-01-15 10:30:00' },
  { id: 'i-2ze9a1b2', name: 'web-server-02', status: 'Running', region: 'cn-hangzhou', spec: 'ecs.g7.xlarge', createTime: '2025-01-15 10:30:00' },
  { id: 'i-2ze4c6d8', name: 'db-master-01', status: 'Running', region: 'cn-shanghai', spec: 'ecs.r7.xlarge', createTime: '2025-02-20 14:00:00' },
  { id: 'i-2ze7e0f1', name: 'db-slave-01', status: 'Stopped', region: 'cn-shanghai', spec: 'ecs.r7.xlarge', createTime: '2025-02-20 14:00:00' },
  { id: 'i-2ze1g2h3', name: 'redis-cache-01', status: 'Running', region: 'cn-beijing', spec: 'ecs.g6.large', createTime: '2025-03-10 09:00:00' },
]

export default function InstanceList() {
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setInstances(MOCK_DATA)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <div style={{ padding: 24, color: '#999' }}>加载中...</div>

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>ECS 实例</h2>
        <button style={{ padding: '8px 16px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          创建实例
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
            <th style={thStyle}>实例 ID / 名称</th>
            <th style={thStyle}>状态</th>
            <th style={thStyle}>地域</th>
            <th style={thStyle}>规格</th>
            <th style={thStyle}>创建时间</th>
            <th style={thStyle}>操作</th>
          </tr>
        </thead>
        <tbody>
          {instances.map(inst => (
            <tr key={inst.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={tdStyle}>
                <Link to={`/products/ecs/instances/${inst.id}`} style={{ color: '#1677ff', textDecoration: 'none' }}>
                  {inst.name}
                </Link>
                <div style={{ fontSize: 12, color: '#999' }}>{inst.id}</div>
              </td>
              <td style={tdStyle}>
                <StatusBadge status={inst.status} />
              </td>
              <td style={tdStyle}>{inst.region}</td>
              <td style={tdStyle}>{inst.spec}</td>
              <td style={tdStyle}>{inst.createTime}</td>
              <td style={tdStyle}>
                <button style={linkStyle}>启动</button>
                <button style={linkStyle}>停止</button>
                <button style={linkStyle}>重启</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status }: { status: Instance['status'] }) {
  const colorMap = { Running: '#52c41a', Stopped: '#999', Starting: '#faad14' }
  return (
    <span style={{ color: colorMap[status], fontWeight: 500 }}>
      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: colorMap[status], marginRight: 6 }} />
      {status}
    </span>
  )
}

const thStyle: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 13, color: '#333' }
const tdStyle: React.CSSProperties = { padding: '12px 16px' }
const linkStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#1677ff', cursor: 'pointer', padding: '4px 8px', fontSize: 13 }
