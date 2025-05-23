import path from 'node:path'
import process from 'node:process'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'process.env': {
        SUPABASE_URL: env.SUPABASE_URL,
        SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY,
        COPILOT_KIT_KEY: env.COPILOT_KIT_KEY,
        DEEPSEEK_API_KEY: env.DEEPSEEK_API_KEY,
        MASTRA_API_URL: env.MASTRA_API_URL,
        WEB_STATIC_URL: env.WEB_STATIC_URL,
      },
    },
  }
})
