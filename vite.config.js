import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración Vite:
// - Desarrollo local con proxy hacia Django
// - Evita problemas CORS
// - Producción usa VITE_API_BASE_URL

export default defineConfig({
  plugins: [react()],

  server: {
    host: '127.0.0.1',
    port: 5173,

    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },

      '/media': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },
    },
  },
})
