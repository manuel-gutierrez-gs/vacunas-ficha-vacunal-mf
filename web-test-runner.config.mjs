import { esbuildPlugin } from '@web/dev-server-esbuild';
import { puppeteerLauncher } from '@web/test-runner-puppeteer';
import { fileURLToPath } from 'url';


export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  files: 'test/**/*.test.ts',
  nodeResolve: true,
  preserveSymlinks: true,
  browsers: [puppeteerLauncher({ launchOptions: { args: ['--no-sandbox', '--disable-setuid-sandbox'] } })],
  plugins: [
    esbuildPlugin({
      ts: true, json: true, js: true, tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
    }),
  ],
});

