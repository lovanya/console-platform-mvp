import { useParams, Link } from 'react-router-dom'

export default function InstanceDetail() {
  const { id } = useParams()

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link to="/products/ecs/instances" style={{ color: '#1677ff', textDecoration: 'none', fontSize: 14 }}>
          ← 返回实例列表
        </Link>
      </div>
      <h2 style={{ margin: '0 0 24px 0' }}>实例详情: {id}</h2>
      <div style={{ padding: 24, border: '1px solid #f0f0f0', borderRadius: 8, background: '#fafafa' }}>
        <InfoRow label="实例 ID" value={id || '-'} />
        <InfoRow label="实例名称" value="web-server-01" />
        <InfoRow label="状态" value="Running" />
        <InfoRow label="地域" value="华东 1（杭州）" />
        <InfoRow label="可用区" value="可用区 G" />
        <InfoRow label="规格" value="ecs.g7.xlarge (4vCPU 16GiB)" />
        <InfoRow label="镜像" value="Alibaba Cloud Linux 3.2104 LTS 64位" />
        <InfoRow label="网络类型" value="VPC" />
        <InfoRow label="计费方式" value="按量付费" />
        <InfoRow label="创建时间" value="2025-01-15 10:30:00" />
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: 14 }}>
      <div style={{ width: 120, color: '#666' }}>{label}</div>
      <div style={{ color: '#333' }}>{value}</div>
    </div>
  )
}
