/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom', // or 'jsdom'
    // Optionally, add setup files:
    // setupFiles: ['src/setupTests.ts'],
  },
});
