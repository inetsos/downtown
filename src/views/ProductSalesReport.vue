<!-- src/views/ProductSalesReport.vue-->
<template>
  <v-card>
    <!-- 운영 대시보드로 돌아가기 버튼 -->
    <div class="text-end mb-4 mr-2">
      <span
        class="text-primary text-subtitle-2 cursor-pointer"
        @click="goToDashboard"
      >
        운영 대시보드
      </span>
    </div>

    <v-card-title class="headline font-weight-bold">상품별 매출 리포트</v-card-title>

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

      <!-- 📱 반응형 테이블 -->
      <div v-if="isMobile">
        <v-card
          v-for="item in productSales"
          :key="item.productName"
          class="mb-2"
          outlined
        >
          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ item.productName }}
          </v-card-title>
          <v-card-text class="text-body-2">
            <div>카테고리: {{ item.category }}</div>
            <div>판매 수량: {{ item.quantitySold.toLocaleString() }}</div>
            <div class="font-weight-medium">
              총 매출: {{ item.totalAmount.toLocaleString() }} 원
            </div>
          </v-card-text>
        </v-card>
      </div>

      <v-data-table
        v-else
        :headers="headers"
        :items="productSales"
        :items-per-page="10"
        class="elevation-1"
        dense
        :sort-by="['totalAmount']"
        :sort-desc="[true]"
        fixed-header
        height="400"
      >
        <template #item.category="{ item }">
          <span class="text-body-2">{{ item.category }}</span>
        </template>
        <template #item.totalAmount="{ item }">
          <span class="text-right font-weight-medium" style="display: block;">
            {{ item.totalAmount.toLocaleString() }} 원
          </span>
        </template>
        <template #item.quantitySold="{ item }">
          <span class="text-center" style="display: block;">
            {{ item.quantitySold.toLocaleString() }}
          </span>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { format } from 'date-fns'
import { useRoute, useRouter } from 'vue-router'
import { useSalesSummary } from '@/composables/useSalesSummary'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)

const router = useRouter()
const route = useRoute()

const companyId = ref(route.query.companyId || '')
const companyName = ref(route.query.companyName)

watch(() => route.query.companyId, (newId) => {
  companyId.value = newId || ''
})

const goToDashboard = () => {
  router.push({
    name: 'OperationsDashboard',
    query: { companyId: companyId.value, companyName: companyName.value },
  })
}

const { loadProductSalesByMenu } = useSalesSummary()

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
      const d = new Date(val)
      endDate.value = d
    }
  },
})

const todayFormatted = format(today, 'yyyy-MM-dd')

const headers = [
  { title: '상품명', key: 'productName', sortable: true },
  { title: '카테고리', key: 'category', sortable: true },
  { title: '판매 수량', key: 'quantitySold', align: 'center', sortable: true },
  { title: '총 매출액', key: 'totalAmount', align: 'end', sortable: true },
]

const productSales = ref([])

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
    const data = await loadProductSalesByMenu(
      companyId.value,
      startDate.value,
      endDate.value
    )
    productSales.value = data.sort((a, b) => b.totalAmount - a.totalAmount)
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
