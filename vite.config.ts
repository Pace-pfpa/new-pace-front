import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const PORT = parseInt(env.VITE_PORT, 10);

  return {
    server: {
      port: PORT,
    },
    build: {
      outDir: 'dist',
    },
    plugins: [react()],
  };
});
