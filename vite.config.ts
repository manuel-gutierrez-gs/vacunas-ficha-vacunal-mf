import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@app': resolve(__dirname, 'src/app'),
      '@module': resolve(__dirname, 'src/module'),
      '@shared': resolve(__dirname, 'src/shared'),
    },
  },

  server: {
    port: 4200,
    host: 'localhost',
    open: true,
  },

  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: () => 'vacunas-ficha-vacunal-mf.js',
      formats: ['es'],
    },

    rollupOptions: {
      external: ['lit', /^lit\//, /^@sas\//],
      output: {
        entryFileNames: 'vacunas-ficha-vacunal-mf.js',
        chunkFileNames: 'assets/[name].js',
      },
    },
  },
});
