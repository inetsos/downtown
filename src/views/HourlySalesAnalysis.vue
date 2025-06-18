<!-- src/views/HourlySalesAnalysis.vue-->
<template>
  <v-card>
    <!-- 운영 대시보드로 돌아가기 버튼 -->
    <div class="d-flex justify-end mt-4 mb-4 mr-2">
      <v-btn
        text
        color="primary"
        class="text-subtitle-2"
        @click="goToDashboard"
        elevation="0"
      >
        <v-icon left>mdi-arrow-left</v-icon>
        운영 대시보드
      </v-btn>
    </div>

    <v-card-title class="headline font-weight-bold">시간대별 매출 분석</v-card-title>

    <v-card-text>
      <!-- 날짜 선택 -->
      <v-row class="mb-4" align="center" dense>
        <v-col cols="12" sm="5">
          <v-menu
            v-model="menu1"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template #activator="{ props }">
              <v-text-field
                v-model="startDateFormatted"
                label="시작일"
                readonly
                v-bind="props"
                prepend-inner-icon="mdi-calendar"
                class="cursor-pointer"
              />
            </template>
            <v-date-picker
              v-model="startDate"
              @update:model-value="menu1 = false"
              :max="endDateFormatted"
            />
          </v-menu>
        </v-col>

        <v-col cols="12" sm="5">
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template #activator="{ props }">
              <v-text-field
                v-model="endDateFormatted"
                label="종료일"
                readonly
                v-bind="props"
                prepend-inner-icon="mdi-calendar"
                class="cursor-pointer"
              />
            </template>
            <v-date-picker
              v-model="endDate"
              @update:model-value="menu2 = false"
              :min="startDateFormatted"
              :max="todayFormatted"
            />
          </v-menu>
        </v-col>

        <v-col cols="12" sm="2" class="d-flex align-center justify-start">
          <v-btn
            color="primary"
            class="ma-0 mb-4"
            @click="loadData"
            :loading="loading"
            elevation="2"
            style="min-width: 80px; padding-left: 16px; padding-right: 16px;"
          >
            조회
          </v-btn>
        </v-col>
      </v-row>

      <!-- 차트 영역 -->
      <v-row>
        <v-col>
          <div style="height: 400px; width: 90%">
            <LineChart
              :labels="labels"
              :totalAmounts="totalAmounts"
              :orderCounts="orderCounts"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { format } from 'date-fns'
import { useRoute, useRouter } from 'vue-router'
import LineChart from '@/components/HourlySalesChart.vue'
import { useSalesSummary } from '@/composables/useSalesSummary'

const router = useRouter()
const route = useRoute()

const companyId = ref(route.query.companyId || '')
const companyName = ref(route.query.companyName || '')

watch(() => route.query.companyId, (newId) => {
  companyId.value = newId || ''
})

const goToDashboard = () => {
  router.push({
    name: 'OperationsDashboard',
    query: { companyId: companyId.value, companyName: companyName.value },
  })
}

const {
  hourlyLabels,
  hourlyTotalAmounts,
  hourlyOrderCounts,
  loadHourlySales,
} = useSalesSummary(companyId.value)

const getZeroTime = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const today = new Date()
const startDate = ref(getZeroTime(today))
const endDate = ref(today)

const menu1 = ref(false)
const menu2 = ref(false)

const loading = ref(false)

const startDateFormatted = computed({
  get: () => format(startDate.value, 'yyyy-MM-dd'),
  set: (val) => {
    if (val) {
      const d = new Date(val)
      startDate.value = getZeroTime(d)
    }
  },
})

const endDateFormatted = computed({
  get: () => format(endDate.value, 'yyyy-MM-dd'),
  set: (val) => {
    if (val) {
      endDate.value = new Date(val)
    }
  },
})

const todayFormatted = format(today, 'yyyy-MM-dd')

const labels = ref([])
const totalAmounts = ref([])
const orderCounts = ref([])

async function loadData() {
  if (!companyId.value) {
    alert('회사 ID가 없습니다.')
    return
  }

  if (startDate.value > endDate.value) {
    alert('시작일이 종료일보다 클 수 없습니다.')
    return
  }

  loading.value = true
  try {
    await loadHourlySales(companyId.value, startDate.value, endDate.value)
    labels.value = hourlyLabels.value
    totalAmounts.value = hourlyTotalAmounts.value
    orderCounts.value = hourlyOrderCounts.value
  } finally {
    loading.value = false
  }
}

watch(companyId, (newVal) => {
  if (newVal) loadData()
})

if (companyId.value) {
  loadData()
}
</script>
