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
  optimizeDeps: {
    exclude: ['react', 'react-dom', 'react-router-dom'],
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    rollupOptions: {
      // Externalize React + react-dom + react-router-dom so they're NOT
      // inlined in common's bundle. Without this, common's bundle has its
      // own copy of React with its own ReactCurrentDispatcher, which
      // is never set (only Shell's React has it set via ReactDOM.render).
      // Result: 'Cannot read properties of null (reading useContext)'.
      external: ['react', 'react-dom', 'react-router-dom'],
      output: { inlineDynamicImports: false },
    },
  },
  server: { port: 3002 },
})
