<!-- src/views/MyReservations.vue-->
<template>
  <v-container max-width="800" class="mx-auto">
    <h2 class="text-h5 font-weight-bold mb-4">내 예약 목록</h2>

    <v-alert v-if="!reservations.length" type="info" class="mb-4">
      예약 내역이 없습니다.
    </v-alert>

    <v-card v-for="res in reservations" :key="res.id" class="mb-4" elevation="1">
      <v-card-title class="d-flex justify-space-between">
        <div>{{ res.date }} | {{ res.timeSlots.join(', ') }}</div>
        <div :class="statusColor(res.status)">{{ res.status }}</div>
      </v-card-title>

      <v-card-text>
        <div><strong>업체:</strong> {{ res.companyName }}</div>
        <div><strong>서비스:</strong> {{ res.serviceName }}</div>
        <div><strong>메모:</strong> {{ res.memo || '없음' }}</div>
        <div><strong>예약 번호:</strong> {{ res.reservationNumber }}</div>
        <div><strong>예약 시간:</strong> {{ formatDateTime(res.createdAt) }}</div>
        <div><strong>예약 ID:</strong> {{ res.id }}</div>
      </v-card-text>

      <v-card-actions v-if="res.status === '대기중'">
        <v-btn color="error" variant="outlined" @click="confirmCancel(res)">예약 취소</v-btn>
      </v-card-actions>
    </v-card>

    <!-- 취소 확인 다이얼로그 -->
    <v-dialog v-model="cancelDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">예약을 취소하시겠습니까?</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="cancelDialog = false">아니오</v-btn>
          <v-btn color="error" text @click="cancelReservation">예, 취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useReservationStore } from '@/stores/reservationStore'
import { useAuthStore } from '@/stores/authStore'

const reservationStore = useReservationStore()
const authStore = useAuthStore()

const reservations = ref([])
const cancelDialog = ref(false)
const selectedReservation = ref(null)

const fetchReservations = async () => {
  const userId = authStore.user?.uid
  if (!userId) return
  reservations.value = await reservationStore.fetchReservationsByUser(userId)
}

const confirmCancel = (reservation) => {
  selectedReservation.value = reservation
  cancelDialog.value = true
}

const cancelReservation = async () => {
  if (!selectedReservation.value) return
  await reservationStore.cancelReservation(selectedReservation.value.id)
  cancelDialog.value = false
  await fetchReservations()
}

const formatDate = (date) => {
  console.log('date:', date)
  return new Date(date).toLocaleDateString('ko-KR')
}

const formatDateTime = (dateTime) => {
  if (dateTime && typeof dateTime.toDate === 'function') {
    return dateTime.toDate().toLocaleString('ko-KR')
  }
  return '날짜 없음'
}

const statusColor = (status) => {
  return {
    대기중: 'text-primary',
    취소: 'text-warning',
    거절: 'text-error',
    승인: 'text-success'
  }[status] || 'text-grey'
}

onMounted(() => {
  fetchReservations()
})
</script>
