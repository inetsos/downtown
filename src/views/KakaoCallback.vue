<!-- src/views/KakaoCallback.vue -->
<template>
  <div>카카오 로그인 처리 중...</div>
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

  if (code) {
    try {
      const { isNewUser } = await authStore.loginWithKakao(code)

      if (isNewUser) {
        router.push('/profile')  // 신규 회원은 프로필 수정 페이지로 이동
      } else {
        router.push('/')  // 기존 회원은 홈으로 이동
      }
    } catch (error) {
      console.error('카카오 로그인 실패:', error)
      router.push('/login')
    }
  } else {
    console.warn('카카오 인가 코드 없음')
    router.push('/login')
  }
})
</script>
