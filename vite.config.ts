import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/** Demo-app config: builds the Capital Flow Tracker showcase into `dist-app/`. */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-app',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
})
