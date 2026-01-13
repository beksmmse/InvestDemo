import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/InvestDemo/',
  define: {
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000')
  }
})
