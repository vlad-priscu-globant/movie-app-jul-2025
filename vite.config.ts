import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/favorites': 'http://localhost:3000',
      '/login': 'http://localhost:3000',
      '/api': 'http://localhost:3000'
    }
  }
})