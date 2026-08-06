import { AppRouter, type RouteConfig } from 'common/components'
import { Navigate, useLocation } from 'react-router-dom'
import InstanceDetail from './pages/InstanceDetail'
import InstanceList from './pages/InstanceList'

/**
 * Single route element that owns both list and detail.
 * Both components stay mounted across navigation, so their
 * internal state (pagination, scroll, filters) is preserved
 * without needing any external keep-alive library.
 *
 * Approach: show/hide via CSS instead of mount/unmount.
 * Trade-off: both components' useEffects run, but our mock data
 * is cheap. For real APIs, add lazy loading to detail.
 */
function InstancesRoot() {
  const location = useLocation()
  const id = location.pathname.match(/\/instances\/([^/]+)$/)?.[1]
  const showDetail = !!id

  return (
    <div>
      <div style={{ display: showDetail ? 'none' : 'block' }}>
        <InstanceList />
      </div>
      {id && (
        <div style={{ display: showDetail ? 'block' : 'none' }}>
          <InstanceDetail />
        </div>
      )}
    </div>
  )
}

const routes: RouteConfig[] = [
  { index: true, element: <Navigate to="instances" replace /> },
  { path: 'instances/*', component: InstancesRoot },
]

export default function ECSRoutes() {
  return <AppRouter routes={routes} />
}
