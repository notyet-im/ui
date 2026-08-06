import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Explicit imports, matching the repo's verbatimModuleSyntax discipline —
    // tests `import { describe, it, expect } from 'vitest'`.
    globals: false,
    include: ['src/**/*.test.{ts,tsx}'],
    css: true,
  },
})
