import { defineConfig } from 'rolldown';

export default defineConfig({
  input: './src/plugin.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: 'plugin.js',
    sourcemap: true,
  },
  external: ['node:*', '@huggingface/transformers', 'openclaw'],
});
