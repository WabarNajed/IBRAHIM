#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const shell = process.platform === 'win32';

function run(command, commandArgs) {
  return spawnSync(command, commandArgs, {
    stdio: 'inherit',
    shell,
  });
}

const direct = run('tsc', args);

if (direct.status === 0) {
  process.exit(0);
}

const missingTsc = direct.error?.code === 'ENOENT' || direct.status === 1;

if (!missingTsc) {
  process.exit(direct.status ?? 1);
}

console.warn('Local TypeScript compiler was not found. Falling back to npx typescript@5.9.3...');
const fallback = run('npx', ['--yes', '--package', 'typescript@5.9.3', 'tsc', ...args]);
process.exit(fallback.status ?? 1);
