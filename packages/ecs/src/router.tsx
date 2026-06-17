import { Routes, Route, Navigate } from 'react-router-dom'
import InstanceList from './pages/InstanceList'
import InstanceDetail from './pages/InstanceDetail'

export default function ECSRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="instances" replace />} />
      <Route path="instances" element={<InstanceList />} />
      <Route path="instances/:id" element={<InstanceDetail />} />
    </Routes>
  )
}
