import React from 'react'
import { createRoot } from 'react-dom/client'

const RegionSelect = React.lazy(() => import('./RegionSelect'))

function DevApp() {
  const [region, setRegion] = React.useState('cn-hangzhou')
  return (
    <div style={{ padding: 40 }}>
      <h2>Common 组件库开发模式</h2>
      <div style={{ marginTop: 20 }}>
        <h4>RegionSelect</h4>
        <React.Suspense fallback={null}>
          <RegionSelect value={region} onChange={setRegion} />
        </React.Suspense>
        <p style={{ marginTop: 12, color: '#666' }}>当前选中: {region}</p>
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<DevApp />)
