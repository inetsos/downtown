<template>
  <v-container class="py-6">
    <v-row justify="center" align="center" dense>
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-4" elevation="2" @click="goToOrders" hover>
          <v-card-title class="text-h6">📦 주문 내역</v-card-title>
          <v-card-text class="text-body-2 text-grey-darken-1">
            지금까지 주문한 내역을 확인할 수 있어요.
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-4" elevation="2" @click="goToReservations" hover>
          <v-card-title class="text-h6">📅 예약 내역</v-card-title>
          <v-card-text class="text-body-2 text-grey-darken-1">
            예약한 시간과 상태를 확인할 수 있어요.
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-4" elevation="2" @click="goToCoupons" hover>
          <v-card-title class="text-h6">🎟️ 내 쿠폰</v-card-title>
          <v-card-text class="text-body-2 text-grey-darken-1">
            사용 가능한 쿠폰을 확인할 수 있어요.
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ✅ 👤 내 프로필 추가 -->
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-4" elevation="2" @click="goToProfile" hover>
          <v-card-title class="text-h6">👤 내 프로필</v-card-title>
          <v-card-text class="text-body-2 text-grey-darken-1">
            이름, 소개글 등 프로필 정보를 확인하고 수정할 수 있어요.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToOrders = () => router.push('/my-orders')
const goToReservations = () => router.push('/my-reservations')
const goToCoupons = () => router.push('/my-coupons')
const goToProfile = () => router.push('/profile') // 🔗 프로필 페이지로 이동
</script>
