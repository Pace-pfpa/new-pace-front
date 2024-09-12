import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  base: "/",
    preview: {
      port: 8080,
      strictPort: true,
    },
    server: {
      port: 8080,
      strictPort: true,
      host: true,
      origin: "http://0.0.0.0:8080",
    },
    build: {
      outDir: 'dist',
    },
    plugins: [react()],
});
