import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

/**
 * Library config: compiles the design system into `dist/` as ESM + CJS with
 * types, leaving react/react-dom external. This is the artifact `/design-sync`
 * consumes.
 */
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx'],
      rollupTypes: true,
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NotYetUI',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
        assetFileNames: (info) => (info.names?.[0]?.endsWith('.css') ? 'styles.css' : '[name][extname]'),
      },
    },
  },
})
