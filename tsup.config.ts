import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
    },
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2022',
    splitting: false,
    treeshake: true,
  },
  {
    entry: {
      stdio: 'src/stdio.ts',
    },
    format: ['esm'],
    sourcemap: true,
    clean: false,
    target: 'es2022',
    splitting: false,
    treeshake: true,
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
