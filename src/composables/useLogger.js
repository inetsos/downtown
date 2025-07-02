// src/composables/useLogger.js
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { logEvent } from '@/utils/logger'
import { useAuthStore } from '@/stores/authStore'

export function useLogger() {
  const route = useRoute()
  const authStore = useAuthStore()

  // 페이지 진입 시 자동 로그
  onMounted(() => {
    logEvent('info', '페이지 진입', {
      path: route.fullPath,
      userId: authStore.userId || 'guest',
    })
  })

  // 클릭 로그 함수
  function logClick(action, extra = {}) {
    logEvent('click', action, {
      path: route.fullPath,
      userId: authStore.userId || 'guest',
      ...extra,
    })
  }

  // 에러 로그 함수
  function logError(message, error = {}) {
    logEvent('error', message, {
      path: route.fullPath,
      userId: authStore.userId || 'guest',
      ...error,
    })
  }

  return { logClick, logError }
}
