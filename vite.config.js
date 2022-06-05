import { defineConfig } from 'vite';
import { resolve } from 'path';

global.navigator = undefined;

export default defineConfig({
  root: `src/`,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src', 'index.html'),
      },
    },
    outDir: `../dist/`,
  },
  base: './',
  server: {
    open: true,
  },
});
