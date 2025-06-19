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
      router.push(isNewUser ? '/profile' : '/')
    } catch {
      router.push('/login')
    }
  } else {
    router.push('/login')
  }
})
</script>
