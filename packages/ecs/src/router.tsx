import { AppRouter, KeepAlive, type RouteConfig } from 'common/components'
import { Navigate, useLocation } from 'react-router-dom'
import InstanceDetail from './pages/InstanceDetail'
import InstanceList from './pages/InstanceList'

/**
 * Internal switcher between list and detail. Both components stay
 * mounted in <KeepAlive>; one is hidden via display:none when
 * inactive. State (pagination, scroll, filters) is preserved
 * because the component instances never unmount.
 */
function InstancesRoot() {
  const location = useLocation()
  const id = location.pathname.match(/\/instances\/([^/]+)$/)?.[1]
  const showDetail = !!id

  return (
    <KeepAlive include={['InstanceList', 'InstanceDetail']} max={5}>
      {showDetail && id ? <InstanceDetail key={id} /> : <InstanceList />}
    </KeepAlive>
  )
}

const routes: RouteConfig[] = [
  { index: true, element: <Navigate to="instances" replace /> },
  { path: 'instances/*', component: InstancesRoot },
]

export default function ECSRoutes() {
  return <AppRouter routes={routes} />
}
