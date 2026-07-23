import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    react({ exclude: [/./] }),
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
  // Tell Vite not to pre-bundle shared deps; MF runtime handles them
  optimizeDeps: {
    exclude: ['react', 'react-dom'],
  },
  resolve: {
    // Force shared deps to be treated as external — MF runtime resolves them
    dedupe: ['react', 'react-dom'],
  },
  build: {
    rollupOptions: { output: { inlineDynamicImports: false } },
  },
  server: { port: 3002 },
})