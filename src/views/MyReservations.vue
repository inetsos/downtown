<!-- src/views/MyReservations.vue-->
<template>
  <v-container max-width="800" class="mx-auto py-6">
    <h2 class="text-h5 font-weight-bold mb-6">내 예약 목록</h2>

    <v-alert v-if="!Object.keys(groupedReservations).length" type="info" class="mb-6">
      예약 내역이 없습니다.
    </v-alert>

    <div v-for="(resList, companyName) in groupedReservations" :key="companyName" class="mb-8">
      <!-- 업체명 섹션 -->
      <v-card class="mb-3" flat color="blue-grey-lighten-5">
        <v-card-title class="text-subtitle-1 font-weight-bold text-blue-grey-darken-2">
          <v-icon left class="mr-2">mdi-domain</v-icon>
          {{ companyName }}
        </v-card-title>
      </v-card>

      <!-- 예약 카드들 -->
      <v-row dense>
        <v-col
          v-for="res in resList"
          :key="res.id"
          cols="12"
        >
          <v-card class="h-full rounded-xl" elevation="2">
            <v-card-title class="d-flex justify-space-between align-center">
              <div class="text-subtitle-2 font-weight-medium">
                {{ res.date }} | {{ res.timeSlots.join(', ') }}
              </div>
              <v-chip :color="statusChipColor(res.status)" size="small" class="text-white">
                {{ res.status }}
              </v-chip>
            </v-card-title>

            <v-card-text class="pt-0">
              <v-list dense>
                <v-list-item>
                  <v-list-item-title><strong>서비스:</strong> {{ res.serviceName }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title><strong>메모:</strong> {{ res.memo || '없음' }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title><strong>예약 번호:</strong> {{ res.reservationNumber }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title><strong>예약 시간:</strong> {{ formatDateTime(res.createdAt) }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>

            <v-card-actions v-if="res.status === '대기중'" class="justify-end">
              <v-btn color="error" variant="outlined" size="small" @click="confirmCancel(res)">
                예약 취소
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- 취소 다이얼로그 -->
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
import { ref, onMounted, computed } from 'vue'
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

const groupedReservations = computed(() => {
  return reservations.value.reduce((acc, res) => {
    const key = res.companyName || '알 수 없는 업체'
    if (!acc[key]) acc[key] = []
    acc[key].push(res)
    return acc
  }, {})
})

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

const formatDateTime = (dateTime) => {
  if (dateTime && typeof dateTime.toDate === 'function') {
    return dateTime.toDate().toLocaleString('ko-KR')
  }
  return '날짜 없음'
}

const statusChipColor = (status) => {
  return {
    대기중: 'primary',
    승인: 'success',
    취소: 'warning',
    거절: 'error'
  }[status] || 'grey'
}

onMounted(fetchReservations)
</script>

