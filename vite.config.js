import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://apiclientalio.azurewebsites.net',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
  build: {
    minify: 'terser',
    cssMinify: true,
  },
});
