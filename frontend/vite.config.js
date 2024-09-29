import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import proxy from 'http-proxy-middleware';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://70.34.200.208:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
})
