import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/industria/',
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/server/**'],
    },
  },
})
