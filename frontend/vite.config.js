import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './',
  cacheDir: './.vite',
  preview: {
    host: '0.0.0.0',
    port: 5000,
  },
  // Server configuration with Replit domains allowed
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    cors: true,
    hmr: {
      clientPort: 443,
    },
    allowedHosts: [
      '*.replit.dev',
      '*.replit.app',
      '*.repl.co',
      'localhost',
      '4292b118-a774-4470-aa1c-70f8aead615e-00-y6et5fxk8hoa.kirk.replit.dev',
    ],
  }
})