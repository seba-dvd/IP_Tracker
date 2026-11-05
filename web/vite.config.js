/* vite.config.js - configurarea Vite (M v2.0.0) */
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // fisierele din ../shared importa 'react': il luam tot din web/node_modules
    dedupe: ['react'],
  },
  server: {
    // serverul de dezvoltare poate citi si folderul parinte, unde este shared/
    fs: { allow: ['..'] },
  },
});
