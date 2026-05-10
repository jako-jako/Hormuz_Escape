import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  publicDir: 'public',
  cacheDir: './.vite-cache',
  build: {
    outDir: './dist',
    emptyOutDir: true,
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  server: {
    port: 8000,
    strictPort: false,
  },
});
