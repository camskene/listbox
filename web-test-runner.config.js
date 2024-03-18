import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fileURLToPath } from 'node:url';
import { chromeLauncher } from '@web/test-runner-chrome';

export default {
	files: ['src/**/*.test.ts'],
	concurrentBrowsers: 1,
	manual: false,
	browsers: [
		chromeLauncher({
      launchOptions: {
        headless: true,
        devtools: true,
      },
    }),
	],
	nodeResolve: {
    exportConditions: ['production', 'default']
  },
	testFramework: {
    config: {
      timeout: 3000,
      retries: 1
    }
  },
	testRunnerHtml: testFramework => `
    <html lang="en-US">
      <head></head>
      <body>
        <script>
          window.process = {env: { NODE_ENV: "production" }}
        </script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
	plugins: [
		esbuildPlugin({
			ts: true,
			tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
		}),
	],
};