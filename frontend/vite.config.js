import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  if (process.env.VERCEL === '1') {
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    const apiBase = process.env.VITE_API_BASE || env.VITE_API_BASE
    let apiUrl
    try {
      apiUrl = new URL(apiBase)
    } catch {
      throw new Error('Set VITE_API_BASE to your public HTTPS backend URL in Vercel before deploying.')
    }
    if (
      apiUrl.protocol !== 'https:' ||
      ['localhost', '127.0.0.1', '[::1]'].includes(apiUrl.hostname) ||
      apiUrl.username || apiUrl.password || apiUrl.search || apiUrl.hash
    ) {
      throw new Error('VITE_API_BASE must be a public HTTPS backend URL without credentials, query parameters or a fragment.')
    }
  }

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true
    }
  }
})
