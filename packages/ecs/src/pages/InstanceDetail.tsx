import Card from 'common/Card'
import { Link, useParams } from 'react-router-dom'

const DETAILS: { label: string; value: string }[] = [
  { label: '实例 ID', value: '-' },
  { label: '实例名称', value: 'web-server-01' },
  { label: '状态', value: 'Running' },
  { label: '地域', value: '华东 1（杭州）' },
  { label: '可用区', value: '可用区 G' },
  { label: '规格', value: 'ecs.g7.xlarge (4vCPU 16GiB)' },
  { label: '镜像', value: 'Alibaba Cloud Linux 3.2104 LTS 64位' },
  { label: '网络类型', value: 'VPC' },
  { label: '计费方式', value: '按量付费' },
  { label: '创建时间', value: '2025-01-15 10:30:00' },
]

export default function InstanceDetail() {
  const { id } = useParams()

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link
          to="/products/ecs/instances"
          style={{ color: '#1677ff', textDecoration: 'none', fontSize: 14 }}
        >
          ← 返回实例列表
        </Link>
      </div>
      <h2 style={{ margin: '0 0 24px 0' }}>实例详情: {id}</h2>
      <Card>
        {DETAILS.map((row) => {
          const display = row.label === '实例 ID' ? id || row.value : row.value
          return <InfoRow key={row.label} label={row.label} value={display} />
        })}
      </Card>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        padding: '10px 0',
        borderBottom: '1px solid #f0f0f0',
        fontSize: 14,
      }}
    >
      <div style={{ width: 120, color: '#666' }}>{label}</div>
      <div style={{ color: '#333' }}>{value}</div>
    </div>
  )
}
