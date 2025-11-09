import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set the correct base path for GitHub Pages when deploying under /2bit-calc/
  // In development it remains '/'
  base: process.env.NODE_ENV === 'production' ? '/2bit-calc/' : '/',
})
