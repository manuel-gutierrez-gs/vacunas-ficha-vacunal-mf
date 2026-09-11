import { readFileSync } from 'fs';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',

  plugins: [
    {
      name: 'copy-runtime-config',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'environments-configmap.json',
          source: readFileSync(resolve(__dirname, 'environments-configmap.json'), 'utf8'),
        });
      },
    },
  ],

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
    minify: 'esbuild',
    lib: {
      entry: 'src/index.ts',
      fileName: () => 'vacunas-ficha-vacunal-mf.js',
      formats: ['es'],
    },

    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});
