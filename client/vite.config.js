import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * TrendAura Core Vite Configuration
 * Features automated local api proxies to bypass CORS layers during deployment.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    // 🛡️ توجيه وتأمين مسارات الاتصال بالسيرفر محلياً
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
  }
})