import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,          // falla si el puerto está ocupado (no salta a otro)
    cors: true,                // permite peticiones desde el browser
    proxy: {
      // todo lo que empiece con /api va al backend
      '/api': {
        // Detecta automáticamente si está en Docker o desarrollo local
        target: process.env.DOCKER_ENV 
          ? `http://${process.env.BACKEND_IP}:8080`     // IP dinámica del backend
          : 'http://localhost:8080',      // Desarrollo local normal
        changeOrigin: true,
        secure: false,
        // si tu backend cuelga /api, no reescribes; si no, descomenta:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

