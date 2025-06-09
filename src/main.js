// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import vuetify from './plugins/vuetify'
import { createPinia } from 'pinia'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import { useAuthStore } from './stores/authStore'

const app = createApp(App)
app.use(vuetify)
app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
authStore.initAuth() // 로그인 상태 복원

app.mount('#app')
