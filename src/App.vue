<template>
  <v-app>
    <!-- 상단 AppBar -->
    <v-app-bar app color="primary" dark>
      <!-- 모바일용 햄버거 버튼 -->
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-sm-none" />

      <v-app-bar-title style="cursor: pointer;" @click="goHome">
        우리 동네
      </v-app-bar-title>

      <!-- 데스크탑 메뉴 -->
      <v-spacer />
      <v-toolbar-items class="d-none d-sm-flex">
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

        <v-btn @click="handleAuthClick" class="d-flex align-center">
          <span class="text-body-1 mr-1">{{ isLoggedIn ? '로그아웃' : '로그인' }}</span>
          <v-icon>{{ isLoggedIn ? 'mdi-logout' : 'mdi-login' }}</v-icon>
        </v-btn>
        <v-btn
          v-if="showInstallButton"
          @click="installApp"
          color="secondary"
          prepend-icon="mdi-download"
        >
          앱 설치
        </v-btn>

      </v-toolbar-items>
    </v-app-bar>

    <!-- 모바일용 Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      class="d-sm-none"
    >
      <v-list>
        <v-list-item to="/" tag="router-link" @click="drawer = false">
          <v-list-item-title>홈</v-list-item-title>
        </v-list-item>

        <template v-if="isLoggedIn">
          <v-list-item to="/my-page" tag="router-link" @click="drawer = false">
            <v-list-item-title>마이페이지</v-list-item-title>
          </v-list-item>
          <v-list-item to="/register-company" tag="router-link" @click="drawer = false">
            <v-list-item-title>상점등록</v-list-item-title>
          </v-list-item>
          <v-list-item to="/my-companies" tag="router-link" @click="drawer = false">
            <v-list-item-title>상점보기</v-list-item-title>
          </v-list-item>
          <v-list-item to="/profile" tag="router-link" @click="drawer = false">
            <v-list-item-title>프로필</v-list-item-title>
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item to="/register" tag="router-link" @click="drawer = false">
            <v-list-item-title>회원가입</v-list-item-title>
          </v-list-item>
        </template>

        <v-list-item v-if="showInstallButton" @click="installApp">
          <v-list-item-title>앱 설치</v-list-item-title>
        </v-list-item>

        <v-list-item @click="handleAuthClick">
          <!-- <v-list-item-title>{{ isLoggedIn ? '로그아웃' : '로그인' }}</v-list-item-title> -->
          <v-icon class="ml-2">{{ isLoggedIn ? 'mdi-logout' : 'mdi-login' }}</v-icon>
        </v-list-item>
        
      </v-list>
    </v-navigation-drawer>

    <!-- 페이지 컨텐츠 -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const drawer = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)

const deferredPrompt = ref(null)
const showInstallButton = ref(false)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    showInstallButton.value = true
  })
})

const installApp = async () => {
  if (!deferredPrompt.value) return
  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice
  if (outcome === 'accepted') {
    console.log('사용자가 설치함')
  }
  deferredPrompt.value = null
  showInstallButton.value = false
}

const goHome = () => {
  router.push('/')
}

const handleAuthClick = () => {
  drawer.value = false
  if (isLoggedIn.value) {
    authStore.logout()
    router.push('/')
  } else {
    router.push('/login')
  }
}
</script>
