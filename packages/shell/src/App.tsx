import { AppRouter, type RouteConfig } from 'common/components'
import { lazy, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import BillingSlot from './components/BillingSlot'
import ShellLayout from './components/ShellLayout'

const Dashboard = lazy(() => import('./Dashboard'))

const routes: RouteConfig[] = [
  {
    path: '/',
    component: ShellLayout,
    children: [
      { path: '', component: Dashboard },
      {
        path: 'products/:productId/*',
        loader: () => import('ecs/routes'),
      },
      {
        path: 'billing/*',
        component: BillingSlot,
      },
    ],
  },
]

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 24, color: '#999' }}>加载中...</div>}>
        <AppRouter routes={routes} />
      </Suspense>
    </BrowserRouter>
  )
}
