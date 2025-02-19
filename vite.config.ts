import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // mantiene los enlaces simboicos, para hacer referencia a paquetes externos en local sin necesidad de tenerlos publicados
  resolve: { preserveSymlinks: true },
  server: {
    port: 4200,
    host: 'localhost',
    open: true,
    watch: {},
  },
  build: {
    lib: {
      entry: 'index.html',
      formats: ['es'],
    },
    rollupOptions: {
      // external: /^lit/,
    },
  },
});
