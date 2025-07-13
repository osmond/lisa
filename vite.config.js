import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const basePath = env.VITE_BASE_PATH || '/'

  return {
    base: basePath,
    define: {
      'process.env.VITE_WEATHER_API_KEY': JSON.stringify(env.VITE_WEATHER_API_KEY),
      'process.env.VITE_BASE_PATH': JSON.stringify(basePath),
      'import.meta.env.VITE_BASE_PATH': JSON.stringify(basePath),
    },
    plugins: [react()],
  }
})
