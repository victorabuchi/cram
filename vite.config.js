import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Relative base so the build works under https://<user>.github.io/<repo>/
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    css: false,
  },
})
