import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
