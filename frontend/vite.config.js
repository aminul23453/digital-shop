// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    host: '0.0.0.0',
    port: 5173,          // ← your dev port
    strictPort: true,
    cors: true,
    hmr: {
      protocol: 'ws',    // or 'wss' if you’re on HTTPS
      host: 'localhost', // or window.location.hostname on repl.it
      port: 5173,        // ← match your dev port
    },
    allowedHosts: [
      '*.replit.dev',
      '*.replit.app',
      '*.repl.co',
      'localhost',
      // etc…
    ],
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,          // ← match again
  },
})
