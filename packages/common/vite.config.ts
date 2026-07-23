import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    react({ exclude: [/./] }), // disable React Refresh for remote modules
    federation({
      name: 'common',
      filename: 'remoteEntry.js',
      varFilename: 'remoteEntry.var.js',
      exposes: {
        './RegionSelect': './src/RegionSelect.tsx',
        './PriceBadge': './src/PriceBadge.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
  build: {
    rollupOptions: { output: { inlineDynamicImports: false } },
  },
  server: { port: 3002 },
})
