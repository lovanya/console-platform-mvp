import { AppRouter, type RouteConfig } from 'common/components'
import { AliveScope, withActivation } from 'react-activation'
import { Navigate } from 'react-router-dom'
import InstanceDetail from './pages/InstanceDetail'
import InstanceList from './pages/InstanceList'

// Wrap components with withActivation() to enable keep-alive.
// State (scroll position, form input, pagination) is preserved
// when navigating between /instances and /instances/:id.
const InstanceListAlive = withActivation(InstanceList)
const InstanceDetailAlive = withActivation(InstanceDetail)

const routes: RouteConfig[] = [
  { index: true, element: <Navigate to="instances" replace /> },
  { path: 'instances', component: InstanceListAlive },
  { path: 'instances/:id', component: InstanceDetailAlive },
]

export default function ECSRoutes() {
  return (
    // AliveScope provides the keep-alive cache.
    // Must be inside AppRouter (inside Routes) for it to work.
    <AliveScope>
      <AppRouter routes={routes} />
    </AliveScope>
  )
}
