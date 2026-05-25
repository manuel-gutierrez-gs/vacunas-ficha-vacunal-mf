import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fileURLToPath } from 'url';

const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  nodeResolve: true,
  open: '/',
  watch: !hmr,

  appIndex: 'index.html',

  plugins: [
    esbuildPlugin({
      ts: true, json: true, js: true, tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
    }),
  ],

  preserveSymlinks: true,
});
