import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'ecs',
      filename: 'remoteEntry.js',
      exposes: {
        './routes': './src/router.tsx',
        './InstanceTable': './src/components/InstanceTable.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'react-router-dom': { singleton: true },
      },
    }),
  ],
  build: {
    rollupOptions: { output: { inlineDynamicImports: false } },
  },
  server: { port: 3001 },
})
