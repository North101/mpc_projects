import { defineConfig } from 'vite'


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    ssr: 'src/server/main.ts',
    outDir: './dist/server',
    target: 'esnext',
    copyPublicDir: false,
  },
})
