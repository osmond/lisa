import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const basePath = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  base: basePath,
  define: {
    'process.env.VITE_WEATHER_API_KEY': JSON.stringify(
      process.env.VITE_WEATHER_API_KEY
    ),
    'import.meta.env.VITE_BASE_PATH': JSON.stringify(basePath),
  },
  plugins: [react()],
})
