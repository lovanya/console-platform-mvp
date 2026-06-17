import React from 'react'
import { Outlet, Link, useParams } from 'react-router-dom'
import { Suspense, lazy } from 'react'

const PRODUCTS = [
  { id: 'ecs', name: 'ECS 云服务器', icon: '🖥' },
  { id: 'rds', name: 'RDS 云数据库', icon: '🗄' },
  { id: 'oss', name: 'OSS 对象存储', icon: '📦' },
  { id: 'slb', name: 'SLB 负载均衡', icon: '⚖' },
]

const RegionSelect = lazy(() => import('common/RegionSelect'))

export default function ShellLayout() {
  const { productId } = useParams()

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: '-apple-system, sans-serif' }}>
      <Sidebar currentProduct={productId} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <div style={{ flex: 1, overflow: 'auto', background: '#f5f5f5' }}>
          <Suspense fallback={<div style={{ padding: 24, color: '#999' }}>加载中...</div>}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function Sidebar({ currentProduct }: { currentProduct?: string }) {
  return (
    <div style={{ width: 220, background: '#001529', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>云控制台</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Cloud Console</div>
      </div>
      <nav style={{ flex: 1, padding: '8px 0' }}>
        <div style={{ padding: '8px 16px', fontSize: 12, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>产品与服务</div>
        {PRODUCTS.map(p => (
          <Link
            key={p.id}
            to={p.id === 'ecs' ? `/products/${p.id}/instances` : `/products/${p.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              color: currentProduct === p.id ? '#fff' : 'rgba(255,255,255,0.75)',
              background: currentProduct === p.id ? '#1677ff' : undefined,
              textDecoration: 'none',
              fontSize: 14,
              margin: '2px 8px',
              borderRadius: 6,
            }}
          >
            <span>{p.icon}</span>
            <span>{p.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

function TopBar() {
  const [region, setRegion] = React.useState('cn-hangzhou')

  return (
    <div style={{
      height: 48,
      background: '#fff',
      borderBottom: '1px solid #e8e8e8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
    }}>
      <div style={{ fontSize: 14, color: '#333' }}>
        <Link to="/" style={{ color: '#333', textDecoration: 'none' }}>首页</Link>
        <span style={{ margin: '0 8px', color: '#ccc' }}>/</span>
        <span>云服务器 ECS</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Suspense fallback={<span style={{ color: '#999', fontSize: 13 }}>地域...</span>}>
          <RegionSelect value={region} onChange={setRegion} />
        </Suspense>
        <span style={{ color: '#666', fontSize: 14 }}>admin@example.com</span>
      </div>
    </div>
  )
}

