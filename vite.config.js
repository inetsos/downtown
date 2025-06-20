// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  server: {
    proxy: {
      '/naver-api': {
        target: 'https://openapi.naver.com/v1',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/naver-api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500, // 경고 임계값 상향(옵션)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vuetify')) return 'vuetify'
            if (id.includes('firebase')) return 'firebase'
            if (id.includes('vue-router')) return 'vue-router'
            if (id.includes('vue')) return 'vue'
            return 'vendor'
          }
        }
      }
    }
  }
})
