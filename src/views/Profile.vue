<!-- src/views/Profile.vue -->
<template>
  <v-container class="d-flex justify-center align-start" style="min-height: 100vh;">
    <v-card width="400" class="pa-4">
      <h2 class="text-h6 mb-4">프로필</h2>
      <v-form @submit.prevent="save">
        <v-text-field v-model="email" label="이메일" readonly />
        <v-text-field v-model="name" label="Name" />
        <v-textarea v-model="aboutMe" label="About Me" rows="3" />
        <v-btn type="submit" color="primary" class="mb-6">Save</v-btn>
      </v-form>

      <h3 class="text-subtitle-1 mb-2">비밀번호 변경</h3>
      <v-form @submit.prevent="changePassword">
        <v-text-field
          v-model="currentPassword"
          label="현재 비밀번호"
          type="password"
          required
        />
        <v-text-field
          v-model="newPassword"
          label="새 비밀번호"
          type="password"
          required
        />
        <v-text-field
          v-model="confirmPassword"
          label="비밀번호 확인"
          type="password"
          :error="confirmPassword && confirmPassword !== newPassword"
          :error-messages="confirmPassword && confirmPassword !== newPassword ? '비밀번호가 일치하지 않습니다.' : ''"
          required
        />
        <v-btn
          type="submit"
          color="secondary"
          :disabled="newPassword !== confirmPassword"
        >
          비밀번호 변경
        </v-btn>
      </v-form>

    </v-card>
  </v-container>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const authStore = useAuthStore()

const email = ref('')
const name = ref('')
const aboutMe = ref('')
const currentPassword = ref('')  // 추가
const newPassword = ref('')
const confirmPassword = ref('')

watchEffect(() => {
  if (authStore.profile) {
    email.value = authStore.profile.email
    name.value = authStore.profile.name
    aboutMe.value = authStore.profile.aboutMe
  }
})

const save = async () => {
  const docRef = doc(db, 'profiles', authStore.user.uid)
  await updateDoc(docRef, {
    name: name.value,
    aboutMe: aboutMe.value,
  })

  // 업데이트된 프로필을 다시 읽어와서 authStore.profile에 반영
  authStore.profile = {
    ...authStore.profile,
    name: name.value,
    aboutMe: aboutMe.value,
  }
  alert('프로필이 저장되었습니다.')
}

const changePassword = async () => {
  if (!newPassword.value || newPassword.value !== confirmPassword.value) {
    alert('비밀번호가 올바르지 않거나 일치하지 않습니다.')
    return
  }

  try {
    // authStore의 changePassword 함수에 재인증 포함됨
    await authStore.changePassword(currentPassword.value, newPassword.value)
    alert('비밀번호가 변경되었습니다.')

    // 입력 초기화
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (error) {
    alert('비밀번호 변경 실패: ' + error.message)
  }
}
</script>
