import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ECSRoutes from './router'

const root = createRoot(document.getElementById('root')!)
root.render(
  <BrowserRouter>
    <ECSRoutes />
  </BrowserRouter>,
)
