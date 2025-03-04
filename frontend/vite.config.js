import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy: {
      '/api': 'http://localhost:8000',
      "/uploads": "http://localhost:8000",
    }
  },
  resolve: {
    alias: {
      // Add alias for your redux folder
      '@redux': path.resolve(__dirname, 'src/redux'),
    },
  },
  build: {
    sourcemap: false, // Disable source maps in build
  },
})
