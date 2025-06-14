<!-- src/App.vue -->
<template>
  <v-app>
    <!-- 상단 AppBar -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-title style="cursor: pointer;" @click="goHome">
        우리 동네 예약 포털
      </v-app-bar-title>

      <v-spacer />

      <v-btn text to="/" tag="router-link">홈</v-btn>

      <template v-if="isLoggedIn">
        <v-btn text to="/my-page" tag="router-link">마이페이지</v-btn>
        <v-btn text to="/register-company" tag="router-link">상점등록</v-btn>
        <v-btn text to="/my-companies" tag="router-link">상점보기</v-btn>
        <v-btn text to="/profile" tag="router-link">프로필</v-btn>
      </template>
      <template v-else>
        <v-btn text to="/register" tag="router-link">회원가입</v-btn>
      </template>

      <!-- 로그인/로그아웃 아이콘 버튼 -->
      <v-btn icon @click="handleAuthClick">
        <v-icon>{{ isLoggedIn ? 'mdi-logout' : 'mdi-login' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- 페이지 컨텐츠 -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore' // Pinia 사용

const router = useRouter()
const authStore = useAuthStore()

// 로그인 상태 확인
const isLoggedIn = computed(() => !!authStore.user)

const goHome = () => {
  router.push('/')
}

// 로그인/로그아웃 클릭 시 동작
const handleAuthClick = () => {
  if (isLoggedIn.value) {
    authStore.logout()
    router.push('/')  // home으로로
  } else {
    router.push('/login')
  }
}
</script>
