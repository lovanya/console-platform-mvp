import Card from 'common/Card'
import LoadingFallback from 'common/LoadingFallback'
import Table from 'common/Table'
import { useEffect, useState } from 'react'
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
  {
    id: 'i-2ze3x5y7',
    name: 'web-server-01',
    status: 'Running',
    region: 'cn-hangzhou',
    spec: 'ecs.g7.xlarge',
    createTime: '2025-01-15 10:30:00',
  },
  {
    id: 'i-2ze9a1b2',
    name: 'web-server-02',
    status: 'Running',
    region: 'cn-hangzhou',
    spec: 'ecs.g7.xlarge',
    createTime: '2025-01-15 10:30:00',
  },
  {
    id: 'i-2ze4c6d8',
    name: 'db-master-01',
    status: 'Running',
    region: 'cn-shanghai',
    spec: 'ecs.r7.xlarge',
    createTime: '2025-02-20 14:00:00',
  },
  {
    id: 'i-2ze7e0f1',
    name: 'db-slave-01',
    status: 'Stopped',
    region: 'cn-shanghai',
    spec: 'ecs.r7.xlarge',
    createTime: '2025-02-20 14:00:00',
  },
  {
    id: 'i-2ze1g2h3',
    name: 'redis-cache-01',
    status: 'Running',
    region: 'cn-beijing',
    spec: 'ecs.g6.large',
    createTime: '2025-03-10 09:00:00',
  },
]

const linkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#1677ff',
  cursor: 'pointer',
  padding: '4px 8px',
  fontSize: 13,
}

function StatusBadge({ status }: { status: Instance['status'] }) {
  const colorMap = { Running: '#52c41a', Stopped: '#999', Starting: '#faad14' }
  return (
    <span style={{ color: colorMap[status], fontWeight: 500 }}>
      <span
        style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: colorMap[status],
          marginRight: 6,
        }}
      />
      {status}
    </span>
  )
}

const columns = [
  {
    key: 'name',
    title: '实例 ID / 名称',
    render: (_value: unknown, row: Record<string, unknown>) => (
      <>
        <Link
          to={`/products/ecs/instances/${(row as unknown as Instance).id}`}
          style={{ color: '#1677ff', textDecoration: 'none' }}
        >
          {(row as unknown as Instance).name}
        </Link>
        <div style={{ fontSize: 12, color: '#999' }}>{(row as unknown as Instance).id}</div>
      </>
    ),
  },
  {
    key: 'status',
    title: '状态',
    render: (value: unknown) => <StatusBadge status={value as Instance['status']} />,
  },
  { key: 'region', title: '地域' },
  { key: 'spec', title: '规格' },
  { key: 'createTime', title: '创建时间' },
  {
    key: 'actions',
    title: '操作',
    render: () => (
      <>
        <button type="button" style={linkStyle}>
          启动
        </button>
        <button type="button" style={linkStyle}>
          停止
        </button>
        <button type="button" style={linkStyle}>
          重启
        </button>
      </>
    ),
  },
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

  if (loading) return <LoadingFallback message="正在加载实例..." />

  return (
    <Card
      title={<h2 style={{ margin: 0 }}>ECS 实例</h2>}
      extra={
        <button
          type="button"
          style={{
            padding: '8px 16px',
            background: '#1677ff',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          创建实例
        </button>
      }
    >
      <Table
        columns={columns}
        data={instances as unknown as Record<string, unknown>[]}
        rowKey="id"
      />
    </Card>
  )
}
