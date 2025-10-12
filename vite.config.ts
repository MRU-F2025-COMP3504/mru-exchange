import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen to all addresses (i.e., connects containers with host)
    port: 5173,
    watch: {
      usePolling: true, // Update on file changes
    },
  },
  resolve: {
    alias: {
      '@features': './src/features',
      '@pages': './src/pages',
      '@assets': './src/assets',
      '@shared': './src/shared',
    },
  },
});
