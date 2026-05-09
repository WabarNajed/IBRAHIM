#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', '.next', '.expo', 'coverage']);
const ignoredFiles = new Set(['pnpm-lock.yaml']);
const conflictMarkerPattern = /^(<<<<<<<|=======|>>>>>>>)(?:\s|$)/m;
const offenders = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry)) continue;

    const fullPath = join(directory, entry);
    const relativePath = relative(root, fullPath).replaceAll('\\\\', '/');
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!stats.isFile() || ignoredFiles.has(relativePath)) continue;

    const content = readFileSync(fullPath, 'utf8');
    if (conflictMarkerPattern.test(content)) offenders.push(relativePath);
  }
}

walk(root);

if (offenders.length > 0) {
  console.error('Git conflict markers were found in these files:');
  for (const offender of offenders) console.error(`- ${offender}`);
  process.exit(1);
}

console.log('No Git conflict markers found.');
