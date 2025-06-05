<!-- src/views/CompanyReservations.vue -->
<template>
  <v-container max-width="800" class="mx-auto">
    <h2 class="text-h5 font-weight-bold mb-4">
      [{{ companyName || '업체' }}] 예약
    </h2>

    <v-card class="mb-6" elevation="1">
      <v-card-title class="text-h6">타임슬롯별 예약 건수</v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>타임슬롯</th>
              <th>예약 건수</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="[slot, count] in timeSlotCounts" :key="slot">
              <td>{{ slot }}</td>
              <td>{{ count }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <v-alert v-if="!reservations.length" type="info" class="mb-4">
      예약 내역이 없습니다.
    </v-alert>

    <<v-row dense>
      <v-col
        v-for="res in reservations"
        :key="res.id"
        cols="12"
        md="6"
      >
        <v-card class="mb-4" elevation="1">
          <v-card-title class="d-flex justify-space-between">
            <div>{{ res.date }} | {{ res.timeSlots.join(', ') }}</div>
            <div :class="statusColor(res.status)">{{ res.status }}</div>
          </v-card-title>

          <v-card-text>
            <div><strong>고객:</strong> {{ res.userName || '비회원' }}</div>
            <div><strong>서비스:</strong> {{ res.serviceName }}</div>
            <div><strong>메모:</strong> {{ res.memo || '없음' }}</div>
            <div><strong>예약 번호:</strong> {{ res.reservationNumber }}</div>
            <div><strong>예약 시간:</strong> {{ formatDateTime(res.createdAt) }}</div>
            <div><strong>예약 ID:</strong> {{ res.id }}</div>
          </v-card-text>

          <v-card-actions v-if="res.status === '대기중'">
            <v-btn color="success" variant="tonal" @click="openConfirmDialog(res.id, 'approve')">승인</v-btn>
            <v-btn color="error" variant="tonal" @click="openConfirmDialog(res.id, 'reject')">거절</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- 확인 모달 -->
  <v-dialog v-model="dialog.show" max-width="400">
    <v-card>
      <v-card-title class="text-h6">{{ dialog.title }}</v-card-title>
      <v-card-text>{{ dialog.message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="tonal" @click="dialog.show = false">취소</v-btn>
        <v-btn :color="dialog.actionType === 'approve' ? 'success' : 'error'"
              @click="handleConfirmAction">
          확인
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useReservationStore } from '@/stores/reservationStore'

const route = useRoute()
const reservationStore = useReservationStore()
const reservations = ref([])

const companyId = route.params.companyId
const companyName = route.query.companyName

// 타임슬롯별 예약 건수 계산
const timeSlotCounts = computed(() => {
  const counts = {}
  for (const res of reservations.value) {
    for (const slot of res.timeSlots || []) {
      counts[slot] = (counts[slot] || 0) + 1
    }
  }
  return Object.entries(counts).sort(([a], [b]) =>
    a.localeCompare(b, 'ko-KR', { numeric: true })
  )
})

const dialog = ref({
  show: false,
  reservationId: null,
  actionType: '',
  title: '',
  message: '',
})

const openConfirmDialog = (id, type) => {
  dialog.value = {
    show: true,
    reservationId: id,
    actionType: type,
    title: type === 'approve' ? '예약 승인 확인' : '예약 거부 확인',
    message: type === 'approve'
      ? '이 예약을 승인하시겠습니까?'
      : '이 예약을 거절하시겠습니까?',
  }
}

const handleConfirmAction = async () => {
  const { reservationId, actionType } = dialog.value
  dialog.value.show = false

  if (actionType === 'approve') {
    await reservationStore.approveReservation(reservationId)
  } else if (actionType === 'reject') {
    await reservationStore.rejectReservation(reservationId)
  }

  await fetchReservations()
}

const fetchReservations = async () => {
  reservations.value = await reservationStore.fetchReservationsByCompany(companyId)
}

const formatDateTime = (dateTime) => {
  return dateTime?.toDate?.().toLocaleString('ko-KR') || '날짜 없음'
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

