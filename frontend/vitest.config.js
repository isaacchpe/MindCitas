import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'src/components/**/*.jsx',
        'src/stores/**/*.js',
        'src/hooks/**/*.js',
        'src/services/**/*.js',
        'src/lib/**/*.js',
      ],
      exclude: ['src/main.jsx', 'src/App.jsx'],
      thresholds: {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60,
      },
    },
  },
});
