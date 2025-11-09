import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Use function form so `base` is reliably set for production builds in any environment
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/2bit-calc/' : '/',
}))
