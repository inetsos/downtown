import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa' 

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    VitePWA({ // ✅ PWA 설정 추가
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png'
      ],
      manifest: {
        name: 'Downtown Life',
        short_name: 'Downtown',
        description: '우리 동네',
        theme_color: '#1867C0', // Vuetify 기본 테마 색상
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
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
    chunkSizeWarningLimit: 1500,
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
