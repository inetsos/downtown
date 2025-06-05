<!-- src/views/Login.vue -->
<template>
  <v-container class="d-flex justify-center align-start" style="min-height: 100vh;">
    <v-card width="400" class="pa-4">
      <v-card-title class="text-h6">로그인</v-card-title>

      <v-form @submit.prevent="login">
        <v-text-field
          v-model="email"
          label="이메일"
          type="email"
          required
          prepend-inner-icon="mdi-email"
        />
        <v-text-field
          v-model="password"
          label="비밀번호"
          type="password"
          required
          prepend-inner-icon="mdi-lock"
        />
        <v-btn type="submit" color="primary" block class="mt-4">로그인</v-btn>
      </v-form>

      <v-btn variant="text" class="mt-2" @click="resetPassword" block>
        비밀번호를 잊으셨나요?
      </v-btn>

      <v-divider class="my-4"></v-divider>

      <!-- ✅ 구글 로그인 버튼 -->
      <v-btn
        color="white"
        class="google-login"
        block
        @click="loginWithGoogle"
      >
        <v-icon left class="mr-2">mdi-google</v-icon>
        구글 계정으로 로그인
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const login = async () => {
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (error) {
    alert(error.message || '로그인에 실패했습니다.')
  }
}

const resetPassword = async () => {
  if (!email.value) {
    alert('비밀번호 재설정을 위해 이메일을 입력해주세요.')
    return
  }
  try {
    await authStore.resetPassword(email.value)
    alert('비밀번호 재설정 이메일이 전송되었습니다.')
  } catch (error) {
    alert(error.message || '비밀번호 재설정에 실패했습니다.')
  }
}

const loginWithGoogle = async () => {
  try {
    const { isNewUser } = await authStore.loginWithGoogle()
    if (isNewUser) {
      // 구글 계정으로 처음 로그인이므로 프로필 수정으로로
      router.push('/profile') 
    } else {
      router.push('/')
    }
  } catch (error) {
    alert(error.message || '구글 로그인에 실패했습니다.')
  }
}
</script>

<style scoped>
.google-login {
  border: 1px solid #ccc;
  color: #444;
  font-weight: 500;
}
</style>
