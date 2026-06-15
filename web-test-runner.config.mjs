import { esbuildPlugin } from '@web/dev-server-esbuild';
import { puppeteerLauncher } from '@web/test-runner-puppeteer';
import { fileURLToPath } from 'url';


export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  files: 'test/**/*.test.ts',
  nodeResolve: true,
  preserveSymlinks: true,
  alias: {
    '@app/': fileURLToPath(new URL('./src/app/', import.meta.url)),
    '@shared/': fileURLToPath(new URL('./src/shared/', import.meta.url)),
    '@module/': fileURLToPath(new URL('./src/module/', import.meta.url)),
  },
  browsers: [puppeteerLauncher({ launchOptions: { args: ['--no-sandbox', '--disable-setuid-sandbox'] } })],
  plugins: [
    {
      name: 'resolve-ts-path-aliases',
      resolveImport({ source }) {
        if (source === 'lit') {
          return '/node_modules/lit/index.js';
        }
        if (source.startsWith('lit/')) {
          return `/node_modules/lit/${source.slice('lit/'.length)}`;
        }
        if (source === 'lit-html') {
          return '/node_modules/lit-html/lit-html.js';
        }
        if (source.startsWith('lit-html/')) {
          return `/node_modules/lit-html/${source.slice('lit-html/'.length)}`;
        }
        if (source === '@lit/reactive-element') {
          return '/node_modules/@lit/reactive-element/reactive-element.js';
        }
        if (source.startsWith('@lit/reactive-element/')) {
          return `/node_modules/@lit/reactive-element/${source.slice('@lit/reactive-element/'.length)}`;
        }

        const resolveAlias = folder => {
          const subpath = source.slice(folder.length + 1);
          const withExtension =
            subpath.endsWith('.ts') || subpath.endsWith('.js') ? subpath : `${subpath}.ts`;
          return `/src/${folder}/${withExtension}`;
        };

        if (source.startsWith('@shared/')) {
          return resolveAlias('shared');
        }
        if (source.startsWith('@app/')) {
          return resolveAlias('app');
        }
        if (source.startsWith('@module/')) {
          return resolveAlias('module');
        }
        return undefined;
      },
    },
    {
      name: 'stub-missing-stic-wc',
      resolveImport({ source }) {
        if (source === '@sas/wc-stic-filters-area' || source === '@sas/wc-stic-tag-set') {
          return '/test/stubs/empty-module.js';
        }
        if (source === '@sas/wc-stic-theme') {
          return '/test/stubs/stic-theme.js';
        }
        if (source.startsWith('@sas/')) {
          return `/node_modules/${source}/dist/index.js`;
        }
        return undefined;
      },
    },
    esbuildPlugin({
      ts: true, json: true, js: true, tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
    }),
  ],
});

