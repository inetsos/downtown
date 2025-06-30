<template>
  <v-app>
    <!-- AppBar -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-sm-none" />
      <v-app-bar-title @click="goHome" style="cursor: pointer">
        <v-icon start>mdi-home</v-icon>우리 동네
      </v-app-bar-title>
      <v-spacer />

      <!-- 데스크탑 메뉴 -->
      <v-toolbar-items class="d-none d-sm-flex align-center">
        
        <template v-if="isLoggedIn">
          <v-btn text to="/my-page" tag="router-link">
            <v-icon start>mdi-account</v-icon> 마이페이지
          </v-btn>
          <v-btn text to="/my-companies" tag="router-link">
            <v-icon start>mdi-store</v-icon> 매장보기
          </v-btn>
        </template>
        <template v-else>
          <v-btn text to="/register" tag="router-link">
            <v-icon start>mdi-account-plus</v-icon> 회원가입
          </v-btn>
        </template>

        <v-btn icon to="/nearby-companies" tag="router-link" title="가까운 매장">
          <v-icon>mdi-map-marker</v-icon>
        </v-btn>
        <v-btn icon to="/qr-scanner" tag="router-link" title="QR 스캔">
          <v-icon>mdi-qrcode-scan</v-icon>
        </v-btn>

        <v-btn
          v-if="showInstallButton"
          @click="installApp"
          prepend-icon="mdi-download"
        >
          앱 설치
        </v-btn>
        
        <v-btn @click="handleAuthClick">
          <v-icon start>{{ isLoggedIn ? 'mdi-logout' : 'mdi-login' }}</v-icon>
          {{ isLoggedIn ? '로그아웃' : '로그인' }}
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <!-- 모바일 Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      class="d-sm-none"
    >
      <v-list nav>
        
        <template v-if="isLoggedIn">
          <v-list-item to="/my-page" tag="router-link" @click="drawer = false">
            <template #prepend><v-icon class="mr-2">mdi-account</v-icon></template>
            <v-list-item-title>마이페이지</v-list-item-title>
          </v-list-item>
          <v-list-item to="/my-companies" tag="router-link" @click="drawer = false">
            <template #prepend><v-icon class="mr-2">mdi-store</v-icon></template>
            <v-list-item-title>매장보기</v-list-item-title>
          </v-list-item>
        </template>

        <template v-else>
          <v-list-item to="/register" tag="router-link" @click="drawer = false">
            <template #prepend><v-icon class="mr-2">mdi-account-plus</v-icon></template>
            <v-list-item-title>회원가입</v-list-item-title>
          </v-list-item>
        </template>

        <v-list-item to="/nearby-companies" tag="router-link" @click="drawer = false">
          <template #prepend><v-icon class="mr-2">mdi-map-marker</v-icon></template>
          <v-list-item-title>가까운 매장</v-list-item-title>
        </v-list-item>

        <v-list-item to="/qr-scanner" tag="router-link" @click="drawer = false">
          <template #prepend><v-icon class="mr-2">mdi-qrcode-scan</v-icon></template>
          <v-list-item-title>QR 스캔</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="showInstallButton" @click="installApp">
          <template #prepend><v-icon class="mr-2">mdi-download</v-icon></template>
          <v-list-item-title>앱 설치</v-list-item-title>
        </v-list-item>

        <v-list-item @click="handleAuthClick">
          <template #prepend>
            <v-icon class="mr-2">{{ isLoggedIn ? 'mdi-logout' : 'mdi-login' }}</v-icon>
          </template>
          <v-list-item-title>{{ isLoggedIn ? '로그아웃' : '로그인' }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
    console.log('사용자가 앱 설치 수락함')
  }
  deferredPrompt.value = null
  showInstallButton.value = false
}

const goHome = () => router.push('/')
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
