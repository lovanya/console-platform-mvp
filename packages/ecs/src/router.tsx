import type { RouteConfig } from 'common/AppRouter'
import { AppRouter } from 'common/AppRouter'
import { Navigate } from 'react-router-dom'
import InstanceDetail from './pages/InstanceDetail'
import InstanceList from './pages/InstanceList'

const routes: RouteConfig[] = [
  { index: true, element: <Navigate to="instances" replace /> },
  { path: 'instances', component: InstanceList },
  { path: 'instances/:id', component: InstanceDetail },
]

export default function ECSRoutes() {
  return <AppRouter routes={routes} />
}
