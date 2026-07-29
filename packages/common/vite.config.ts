import { federation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

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
        './LoadingFallback': './src/components/LoadingFallback.tsx',
        './Card': './src/components/Card.tsx',
        './Table': './src/components/Table.tsx',
        './AppRouter': './src/router/AppRouter.tsx',
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
          packageName: 'react',
        },
        'react-dom': {
          singleton: true,
          eager: true,
          packageName: 'react-dom',
        },
        'react-router-dom': {
          singleton: true,
          eager: true,
          requiredVersion: '^6.20.0',
          packageName: 'react-router-dom',
        },
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
