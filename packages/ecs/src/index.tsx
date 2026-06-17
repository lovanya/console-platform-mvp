import React from 'react'
import { createRoot } from 'react-dom/client'
import ECSRoutes from './router'
import { BrowserRouter } from 'react-router-dom'

const root = createRoot(document.getElementById('root')!)
root.render(
  <BrowserRouter>
    <ECSRoutes />
  </BrowserRouter>
)
