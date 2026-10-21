// Verify behavior using the same tests exercised during development.
const { execFileSync } = require('node:child_process');
const { resolve } = require('node:path');
execFileSync(process.execPath, ['--experimental-strip-types', '--test', 'tests/signal-game.test.mjs'], {
  cwd: resolve(__dirname, '..'),
  stdio: 'inherit',
});
