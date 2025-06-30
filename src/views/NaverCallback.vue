<!-- src/views/NaverCallback.vue -->
<template>
  <div>네이버 로그인 처리 중...</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  if (code && state) {
    try {
      const { isNewUser } = await authStore.loginWithNaver(code, state)

      const redirect = sessionStorage.getItem('redirect')
      const companyId = sessionStorage.getItem('companyId')
      const companyName = sessionStorage.getItem('companyName')

      // 로그인 성공 후
      if (isNewUser) {
        router.push('/profile')
      } else if (redirect === '/order' && companyId && companyName) {
        router.push({ path: '/order', query: { companyId, companyName } })
      } else if (redirect === '/reservation' && companyId && companyName) {
        router.push({ path: '/reservation', query: { companyId, companyName } })
      } else {
        router.push('/')
      }

      // 👉 조건 분기 끝난 뒤에 클리어
      sessionStorage.removeItem('redirect')
      sessionStorage.removeItem('companyId')
      sessionStorage.removeItem('companyName')

    } catch {
      router.push('/login')
    }
  } else {
    router.push('/login')
  }
})
</script>
