import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "sv-02udg1brnilz4phvect8.cloud.elastika.pe"
    ]
  }
})
