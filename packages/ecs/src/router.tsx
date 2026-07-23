import { Navigate, Route, Routes } from 'react-router-dom'
import InstanceDetail from './pages/InstanceDetail'
import InstanceList from './pages/InstanceList'

export default function ECSRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="instances" replace />} />
      <Route path="instances" element={<InstanceList />} />
      <Route path="instances/:id" element={<InstanceDetail />} />
    </Routes>
  )
}
