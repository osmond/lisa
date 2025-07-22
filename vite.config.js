import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const basePath = env.VITE_BASE_PATH || '/'

  return {
    base: basePath,
    define: {
      'process.env.VITE_WEATHER_API_KEY': JSON.stringify(env.VITE_WEATHER_API_KEY),
      'process.env.VITE_OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY),
      'process.env.VITE_BASE_PATH': JSON.stringify(basePath),
      'import.meta.env.VITE_BASE_PATH': JSON.stringify(basePath),
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'react-vendor'
              if (id.includes('framer-motion')) return 'framer-motion'
              if (id.includes('phosphor-react')) return 'phosphor'
            }
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': 'http://localhost:3000',
      },
    },
  }
})
