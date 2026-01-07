import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/wiki',
  build: {
    outDir: '../../dist/wiki',
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets',
      '@pages': '/src/pages',
      '@features': '/src/features',
      '@layouts': '/src/layouts'
    },
  },
})
