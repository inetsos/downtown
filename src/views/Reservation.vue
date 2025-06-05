<template>
  <v-container max-width="800" class="mx-auto">
    <!-- ... 기존 코드 ... -->

    <v-form @submit.prevent="submitReservation" ref="formRef">
      <v-card class="pa-4" elevation="2">
        <v-card-title class="text-h6 font-weight-bold">
          {{ companyName }} ({{ companyCategory }}) - 예약하기
        </v-card-title>

        <!-- 영업시간 및 상태 표시 -->
        <span class="mb-3 ml-4 mr-4">
          <strong>영업시간:</strong>
          {{ openTime || '--' }} ~ {{ closeTime || '--' }}
        </span>
        <strong>영업 상태:</strong>
        <span class="mb-3 ml-2" :class="isOpen ? 'text-success' : 'text-error'">
          {{ isOpen ? '영업중' : '영업 종료' }}
        </span>

        <v-card-subtitle class="text-end">{{ username }} </v-card-subtitle>
        <v-card-text>

          <!-- 서비스 상품 선택 추가 -->
          <v-select
            v-model="form.serviceId"
            :items="services"
            item-title="name"
            item-value="id"
            label="서비스 선택"
            :rules="[rules.required]"
            required
            dense
            class="mb-4"
            clearable
          ></v-select>

          <!-- 날짜 선택 -->
          <v-text-field
            label="예약 날짜"
            v-model="form.date"
            type="date"
            :rules="[rules.required, rules.notPast]"
            required
            dense
            class="mb-4"
          />

          <!-- 시간 선택 -->
          <div class="mb-2 font-weight-medium">시간 선택</div>

          <v-input
            v-model="form.timeSlots"
            :rules="[v => v.length > 0 || '최소 1개 이상의 시간을 선택하세요.']"
            hide-details="auto"
          >
            <v-row class="mb-4">
              <v-col v-for="slot in allTimeSlots" :key="slot" cols="3" class="pa-0">
                <v-checkbox
                  v-model="form.timeSlots"
                  :label="slot"
                  :value="slot"
                  color="primary"
                  hide-details
                  density="compact"
                  class="ma-0"
                />
              </v-col>
            </v-row>
          </v-input>

          <!-- 메모 -->
          <v-textarea
            label="메모"
            v-model="form.memo"
            auto-grow
            clearable
            rows="2"
            class="mb-4 mt-4"
          />

          <!-- 버튼 -->
          <v-btn type="submit" color="primary" block>예약하기</v-btn>
        </v-card-text>
      </v-card>
    </v-form>

    <!-- 예약 성공 모달 -->
     <!-- 예약 성공 모달 -->
    <v-dialog
      v-model="dialog"
      max-width="400"
      @click:outside="closeDialog"
      @keydown.esc="closeDialog"
    >
      <v-card v-if="reservationResult">
        <v-card-title class="headline">예약 완료</v-card-title>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <th class="text-left"></th>
                <td>{{ reservationResult.companyName }}</td>
              </tr>
              <tr>
                <th class="text-left">예약 번호</th>
                <td>{{ reservationResult.reservationNumber }}</td>
              </tr>
              <tr>
                <th class="text-left">예약 날짜</th>
                <td>{{ reservationResult.date }}</td>
              </tr>
              <tr>
                <th class="text-left">시간</th>
                <td>{{ reservationResult.timeSlots?.join(', ') || '' }}</td>
              </tr>
              <tr>
                <th class="text-left">서비스</th>
                <td>{{ reservationResult.serviceName || '없음' }}</td>
              </tr>
              <tr>
                <th class="text-left">메모</th>
                <td>{{ reservationResult.memo || '없음' }}</td>
              </tr>
              <tr>
                <th class="text-left">상태</th>
                <td>{{ reservationResult.status }}</td>
              </tr>
              <tr>
                <th class="text-left">예약 시간</th>
                <td>{{ formatDateTime(reservationResult.createdAt) }}</td>
              </tr>
              <tr>
                <th class="text-left">예약 ID</th>
                <td>{{ reservationResult.id }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="closeDialog">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/companyStore'
import { useReservationStore } from '@/stores/reservationStore'
import { useServiceManagement } from '@/composables/useServiceManagement'

const router = useRouter()
const route = useRoute()

const companyId = route.query.companyId ?? ''
const username = route.query.username ?? ''

const selectedService = computed(() =>
  services.value?.find(service => service.id === form.value.serviceId)
)

const companyStore = useCompanyStore()
const reservationStore = useReservationStore()
// 서비스를 가져온다.
const { services, loadingServices } = useServiceManagement(companyId)
const formRef = ref()

const today = new Date().toISOString().split('T')[0]
const form = ref({
  companyId: '',
  companyName: '',
  serviceId: null, 
  serviceName: null, 
  date: today,
  timeSlots: [],
  memo: '',
})

const allTimeSlots = [
  '09:00~09:30', '09:30~10:00',
  '10:00~10:30', '10:30~11:00',
  '11:00~11:30', '11:30~12:00',
  '12:00~12:30', '12:30~13:00',
  '13:00~13:30', '13:30~14:00',
  '14:00~14:30', '14:30~15:00',
  '15:00~15:30', '15:30~16:00',
  '16:00~16:30', '16:30~17:00',
  '17:00~17:30', '17:30~18:00',
]

const rules = {
  required: v => (Array.isArray(v) ? v.length > 0 : !!v) || '필수 입력 항목입니다',
  notPast: v => {
    if (!v) return true
    const selectedDate = new Date(v)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // 오늘 00:00으로 초기화
    return selectedDate >= today || '오늘 이전 날짜는 선택할 수 없습니다'
  }
}

const dialog = ref(false)
const reservationResult = ref(null)

const company = computed(() => companyStore.company)
const companyName = computed(() => company.value?.name || '')
const companyCategory = computed(() => company.value?.category || '')
const openTime = computed(() => company.value?.openTime || '00:00')
const closeTime = computed(() => company.value?.closeTime || '00:00')

const submitReservation = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    form.value.companyId = companyId
    form.value.companyName = companyName.value
    form.value.serviceName = selectedService.value?.name;
    const res = await reservationStore.submitReservation(form.value)

    reservationResult.value = res
    dialog.value = true
    console.log('Dialog should open:', dialog.value, reservationResult.value)

  } catch (err) {
    alert('예약 실패: ' + (err.response?.data?.message || err.message))
  }
}

const closeDialog = () => {
  dialog.value = false
  reservationResult.value = null
  router.push('/my-reservations')
}

const formatDateTime = (value) => {
  const date = new Date(value)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const isOpen = computed(() => {
  if (!company.value?.openTime || !company.value?.closeTime) return false

  const now = new Date()
  const nowStr = now.toTimeString().slice(0, 5)

  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number)
    return h * 60 + m
  }

  const openMinutes = toMinutes(company.value.openTime)
  const closeMinutes = toMinutes(company.value.closeTime)
  const nowMinutes = toMinutes(nowStr)

  if (closeMinutes < openMinutes) {
    return nowMinutes >= openMinutes || nowMinutes < closeMinutes
  } else {
    return nowMinutes >= openMinutes && nowMinutes < closeMinutes
  }
})

onMounted(async () => {
  if (companyId) {
    await companyStore.fetchCompany(companyId)
  }
})
</script>
