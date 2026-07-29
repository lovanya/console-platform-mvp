import { federation } from '@module-federation/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'billing',
      filename: 'remoteEntry.js',
      varFilename: 'remoteEntry.var.js',
      exposes: {
        './bootstrap': './src/bootstrap.ts',
      },
      shared: {
        vue: { singleton: true },
        'vue-router': { singleton: true },
        pinia: { singleton: true },
        '@console/shared': { singleton: true },
      },
      dts: false, // Disable DTS for Vue SFCs (vue-tsc handles it separately)
    }),
  ],
  build: {
    rollupOptions: { output: { inlineDynamicImports: false } },
  },
  server: { port: 3003 },
})
