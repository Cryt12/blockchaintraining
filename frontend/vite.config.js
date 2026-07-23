import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// envDir points at the repo root so the frontend reads the single shared .env
// (VITE_-prefixed vars only) instead of needing its own copy.
export default defineConfig({
  plugins: [react()],
  envDir: path.resolve(__dirname, '..'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
