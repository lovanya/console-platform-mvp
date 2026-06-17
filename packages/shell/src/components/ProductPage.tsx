import { useParams } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import type { ComponentType } from 'react'

const productRoutes: Record<string, React.LazyExoticComponent<ComponentType<any>>> = {
  ecs: lazy(() => import('ecs/routes')),
}

export default function ProductPage() {
  const { productId } = useParams()

  if (!productId || !productRoutes[productId]) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: '#999' }}>
        <h2>产品 "{productId}" 暂未接入</h2>
        <p>该产品正在开发中，敬请期待</p>
      </div>
    )
  }

  const Routes = productRoutes[productId]

  return (
    <div style={{ padding: 24 }}>
      <Suspense fallback={<div style={{ padding: 24, color: '#999' }}>产品页面加载中...</div>}>
        <Routes />
      </Suspense>
    </div>
  )
}
