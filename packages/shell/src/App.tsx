import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ShellLayout from './components/ShellLayout'
import ProductPage from './components/ProductPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShellLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products/:productId/*" element={<ProductPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function Dashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h1>云控制台首页</h1>
      <p style={{ color: '#666' }}>选择左侧产品开始管理云资源</p>
    </div>
  )
}
