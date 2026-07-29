import { lazy } from 'react'
import { BrowserRouter } from 'react-router-dom'
import BillingSlot from './components/BillingSlot'
import ShellLayout from './components/ShellLayout'
import { AppRouter, type RouteConfig } from './router/AppRouter'

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
      <AppRouter routes={routes} />
    </BrowserRouter>
  )
}
