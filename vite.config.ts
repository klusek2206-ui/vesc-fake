import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Względna ścieżka dla GitHub Pages (działa na username.github.io/fake-vesc/)
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});