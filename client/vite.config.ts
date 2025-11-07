import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://192.168.31.44:8075',
        changeOrigin: true,
        ws: true
      },
      '/upload': {
        target: 'http://192.168.31.44:8075',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://192.168.31.44:8075',
        changeOrigin: true
      }
    }
  }
})
