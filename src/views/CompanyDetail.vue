<!-- src/views/CompanyDetail.vue -->
<template>
  <v-container fluid>
    <div class="d-flex justify-center">
      <v-card class="pa-4" width="900">
        <v-card-title>업체 상세 정보</v-card-title>

        <v-card-text>
          <div class="mb-3">
            <strong>업체명:</strong> 
            {{ company?.name || '없음' }}
          </div>

          <div class="mb-3">
            <strong>업종:</strong> 
            {{ company?.category || '없음' }}
          </div>

          <div class="mb-3">
            <strong>소개글:</strong><br />
            <div class="multiline-text">
              {{ company?.description || '없음' }}
            </div>
          </div>

          <!-- 영업시간 및 상태 표시 -->
          <div class="mb-3">
            <strong>영업시간:</strong>
            {{ company?.openTime || '--' }} ~ {{ company?.closeTime || '--' }}
          </div>
          <div class="mb-3" :class="isOpen ? 'text-success' : 'text-error'">
            <strong>영업 상태:</strong>
            {{ isOpen ? '영업중' : '영업 종료' }}
          </div>

          <v-card-subtitle class="pa-0 pt-1">
            <strong>주소:</strong> {{ company.address || '--' }}
            <v-btn
              size="small"
              class="ml-2"
              variant="text"
              color="blue"
              @click.stop="goToMap(company)"
            >
              지도 보기
            </v-btn>
          </v-card-subtitle>

          <v-card-subtitle class="pa-0 pt-1">
            <strong>상세주소:</strong> {{ company.detailAddress || '--' }}
          </v-card-subtitle>
        </v-card-text>

        <v-card-actions class="justify-end">
          <!-- 🔹 서비스 목록 버튼 추가 -->
          <v-btn 
            v-if="company.category === '서비스업'"
            color="secondary"
            @click="goToServiceList(company.id, company.name)">
            서비스 보기
          </v-btn>

          <v-btn
            v-if="authStore.user"
            color="primary"
            @click="goToReservation(company.id)"
            :disabled="!isOpen"
          >
            예약하기
          </v-btn>

          <v-btn color="grey" @click="goBack">홈</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/companyStore'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const companyStore = useCompanyStore()
const authStore = useAuthStore()

const id = route.params.id

const company = computed(() =>
  companyStore.companies.find((c) => c.id === id)
)

onMounted(() => {
  if (!company.value) {
    companyStore.fetchMyCompanies()
  }
})

// 현재 시간이 영업시간 내인지 계산하는 함수
const isOpen = computed(() => {
  if (!company.value?.openTime || !company.value?.closeTime) return false

  const now = new Date()

  // 현재 시간을 "HH:mm" 형태로 맞추기
  const nowStr = now.toTimeString().slice(0, 5)

  // "HH:mm" -> 분으로 변환 (예: 13:30 => 13*60 + 30)
  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number)
    return h * 60 + m
  }

  const openMinutes = toMinutes(company.value.openTime)
  const closeMinutes = toMinutes(company.value.closeTime)
  const nowMinutes = toMinutes(nowStr)

  // 영업시간이 자정 넘는 경우(예: 22:00~02:00) 처리
  if (closeMinutes < openMinutes) {
    return nowMinutes >= openMinutes || nowMinutes < closeMinutes
  } else {
    return nowMinutes >= openMinutes && nowMinutes < closeMinutes
  }
})

const goToReservation = (companyId) => {  
  router.push({
    path: '/reservation',
    query: {
      companyId,
      username: authStore.profile.name
    }
  })
}

const goToMap = (company) => {
  router.push({
    path: '/map',
    query: {
      address: company.address,
      name: company.name,
    },
  })
}

const goToServiceList = (id, name) => {
    router.push({
    name: 'ServiceList',
    params: { companyId: id },
    query: { companyName: name }
  })
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.multiline-text {
  white-space: pre-line;
}

.text-success {
  color: green;
}
.text-error {
  color: red;
}
</style>
