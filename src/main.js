// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import vuetify from './plugins/vuetify'
import { createPinia } from 'pinia'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import { useAuthStore } from './stores/authStore'
import { logEvent } from '@/utils/logger'

const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  logEvent('error', 'Vue 전역 에러', {
    message: err.message,
    stack: err.stack,
    component: info,
  })
}

window.onerror = (msg, src, line, col, err) => {
  logEvent('error', 'JS 전역 에러', {
    message: msg,
    source: src,
    line,
    col,
    stack: err?.stack,
  })
}

app.use(vuetify)
app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
authStore.initAuth() // 로그인 상태 복원

app.mount('#app')

// 서비스 워커 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
