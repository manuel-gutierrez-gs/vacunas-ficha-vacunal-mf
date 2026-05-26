import { defineConfig } from 'vite';
import { resolve } from 'path';


export default defineConfig({
  resolve: { 
    preserveSymlinks: true,
    alias: {
      '@module': resolve(__dirname, 'src/module'),
      '@routing': resolve(__dirname, 'src/routing'),
      '@shared': resolve(__dirname, 'src/shared'),
    },
  },
  server: {
    port: 4200,
    host: 'localhost',
    open: true,
    watch: {},
  },
  build: {
    rollupOptions: {
      external: ['lit', /^lit\//],
      output: {
        entryFileNames: 'mfe-entry.js',
        chunkFileNames: 'assets/[name].js',
      },
    },
  },
});
