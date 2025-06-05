<!-- src/views/Register.vue -->
<template>
  <v-container class="d-flex justify-center align-start" style="min-height: 100vh;">
    <v-card width="400" class="pa-4">
      <v-card-title class="text-h5 mb-4">회원가입</v-card-title>
      <v-form @submit.prevent="register" ref="formRef">
        <v-text-field
          v-model="email"
          label="이메일"
          type="email"
          required
        />
        <v-text-field
          v-model="password"
          label="비밀번호"
          type="password"
          required
        />
        <v-text-field
          v-model="confirmPassword"
          label="비밀번호 확인"
          type="password"
          :error="confirmPassword && confirmPassword !== password"
          :error-messages="passwordMismatchMessage"
          required
        />
        <v-text-field
          v-model="name"
          label="이름"
          required
        />
        <v-textarea
          v-model="aboutMe"
          label="소개"
          rows="3"
        />
        <v-btn
          type="submit"
          color="primary"
          block
          class="mt-4"
          :disabled="!canSubmit"
        >
          회원가입
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const aboutMe = ref('')

const passwordMismatchMessage = computed(() =>
  confirmPassword.value && confirmPassword.value !== password.value
    ? '비밀번호가 일치하지 않습니다.'
    : ''
)

const canSubmit = computed(() =>
  email.value &&
  password.value &&
  confirmPassword.value === password.value &&
  name.value
)

const register = async () => {
  if (!canSubmit.value) return
  try {
    await authStore.register(email.value, password.value, name.value, aboutMe.value)
    router.push('/profile')
  } catch (err) {
    alert(err.message)
  }
}
</script>
