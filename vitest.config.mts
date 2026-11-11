import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: { environment: 'node', include: ['tests/unit/**/*.test.ts'] },
  resolve: { alias: { 'server-only': new URL('./tests/unit/vacio.ts', import.meta.url).pathname } },
})
