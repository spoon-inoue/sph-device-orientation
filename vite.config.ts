import { resolve } from 'path'
import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'
import tsconfigPaths from 'vite-tsconfig-paths'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  root: './src',
  publicDir: resolve(__dirname, 'public'),
  base: '/sph-device-orientation/',
  plugins: [glsl(), tsconfigPaths(), basicSsl()],
  server: {
    host: true,
    https: {},
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    target: 'esnext',
    emptyOutDir: true,
  },
})
