import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/lisa/',
  define: {
    'process.env.VITE_WEATHER_API_KEY': JSON.stringify(
      process.env.VITE_WEATHER_API_KEY
    ),
  },
  plugins: [react()],
})
