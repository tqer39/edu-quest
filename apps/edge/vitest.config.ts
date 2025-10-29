import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@edu-quest/domain': resolve(__dirname, '../../packages/domain/src'),
      '@edu-quest/app': resolve(__dirname, '../../packages/app/src'),
    },
  },
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    },
  },
});
